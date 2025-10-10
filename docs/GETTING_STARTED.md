# Getting Started Guide

## Quick Start

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (will be installed automatically)
- **Docker** & Docker Compose ([Download](https://www.docker.com/))
- **Git**

### 2. Clone and Setup

```bash
cd saas-messaging-platform
./setup.sh
```

The setup script will:
- Install dependencies
- Create environment files
- Start PostgreSQL and Redis
- Run database migrations
- Build shared packages

### 3. Configure Environment Variables

#### Backend (`apps/backend/.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_messaging?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Clerk (Get from https://clerk.com)
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Meta (Get from https://developers.facebook.com)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_WEBHOOK_VERIFY_TOKEN=your_random_verify_token

# TikTok (Get from https://developers.tiktok.com)
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret

# Stripe (Get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`apps/frontend/.env.local`)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Meta
NEXT_PUBLIC_META_APP_ID=your_app_id

# TikTok
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_client_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development Servers

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter @saas-platform/frontend dev
pnpm --filter @saas-platform/backend dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Database**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

## Setting Up Integrations

### Meta (Facebook/Instagram)

1. **Create Facebook App**
   - Go to https://developers.facebook.com
   - Create new app → Business type
   - Add products: Messenger, Instagram

2. **Configure App**
   ```
   App ID: Copy to .env
   App Secret: Copy to .env
   ```

3. **Set up OAuth**
   ```
   Valid OAuth Redirect URIs:
   http://localhost:3000/api/integrations/meta/callback
   https://yourdomain.com/api/integrations/meta/callback
   ```

4. **Configure Webhooks**
   ```
   Callback URL: https://yourdomain.com/api/webhooks/meta
   Verify Token: (same as META_WEBHOOK_VERIFY_TOKEN)

   Subscribe to:
   - messages
   - messaging_postbacks
   - messaging_optins
   - message_deliveries
   - message_reads
   ```

5. **Get Page Access**
   - Add test pages
   - Generate page access tokens
   - Subscribe app to page

### TikTok Business

1. **Register Developer Account**
   - Go to https://developers.tiktok.com
   - Complete business verification

2. **Create App**
   ```
   Product: Business Messaging API
   ```

3. **Configure OAuth**
   ```
   Redirect URI: http://localhost:3000/api/integrations/tiktok/callback
   ```

4. **Set up Webhooks**
   ```
   Webhook URL: https://yourdomain.com/api/webhooks/tiktok
   Events: messages, message_status
   ```

### WhatsApp Cloud API

1. **Create Meta Business Account**
   - Go to https://business.facebook.com
   - Create business account

2. **Set up WhatsApp**
   - Add WhatsApp product
   - Get test phone number
   - Verify your business

3. **Get Credentials**
   ```
   Phone Number ID: Copy to .env
   Business Account ID: Copy to .env
   Access Token: Generate permanent token
   ```

4. **Configure Webhooks**
   ```
   Callback URL: https://yourdomain.com/api/webhooks/whatsapp
   Verify Token: (same as META_WEBHOOK_VERIFY_TOKEN)

   Subscribe to:
   - messages
   - message_status
   ```

### Stripe

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Complete registration

2. **Get API Keys**
   ```
   Publishable key: pk_test_xxxxx
   Secret key: sk_test_xxxxx
   ```

3. **Create Products**
   ```
   Products:
   - Free Plan (€0)
   - Pro Plan (€49/month)
   - Business Plan (€149/month)
   ```

4. **Set up Webhook**
   ```
   Endpoint: https://yourdomain.com/api/webhooks/stripe

   Events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.paid
   - invoice.payment_failed
   ```

### Clerk

1. **Create Application**
   - Go to https://clerk.com
   - Create new application

2. **Configure Authentication**
   ```
   Enable:
   - Email/Password
   - Google OAuth (optional)
   - Facebook OAuth (optional)
   ```

3. **Set Redirect URLs**
   ```
   Sign-in: http://localhost:3000/sign-in
   Sign-up: http://localhost:3000/sign-up
   After sign-in: http://localhost:3000/dashboard
   ```

4. **Create Webhook**
   ```
   Endpoint: http://localhost:3001/api/webhooks/clerk
   Events: user.created, user.updated
   ```

## Database Management

### Run Migrations

```bash
cd apps/backend
pnpm prisma migrate dev
```

### Generate Prisma Client

```bash
pnpm prisma generate
```

### View Database

```bash
pnpm prisma studio
```

### Reset Database

```bash
pnpm prisma migrate reset
```

## Testing

### Run All Tests

```bash
pnpm test
```

### Run Specific Tests

```bash
pnpm --filter @saas-platform/backend test
pnpm --filter @saas-platform/frontend test
```

### E2E Tests

```bash
pnpm test:e2e
```

## Building for Production

### Build All Apps

```bash
pnpm build
```

### Build Specific App

```bash
pnpm --filter @saas-platform/frontend build
pnpm --filter @saas-platform/backend build
```

## Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Common Tasks

### Add New Dependency

```bash
# To specific package
pnpm --filter @saas-platform/backend add package-name

# To workspace root
pnpm add -w package-name
```

### Create New Module

```bash
cd apps/backend
nest g module module-name
nest g controller module-name
nest g service module-name
```

### Format Code

```bash
pnpm format
```

### Lint Code

```bash
pnpm lint
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker-compose ps

# Restart Redis
docker-compose restart redis
```

### Clear Cache

```bash
# Clear Next.js cache
rm -rf apps/frontend/.next

# Clear node_modules
pnpm clean
pnpm install
```

## Next Steps

1. **Complete Environment Setup** - Add all API keys
2. **Run the Application** - `pnpm dev`
3. **Create Your Account** - Sign up at http://localhost:3000
4. **Connect First Integration** - Add Meta/TikTok account
5. **Build Your First Flow** - Create automation workflow
6. **Test Messaging** - Send test messages

## Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](http://localhost:3001/api/docs)
- [Prisma Schema](../apps/backend/prisma/schema.prisma)
- [Frontend Components](../apps/frontend/components)

## Support

- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
- Documentation: [Read Docs](./docs)
- Email: support@example.com
