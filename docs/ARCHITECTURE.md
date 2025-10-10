# Architecture Documentation

## System Overview

The SaaS Messaging Platform is a multi-tenant system that enables businesses to manage customer conversations across multiple messaging platforms (Facebook, Instagram, WhatsApp, TikTok) from a unified interface.

## Architecture Principles

1. **Multi-tenancy** - Complete data isolation per tenant
2. **Microservices** - Loosely coupled services
3. **Event-driven** - Async communication via queues
4. **Scalability** - Horizontal scaling capability
5. **Security** - OAuth 2.0, JWT, encrypted data

## System Components

### 1. Frontend (Next.js)
- **Purpose**: User interface
- **Tech**: Next.js 15, React, TypeScript, Tailwind
- **Features**:
  - Server-side rendering
  - Authentication with Clerk
  - Real-time updates via WebSockets
  - Responsive design

### 2. Backend API (NestJS)
- **Purpose**: Core business logic
- **Tech**: NestJS, TypeScript, Prisma
- **Responsibilities**:
  - Authentication & authorization
  - Tenant management
  - Integration management
  - Conversation & message handling
  - Flow execution
  - Billing operations

### 3. Webhook Gateway
- **Purpose**: Receive webhooks from platforms
- **Tech**: Express, TypeScript
- **Responsibilities**:
  - Webhook validation
  - Event normalization
  - Queue distribution
  - Rate limiting

### 4. Worker
- **Purpose**: Background job processing
- **Tech**: BullMQ, TypeScript
- **Jobs**:
  - Message sending
  - Flow execution
  - Usage metrics calculation
  - Webhook delivery
  - Token refresh

### 5. Database (PostgreSQL)
- **Schema**: Multi-tenant with row-level security
- **Models**: Tenant, User, Integration, Conversation, Message, Flow
- **Indexing**: Optimized for tenant-scoped queries

### 6. Cache/Queue (Redis)
- **Caching**: User sessions, API responses
- **Queuing**: Job processing, webhooks
- **Pub/Sub**: Real-time notifications

## Data Flow

### Message Reception Flow
```
Platform Webhook
  → Webhook Gateway
  → Validate & Normalize
  → Redis Queue
  → Worker
  → Save to DB
  → Trigger Flow (if applicable)
  → WebSocket notification to Frontend
```

### Message Sending Flow
```
Frontend
  → Backend API
  → Validate permissions
  → Check usage limits
  → Queue job
  → Worker
  → Platform API
  → Update DB status
  → Notify Frontend
```

### OAuth Connection Flow
```
User clicks "Connect"
  → Frontend redirects to Platform OAuth
  → User authorizes
  → Platform redirects to callback
  → Backend exchanges code for token
  → Save integration
  → Subscribe to webhooks
  → Sync initial data
```

## Multi-Tenancy Strategy

### Data Isolation
- All queries filtered by `tenantId`
- Middleware enforces tenant context
- No cross-tenant data access

### Resource Limits
```typescript
FREE: {
  integrations: 1,
  messages: 50/month,
  teamMembers: 1,
  flows: 1
}

PRO: {
  integrations: 3,
  messages: 5000/month,
  teamMembers: 3,
  flows: 10
}
```

## Security

### Authentication
- **Frontend**: Clerk (OAuth, Email, Social)
- **Backend**: JWT tokens
- **API**: Bearer token authentication

### Authorization
```typescript
Roles:
- OWNER: Full access
- ADMIN: Manage team, integrations
- AGENT: Handle conversations
- VIEWER: Read-only access
```

### Data Protection
- Encrypted tokens at rest
- HTTPS only
- Rate limiting
- CORS configuration
- Helmet.js security headers

## Scalability

### Horizontal Scaling
- Stateless API servers
- Load balancing
- Database read replicas
- Redis cluster

### Performance Optimization
- Database indexing
- Query optimization
- Caching strategy
- CDN for static assets
- Image optimization

## Integration Architecture

### Meta (Facebook/Instagram)
```
OAuth 2.0
  → Page Access Token
  → Subscribe to webhooks
  → Graph API for messaging
```

### WhatsApp Cloud API
```
Business Verification
  → Phone Number ID
  → Webhook subscription
  → Cloud API for messaging
```

### TikTok Business
```
OAuth 2.0
  → Business Account
  → Webhook subscription
  → Business API for messaging
```

## Flow Builder Architecture

### Structure
```typescript
Flow {
  trigger: TriggerConfig
  nodes: Node[]
  edges: Edge[]
}

Node {
  id: string
  type: ActionType
  config: any
}
```

### Execution
1. Trigger event occurs
2. Load flow from DB
3. Execute nodes sequentially
4. Handle conditions/branches
5. Log execution
6. Update statistics

## Webhook Processing

### Verification
- Meta: Verify token
- TikTok: Verify signature
- WhatsApp: Verify signature

### Normalization
Convert platform-specific formats to unified schema:
```typescript
{
  platform: 'INSTAGRAM',
  event: 'message.received',
  data: {
    messageId: string,
    conversationId: string,
    content: string,
    sender: string,
    timestamp: Date
  }
}
```

## Monitoring & Logging

### Application Monitoring
- Sentry for error tracking
- Custom metrics dashboard
- Performance monitoring

### Logging Strategy
```
ERROR: Critical failures
WARN: Recoverable issues
INFO: Important events
DEBUG: Detailed traces (dev only)
```

## Deployment

### Development
```bash
docker-compose up -d
pnpm dev
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline
1. Run tests
2. Build Docker images
3. Push to registry
4. Deploy to Kubernetes
5. Run migrations
6. Health checks

## Database Schema

### Core Tables
- `tenants` - Organizations
- `users` - Team members
- `integrations` - Platform connections
- `conversations` - Message threads
- `messages` - Individual messages
- `flows` - Automation workflows
- `flow_executions` - Workflow runs

### Indexes
```sql
CREATE INDEX idx_messages_tenant_conversation
  ON messages(tenant_id, conversation_id, timestamp DESC);

CREATE INDEX idx_conversations_tenant_status
  ON conversations(tenant_id, status, last_message_at DESC);
```

## API Design

### RESTful Endpoints
```
GET    /api/v1/conversations
POST   /api/v1/conversations/:id/messages
GET    /api/v1/integrations
POST   /api/v1/integrations/meta/connect
GET    /api/v1/flows
POST   /api/v1/flows
```

### WebSocket Events
```
conversation:new
conversation:updated
message:new
message:status
```

## Error Handling

### Strategy
1. Catch at service layer
2. Log with context
3. Return user-friendly message
4. Retry transient failures
5. Alert on critical errors

### Example
```typescript
try {
  await sendMessage();
} catch (error) {
  if (isRateLimitError(error)) {
    await queue.retry(job, { delay: 60000 });
  } else {
    await logError(error, context);
    throw new ServiceUnavailableException();
  }
}
```

## Future Enhancements

1. **AI-powered responses** - GPT integration
2. **Mobile apps** - React Native
3. **Voice/Video** - WebRTC support
4. **Advanced analytics** - ML insights
5. **WhiteLabel** - Custom branding
6. **API marketplace** - Third-party apps
