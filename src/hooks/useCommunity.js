// hooks/useCommunity.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import * as communityService from '../services/communityService';

// ============ POSTS HOOK ============
export const usePosts = (filterType = 'all', communityId = 'all') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = communityService.getPosts((snapshot) => {
      try {
        const postsData = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          postsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          });
        });
        
        setPosts(postsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error processing posts:', err);
        setError(err.message);
        setLoading(false);
      }
    }, filterType, communityId);

    return unsubscribe;
  }, [filterType, communityId, refreshToken]);

  const refreshPosts = useCallback(() => {
    setRefreshToken((t) => t + 1);
  }, []);

  return { posts, loading, error, refreshPosts };
};

// ============ COMMENTS HOOK ============
export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = communityService.getComments(postId, (snapshot) => {
      try {
        const commentsData = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          commentsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt && data.updatedAt.toDate ? data.updatedAt.toDate() : undefined)
          });
        });
        
        setComments(commentsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error processing comments:', err);
        setError(err.message);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [postId]);

  return { comments, loading, error };
};

// ============ TRENDING TAGS HOOK ============
export const useTrendingTags = (limit = 10) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    communityService.getTrendingTags()
      .then(result => {
        if (result.success) {
          setTags(result.data.slice(0, limit));
          setError(null);
        } else {
          setError(result.error);
        }
      })
      .catch(err => {
        console.error('Error fetching trending tags:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { tags, loading, error };
};

// ============ FOLLOWING HOOK ============
export const useFollowing = (userId) => {
  const [following, setFollowing] = useState([]);
  const [followSuggestions, setFollowSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setFollowing([]);
      setFollowSuggestions([]);
      setLoading(false);
      return;
    }

    const fetchFollowingData = async () => {
      setLoading(true);
      try {
        const [followingResult, suggestionsResult] = await Promise.all([
          communityService.getFollowing(userId),
          communityService.getFollowSuggestions(userId)
        ]);

        if (followingResult.success) {
          setFollowing(followingResult.data);
        } else {
          console.error('Error fetching following:', followingResult.error);
        }

        if (suggestionsResult.success) {
          setFollowSuggestions(suggestionsResult.data);
        } else {
          console.error('Error fetching suggestions:', suggestionsResult.error);
        }

        setError(null);
      } catch (err) {
        console.error('Error in useFollowing:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingData();
  }, [userId]);

  const followUser = useCallback(async (targetUserId) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.followUser(userId, targetUserId);
      if (result.success) {
        setFollowing(prev => [...prev, targetUserId]);
        setFollowSuggestions(prev => prev.filter(user => user.id !== targetUserId));
      }
      return result;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }, [userId]);

  const unfollowUser = useCallback(async (targetUserId) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.unfollowUser(userId, targetUserId);
      if (result.success) {
        setFollowing(prev => prev.filter(id => id !== targetUserId));
      }
      return result;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }, [userId]);

  return { 
    following, 
    followSuggestions, 
    loading, 
    error, 
    followUser, 
    unfollowUser 
  };
};

// ============ USER PROFILE HOOK ============
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const result = await communityService.getUserProfile(userId);
        
        if (result.success) {
          setProfile(result.data);
          setError(null);
        } else {
          setError(result.error);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};

// ============ EVENTS HOOK ============
export const useEvents = () => {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = communityService.getEvents((snapshot) => {
      try {
        const eventsData = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          eventsData.push({
            id: doc.id,
            ...data,
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
            createdAt: data.createdAt?.toDate(),
            isRegistered: user ? (data.attendees || []).includes(user.uid) : false
          });
        });
        
        setEvents(eventsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error processing events:', err);
        setError(err.message);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [user]);

  const registerForEvent = useCallback(async (eventId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.registerForEvent(eventId, user.uid);
      if (result.success) {
        // Update local state immediately
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true, attendeeCount: (event.attendeeCount || 0) + 1 }
            : event
        ));
      }
      return result;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }, [user]);

  const unregisterFromEvent = useCallback(async (eventId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.unregisterFromEvent(eventId, user.uid);
      if (result.success) {
        // Update local state immediately
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: false, attendeeCount: Math.max((event.attendeeCount || 1) - 1, 0) }
            : event
        ));
      }
      return result;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  }, [user]);

  return { 
    events, 
    loading, 
    error, 
    registerForEvent, 
    unregisterFromEvent
  };
};

// ============ COMMUNITIES HOOK ============
export const useCommunities = () => {
  const [user] = useAuthState(auth);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = communityService.getCommunities((snapshot) => {
      try {
        const communitiesData = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          communitiesData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            isJoined: user ? (data.members || []).includes(user.uid) : false
          });
        });
        
        setCommunities(communitiesData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error processing communities:', err);
        setError(err.message);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [user]);

  const joinCommunity = useCallback(async (communityId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.joinCommunity(communityId, user.uid);
      if (result.success) {
        // Update local state immediately
        setCommunities(prev => prev.map(community => 
          community.id === communityId 
            ? { ...community, isJoined: true, memberCount: (community.memberCount || 0) + 1 }
            : community
        ));
      }
      return result;
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  }, [user]);

  const leaveCommunity = useCallback(async (communityId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.leaveCommunity(communityId, user.uid);
      if (result.success) {
        // Update local state immediately
        setCommunities(prev => prev.map(community => 
          community.id === communityId 
            ? { ...community, isJoined: false, memberCount: Math.max((community.memberCount || 1) - 1, 0) }
            : community
        ));
      }
      return result;
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  }, [user]);

  return { 
    communities, 
    loading, 
    error, 
    joinCommunity, 
    leaveCommunity 
  };
};

// ============ COMMUNITY ACTIONS HOOK ============
export const useCommunityActions = () => {
  const [user] = useAuthState(auth);
  const [actionLoading, setActionLoading] = useState({});

  const setLoading = (action, postId = null) => {
    const key = postId ? `${action}_${postId}` : action;
    setActionLoading(prev => ({ ...prev, [key]: true }));
  };

  const clearLoading = (action, postId = null) => {
    const key = postId ? `${action}_${postId}` : action;
    setActionLoading(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const createPost = useCallback(async (content, tags = [], images = [], communityId = 'all', videoUrl = null, linkUrl = null) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading('createPost');
    try {
      const postData = {
        content,
        tags: tags.map(tag => tag.toLowerCase()),
        images,
        videoUrl,
        linkUrl,
        authorId: user.uid,
        communityId: communityId === 'all' ? null : communityId
      };
      
      const result = await communityService.createPost(postData);
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      clearLoading('createPost');
    }
  }, [user]);

  const createComment = useCallback(async (postId, content) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading('createComment');
    try {
      const commentData = {
        postId,
        content,
        authorId: user.uid
      };
      
      const result = await communityService.createComment(commentData);
      return result;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    } finally {
      clearLoading('createComment');
    }
  }, [user]);

  const likePost = useCallback(async (postId) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading('likePost', postId);
    try {
      const result = await communityService.likePost(postId, user.uid);
      return result;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    } finally {
      clearLoading('likePost', postId);
    }
  }, [user]);

  const savePost = useCallback(async (postId) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading('savePost', postId);
    try {
      const result = await communityService.savePost(postId, user.uid);
      return result;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    } finally {
      clearLoading('savePost', postId);
    }
  }, [user]);

  const sharePost = useCallback(async (postId) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading('sharePost', postId);
    try {
      const result = await communityService.sharePost(postId, user.uid);
      return result;
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    } finally {
      clearLoading('sharePost', postId);
    }
  }, [user]);

  const likeComment = useCallback(async (commentId) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.likeComment(commentId, user.uid);
      return result;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }, [user]);

  const updatePost = useCallback(async (postId, updates, authorId) => {
    if (!user) throw new Error('User not authenticated');

    setLoading('updatePost', postId);
    try {
      const result = await communityService.updatePost(postId, updates, authorId || user.uid);
      return result;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    } finally {
      clearLoading('updatePost', postId);
    }
  }, [user]);

  const deletePost = useCallback(async (postId, authorId) => {
    if (!user) throw new Error('User not authenticated');

    setLoading('deletePost', postId);
    try {
      const result = await communityService.deletePost(postId, authorId || user.uid);
      return result;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    } finally {
      clearLoading('deletePost', postId);
    }
  }, [user]);

  const uploadImage = useCallback(async (file, folder = 'posts') => {
    try {
      const result = await communityService.uploadImage(file, folder);
      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }, []);

  return {
    actionLoading,
    createPost,
    createComment,
    likePost,
    savePost,
    sharePost,
    likeComment,
    uploadImage,
    updatePost,
    deletePost
  };
};

// ============ SEARCH HOOK ============
export const useSearch = (searchTerm, searchType = 'all') => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm?.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        let result;
        
        switch (searchType) {
          case 'posts':
            result = await communityService.searchPosts(searchTerm);
            break;
          case 'users':
            result = await communityService.searchUsers(searchTerm);
            break;
          case 'communities':
            result = await communityService.searchCommunities(searchTerm);
            break;
          case 'events':
            result = await communityService.searchEvents(searchTerm);
            break;
          default:
            result = await communityService.globalSearch(searchTerm);
        }
        
        if (result.success) {
          setResults(result.data);
          setError(null);
        } else {
          setError(result.error);
          setResults([]);
        }
      } catch (err) {
        console.error('Error searching:', err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType]);

  return { results, loading, error };
};

// ============ NOTIFICATIONS HOOK ============
export const useNotifications = () => {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = communityService.getUserNotifications(user.uid, (snapshot) => {
      try {
        const notificationsData = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          notificationsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate()
          });
        });
        
        setNotifications(notificationsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error processing notifications:', err);
        setError(err.message);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [user]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const result = await communityService.markNotificationAsRead(notificationId);
      if (result.success) {
        setNotifications(prev => prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        ));
      }
      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await communityService.markAllNotificationsAsRead(user.uid);
      if (result.success) {
        setNotifications(prev => prev.map(notification => ({ 
          ...notification, 
          read: true 
        })));
      }
      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { 
    notifications, 
    loading, 
    error, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  };
};
