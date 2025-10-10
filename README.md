# SaaS Messaging Platform

A multi-tenant SaaS platform for unified messaging automation across Facebook, Instagram, WhatsApp, and TikTok.

## 🚀 Features

- **Multi-tenant Architecture** - Isolated workspaces for each customer
- **Unified Inbox** - Manage all conversations from multiple platforms in one place
- **OAuth Integrations** - Native connections to Meta (Facebook/Instagram), TikTok, and WhatsApp
- **Flow Builder** - Drag-and-drop automation workflows
- **Real-time Messaging** - WebSocket support for instant updates
- **Subscription Plans** - Stripe-powered billing with multiple tiers
- **Analytics Dashboard** - Track conversations, messages, and engagement
- **Team Collaboration** - Role-based access control
- **Webhook Support** - Receive real-time events from platforms

## 📦 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN/UI** - Component library
- **Clerk** - Authentication
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Framer Motion** - Animations

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and queues
- **BullMQ** - Job queue
- **Stripe** - Payments

### Infrastructure
- **Docker** - Containerization
- **pnpm** - Package manager
- **Turbo** - Monorepo build system

## 🏗️ Project Structure

```
saas-messaging-platform/
├── apps/
│   ├── frontend/          # Next.js application
│   ├── backend/           # NestJS API
│   ├── webhook-gateway/   # Webhook receiver service
│   └── worker/            # Background job processor
├── packages/
│   ├── shared/            # Shared types and utilities
│   ├── sdk-meta/          # Meta (FB/IG) SDK
│   ├── sdk-tiktok/        # TikTok SDK
│   └── sdk-whatsapp/      # WhatsApp SDK
├── infra/                 # Infrastructure configs
└── docs/                  # Documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Installation

1. **Clone the repository**
```bash
cd saas-messaging-platform
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

4. **Start services with Docker**
```bash
docker-compose up -d postgres redis
```

5. **Run database migrations**
```bash
cd apps/backend
pnpm prisma migrate dev
pnpm prisma generate
```

6. **Start development servers**
```bash
# From root directory
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 🔧 Configuration

### Meta (Facebook/Instagram) Setup

1. Create a Facebook App at https://developers.facebook.com
2. Add "Messenger" and "Instagram" products
3. Configure OAuth redirect: `http://localhost:3000/api/integrations/meta/callback`
4. Set up webhooks: `http://your-domain.com/api/webhooks/meta`
5. Add credentials to `.env` files

### TikTok Setup

1. Register at https://developers.tiktok.com
2. Create a Business Messaging app
3. Configure OAuth redirect: `http://localhost:3000/api/integrations/tiktok/callback`
4. Add credentials to `.env` files

### WhatsApp Cloud API Setup

1. Set up WhatsApp Business Account
2. Get Phone Number ID and Business Account ID
3. Generate access token from Meta Business Manager
4. Add credentials to `.env` files

### Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from Dashboard
3. Create products and prices
4. Set up webhook endpoint
5. Add credentials to `.env` files

### Clerk Setup

1. Create account at https://clerk.com
2. Create application
3. Configure social providers (optional)
4. Get API keys
5. Add credentials to `.env` files

## 📊 Database Schema

The application uses a multi-tenant architecture with the following main models:

- **Tenant** - Organization/workspace
- **User** - Team members
- **Integration** - Connected platforms
- **Conversation** - Message threads
- **Message** - Individual messages
- **Flow** - Automation workflows
- **FlowExecution** - Workflow runs

## 🔐 Authentication & Authorization

- Frontend uses **Clerk** for user authentication
- Backend uses **JWT** for API authentication
- Multi-tenant isolation via `tenantId` in all queries
- Role-based access control (OWNER, ADMIN, AGENT, VIEWER)

## 💳 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | €0 | 1 integration, 50 messages/month |
| **Pro** | €49/mo | 3 integrations, 5K messages/month, 3 team members |
| **Business** | €149/mo | Unlimited integrations, messages & team |
| **Agency** | Custom | Multi-client, whitelabel, dedicated support |

## 🔄 Webhook Events

The platform emits the following webhook events:

- `message.received` - New message received
- `message.sent` - Message sent
- `message.delivered` - Message delivered
- `message.read` - Message read
- `message.failed` - Message failed
- `conversation.created` - New conversation
- `conversation.updated` - Conversation updated
- `integration.connected` - Platform connected
- `integration.disconnected` - Platform disconnected

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @saas-platform/backend test

# Run tests in watch mode
pnpm test:watch
```

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Docker Deployment

```bash
docker-compose up -d
```

### Environment Variables

See `.env.example` files in each app for required variables.

## 📝 API Documentation

API documentation is available at `/api/docs` when running the backend.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@example.com or open an issue.

## 🗺️ Roadmap

- [x] Core architecture and setup
- [x] Authentication system
- [x] Database schema
- [ ] Meta OAuth integration
- [ ] TikTok OAuth integration
- [ ] WhatsApp integration
- [ ] Unified Inbox UI
- [ ] Flow builder
- [ ] Stripe billing
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered automation
- [ ] WhiteLabel support

## 📚 Documentation

### 📖 Complete Documentation Set

- **[INDEX.md](./INDEX.md)** - Documentation index and navigation guide
- **[QUICK_START.md](./QUICK_START.md)** - Get started in 3 steps
- **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)** - Comprehensive setup guide
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture & design
- **[API_EXAMPLES.md](./docs/API_EXAMPLES.md)** - Complete API reference
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current progress & status
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete overview
- **[DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)** - Implementation tasks

### 🎯 Quick Navigation

- **New to the project?** → Start with [QUICK_START.md](./QUICK_START.md)
- **Want detailed setup?** → Read [GETTING_STARTED.md](./docs/GETTING_STARTED.md)
- **Need API reference?** → Check [API_EXAMPLES.md](./docs/API_EXAMPLES.md)
- **Planning work?** → Use [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)
- **Understanding architecture?** → Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
