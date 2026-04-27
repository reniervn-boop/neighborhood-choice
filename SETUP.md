# Neighborhood of Choice - Setup Guide

## Quick Start

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Get your web app credentials (Project Settings > Web App)
4. Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials

```bash
cp .env.local.example .env.local
```

Fill in the values from Firebase Console:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 2. Firestore Setup

1. In Firebase Console, go to Firestore Database
2. Create a new database (start in test mode for development)
3. Go to Rules tab and paste the content from `firestore.rules`
4. Publish rules

### 3. Storage Rules

1. Go to Storage in Firebase Console
2. Go to Rules tab and update to:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

### 4. Create Initial Admin User

1. Sign up through the app with your email
2. Go to Firestore > users collection
3. Edit your user document and set `role: "admin"` and `verified: true`

### 5. Enable Authentication Methods

1. Go to Authentication in Firebase Console
2. Enable Email/Password provider
3. Optional: Enable Phone authentication

### 6. Initialize Default Badges (Backend)

Run this in Firebase Cloud Functions console or use a one-time setup script:

```javascript
const gamificationService = require('./lib/services/gamificationService');
gamificationService.initializeDefaultBadges();
```

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── page.tsx              # Landing/Dashboard
├── auth/
│   ├── login/
│   └── signup/
├── report/              # Report submission
├── leaderboard/         # View top reporters
├── profile/             # User profile & settings
├── admin/               # Admin dashboard
└── layout.tsx           # Root layout with providers

lib/
├── firebase/
│   └── config.ts        # Firebase initialization
├── services/
│   ├── reportService.ts    # Report CRUD
│   ├── userService.ts      # User CRUD & gamification
│   └── gamificationService.ts  # Badge logic
├── hooks/
│   └── useAuth.ts       # Auth context hook
└── types.ts             # TypeScript interfaces

public/
└── manifest.json        # PWA manifest
```

## Key Features

### User Roles
- **Resident**: Can report issues, earn points, see leaderboard
- **Admin**: Can approve/reject reports, manage badges, export to JRA/COJ

### Gamification
- **Points**: 10 pts for approved report + 5 pts for photos
- **Badges**: Awarded based on triggers (first report, 5 potholes, etc.)
- **Leaderboard**: Top reporters by points

### JRA/COJ Integration (Phase 1)
- Manual admin review of reports
- Export approved reports to CSV
- Format includes all JRA escalation fields

## Database Schema

### Users Collection
```typescript
{
  uid: string
  email: string
  name: string
  unitBlock: string
  verified: boolean
  points: number
  badges: string[]
  role: "admin" | "resident"
  notificationPrefs: {
    realTime: boolean
    weeklyDigest: boolean
  }
}
```

### Reports Collection
```typescript
{
  userId: string
  category: ReportCategory
  title: string
  description: string
  location: { lat, lng, address }
  photos: string[]
  status: "submitted" | "approved" | "rejected" | "submitted_to_jra"
  createdAt: number
  points: number
}
```

## Next Steps (Phase 2)

- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Email newsletters (Resend/SendGrid)
- [ ] Report photo gallery & map view
- [ ] Duplicate detection
- [ ] JRA/COJ API integration (if available)
- [ ] SMS notifications
- [ ] Community forum

## Troubleshooting

**"Firebase config not found"**
- Ensure `.env.local` is created with all Firebase credentials
- Restart dev server after adding env vars

**"User not found after signup"**
- Check Firestore users collection
- Ensure Firestore rules are published

**"Photos not uploading"**
- Check Storage rules in Firebase Console
- Verify file size < 5MB
- Ensure user is authenticated

## Deployment

### Vercel (Recommended)

```bash
git push origin main
```

Vercel will auto-deploy. Add env vars in project settings.

### Environment Variables for Production
```
NEXT_PUBLIC_FIREBASE_* (same as development)
FIREBASE_ADMIN_SDK_JSON_BASE64 (for backend functions)
RESEND_API_KEY (for emails)
```

## Support

For questions or issues, check the plan file at `/plans/whimsical-purring-engelbart.md`.
