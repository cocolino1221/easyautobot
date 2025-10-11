# Deploy to Vercel (Frontend) + Render (Backend) - FREE

## 🎯 Step 1: Deploy Backend to Render (FREE)

1. **Go to Render.com**
   - Visit: https://render.com
   - Sign up with GitHub (if you haven't already)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `easyautobot` repository

3. **Configure Backend Service**
   - **Name:** `easyautobot-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or just `/`)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     pnpm install && pnpm --filter @saas-platform/shared build && cd apps/backend && pnpm prisma generate && cd ../.. && pnpm --filter @saas-platform/backend build
     ```
   - **Start Command:**
     ```bash
     cd apps/backend && node dist/main
     ```

4. **Add Environment Variables**
   Click "Environment" and add these variables:

   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_MIPdK1h3wlzc@ep-fragrant-block-ag7zcohe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

   JWT_SECRET=super-secret-jwt-key-change-in-production-make-it-very-long-and-random
   JWT_EXPIRATION=7d

   NODE_ENV=production
   PORT=3003

   META_APP_ID=1516114852849404
   META_APP_SECRET=8420f428e6e05ac5f8d500a773a3acaf
   META_REDIRECT_URI=https://easyautobot-backend.onrender.com/api/v1/integrations/facebook/callback

   TIKTOK_CLIENT_KEY=sbaws83d99xvqldaoi
   TIKTOK_CLIENT_SECRET=e1nTisYspFRxxnzC6ALAOzKQVTYulGH2
   TIKTOK_REDIRECT_URI=https://easyautobot-backend.onrender.com/api/v1/integrations/tiktok/callback

   FRONTEND_URL=https://easyautobot.vercel.app
   ```

   **Note:** Replace `easyautobot-backend.onrender.com` with your actual Render URL after deployment!

5. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes first time)
   - Copy your backend URL (e.g., `https://easyautobot-backend.onrender.com`)

---

## 🎯 Step 2: Deploy Frontend to Vercel (FREE)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up with GitHub (if you haven't already)

2. **Import Project**
   - Click "Add New" → "Project"
   - Import `easyautobot` repository from GitHub
   - Click "Import"

3. **Configure Frontend**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `pnpm install && pnpm build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://easyautobot-backend.onrender.com
     ```
   - Replace with your actual Render backend URL!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - You'll get a URL like: `https://easyautobot.vercel.app`

---

## 🎯 Step 3: Update OAuth Redirect URIs

### Facebook App:
1. Go to: https://developers.facebook.com/apps/1516114852849404
2. Go to: Settings → Basic
3. Add to "Valid OAuth Redirect URIs":
   ```
   https://easyautobot-backend.onrender.com/api/v1/integrations/facebook/callback
   ```
4. Save changes

### TikTok App:
1. Go to: https://developers.tiktok.com/apps
2. Select your app
3. Add redirect URI:
   ```
   https://easyautobot-backend.onrender.com/api/v1/integrations/tiktok/callback
   ```
4. Save changes

---

## 🎯 Step 4: Update Backend Environment Variables

Now that you have both URLs, update Render backend environment variables:

1. Go to your Render dashboard
2. Select `easyautobot-backend` service
3. Go to "Environment" tab
4. Update these variables:
   - `META_REDIRECT_URI=https://easyautobot-backend.onrender.com/api/v1/integrations/facebook/callback`
   - `TIKTOK_REDIRECT_URI=https://easyautobot-backend.onrender.com/api/v1/integrations/tiktok/callback`
   - `FRONTEND_URL=https://easyautobot.vercel.app`
5. Save and trigger a redeploy

---

## ✅ Step 5: Test Your Deployment

1. Visit: `https://easyautobot.vercel.app`
2. Sign in with: `admin@platform.com` / `admin123`
3. Go to Integrations
4. Click "Connect Facebook"
5. You should be redirected to Facebook OAuth!

---

## 📊 Free Tier Limits

### Vercel (Frontend):
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Auto-scaling

### Render (Backend):
- ✅ 750 hours/month (enough for 1 app running 24/7)
- ✅ Automatic HTTPS
- ⚠️  Spins down after 15 min of inactivity (free tier)
- ⚠️  Cold starts take ~30 seconds

---

## 🔧 Troubleshooting

### Backend takes 30s to respond:
- This is normal on Render free tier (cold start after inactivity)
- Upgrade to paid plan ($7/month) for always-on

### CORS errors:
- Check `FRONTEND_URL` is set correctly in Render
- Make sure it matches your Vercel URL exactly

### OAuth redirects fail:
- Verify redirect URIs in Facebook/TikTok developer portals
- Must match exactly (no trailing slashes)
- Must use HTTPS

### Database connection fails:
- Check `DATABASE_URL` in Render environment variables
- Verify Neon database is accessible (whitelist 0.0.0.0/0)

---

## 🚀 Next Steps

1. Change `JWT_SECRET` to a strong random string
2. Test all OAuth flows
3. Submit Facebook app for review (for production use)
4. Set up custom domain (optional)
5. Add monitoring (Vercel Analytics, Render logs)

---

## 💰 Cost After Free Tier

If you exceed free tier limits:
- **Vercel:** ~$20/month (Pro plan)
- **Render:** ~$7/month (Starter plan for always-on backend)
- **Neon Database:** Free tier is generous, paid starts at $19/month

**Total estimated cost:** $7-27/month depending on usage
