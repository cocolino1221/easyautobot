# 🚀 Quick Start - Connect Real Facebook/Instagram

## ✅ The 503 Error is EXPECTED!

That error means the OAuth system is **working correctly** but waiting for your Facebook App credentials.

---

## 📝 5-Minute Setup Guide

### Step 1: Create Facebook App (2 minutes)

1. Go to: **https://developers.facebook.com/apps/**
2. Click **"Create App"**
3. Choose **"Business"** type
4. Fill in:
   - App Name: `My Messaging Platform`
   - App Contact Email: your@email.com
5. Click **"Create App"**

### Step 2: Add Products (1 minute)

1. Find **"Messenger"** → Click **"Set Up"**
2. Find **"Instagram"** → Click **"Set Up"**

### Step 3: Get Credentials (30 seconds)

1. Go to **Settings → Basic**
2. Copy **App ID**
3. Click "Show" and copy **App Secret**

### Step 4: Add to .env (1 minute)

Open: `apps/backend/.env`

```bash
META_APP_ID=YOUR_APP_ID_HERE
META_APP_SECRET=YOUR_APP_SECRET_HERE
```

### Step 5: Save & Restart

Backend will auto-reload! Or restart with `pnpm dev`

---

## ✨ Test It!

1. Go to: http://localhost:3002/integrations
2. Click "Connect Facebook"
3. REAL Facebook login appears
4. Authorize & select pages
5. Done! Real integration! 🎉

---

**This is now a REAL integration like ManyChat - no fake data!** 🚀
