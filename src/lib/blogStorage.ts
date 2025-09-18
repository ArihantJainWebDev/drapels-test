import { Blog, BlogFormData, BlogCell, BlogUpdateData } from '@/types/blog';
import { db, auth } from '@/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { isCurrentUserAdmin } from '@/lib/adminConfig';

const BLOGS_COLLECTION = 'blogs';
const USER_FEEDBACK_COLLECTION = 'userFeedback';

// Helper function to convert Firestore timestamp to ISO string
const timestampToISO = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return new Date().toISOString();
};

// Helper function to convert Firestore document to Blog
const docToBlog = (doc: any): Blog => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    cells: data.cells,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    publishedAt: timestampToISO(data.publishedAt),
    updatedAt: timestampToISO(data.updatedAt),
    slug: data.slug,
    author: data.author,
    authorId: data.authorId,
    authorDisplayName: data.authorDisplayName,
    readTime: data.readTime,
    feedback: data.feedback || { likes: 0, dislikes: 0 }
  };
};

// Helper function to check if user is authenticated
const requireAuth = (): User => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

// Helper function to check if user can edit/delete a blog
const canModifyBlog = (blog: Blog, user: User): boolean => {
  return blog.authorId === user.uid;
};

// Helper function to check if user is an admin
const isAdmin = (user: User): boolean => {
  return isCurrentUserAdmin(user);
};

export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateExcerpt = (cells: BlogCell[]): string => {
  const textCells = cells.filter(cell => cell.type === 'text');
  if (textCells.length === 0) return '';
  
  const firstTextContent = textCells[0].content;
  return firstTextContent.length > 150 
    ? firstTextContent.slice(0, 150) + '...'
    : firstTextContent;
};

/** Fetch all blogs from Firestore */
export const fetchBlogs = async (): Promise<Blog[]> => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(blogsRef, orderBy('publishedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docToBlog);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

/** Fetch blogs with pagination support */
export const fetchBlogsPaginated = async (
  pageSize: number = 10,
  lastDoc?: any
): Promise<{ blogs: Blog[]; lastDoc?: any; hasMore: boolean }> => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    let q = query(blogsRef, orderBy('publishedAt', 'desc'), limit(pageSize));
    
    if (lastDoc) {
      q = query(blogsRef, orderBy('publishedAt', 'desc'), startAfter(lastDoc), limit(pageSize));
    }
    
    const querySnapshot = await getDocs(q);
    const blogs = querySnapshot.docs.map(docToBlog);
    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return {
      blogs,
      lastDoc: newLastDoc,
      hasMore: querySnapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching paginated blogs:', error);
    return { blogs: [], hasMore: false };
  }
};

/** Search blogs by title or content */
export const searchBlogs = async (searchTerm: string): Promise<Blog[]> => {
  if (!searchTerm.trim()) {
    return fetchBlogs();
  }

  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const querySnapshot = await getDocs(blogsRef);
    
    return querySnapshot.docs
      .map(docToBlog)
      .filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
};

/** Add a blog - requires authentication */
export const addBlogAsync = async (formData: BlogFormData): Promise<Blog> => {
  const user = requireAuth();
  
  const slug = createSlug(formData.title);
  const excerpt = formData.excerpt || generateExcerpt(formData.cells);
  
  // Get first image from cells as featured image if not provided
  const imageCell = formData.cells.find(cell => cell.type === 'image');
  const coverImage = formData.coverImage || imageCell?.content;

  const blogData = {
    title: formData.title,
    cells: formData.cells,
    excerpt,
    coverImage,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    slug,
    author: formData.author || user.displayName || 'Anonymous',
    authorId: user.uid,
    authorDisplayName: user.displayName || 'Anonymous',
    readTime: formData.readTime || '5 min read',
    feedback: { likes: 0, dislikes: 0 }
  };

  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const docRef = await addDoc(blogsRef, blogData);
    
    // Return the created blog with the generated ID
    return {
      id: docRef.id,
      ...blogData,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Blog;
  } catch (error) {
    console.error('Error adding blog:', error);
    throw new Error('Failed to create blog');
  }
};

/** Get a single blog by slug from Firestore */
export const getBlogBySlugAsync = async (slug: string): Promise<Blog | undefined> => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(blogsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return undefined;
    }
    
    return docToBlog(querySnapshot.docs[0]);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return undefined;
  }
};

/** Delete a blog by slug - requires authentication and ownership or admin */
export const deleteBlogBySlugAsync = async (slug: string): Promise<boolean> => {
  const user = requireAuth();
  
  try {
    const blog = await getBlogBySlugAsync(slug);
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    if (!isAdmin(user) && !canModifyBlog(blog, user)) {
      throw new Error('You can only delete your own blogs');
    }
    
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(blogsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

/** Update a blog by slug - requires authentication and ownership or admin */
export const updateBlogBySlugAsync = async (slug: string, partial: Partial<BlogFormData>): Promise<Blog | undefined> => {
  const user = requireAuth();
  
  try {
    const blog = await getBlogBySlugAsync(slug);
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    if (!isAdmin(user) && !canModifyBlog(blog, user)) {
      throw new Error('You can only edit your own blogs');
    }
    
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(blogsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return undefined;
    }
    
    const docRef = querySnapshot.docs[0].ref;
    const updateData: any = {
      ...partial,
      updatedAt: serverTimestamp()
    };
    
    // Update excerpt if cells changed
    if (partial.cells) {
      updateData.excerpt = partial.excerpt || generateExcerpt(partial.cells);
      
      // Update coverImage from cells if not explicitly provided
      if (!partial.coverImage) {
        const imageCell = partial.cells.find(cell => cell.type === 'image');
        if (imageCell?.content) {
          updateData.coverImage = imageCell.content;
        }
      }
    }
    
    // Update slug if title changed
    if (partial.title) {
      updateData.slug = createSlug(partial.title);
    }
    
    await updateDoc(docRef, updateData);
    
    // Return updated blog
    return await getBlogBySlugAsync(updateData.slug || slug);
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

/** Get blogs by specific author */
export const getBlogsByAuthorAsync = async (authorId: string): Promise<Blog[]> => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(blogsRef, where('authorId', '==', authorId), orderBy('publishedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docToBlog);
  } catch (error) {
    console.error('Error fetching blogs by author:', error);
    return [];
  }
};

/** Check if current user can modify a blog */
export const canUserModifyBlog = (blog: Blog): boolean => {
  const user = auth.currentUser;
  if (!user || !blog) return false;
  return isAdmin(user) || canModifyBlog(blog, user);
};

// -------------------- Feedback System --------------------

/** Get feedback counts for a blog */
export const getFeedbackCountsAsync = async (blogId: string): Promise<{ likes: number; dislikes: number }> => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    const blogDoc = await getDoc(blogRef);
    
    if (blogDoc.exists()) {
      const data = blogDoc.data();
      return data.feedback || { likes: 0, dislikes: 0 };
    }
    
    return { likes: 0, dislikes: 0 };
  } catch (error) {
    console.error('Error getting feedback counts:', error);
    return { likes: 0, dislikes: 0 };
  }
};

/** Submit feedback for a blog */
export const submitFeedbackAsync = async (blogId: string, type: 'like' | 'dislike'): Promise<{ likes: number; dislikes: number }> => {
  try {
    const user = requireAuth();
    const userRef = doc(db, USER_FEEDBACK_COLLECTION, user.uid);
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    
    // Get current user feedback and blog data
    const [userDoc, blogDoc] = await Promise.all([
      getDoc(userRef),
      getDoc(blogRef)
    ]);
    
    if (!blogDoc.exists()) {
      throw new Error('Blog not found');
    }
    
    // Initialize user feedback document if it doesn't exist
    if (!userDoc.exists()) {
      await setDoc(userRef, {});
    }
    
    const currentBlogData = blogDoc.data();
    const currentFeedback = currentBlogData.feedback || { likes: 0, dislikes: 0 };
    const userFeedback = userDoc.exists() ? userDoc.data() : {};
    const previousVote = userFeedback[blogId]; // 'like', 'dislike', or undefined
    
    // Calculate new feedback counts
    let newFeedback = { ...currentFeedback };
    
    // Remove previous vote if it exists
    if (previousVote === 'like') {
      newFeedback.likes = Math.max(0, newFeedback.likes - 1);
    } else if (previousVote === 'dislike') {
      newFeedback.dislikes = Math.max(0, newFeedback.dislikes - 1);
    }
    
    // Add new vote if it's different from previous vote
    if (previousVote !== type) {
      if (type === 'like') {
        newFeedback.likes = newFeedback.likes + 1;
      } else {
        newFeedback.dislikes = newFeedback.dislikes + 1;
      }
      
      // Update user's vote
      userFeedback[blogId] = type;
    } else {
      // User is removing their vote (clicking same button twice)
      delete userFeedback[blogId];
    }
    
    // Update both documents
    await Promise.all([
      updateDoc(blogRef, { feedback: newFeedback }),
      updateDoc(userRef, userFeedback)
    ]);
    
    return newFeedback;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const getUserFeedbackAsync = async (slug: string): Promise<1 | -1 | 0> => {
  try {
    const user = requireAuth();
    const userRef = doc(db, USER_FEEDBACK_COLLECTION, user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return 0;
    }
    
    const userFeedback = userDoc.data();
    const feedback = userFeedback[slug];
    
    if (feedback === 'like') {
      return 1;
    } else if (feedback === 'dislike') {
      return -1;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error getting user feedback:', error);
    return 0;
  }
};

export const updateUserFeedbackAsync = async (slug: string, type: 'like' | 'dislike'): Promise<void> => {
  const user = requireAuth();
  const userRef = doc(db, USER_FEEDBACK_COLLECTION, user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {});
  }
  
  const blogRef = doc(db, BLOGS_COLLECTION, slug);
  const blogDoc = await getDoc(blogRef);
  
  if (!blogDoc.exists()) {
    throw new Error('Blog not found');
  }
  
  const blogId = blogDoc.id;
  const userFeedback = userDoc.data() || {};
  userFeedback[blogId] = type;

  await updateDoc(userRef, userFeedback);
};

// Legacy compatibility functions (will be removed in future versions)
export const getBlogFromLocalStorage = (): Blog[] => {
  console.warn('getBlogFromLocalStorage is deprecated. Use fetchBlogs() instead.');
  return [];
};

export const addBlog = (formData: BlogFormData): Blog[] => {
  console.warn('addBlog is deprecated. Use addBlogAsync() instead.');
  return [];
};

export const getBlogBySlug = (slug: string): Blog | undefined => {
  console.warn('getBlogBySlug is deprecated. Use getBlogBySlugAsync() instead.');
  return undefined;
};

export const clearBlogCache = (): void => {
  // No-op for Firebase implementation
};

export const updateBlogFeedback = async (blogId: string, type: 'like' | 'dislike'): Promise<void> => {
  await submitFeedbackAsync(blogId, type);
};