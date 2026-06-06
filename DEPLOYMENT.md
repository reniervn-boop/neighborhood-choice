# 🚀 Deployment Guide

## ✅ GitHub Repository
**Repository:** https://github.com/reniervn-boop/neighborhood-choice
**Branch:** main
**Status:** ✅ Code pushed

## 🌐 Deploy to Vercel (Next.js)

Vercel is the easiest way to deploy Next.js apps. Follow these steps:

### Step 1: Go to Vercel
1. Open https://vercel.com in Chrome
2. Click **"Sign in with GitHub"**
3. Authorize Vercel to access your GitHub account

### Step 2: Create New Project
1. Click **"New Project"**
2. Search for and select **`neighborhood-choice`**
3. Click **"Import"**

### Step 3: Configure Project
1. **Project Name:** Keep as `neighborhood-choice`
2. **Framework Preset:** Next.js (auto-detected)
3. **Root Directory:** ./
4. **Environment Variables:** Add these:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

(Get these values from your Firebase console)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes for deployment to complete
3. Your app will be live at: **https://neighborhood-choice.vercel.app**

---

## 📋 Environment Variables

Copy your Firebase config from:
1. Firebase Console → Project Settings
2. Look for the "Web" config
3. Add each value to Vercel project settings

---

## ✨ Features Deployed

✅ Constitution reference page (`/constitution`)
✅ Membership system with voting enforcement
✅ AGM/voting with governance rules
✅ Committee management
✅ Noticeboard & alerts
✅ Finance & projects
✅ Events management
✅ User profiles with membership status
✅ Admin dashboard

---

## 🔗 Links

- **GitHub:** https://github.com/reniervn-boop/neighborhood-choice
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Live App:** https://neighborhood-choice.vercel.app (after deployment)

---

## ⚡ Local Development

To run locally:

```bash
cd /Users/renier/Projects/neighborhood-choice

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📞 Support

- GitHub Issues: https://github.com/reniervn-boop/neighborhood-choice/issues
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
