# Firebase Setup Guide

This project uses a proper separation between Firebase client and server SDKs to avoid Next.js build issues.

## File Structure

### Client-Side Firebase (`src/lib/firebase.ts`)
- **Purpose**: For use in React components and client-side code
- **SDK**: `firebase` (client SDK)
- **Usage**: Authentication, Firestore operations from the browser
- **Safe to import in**: Components, hooks, client utilities

```ts
import { auth, db } from '@/lib/firebase';
```

### Server-Side Firebase (`src/lib/firebase-admin.ts`)
- **Purpose**: For use in server-side code only
- **SDK**: `firebase-admin` (admin SDK)  
- **Usage**: API routes, server actions, Cloud Functions
- **⚠️ Never import in**: React components, client-side code

```ts
import { admin } from '@/lib/firebase-admin';
```

### Server-Side Auth Utilities (`src/lib/auth-server.ts`)
- **Purpose**: Server-side authentication helpers
- **Usage**: Verify tokens, manage users from server
- **⚠️ Never import in**: React components, client-side code

```ts
import { verifyIdToken, getUserByUid } from '@/lib/auth-server';
```

## Usage Examples

### ✅ Correct Usage

**Client Component:**
```tsx
'use client';
import { auth } from '@/lib/firebase'; // ✅ Client SDK in client component
```

**API Route:**
```ts
// app/api/users/route.ts
import { admin } from '@/lib/firebase-admin'; // ✅ Admin SDK in API route
```

**Server Action:**
```ts
'use server';
import { admin } from '@/lib/firebase-admin'; // ✅ Admin SDK in server action
```

### ❌ Incorrect Usage

**Client Component:**
```tsx
'use client';
import { admin } from '@/lib/firebase-admin'; // ❌ Admin SDK in client component
```

**Layout or Shared Component:**
```tsx
// This would cause the "net module" error:
import { admin } from '@/lib/firebase-admin'; // ❌ Admin SDK in shared component
```

## Next.js Configuration

The `next.config.ts` includes fallback configuration to prevent Node.js module errors:

```ts
webpack: (config) => {
  config.resolve.fallback = {
    net: false,
    tls: false, 
    fs: false,
    child_process: false,
    http: false,
    https: false,
    os: false,
    path: false,
  };
  return config;
}
```

## Environment Variables

For the admin SDK to work in production, set up Firebase service account credentials:

```env
# Option 1: Application Default Credentials (recommended for deployment)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Option 2: Service account directly in env (not recommended for production)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="your-project-id"
```

## Key Rules

1. **Never import `firebase-admin` in client components or shared files**
2. **Use `firebase` (client SDK) for browser-side operations**
3. **Use `firebase-admin` only in API routes, server actions, and Cloud Functions**
4. **Keep authentication logic separated between client and server**