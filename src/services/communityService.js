import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getDoc,
  writeBatch,
  limit,
  startAfter,
  or,
  and,
  setDoc,
  runTransaction
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// ============ POSTS ============
export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      likedBy: [],
      savedBy: []
    });

    // Update user post count (create doc if missing)
    const userRef = doc(db, 'users', postData.authorId);
    await setDoc(userRef, { postCount: increment(1) }, { merge: true });

    // Update community post count if posted in a community
    if (postData.communityId && postData.communityId !== 'all') {
      const communityRef = doc(db, 'communities', postData.communityId);
      await setDoc(
        communityRef,
        { postCount: increment(1), lastActivity: serverTimestamp() },
        { merge: true }
      );
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
};

// ============ USERNAME UTILITIES ============
const normalizeUsername = (name) => name?.toLowerCase().trim();

export const isValidUsername = (name) => {
  const username = normalizeUsername(name);
  // letters, numbers, underscores, dots; 3-20 chars; no consecutive dots/underscores; cannot start/end with dot/underscore
  if (!username) return false;
  if (username.length < 3 || username.length > 20) return false;
  if (!/^[a-z0-9._]+$/.test(username)) return false;
  if (/[._]{2,}/.test(username)) return false;
  if (/^[._]|[._]$/.test(username)) return false;
  return true;
};

// Checks if a username document exists in 'usernames' collection
export const checkUsernameAvailability = async (username) => {
  const uname = normalizeUsername(username);
  if (!isValidUsername(uname)) {
    return { success: false, available: false, error: 'Invalid username' };
  }
  const ref = doc(db, 'usernames', uname);
  const snap = await getDoc(ref);
  return { success: true, available: !snap.exists() };
};

// First-time set: creates a username doc mapping -> uid and updates user's profile
export const setUsername = async (userId, username) => {
  const uname = normalizeUsername(username);
  if (!isValidUsername(uname)) {
    return { success: false, error: 'Invalid username' };
  }
  try {
    await runTransaction(db, async (transaction) => {
      const unameRef = doc(db, 'usernames', uname);
      const userRef = doc(db, 'users', userId);
      const unameSnap = await transaction.get(unameRef);
      if (unameSnap.exists()) {
        throw new Error('Username already taken');
      }
      // Ensure user exists
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        // create minimal user doc if not present
        transaction.set(userRef, { createdAt: serverTimestamp() });
      }
      transaction.set(unameRef, { userId, createdAt: serverTimestamp() });
      transaction.update(userRef, { username: uname, updatedAt: serverTimestamp() });
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Map: username -> userId (after username utilities)
export const getUserIdByUsername = async (username) => {
  try {
    const uname = normalizeUsername(username);
    if (!uname) return { success: false, error: 'Invalid username' };
    const unameRef = doc(db, 'usernames', uname);
    const snap = await getDoc(unameRef);
    if (!snap.exists()) return { success: false, error: 'Username not found' };
    const data = snap.data();
    return { success: true, data: data.userId };
  } catch (error) {
    console.error('Error mapping username to userId:', error);
    return { success: false, error: error.message };
  }
};

// Map: userId -> username (reads from the user profile)
export const getUsernameByUserId = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return { success: false, error: 'User not found' };
    const data = userDoc.data();
    return { success: true, data: data.username || null };
  } catch (error) {
    console.error('Error mapping userId to username:', error);
    return { success: false, error: error.message };
  }
};

// Change username: move mapping atomically
export const changeUsername = async (userId, newUsername) => {
  const uname = normalizeUsername(newUsername);
  if (!isValidUsername(uname)) {
    return { success: false, error: 'Invalid username' };
  }
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error('User not found');
      const current = userSnap.data().username;
      const newRef = doc(db, 'usernames', uname);
      const newSnap = await transaction.get(newRef);
      if (newSnap.exists()) throw new Error('Username already taken');
      // reserve new
      transaction.set(newRef, { userId, createdAt: serverTimestamp() });
      // update user
      transaction.update(userRef, { username: uname, updatedAt: serverTimestamp() });
      // delete old mapping
      if (current) {
        const oldRef = doc(db, 'usernames', normalizeUsername(current));
        transaction.delete(oldRef);
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPosts = (callback, filterType = 'all', communityId = 'all') => {
  let q;
  
  // Base query conditions
  let conditions = [];
  
  if (communityId && communityId !== 'all') {
    conditions.push(where('communityId', '==', communityId));
  }
  
  switch (filterType) {
    case 'trending':
      q = query(
        collection(db, 'posts'), 
        ...conditions,
        orderBy('likes', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      break;
    case 'recent':
      q = query(
        collection(db, 'posts'), 
        ...conditions,
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      break;
    case 'my_posts':
      // This will be handled separately with user-specific query
      q = query(
        collection(db, 'posts'), 
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      break;
    default:
      q = query(
        collection(db, 'posts'), 
        ...conditions,
        orderBy('createdAt', 'desc'),
        limit(50)
      );
  }
  
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching posts:', error);
  });
};

export const getPostsByUser = (userId, callback) => {
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, callback);
};

// Get a single post by ID (for previews/thumbnails)
export const getPostById = async (postId) => {
  try {
    const snap = await getDoc(doc(db, 'posts', postId));
    if (!snap.exists()) {
      return { success: false, error: 'Post not found' };
    }
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (error) {
    console.error('Error fetching post by id:', error);
    return { success: false, error: error.message };
  }
};

export const getSavedPosts = (userId, callback) => {
  const q = query(
    collection(db, 'posts'),
    where('savedBy', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, callback);
};

export const incrementPostViews = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing post views:', error);
    return { success: false, error: error.message };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) throw new Error('Post not found');
    
    const postData = postDoc.data();
    const likedBy = postData.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    const batch = writeBatch(db);
    
    if (isLiked) {
      // Unlike
      batch.update(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
    } else {
      // Like
      batch.update(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      });
      
      // Create notification for post author (if not self-like)
      if (postData.authorId !== userId) {
        const notificationRef = doc(collection(db, 'notifications'));
        batch.set(notificationRef, {
          userId: postData.authorId,
          type: 'like',
          actorId: userId,
          postId: postId,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return { success: true, isLiked: !isLiked };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};

export const savePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) throw new Error('Post not found');
    
    const postData = postDoc.data();
    const savedBy = postData.savedBy || [];
    const isSaved = savedBy.includes(userId);
    
    if (isSaved) {
      // Unsave
      await updateDoc(postRef, {
        savedBy: arrayRemove(userId)
      });
    } else {
      // Save
      await updateDoc(postRef, {
        savedBy: arrayUnion(userId)
      });
    }
    
    return { success: true, isSaved: !isSaved };
  } catch (error) {
    console.error('Error toggling save:', error);
    return { success: false, error: error.message };
  }
};

export const sharePost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      shares: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error sharing post:', error);
    return { success: false, error: error.message };
  }
};

// Update a post (only by author)
export const updatePost = async (postId, updates, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) throw new Error('Post not found');
    const data = postDoc.data();
    if (data.authorId !== userId) throw new Error('Not authorized');

    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: error.message };
  }
};

// Admin override: update any post (no author check)
export const adminUpdatePost = async (postId, updates) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) throw new Error('Post not found');

    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error admin-updating post:', error);
    return { success: false, error: error.message };
  }
};

// Delete a post (only by author) and adjust counts
// (removed duplicate temporary deletePost; see enhanced version below)

export const deletePost = async (postId, authorId) => {
  try {
    // Verify author and get post data
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error('Post not found');
    const postData = postSnap.data();
    if (postData.authorId !== authorId) throw new Error('Not authorized');

    const batch = writeBatch(db);

    // Delete the post
    batch.delete(postRef);

    // Delete all comments for this post
    const commentsQueryRef = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );
    const commentsSnapshot = await getDocs(commentsQueryRef);
    commentsSnapshot.docs.forEach((d) => batch.delete(d.ref));

    // Update user post count
    const userRef = doc(db, 'users', authorId);
    batch.update(userRef, { postCount: increment(-1) });

    // Update community post count if applicable
    if (postData.communityId) {
      const communityRef = doc(db, 'communities', postData.communityId);
      batch.update(communityRef, { postCount: increment(-1), lastActivity: serverTimestamp() });
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: error.message };
  }
};

// Admin override: delete any post (no author check)
export const adminDeletePost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error('Post not found');
    const postData = postSnap.data();

    const batch = writeBatch(db);
    batch.delete(postRef);

    // Delete all comments tied to this post
    const commentsQueryRef = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );
    const commentsSnapshot = await getDocs(commentsQueryRef);
    commentsSnapshot.docs.forEach((d) => batch.delete(d.ref));

    // Decrement author's post count if we have it
    if (postData.authorId) {
      const userRef = doc(db, 'users', postData.authorId);
      batch.update(userRef, { postCount: increment(-1) });
    }

    // Update community post count if applicable
    if (postData.communityId) {
      const communityRef = doc(db, 'communities', postData.communityId);
      batch.update(communityRef, { postCount: increment(-1), lastActivity: serverTimestamp() });
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error admin-deleting post:', error);
    return { success: false, error: error.message };
  }
};

// ============ COMMENTS ============
export const createComment = async (commentData) => {
  try {
    const batch = writeBatch(db);
    
    // Add comment
    const commentRef = doc(collection(db, 'comments'));
    batch.set(commentRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: []
    });
    
    // Increment post comment count
    const postRef = doc(db, 'posts', commentData.postId);
    batch.update(postRef, {
      comments: increment(1)
    });

    // Update user comment count
    const userRef = doc(db, 'users', commentData.authorId);
    batch.update(userRef, {
      commentCount: increment(1)
    });

    // Get post data to create notification
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      
      // Create notification for post author (if not self-comment)
      if (postData.authorId !== commentData.authorId) {
        const notificationRef = doc(collection(db, 'notifications'));
        batch.set(notificationRef, {
          userId: postData.authorId,
          type: 'comment',
          actorId: commentData.authorId,
          postId: commentData.postId,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return { success: true, id: commentRef.id };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error: error.message };
  }
};

export const getComments = (postId, callback) => {
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching comments:', error);
  });
};

export const likeComment = async (commentId, userId) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) throw new Error('Comment not found');
    
    const commentData = commentDoc.data();
    const likedBy = commentData.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    const batch = writeBatch(db);
    
    if (isLiked) {
      // Unlike
      batch.update(commentRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
    } else {
      // Like
      batch.update(commentRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      });

      // Create notification for comment author (if not self-like)
      if (commentData.authorId !== userId) {
        const notificationRef = doc(collection(db, 'notifications'));
        batch.set(notificationRef, {
          userId: commentData.authorId,
          type: 'comment_like',
          actorId: userId,
          postId: commentData.postId,
          commentId: commentId,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    return { success: true, isLiked: !isLiked };
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return { success: false, error: error.message };
  }
};

// ============ COMMUNITIES ============
export const createCommunity = async (communityData) => {
  try {
    const docRef = await addDoc(collection(db, 'communities'), {
      ...communityData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      memberCount: 1,
      postCount: 0,
      members: [communityData.creatorId],
      moderators: [communityData.creatorId],
      lastActivity: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating community:', error);
    return { success: false, error: error.message };
  }
};

export const getCommunities = (callback) => {
  const q = query(
    collection(db, 'communities'),
    orderBy('memberCount', 'desc'),
    limit(50)
  );
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching communities:', error);
  });
};

export const joinCommunity = async (communityId, userId) => {
  try {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const communityData = communityDoc.data();
    const members = communityData.members || [];
    
    if (members.includes(userId)) {
      return { success: false, error: 'Already a member' };
    }
    
    const batch = writeBatch(db);
    
    batch.update(communityRef, {
      memberCount: increment(1),
      members: arrayUnion(userId),
      lastActivity: serverTimestamp()
    });

    // Update user community count
    const userRef = doc(db, 'users', userId);
    batch.update(userRef, {
      communityCount: increment(1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error joining community:', error);
    return { success: false, error: error.message };
  }
};

export const leaveCommunity = async (communityId, userId) => {
  try {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (!communityDoc.exists()) throw new Error('Community not found');
    
    const communityData = communityDoc.data();
    const members = communityData.members || [];
    
    if (!members.includes(userId)) {
      return { success: false, error: 'Not a member' };
    }
    
    const batch = writeBatch(db);
    
    batch.update(communityRef, {
      memberCount: increment(-1),
      members: arrayRemove(userId),
      moderators: arrayRemove(userId), // Remove from moderators if they were one
      lastActivity: serverTimestamp()
    });

    // Update user community count
    const userRef = doc(db, 'users', userId);
    batch.update(userRef, {
      communityCount: increment(-1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error leaving community:', error);
    return { success: false, error: error.message };
  }
};

// ============ EVENTS ============
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      attendeeCount: 0,
      attendees: [],
      date: new Date(eventData.date) // Ensure date is properly formatted
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error: error.message };
  }
};

export const getEvents = (callback) => {
  const q = query(
    collection(db, 'events'),
    where('date', '>=', new Date()),
    orderBy('date', 'asc'),
    limit(50)
  );
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching events:', error);
  });
};

export const registerForEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) throw new Error('Event not found');
    
    const eventData = eventDoc.data();
    const attendees = eventData.attendees || [];
    
    if (attendees.includes(userId)) {
      return { success: false, error: 'Already registered' };
    }
    
    const batch = writeBatch(db);
    
    batch.update(eventRef, {
      attendeeCount: increment(1),
      attendees: arrayUnion(userId)
    });

    // Update user event count
    const userRef = doc(db, 'users', userId);
    batch.update(userRef, {
      eventCount: increment(1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error: error.message };
  }
};

export const unregisterFromEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) throw new Error('Event not found');
    
    const eventData = eventDoc.data();
    const attendees = eventData.attendees || [];
    
    if (!attendees.includes(userId)) {
      return { success: false, error: 'Not registered' };
    }
    
    const batch = writeBatch(db);
    
    batch.update(eventRef, {
      attendeeCount: increment(-1),
      attendees: arrayRemove(userId)
    });

    // Update user event count
    const userRef = doc(db, 'users', userId);
    batch.update(userRef, {
      eventCount: increment(-1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return { success: false, error: error.message };
  }
};

// ============ USERS & FOLLOWING ============
export const createOrUpdateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
};

export const followUser = async (followerId, followingId) => {
  try {
    if (followerId === followingId) {
      return { success: false, error: 'Cannot follow yourself' };
    }

    const batch = writeBatch(db);
    
    const followerRef = doc(db, 'users', followerId);
    const followingRef = doc(db, 'users', followingId);
    
    // Check if already following
    const followDoc = await getDocs(query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    ));
    
    if (!followDoc.empty) {
      return { success: false, error: 'Already following this user' };
    }
    
    // Update follower count
    batch.update(followerRef, {
      followingCount: increment(1)
    });
    
    // Update following count
    batch.update(followingRef, {
      followerCount: increment(1)
    });
    
    // Create follow relationship
    const followRef = doc(collection(db, 'follows'));
    batch.set(followRef, {
      followerId,
      followingId,
      createdAt: serverTimestamp()
    });

    // Create notification for the followed user
    const notificationRef = doc(collection(db, 'notifications'));
    batch.set(notificationRef, {
      userId: followingId,
      type: 'follow',
      actorId: followerId,
      read: false,
      createdAt: serverTimestamp()
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error following user:', error);
    return { success: false, error: error.message };
  }
};

export const unfollowUser = async (followerId, followingId) => {
  try {
    const batch = writeBatch(db);
    
    const followerRef = doc(db, 'users', followerId);
    const followingRef = doc(db, 'users', followingId);
    
    // Find and delete follow relationship
    const followQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    
    const followDocs = await getDocs(followQuery);
    
    if (followDocs.empty) {
      return { success: false, error: 'Not following this user' };
    }
    
    followDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Update counts
    batch.update(followerRef, {
      followingCount: increment(-1)
    });
    
    batch.update(followingRef, {
      followerCount: increment(-1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, error: error.message };
  }
};

export const getFollowSuggestions = async (userId) => {
  try {
    // Get users that current user is not following
    // This is a simplified version - in production, you'd want more sophisticated recommendations
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('followerCount', 'desc'),
      limit(10)
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    const users = [];
    
    // Get current user's following list
    const followingQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', userId)
    );
    const followingSnapshot = await getDocs(followingQuery);
    const followingIds = followingSnapshot.docs.map(doc => doc.data().followingId);
    
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (doc.id !== userId && !followingIds.includes(doc.id)) {
        users.push({
          id: doc.id,
          ...userData
        });
      }
    });
    
    return { success: true, data: users.slice(0, 5) };
  } catch (error) {
    console.error('Error getting follow suggestions:', error);
    return { success: false, error: error.message };
  }
};

export const getFollowing = async (userId) => {
  try {
    const followingQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', userId)
    );
    
    const snapshot = await getDocs(followingQuery);
    const followingIds = snapshot.docs.map(doc => doc.data().followingId);
    
    return { success: true, data: followingIds };
  } catch (error) {
    console.error('Error getting following list:', error);
    return { success: false, error: error.message };
  }
};

export const getFollowers = async (userId) => {
  try {
    const followersQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', userId)
    );
    
    const snapshot = await getDocs(followersQuery);
    const followerIds = snapshot.docs.map(doc => doc.data().followerId);
    
    return { success: true, data: followerIds };
  } catch (error) {
    console.error('Error getting followers list:', error);
    return { success: false, error: error.message };
  }
};

// ============ SEARCH ============
export const searchPosts = async (searchTerm) => {
  try {
    // Search in post content and tags
    const q = query(
      collection(db, 'posts'),
      where('tags', 'array-contains-any', [searchTerm.toLowerCase()]),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      type: 'post',
      ...doc.data()
    }));
    
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error searching posts:', error);
    return { success: false, error: error.message };
  }
};

export const searchUsers = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simplified search - for production, you'd want more sophisticated recommendations
    const q = query(
      collection(db, 'users'),
      orderBy('displayName'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const users = snapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'user',
        ...doc.data()
      }))
      .filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return { success: true, data: users };
  } catch (error) {
    console.error('Error searching users:', error);
    return { success: false, error: error.message };
  }
};

export const searchCommunities = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'communities'),
      orderBy('memberCount', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const communities = snapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'community',
        ...doc.data()
      }))
      .filter(community => 
        community.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return { success: true, data: communities };
  } catch (error) {
    console.error('Error searching communities:', error);
    return { success: false, error: error.message };
  }
};

export const searchEvents = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('date', '>=', new Date()),
      orderBy('date', 'asc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const events = snapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'event',
        ...doc.data()
      }))
      .filter(event => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    
    return { success: true, data: events };
  } catch (error) {
    console.error('Error searching events:', error);
    return { success: false, error: error.message };
  }
};

export const globalSearch = async (searchTerm) => {
  try {
    const [postsResult, usersResult, communitiesResult, eventsResult] = await Promise.all([
      searchPosts(searchTerm),
      searchUsers(searchTerm),
      searchCommunities(searchTerm),
      searchEvents(searchTerm)
    ]);
    
    const allResults = [
      ...(postsResult.success ? postsResult.data : []),
      ...(usersResult.success ? usersResult.data : []),
      ...(communitiesResult.success ? communitiesResult.data : []),
      ...(eventsResult.success ? eventsResult.data : [])
    ];
    
    return { success: true, data: allResults };
  } catch (error) {
    console.error('Error in global search:', error);
    return { success: false, error: error.message };
  }
};

// ============ NOTIFICATIONS ============
export const getUserNotifications = (userId, callback) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching notifications:', error);
  });
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const batch = writeBatch(db);
    
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(notificationsQuery);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: error.message };
  }
};

// ============ ANALYTICS & TRENDING ============
export const getTrendingTags = async () => {
  try {
    // Get recent posts to calculate trending tags
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(200)
    );
    
    const snapshot = await getDocs(q);
    const tagCounts = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.tags) {
        data.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    const sortedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
    
    return { success: true, data: sortedTags };
  } catch (error) {
    console.error('Error getting trending tags:', error);
    return { success: false, error: error.message };
  }
};

export const getUserStats = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    
    // Get additional stats
    const [postsQuery, commentsQuery, followersQuery, followingQuery] = await Promise.all([
      getDocs(query(collection(db, 'posts'), where('authorId', '==', userId))),
      getDocs(query(collection(db, 'comments'), where('authorId', '==', userId))),
      getDocs(query(collection(db, 'follows'), where('followingId', '==', userId))),
      getDocs(query(collection(db, 'follows'), where('followerId', '==', userId)))
    ]);
    
    const stats = {
      postCount: postsQuery.size,
      commentCount: commentsQuery.size,
      followerCount: followersQuery.size,
      followingCount: followingQuery.size,
      communityCount: userData.communityCount || 0,
      eventCount: userData.eventCount || 0
    };
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { success: false, error: error.message };
  }
};

// ============ UTILITY FUNCTIONS ============
export const deletePost_DUPLICATE = async (postId, authorId) => {
  try {
    // Verify author and get post data
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error('Post not found');
    const postData = postSnap.data();
    if (postData.authorId !== authorId) throw new Error('Not authorized');

    const batch = writeBatch(db);

    // Delete the post
    batch.delete(postRef);

    // Delete all comments for this post
    const commentsQueryRef = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );
    const commentsSnapshot = await getDocs(commentsQueryRef);
    commentsSnapshot.docs.forEach((d) => batch.delete(d.ref));

    // Update user post count
    const userRef = doc(db, 'users', authorId);
    batch.update(userRef, { postCount: increment(-1) });

    // Update community post count if applicable
    if (postData.communityId) {
      const communityRef = doc(db, 'communities', postData.communityId);
      batch.update(communityRef, { postCount: increment(-1), lastActivity: serverTimestamp() });
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: error.message };
  }
};

// Admin override: delete any post (no author check)
export const adminDeletePost_DUPLICATE = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error('Post not found');
    const postData = postSnap.data();

    const batch = writeBatch(db);
    batch.delete(postRef);

    // Delete all comments tied to this post
    const commentsQueryRef = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );
    const commentsSnapshot = await getDocs(commentsQueryRef);
    commentsSnapshot.docs.forEach((d) => batch.delete(d.ref));

    // Decrement author's post count if we have it
    if (postData.authorId) {
      const userRef = doc(db, 'users', postData.authorId);
      batch.update(userRef, { postCount: increment(-1) });
    }

    // Update community post count if applicable
    if (postData.communityId) {
      const communityRef = doc(db, 'communities', postData.communityId);
      batch.update(communityRef, { postCount: increment(-1), lastActivity: serverTimestamp() });
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error admin-deleting post:', error);
    return { success: false, error: error.message };
  }
};

export const deleteComment = async (commentId, postId, authorId) => {
  try {
    const batch = writeBatch(db);
    
    // Delete comment
    batch.delete(doc(db, 'comments', commentId));
    
    // Decrement post comment count
    const postRef = doc(db, 'posts', postId);
    batch.update(postRef, {
      comments: increment(-1)
    });

    // Update user comment count
    const userRef = doc(db, 'users', authorId);
    batch.update(userRef, {
      commentCount: increment(-1)
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message };
  }
};

// ============ IMAGE UPLOAD (if needed) ============
export const uploadImage = async (file, folder = 'posts') => {
  try {
    // This is a placeholder - in a real app, you'd upload to Firebase Storage or another service
    // For now, we'll just return the data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result });
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
};

// ============ VIDEO UPLOAD (placeholder) ============
export const uploadVideo = async (file, folder = 'posts') => {
  try {
    const timestamp = Date.now();
    const path = `${folder}/videos/${timestamp}_${file.name}`;
    const ref = storageRef(storage, path);
    const snapshot = await uploadBytes(ref, file, { contentType: file.type || 'video/mp4' });
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { success: false, error: error.message };
  }
};

// ============ COMMUNITIES SLUG RESOLUTION ============
// Used by Community.tsx route "/c/:slug"
export const getCommunityIdBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, 'communities'),
      where('slug', '==', slug)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { success: false, error: 'Community not found' };
    const docSnap = snapshot.docs[0];
    return { success: true, data: docSnap.id };
  } catch (error) {
    console.error('Error resolving community slug:', error);
    return { success: false, error: error.message };
  }
};

// ============ CHANNELS (WhatsApp-like) ============
// Collection: 'channels'
// Fields: name, slug, description, avatarUrl, createdAt, updatedAt,
//         memberCount, members[], admins[], postCount, lastActivity
export const createChannel = async (channelData) => {
  try {
    // Ensure slug: generate from name if missing; ensure unique
    const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9\-\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    let slug = channelData.slug && channelData.slug.trim() ? slugify(channelData.slug) : slugify(channelData.name || 'channel');
    if (slug) {
      let candidate = slug;
      let suffix = 0;
      // Loop to ensure uniqueness (bounded attempts)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const existing = await getDocs(query(collection(db, 'channels'), where('slug', '==', candidate)));
        if (existing.empty) { slug = candidate; break; }
        suffix += 1;
        candidate = `${slug}-${suffix}`;
        if (suffix > 50) break; // safety
      }
    }

    const docRef = await addDoc(collection(db, 'channels'), {
      ...channelData,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      memberCount: 1,
      postCount: 0,
      members: [channelData.creatorId],
      admins: [channelData.creatorId],
      lastActivity: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating channel:', error);
    return { success: false, error: error.message };
  }
};

export const getChannels = (callback) => {
  const q = query(
    collection(db, 'channels'),
    orderBy('memberCount', 'desc'),
    limit(100)
  );
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching channels:', error);
  });
};

export const getChannelIdBySlug = async (slug) => {
  try {
    const q = query(collection(db, 'channels'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { success: false, error: 'Channel not found' };
    return { success: true, data: snapshot.docs[0].id };
  } catch (error) {
    console.error('Error resolving channel slug:', error);
    return { success: false, error: error.message };
  }
};

export const joinChannel = async (channelId, userId) => {
  try {
    const channelRef = doc(db, 'channels', channelId);
    const snap = await getDoc(channelRef);
    if (!snap.exists()) throw new Error('Channel not found');
    const data = snap.data();
    const members = data.members || [];
    if (members.includes(userId)) return { success: false, error: 'Already a member' };

    const batch = writeBatch(db);
    batch.update(channelRef, {
      memberCount: increment(1),
      members: arrayUnion(userId),
      lastActivity: serverTimestamp()
    });
    // optional: user doc tracking
    const userRef = doc(db, 'users', userId);
    batch.set(userRef, { channelCount: increment(1) }, { merge: true });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error joining channel:', error);
    return { success: false, error: error.message };
  }
};

export const leaveChannel = async (channelId, userId) => {
  try {
    const channelRef = doc(db, 'channels', channelId);
    const snap = await getDoc(channelRef);
    if (!snap.exists()) throw new Error('Channel not found');
    const data = snap.data();
    const members = data.members || [];
    if (!members.includes(userId)) return { success: false, error: 'Not a member' };

    const batch = writeBatch(db);
    batch.update(channelRef, {
      memberCount: increment(-1),
      members: arrayRemove(userId),
      admins: arrayRemove(userId),
      lastActivity: serverTimestamp()
    });
    const userRef = doc(db, 'users', userId);
    batch.set(userRef, { channelCount: increment(-1) }, { merge: true });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error leaving channel:', error);
    return { success: false, error: error.message };
  }
};

// Channel posts live in collection: 'channelPosts'
// Fields: channelId, authorId (must be admin), content, images[], linkUrl, createdAt, updatedAt, likes, likedBy[], views
export const getChannelPosts = (channelId, callback) => {
  const q = query(
    collection(db, 'channelPosts'),
    where('channelId', '==', channelId),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  return onSnapshot(q, callback, (error) => {
    console.error('Error fetching channel posts:', error);
  });
};

export const createChannelPost = async (channelId, authorId, post) => {
  try {
    // verify admin
    const channelRef = doc(db, 'channels', channelId);
    const channelDoc = await getDoc(channelRef);
    if (!channelDoc.exists()) throw new Error('Channel not found');
    const ch = channelDoc.data();
    const admins = ch.admins || [];
    if (!admins.includes(authorId)) throw new Error('Not authorized');

    const postRef = await addDoc(collection(db, 'channelPosts'), {
      channelId,
      authorId,
      content: post.content,
      images: post.images || [],
      linkUrl: post.linkUrl || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      views: 0
    });

    await updateDoc(channelRef, {
      postCount: increment(1),
      lastActivity: serverTimestamp()
    });

    return { success: true, id: postRef.id };
  } catch (error) {
    console.error('Error creating channel post:', error);
    return { success: false, error: error.message };
  }
};

export const likeChannelPost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'channelPosts', postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) throw new Error('Post not found');
    const data = snap.data();
    const likedBy = data.likedBy || [];
    const isLiked = likedBy.includes(userId);
    await updateDoc(postRef, {
      likes: increment(isLiked ? -1 : 1),
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
    return { success: true, isLiked: !isLiked };
  } catch (error) {
    console.error('Error liking channel post:', error);
    return { success: false, error: error.message };
  }
};

export const incrementChannelPostViews = async (postId) => {
  try {
    await updateDoc(doc(db, 'channelPosts', postId), { views: increment(1) });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing channel post views:', error);
    return { success: false, error: error.message };
  }
};

// Single channel helpers
export const getChannelById = async (channelId) => {
  try {
    const ref = doc(db, 'channels', channelId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { success: false, error: 'Channel not found' };
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (error) {
    console.error('Error getting channel by id:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeChannel = (channelId, callback) => {
  try {
    const ref = doc(db, 'channels', channelId);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        callback(null);
      } else {
        callback({ id: snap.id, ...snap.data() });
      }
    }, (error) => {
      console.error('Error subscribing to channel:', error);
    });
  } catch (error) {
    console.error('Error subscribing to channel:', error);
    return () => {};
  }
};
