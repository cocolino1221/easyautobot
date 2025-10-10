# TikTok OAuth Setup Guide

## Current Issue
The error "Something went wrong... client_key" indicates that TikTok is rejecting your OAuth request, likely due to:
1. Invalid or incorrectly formatted client credentials
2. App not properly configured in TikTok Developer Portal
3. Redirect URI not whitelisted
4. Missing required app permissions

## Step-by-Step Setup

### 1. Create TikTok Developer Account
1. Go to https://developers.tiktok.com/
2. Sign up with your TikTok account
3. Complete developer verification (may require business verification)

### 2. Create a New App
1. Navigate to "My Apps" in the Developer Portal
2. Click "Create App"
3. Fill in app details:
   - **App Name**: Your platform name (e.g., "SaaS Messaging Platform")
   - **App Type**: Select "Web"
   - **Category**: Social or Marketing

### 3. Enable Login Kit Product
1. In your app dashboard, find "Products"
2. Click "Add Product"
3. Select "Login Kit" (required for OAuth)
4. Click "Manage" on Login Kit

### 4. Configure Redirect URI
**CRITICAL**: The redirect URI must match EXACTLY
1. In Login Kit settings, find "Redirect URI"
2. Add: `http://localhost:3003/api/v1/integrations/tiktok/callback`
3. For production, add your production URL (e.g., `https://yourdomain.com/api/v1/integrations/tiktok/callback`)
4. Click "Save"

### 5. Request Scopes/Permissions
1. In Login Kit, go to "User Data & Permissions"
2. Request these scopes (you may need to submit for review):
   - `user.info.basic` - Basic user info
   - `user.info.profile` - Profile information
   - `user.info.stats` - User statistics
   - `video.list` - Access to video list

⚠️ **Note**: TikTok requires app review for most scopes. During development, you may be limited to test users.

### 6. Get Your Credentials
1. Go to your app's "Credentials" or "App Info" section
2. Copy the **Client Key** (should be longer than 18 characters, typically 20-30 chars)
3. Copy the **Client Secret**
4. Update your `.env` file:

```bash
TIKTOK_CLIENT_KEY=your_actual_client_key_here
TIKTOK_CLIENT_SECRET=your_actual_client_secret_here
TIKTOK_REDIRECT_URI=http://localhost:3003/api/v1/integrations/tiktok/callback
```

### 7. Verify Your Credentials
The Client Key should:
- Be alphanumeric (letters and numbers)
- Be around 20-30 characters long
- Match exactly what's shown in the TikTok Developer Portal

The current key in your .env (`sbaws83d99xvqldaoi`) appears to be only 18 characters, which may be:
- Truncated
- From a test/sandbox environment
- Invalid/expired

### 8. Test with Test Users
1. In Developer Portal, go to "Test Users"
2. Add your TikTok account as a test user
3. Try the OAuth flow with this test account

### 9. Submit for App Review (Production)
For production use:
1. Complete all required app information
2. Submit app for TikTok review
3. Wait for approval (can take several days)
4. Once approved, your app can be used by any TikTok user

## Common Issues & Solutions

### Issue: "client_key" Error
**Solution**:
- Verify client_key is correct and complete
- Check that app is active (not suspended)
- Ensure you're using the Web App credentials (not iOS/Android)

### Issue: Redirect URI Mismatch
**Solution**:
- Redirect URI in code MUST exactly match TikTok app settings
- Include http:// or https://
- No trailing slashes unless configured in TikTok
- Port numbers must match

### Issue: Scope Not Granted
**Solution**:
- Some scopes require app review
- Use only approved scopes during testing
- Add test users in Developer Portal

### Issue: PKCE Verification Failed
**Solution**:
- Our implementation already includes PKCE (SHA-256)
- This error usually means the code_verifier was lost between requests
- Make sure your backend isn't restarting between auth request and callback

## Testing Your Setup

### 1. Check Backend Logs
When you click "Connect TikTok":
```bash
cd /Users/constantinpristavita/automation/saas-messaging-platform/apps/backend
pnpm dev
```

### 2. Inspect OAuth URL
The generated URL should look like:
```
https://www.tiktok.com/v2/auth/authorize?
  client_key=YOUR_CLIENT_KEY&
  redirect_uri=http://localhost:3003/api/v1/integrations/tiktok/callback&
  state=BASE64_ENCODED_STATE&
  scope=user.info.basic,video.list,user.info.profile,user.info.stats&
  response_type=code&
  code_challenge=GENERATED_SHA256_HASH&
  code_challenge_method=S256
```

### 3. Test the URL Manually
1. Copy the generated authUrl from the API response
2. Paste it in your browser
3. Check for TikTok's error message (more detailed than frontend)

## Debugging Checklist

- [ ] Client Key is correct and complete (20-30 chars)
- [ ] Client Secret is correct
- [ ] Redirect URI exactly matches TikTok app settings
- [ ] App has Login Kit product enabled
- [ ] Required scopes are approved or you're using a test user
- [ ] App status is "Active" not "Suspended"
- [ ] Using Web App credentials (not mobile app)
- [ ] No special characters in credentials

## Alternative: Facebook/Instagram First

Since Facebook OAuth credentials are already configured and working:
1. Test with Facebook first: `http://localhost:3002/integrations` → Click "Connect Facebook"
2. Verify OAuth flow works correctly
3. Use Facebook as a reference when debugging TikTok

## Production Deployment

When moving to production:
1. Add production redirect URI to TikTok app: `https://yourdomain.com/api/v1/integrations/tiktok/callback`
2. Update `TIKTOK_REDIRECT_URI` in production .env
3. Ensure app is approved by TikTok review
4. Test with real users (not just test users)

## Need More Help?

1. TikTok Documentation: https://developers.tiktok.com/doc/login-kit-web
2. TikTok API Reference: https://developers.tiktok.com/doc/oauth-user-access-token-management
3. Check Developer Portal for app status and error logs
