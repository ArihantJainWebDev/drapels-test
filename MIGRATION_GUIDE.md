# Firebase to NextAuth.js + MongoDB Migration Guide

## Overview

This document outlines the complete migration from Firebase Authentication and Firestore to NextAuth.js and MongoDB. This migration provides better performance, more control over your data, and eliminates vendor lock-in.

## 🔄 Migration Summary

### What Changed

| **Component** | **Before (Firebase)** | **After (NextAuth.js + MongoDB)** |
|---------------|----------------------|----------------------------------|
| **Authentication** | Firebase Auth | NextAuth.js with OAuth providers |
| **Database** | Firestore | MongoDB with Mongoose ODM |
| **Session Management** | Firebase Auth State | NextAuth.js Sessions |
| **User Management** | Firebase Admin SDK | Custom MongoDB operations |
| **File Storage** | Firebase Storage | ⚠️ Needs implementation (see below) |

### Key Benefits

- 🔒 **Better Security**: Database sessions, customizable auth flows
- ⚡ **Performance**: Direct database queries, optimized indexes
- 🎛️ **Control**: Full control over user data and authentication logic
- 💰 **Cost**: Potentially lower costs with self-managed infrastructure
- 🔓 **No Vendor Lock-in**: Open source solutions

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **MongoDB Database**: Either local MongoDB or MongoDB Atlas
2. **OAuth Provider Credentials**: Google, GitHub, etc.
3. **Environment Variables**: Updated with new credentials

---

## 🛠️ Installation & Setup

### 1. Dependencies Installed

The following packages were automatically installed/removed:

```bash
# Removed
npm uninstall firebase react-firebase-hooks

# Added
npm install mongoose @next-auth/mongodb-adapter mongodb@^5.9.2
```

### 2. Environment Variables

Create/update your `.env.local` file:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/your-database
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Email Provider (optional)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

---

## 📂 File Structure Changes

### New Files Created

```
models/
├── User.js              # User schema for MongoDB
├── Roadmap.js           # Roadmap schema
├── Progress.js          # Progress tracking schema
└── InterviewSession.js  # Interview session schema

src/services/
├── userService.ts       # Updated with MongoDB operations
├── roadmapService.ts    # New service for roadmap operations
└── roadmapGenerator.ts  # Updated to use MongoDB

src/app/api/auth/
└── [...nextauth].ts     # NextAuth configuration
```

### Modified Files

- `src/context/AuthContext.tsx` - Updated for NextAuth.js
- `src/app/layout.tsx` - Added SessionProvider
- `src/hooks/useAuth.ts` - Updated to use NextAuth.js session
- `src/lib/mongodb.ts` - Updated MongoDB connection
- `src/services/userService.ts` - Complete rewrite for MongoDB

### Removed Files

- `src/firebase.ts` - Firebase configuration (removed)
- `src/lib/firebase.ts` - Firebase configuration (removed)

---

## 🔄 Data Migration

### Database Schema Mapping

#### Users Collection

| **Firestore Field** | **MongoDB Field** | **Notes** |
|---------------------|-------------------|-----------|
| `uid` | `_id` | Auto-generated MongoDB ObjectId |
| `email` | `email` | Primary identifier |
| `displayName` | `name` or `displayName` | User's display name |
| `photoURL` | `image` | Profile image URL |
| `createdAt` | `createdAt` | Timestamp |
| `customClaims` | `plan`, `credits` | User subscription/credits |

#### Roadmaps Collection

| **Firestore Structure** | **MongoDB Structure** | **Changes** |
|-------------------------|----------------------|-------------|
| `users/{userId}/roadmaps/{roadmapId}` | `roadmaps` collection with `userId` field | Flattened structure |
| `topics.subtopics` | `steps` array | Simplified structure |
| `overallProgress` | `progress.percentage` | Nested progress object |

### Migration Script (Manual)

If you need to migrate existing data, create a migration script:

```javascript
// migration-script.js
const admin = require('firebase-admin');
const mongoose = require('mongoose');

// Initialize Firebase Admin
const serviceAccount = require('./path-to-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Connect to MongoDB
mongoose.connect('your-mongodb-uri');

const User = require('./models/User.js');
const Roadmap = require('./models/Roadmap.js');

async function migrateUsers() {
  const usersSnapshot = await admin.firestore().collection('users').get();
  
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    
    try {
      await User.findOneAndUpdate(
        { email: userData.email },
        {
          name: userData.displayName,
          email: userData.email,
          image: userData.photoURL,
          credits: userData.credits || 100,
          plan: userData.plan || 'free',
          // ... other fields
        },
        { upsert: true }
      );
      console.log(`Migrated user: ${userData.email}`);
    } catch (error) {
      console.error(`Failed to migrate user ${doc.id}:`, error);
    }
  }
}

// Run migration
migrateUsers();
```

---

## 🔧 Code Updates Required

### 1. Authentication Usage

**Before (Firebase):**
```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  const handleSignIn = () => {
    signIn(email, password);
  };
}
```

**After (NextAuth.js):**
```tsx
import { useAuth } from '@/context/AuthContext';
import { signIn, signOut } from 'next-auth/react';

function MyComponent() {
  const { user, session, isAuthenticated } = useAuth();
  
  const handleSignIn = () => {
    signIn('google'); // or 'github'
  };
}
```

### 2. Database Operations

**Before (Firestore):**
```tsx
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const userRef = doc(db, 'users', userId);
const userDoc = await getDoc(userRef);
```

**After (MongoDB):**
```tsx
import { getUserProfile, updateUserProfile } from '@/services/userService';

const user = await getUserProfile(userId);
await updateUserProfile(userId, updateData);
```

### 3. Roadmap Operations

**Before:**
```tsx
import { generateRoadmap } from '@/services/roadmapGenerator';

const roadmap = await generateRoadmap(params);
```

**After:**
```tsx
import { generateRoadmap } from '@/services/roadmapGenerator';

const roadmap = await generateRoadmap(params, session.user.id);
```

---

## 🚨 Important Notes & Warnings

### File Storage Migration Required

⚠️ **File uploads are not implemented** - Firebase Storage functionality needs to be replaced with:

- **AWS S3** - Most popular, cost-effective
- **Cloudinary** - Image optimization included
- **UploadThing** - Next.js friendly
- **Supabase Storage** - Open source alternative

**Current Implementation:**
```tsx
export const uploadUserPhoto = async (userId: string, file: File): Promise<string> => {
  // TODO: Implement with your preferred file storage solution
  throw new Error('Photo upload needs to be implemented with a file storage service');
};
```

### Authentication Providers

Ensure you've configured OAuth applications:

1. **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
2. **GitHub OAuth**: [GitHub Developer Settings](https://github.com/settings/developers)

### Database Connection

Make sure your MongoDB connection string is correct:
- **Local**: `mongodb://localhost:27017/database-name`
- **Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

---

## 🧪 Testing the Migration

### 1. Authentication Testing

- [ ] Sign in with Google OAuth
- [ ] Sign in with GitHub OAuth  
- [ ] Session persistence after page refresh
- [ ] Sign out functionality

### 2. Database Operations Testing

- [ ] User profile creation/updates
- [ ] Roadmap creation/retrieval
- [ ] Progress tracking
- [ ] Credit system functionality

### 3. Performance Testing

- [ ] Page load times
- [ ] Database query performance
- [ ] Session management speed

---

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   MongooseError: Operation `users.findOne()` buffering timed out
   ```
   **Solution**: Check your `MONGODB_URI` and network connectivity

2. **NextAuth Session Error**
   ```
   [next-auth][error][SESSION_ERROR]
   ```
   **Solution**: Verify `NEXTAUTH_SECRET` is set and OAuth credentials are correct

3. **OAuth Provider Error**
   ```
   [next-auth][error][OAUTH_CALLBACK_ERROR]
   ```
   **Solution**: Check callback URLs in OAuth provider settings

### Environment Variables Checklist

- [ ] `MONGODB_URI` - Database connection string
- [ ] `NEXTAUTH_SECRET` - Secure random string
- [ ] `NEXTAUTH_URL` - Your app's URL
- [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_ID` & `GITHUB_SECRET`

---

## 🚀 Next Steps

### Immediate Actions Required

1. **Setup File Storage**: Choose and implement a file storage solution
2. **Test All Features**: Ensure all functionality works as expected
3. **Monitor Performance**: Watch for any performance issues
4. **Update Documentation**: Update any internal docs referencing old Firebase APIs

### Optional Enhancements

1. **Add More OAuth Providers**: Discord, Twitter, etc.
2. **Implement Email Magic Links**: For passwordless authentication
3. **Add Role-Based Access Control**: Using the MongoDB user model
4. **Setup Database Indexes**: Optimize query performance

### Security Recommendations

1. **Regular Security Updates**: Keep all packages updated
2. **Monitor Authentication**: Set up logging for failed attempts
3. **Database Security**: Use strong credentials and connection encryption
4. **Session Security**: Configure proper session timeouts

---

## 📞 Support

If you encounter issues during migration:

1. **Check Logs**: Browser console and server logs
2. **Verify Configuration**: Double-check all environment variables
3. **Test Database Connection**: Ensure MongoDB is accessible
4. **Review Code Changes**: Ensure all Firebase references are removed

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Backup existing Firebase data
- [ ] Set up MongoDB database
- [ ] Configure OAuth providers
- [ ] Update environment variables

### During Migration  
- [ ] Remove Firebase dependencies
- [ ] Install NextAuth.js and MongoDB packages
- [ ] Update authentication context
- [ ] Replace database operations
- [ ] Update API calls

### Post-Migration
- [ ] Test authentication flows
- [ ] Verify database operations
- [ ] Check performance
- [ ] Update deployment configuration
- [ ] Monitor for issues

---

*Migration completed on: $(date)*
*For questions or issues, refer to the troubleshooting section above.*