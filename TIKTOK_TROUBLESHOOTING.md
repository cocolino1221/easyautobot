# TikTok OAuth Troubleshooting - redirect_uri Error

## The Error You're Seeing
```
Something went wrong
We couldn't log in with TikTok. This may be due to specific app settings.
If you're a developer, correct the following and try again:
    redirect_uri
```

## Common Causes & Solutions

### 1. Redirect URI Format Must Be EXACT

TikTok is very strict about redirect URI matching. Check these:

**✅ Correct format:**
```
http://localhost:3003/api/v1/integrations/tiktok/callback
```

**❌ Wrong formats that will fail:**
- `http://localhost:3003/api/v1/integrations/tiktok/callback/` (trailing slash)
- `https://localhost:3003/api/v1/integrations/tiktok/callback` (https instead of http)
- `http://127.0.0.1:3003/api/v1/integrations/tiktok/callback` (127.0.0.1 instead of localhost)
- `http://localhost:3003//api/v1/integrations/tiktok/callback` (double slash)

### 2. Where to Add Redirect URI in TikTok Portal

**Step-by-step:**

1. Go to: https://developers.tiktok.com/apps
2. Click on your app
3. In the left sidebar, find **"Login Kit"**
4. Click **"Manage"** or **"Settings"**
5. Look for **"Redirect domain"** or **"Redirect URI"** section
6. Add **EXACTLY** this:
   ```
   http://localhost:3003/api/v1/integrations/tiktok/callback
   ```
7. Click **"Save"** or **"Submit"**
8. Wait a few seconds for changes to propagate
9. Try connecting again

### 3. TikTok App Status

Your app must be in the correct state:

- ✅ **App Status**: Active (not Suspended)
- ✅ **Login Kit**: Enabled/Added as a product
- ✅ **Test Mode**: If using test mode, make sure your TikTok account is added as a test user

### 4. Check Your TikTok App Type

TikTok has different app types:

- **Web App** ✅ Use this type
- **iOS App** ❌ Won't work for web OAuth
- **Android App** ❌ Won't work for web OAuth

If you created a mobile app by mistake, create a new **Web App** instead.

### 5. Verify Your Environment Variables

Check your backend `.env` file:

```bash
TIKTOK_CLIENT_KEY=sbaws83d99xvqldaoi
TIKTOK_CLIENT_SECRET=e1nTisYspFRxxnzC6ALAOzKQVTYulGH2
TIKTOK_REDIRECT_URI=http://localhost:3003/api/v1/integrations/tiktok/callback
```

**Important**:
- No trailing slashes
- No extra spaces
- Use `http://` for local development
- Port must match (3003)

### 6. TikTok Developer Portal Changes (2024+)

TikTok may have changed their portal UI. Look for these alternative locations:

**Alternative 1: Basic Information Tab**
- Go to your app
- Click "Basic Information"
- Scroll down to "OAuth Redirect URLs" or "Authorized Redirect URIs"

**Alternative 2: Settings Tab**
- Go to your app
- Click "Settings"
- Look for "OAuth Settings" or "Redirect Settings"

**Alternative 3: Products Tab**
- Go to your app
- Click "Products"
- Find "Login Kit"
- Click "Settings" icon next to it

### 7. Scopes May Require Review

Your app is requesting these scopes:
- `user.info.basic`
- `video.list`
- `user.info.profile`
- `user.info.stats`

**Check:**
1. Are these scopes approved for your app?
2. In test mode, you may only have access to basic scopes
3. Try reducing scopes temporarily to just `user.info.basic`

To test with minimal scopes, temporarily update backend code at:
`apps/backend/src/integration/services/tiktok-oauth.service.ts` line ~56

Change from:
```typescript
const scopes = [
  'user.info.basic',
  'video.list',
  'user.info.profile',
  'user.info.stats',
].join(',');
```

To:
```typescript
const scopes = ['user.info.basic'].join(',');
```

### 8. Try Copy-Pasting from Browser Console

When you click "Connect TikTok", check backend logs for the full OAuth URL:

1. Click "Connect TikTok" button
2. Check your backend terminal for output like:
   ```
   🔗 TikTok OAuth URL generated:
      Client Key: sbaws...
      Redirect URI: http://localhost:3003/api/v1/integrations/tiktok/callback
      Full URL: https://www.tiktok.com/v2/auth/authorize?client_key=...
   ```
3. Copy the redirect URI from the logs
4. Paste it EXACTLY into TikTok Developer Portal

### 9. Clear Browser Cache & Cookies

Sometimes TikTok caches OAuth errors:

1. Open Developer Tools (F12)
2. Go to Application → Cookies
3. Clear all TikTok cookies
4. Try again

### 10. Test Mode Limitations

TikTok's test/sandbox mode may have restrictions:

**If using test mode:**
- Only test users (accounts you manually added) can authorize
- Some scopes may not be available
- The app won't work for public users until approved

**To add test users:**
1. Go to your TikTok app
2. Find "Test Users" or "Authorized Test Accounts"
3. Add your TikTok account email/username
4. Log in with that account when testing

### 11. Check TikTok API Version

We're using TikTok v2 API: `https://www.tiktok.com/v2/auth/authorize`

If this doesn't work, TikTok may have:
- Deprecated v2
- Changed the authorization endpoint
- Changed required parameters

Check TikTok's latest docs: https://developers.tiktok.com/doc/login-kit-web

### 12. Backend Logs to Check

After clicking "Connect TikTok", check backend terminal for warnings:

```bash
⚠️ TikTok Client Key appears too short (18 chars). Expected 20-30 characters.
```

If you see this, your client key might still be invalid.

## Step-by-Step Debugging Process

1. **Verify redirect URI is added** (with exact format, no trailing slash)
2. **Verify app type is "Web App"** (not mobile)
3. **Verify Login Kit is enabled**
4. **Try with minimal scopes** (just `user.info.basic`)
5. **Add your account as test user** (if in test mode)
6. **Clear browser cookies**
7. **Restart backend** (`pnpm dev`)
8. **Try again**

## Still Not Working?

If you've tried everything above and it still fails:

### Option A: Use Facebook OAuth Instead

Facebook/Instagram OAuth is working perfectly with your current credentials. Facebook is more commonly used for messaging automation anyway.

### Option B: Create a Brand New TikTok App

Sometimes TikTok apps get into a bad state:

1. Go to https://developers.tiktok.com/apps
2. Create a **NEW** app (not edit existing)
3. Choose **"Web App"** type
4. Add **"Login Kit"** product
5. Configure redirect URI from the start
6. Get new credentials
7. Update `.env` file

### Option C: Contact TikTok Developer Support

If nothing works:
1. Go to TikTok Developer Portal
2. Find "Support" or "Help"
3. Submit a ticket with:
   - Your app ID
   - The exact error message
   - Screenshots of your redirect URI settings

## Production Deployment

When you deploy to production, remember to:

1. Add production redirect URI:
   ```
   https://yourdomain.com/api/v1/integrations/tiktok/callback
   ```
2. Update `.env` in production:
   ```
   TIKTOK_REDIRECT_URI=https://yourdomain.com/api/v1/integrations/tiktok/callback
   ```
3. Submit app for review (required for public use)
4. Wait for TikTok approval

## Quick Test

To verify the OAuth flow is working on our end, test with Facebook which is already configured:

1. Go to http://localhost:3002/integrations
2. Click "Connect Facebook"
3. If Facebook works → our OAuth implementation is correct
4. If Facebook fails → there's a code issue

The fact that Facebook works confirms our OAuth implementation is solid - the issue is purely TikTok app configuration.
