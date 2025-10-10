# 🔌 Setting Up REAL Social Media Integrations

This guide will help you connect REAL Instagram, Facebook, WhatsApp, and TikTok APIs to get actual data instead of dummy data.

## ⚠️ Important Note

To use REAL integrations, you need to:
1. Create developer accounts on each platform
2. Get API credentials (App IDs, Secrets, Tokens)
3. Set up OAuth apps
4. Configure webhooks

**This cannot be done automatically** - only YOU can create these accounts and get the credentials.

---

## 📋 Prerequisites

Before starting, you need:
- A Facebook Developer account
- A TikTok Developer account
- A business phone number for WhatsApp
- Access to the Instagram/Facebook pages you want to manage

---

## 1️⃣ Instagram Integration

### Step 1: Create Facebook App
1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" type
4. Fill in app details

### Step 2: Add Instagram Basic Display
1. In your app dashboard, go to "Add Products"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App"
4. Add OAuth Redirect URI: `http://localhost:3003/api/v1/integrations/instagram/callback`

### Step 3: Get Credentials
1. Go to Basic Settings
2. Copy your **App ID**
3. Copy your **App Secret**

### Step 4: Add to .env
```bash
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_WEBHOOK_VERIFY_TOKEN=random_string_here
```

---

## 2️⃣ Facebook Messenger Integration

### Step 1: Use Same Facebook App
You can use the same app from Instagram setup

### Step 2: Add Messenger Product
1. In app dashboard, go to "Add Products"
2. Find "Messenger" and click "Set Up"
3. Generate Page Access Token for your Facebook Page

### Step 3: Set up Webhooks
1. In Messenger settings, click "Set up webhooks"
2. Callback URL: `http://localhost:3003/api/v1/webhooks/facebook`
3. Verify Token: Use the same as `META_WEBHOOK_VERIFY_TOKEN`
4. Subscribe to: `messages`, `messaging_postbacks`, `messaging_optins`

### Step 4: Add to .env
```bash
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_VERIFY_TOKEN=same_as_meta_verify_token
```

---

## 3️⃣ WhatsApp Business Integration

### Step 1: Set Up WhatsApp Business API
1. Go to https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
2. Follow the "Get Started" guide
3. You need a business phone number

### Step 2: Get Phone Number ID
1. In Facebook App dashboard, go to WhatsApp > Getting Started
2. Copy your **Phone Number ID**
3. Copy your **Business Account ID**

### Step 3: Generate Permanent Token
1. Go to WhatsApp > Getting Started
2. Generate a permanent access token (instead of temporary 24h token)
3. Save this token securely

### Step 4: Set up Webhook
1. Callback URL: `http://localhost:3003/api/v1/webhooks/whatsapp`
2. Verify Token: Create a random string
3. Subscribe to `messages` field

### Step 5: Add to .env
```bash
WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id_here
WHATSAPP_ACCESS_TOKEN=your_permanent_token_here
WHATSAPP_VERIFY_TOKEN=random_string_here
```

---

## 4️⃣ TikTok Integration

### Step 1: Create TikTok Developer App
1. Go to https://developers.tiktok.com/
2. Click "Manage Apps" > "Connect an app"
3. Fill in app details

### Step 2: Configure OAuth
1. Add Redirect URI: `http://localhost:3003/api/v1/integrations/tiktok/callback`
2. Request permissions: `user.info.basic`, `video.list`

### Step 3: Get Credentials
1. Go to your app details
2. Copy **Client Key**
3. Copy **Client Secret**

### Step 4: Add to .env
```bash
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
```

---

## 5️⃣ Testing Your Setup

### For Local Development:
1. Use ngrok or a similar tool to expose your localhost:
   ```bash
   ngrok http 3003
   ```

2. Update all webhook URLs to use your ngrok URL:
   - Replace `http://localhost:3003` with `https://your-ngrok-url.ngrok.io`

3. Update OAuth redirect URIs in each platform's developer console

### For Production:
1. Deploy your backend to a server with HTTPS
2. Update all environment variables with production URLs
3. Update OAuth redirect URIs and webhook URLs in each platform

---

## 6️⃣ Rate Limits & Pricing

### Free Tier (Current Setup):
- ✅ 7-day trial period
- ✅ 5 API calls per day (150/month)
- ✅ Up to 4 integrations
- ✅ Up to 3 automation flows
- ✅ 1 team member

### After you add real credentials:
The platform will make REAL API calls to:
- Instagram Graph API
- Facebook Messenger API
- WhatsApp Cloud API
- TikTok For Business API

**Important**: Each platform has its own rate limits. Monitor your usage!

---

## 7️⃣ How It Works After Setup

Once you add real credentials:

1. **User clicks "Connect Instagram"**
   - → Redirects to Instagram OAuth
   - → User authorizes your app
   - → Gets real access token
   - → Stores in database

2. **Platform fetches real messages**
   - → Uses access token to call API
   - → Gets actual conversations
   - → Displays in your inbox

3. **User sends message**
   - → Platform calls Instagram API with token
   - → Real message sent to customer
   - → Counted against daily limit (5/day free)

---

## 8️⃣ Next Steps

1. ✅ Rate limiting is already implemented
2. ✅ 7-day trial period is configured
3. ⏳ Add your API credentials to `.env`
4. ⏳ Test OAuth flows
5. ⏳ Configure webhooks
6. ⏳ Deploy to production

---

## 📚 Additional Resources

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [TikTok For Business](https://developers.tiktok.com/doc/getting-started-create-an-app)

---

## ❓ FAQ

**Q: Can you add the API credentials for me?**
A: No, only YOU can create developer accounts and get credentials. These are tied to YOUR business/personal account.

**Q: How much does it cost?**
A: The APIs themselves are free for basic usage, but each platform has rate limits. You may need to pay for higher limits.

**Q: Do I need all 4 integrations?**
A: No, you can start with just one (e.g., Instagram) and add others later.

**Q: What happens after 7-day trial?**
A: Free tier continues with 5 calls/day limit. Upgrade to PRO for unlimited.

---

## 🚀 Ready to Start?

1. Copy `.env.example` to `.env`
2. Fill in your API credentials
3. Restart the backend server
4. Connect your accounts from the Integrations page

Good luck! 🎉
