// Admin configuration - predefined admin accounts
export const ADMIN_ACCOUNTS = {
  'taizun8@gmail.com': {
    email: 'taizun8@gmail.com',
    username: '@taizun',
    displayName: 'Taizun',
    isVerified: true
  },
  'drapelsai@gmail.com': {
    email: 'drapelsai@gmail.com', 
    username: '@drapels',
    displayName: 'Drapels',
    isVerified: true
  },
  'arihantjainwebdev@gmail.com': {
    email: 'arihantjainwebdev@gmail.com',
    username: 'arihant15109',
    displayName: 'Arihant',
    isVerified: true
  }
} as const;

// Admin permissions - these cannot be granted to anyone else
export const ADMIN_PERMISSIONS = {
  DELETE_USER_PROFILE: 'delete_user_profile',
  DELETE_USER_POSTS: 'delete_user_posts', 
  PROMOTE_TO_VERIFIED: 'promote_to_verified',
  MANAGE_USERS: 'manage_users',
  MODERATE_CONTENT: 'moderate_content'
} as const;

// Check if a user is an admin by email
export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email in ADMIN_ACCOUNTS;
};

// Check if current Firebase user is an admin
export const isCurrentUserAdmin = (user: any): boolean => {
  return user?.email ? isAdmin(user.email) : false;
};

// Get admin info by email
export const getAdminInfo = (email: string) => {
  return ADMIN_ACCOUNTS[email as keyof typeof ADMIN_ACCOUNTS] || null;
};

// Check if user has specific admin permission
export const hasAdminPermission = (userEmail: string | null | undefined, permission: string): boolean => {
  return isAdmin(userEmail);
};

// Get all admin permissions for a user
export const getAdminPermissions = (userEmail: string | null | undefined): string[] => {
  if (!isAdmin(userEmail)) return [];
  return Object.values(ADMIN_PERMISSIONS);
};
