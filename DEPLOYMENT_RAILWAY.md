# Deploy to Railway - Step by Step Guide

## Why Railway?
- ✅ **FREE**: $5 credit/month (enough for small apps)
- ✅ Deploy frontend + backend together
- ✅ Automatic HTTPS & custom domains
- ✅ GitHub auto-deploy
- ✅ Easy environment variables
- ✅ Built-in PostgreSQL (or use Neon)

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Your code pushed to GitHub

---

## Step 1: Prepare Your Code

### 1.1 Update package.json in root
Make sure your root `package.json` has these scripts:

```json
{
  "scripts": {
    "build": "pnpm build",
    "start": "pnpm start"
  }
}
```

### 1.2 Create Railway configuration files

**For Backend** - Create `apps/backend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ../.. && pnpm install && pnpm --filter @saas-platform/backend build"
  },
  "deploy": {
    "startCommand": "cd apps/backend && pnpm start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**For Frontend** - Create `apps/frontend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ../.. && pnpm install && pnpm --filter @saas-platform/frontend build"
  },
  "deploy": {
    "startCommand": "cd apps/frontend && pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.3 Update NestJS for production

In `apps/backend/src/main.ts`, update CORS to accept your Railway domain:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    process.env.FRONTEND_URL || 'http://localhost:3002',
    /\.railway\.app$/, // Allow all Railway domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### 1.4 Add production start script

In `apps/backend/package.json`:
```json
{
  "scripts": {
    "start:prod": "node dist/main"
  }
}
```

In `apps/frontend/package.json`:
```json
{
  "scripts": {
    "start": "next start -p ${PORT:-3000}"
  }
}
```

---

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

---

## Step 3: Deploy Backend to Railway

### 3.1 Create Railway Project
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect it's a monorepo

### 3.2 Configure Backend Service
1. Click **"Add Service"** → **"GitHub Repo"**
2. Set **Root Directory**: `apps/backend`
3. Click **"Add Variables"** and add:

```env
# Database (use your Neon URL)
DATABASE_URL=postgresql://neondb_owner:npg_MIPdK1h3wlzc@ep-fragrant-block-ag7zcohe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# JWT
JWT_SECRET=super-secret-jwt-key-change-in-production-CHANGE-THIS
JWT_EXPIRATION=7d

# Server
PORT=3003
NODE_ENV=production

# Frontend URL (will update after frontend deployed)
FRONTEND_URL=https://your-frontend-app.railway.app

# Meta/Facebook
META_APP_ID=1516114852849404
META_APP_SECRET=8420f428e6e05ac5f8d500a773a3acaf
META_REDIRECT_URI=https://your-backend-app.railway.app/api/v1/integrations/facebook/callback

# TikTok
TIKTOK_CLIENT_KEY=sbaws83d99xvqldaoi
TIKTOK_CLIENT_SECRET=e1nTisYspFRxxnzC6ALAOzKQVTYulGH2
TIKTOK_REDIRECT_URI=https://your-backend-app.railway.app/api/v1/integrations/tiktok/callback
```

4. Click **"Deploy"**
5. Wait for deployment (2-5 minutes)
6. Copy your backend URL: `https://your-backend-app.railway.app`

### 3.3 Update OAuth Redirect URIs

**Facebook:**
1. Go to https://developers.facebook.com/apps/
2. Select your app
3. Add redirect URI: `https://your-backend-app.railway.app/api/v1/integrations/facebook/callback`

**TikTok:**
1. Go to https://developers.tiktok.com/apps
2. Select your app
3. Add redirect URI: `https://your-backend-app.railway.app/api/v1/integrations/tiktok/callback`

---

## Step 4: Deploy Frontend to Railway

### 4.1 Add Frontend Service
1. In same Railway project, click **"+ New"**
2. Choose **"GitHub Repo"** (same repo)
3. Set **Root Directory**: `apps/frontend`
4. Click **"Add Variables"**:

```env
NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app
NODE_ENV=production
```

5. Click **"Deploy"**
6. Wait for deployment
7. Copy your frontend URL: `https://your-frontend-app.railway.app`

### 4.2 Update Backend FRONTEND_URL
1. Go back to backend service
2. Update `FRONTEND_URL` variable to your frontend URL
3. Redeploy backend

---

## Step 5: Test Your Deployment

1. Visit: `https://your-frontend-app.railway.app`
2. Try signing in with: `admin@platform.com` / `admin123`
3. Test Facebook OAuth integration
4. Check backend logs in Railway dashboard

---

## Step 6: Add Custom Domain (Optional)

### 6.1 In Railway:
1. Go to frontend service
2. Click **"Settings"** → **"Domains"**
3. Click **"Generate Domain"** or **"Custom Domain"**
4. If custom: Add your domain (e.g., `app.yourdomain.com`)

### 6.2 In Your Domain Provider:
1. Add CNAME record:
   - Name: `app` (or `@` for root)
   - Value: `your-app.railway.app`
2. Wait for DNS propagation (5-30 minutes)

---

## Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify `DATABASE_URL` is correct
- Check `PORT` environment variable

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` points to backend
- Check CORS settings in `main.ts`
- Verify backend is deployed and running

### Database connection fails
- Use Neon PostgreSQL URL with `?sslmode=require`
- Check if IP is whitelisted in Neon (allow all: `0.0.0.0/0`)

### OAuth redirects fail
- Update redirect URIs in Facebook/TikTok developer portals
- Must use HTTPS URLs
- Match exactly (no trailing slashes)

---

## Cost Estimate

**Railway Free Tier:**
- $5 credit/month
- ~500 hours of runtime
- Your app will use ~$3-4/month

**To stay free:**
- Use Neon for database (free tier)
- Deploy only when needed
- Scale down when not in use

**After free tier:**
- ~$5-10/month for both services
- Pay-as-you-go pricing
- Can pause services when not needed

---

## Alternative: Split Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)
- Deploy frontend to Vercel (better for Next.js)
- Deploy backend to Railway
- Best performance

### Option 2: Vercel (Both)
- Deploy frontend as Vercel app
- Deploy backend as Vercel serverless functions
- May need code changes

---

## Next Steps After Deployment

1. **Change JWT_SECRET** to a strong random string
2. **Set up monitoring** (Railway has built-in metrics)
3. **Configure custom domain**
4. **Set up CI/CD** (Railway auto-deploys on git push)
5. **Add SSL certificate** (automatic with Railway)
6. **Test all OAuth flows** with production URLs
7. **Submit Facebook app for review** (for advanced permissions)

---

## Production Checklist

Before going live:

- [ ] Change `JWT_SECRET` to secure random string
- [ ] Update all OAuth redirect URIs to production URLs
- [ ] Test sign up/sign in flows
- [ ] Test Facebook OAuth integration
- [ ] Test TikTok OAuth (if using)
- [ ] Verify database connection
- [ ] Check error handling
- [ ] Test all API endpoints
- [ ] Configure custom domain
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Add privacy policy & terms of service
- [ ] Submit Facebook app for review

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app
