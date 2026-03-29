# How to Deploy Your PWA for Free

Since your app is built with **React, Vite, and Firebase**, you have three excellent, 100% free options for deployment. The white screen you saw on Netlify was likely caused by either **missing Environment Variables** (Firebase crashed because it lacked the API keys) or a **missing `_redirects` file** (Netlify couldn't parse React Router).

Here are the best free platforms to deploy this site correctly, starting with the absolute easiest.

---

## ⭐️ Option 1: Firebase Hosting (Recommended)
Since you are already using Firebase Authentication and Firestore, Firebase Hosting is the most native, seamless, and **completely free** (Spark Plan) place to deploy.

**Why it's best:** It automatically configures single-page app (SPA) routing so you never get a white screen, and it shares the same project as your database!

### Step-by-Step Guide:
1. Open your terminal in VS Code (where your project is).
2. Install the Firebase CLI (if you haven't already):
   ```bash
   npm install -g firebase-tools
   ```
3. Log in to your Google Account:
   ```bash
   firebase login
   ```
4. Initialize your project:
   ```bash
   firebase init hosting
   ```
   * **Select project:** Choose "Use an existing project" -> select `aanchal-1818` (or whatever your Firebase project ID is).
   * **Public directory:** Type `dist` (This is very important! Do NOT leave it as public).
   * **Configure as a single-page app:** Type `y` (Yes). This prevents the white screen errors!
   * **Set up automatic builds with GitHub:** Type `N` (No).
5. Build your Vite app locally:
   ```bash
   npm run build
   ```
6. Deploy it to the world!
   ```bash
   firebase deploy --only hosting
   ```
*(Note: Because Firebase Hosting serves from the same domain ecosystem as your database, you don't even need to add `.env` secrets to a dashboard! It builds your local `.env` keys right into the `dist` folder before uploading).*

---

## Option 2: Vercel (Easiest Integration)
Vercel is the creator of Next.js and has world-class free hosting for Vite apps with zero configuration required.

### Step-by-Step Guide:
1. Go to [Vercel.com](https://vercel.com) and create a free account using GitHub.
2. Click **"Add New..." > "Project"**.
3. Import your `Aanchal-lilmin` GitHub repository.
4. **CRITICAL STEP:** Before clicking Deploy, open the **Environment Variables** section.
5. In your local VS Code, open your `.env` file. You must copy/paste all 6 Firebase variables into Vercel one by one:
   - `VITE_FIREBASE_API_KEY` = `AIzaSy...`
   - `VITE_FIREBASE_AUTH_DOMAIN` = `...`
   - `VITE_FIREBASE_PROJECT_ID` = `...`
   - `VITE_FIREBASE_STORAGE_BUCKET` = `...`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = `...`
   - `VITE_FIREBASE_APP_ID` = `...`
6. Click **Deploy**. Vercel automatically understands React Router and Vite, so you won't get a white screen.

---

## Option 3: Fixing Netlify (If you want to stay there)
If you prefer to stick with Netlify, here is exactly how to fix the White Screen of Death:

1. **Add your Environment Variables:**
   - Go to your Netlify Dashboard > Site Configuration > Environment Variables.
   - You MUST add all 6 `VITE_FIREBASE_...` keys from your `.env` file here. If they are missing, Firebase crashes instantly on load, causing the white screen.
2. **Add a `_redirects` file (Fixes Router Crashes):**
   - Create a brand new file sitting directly inside your `/public` folder named exactly `_redirects` (no extension).
   - Paste this exact line of text inside it:
     ```text
     /*    /index.html   200
     ```
   - Commit and push this to GitHub. Netlify will rebuild and your site will work!
