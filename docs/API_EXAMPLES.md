# API Examples

## Authentication

### Sync User from Clerk
```bash
POST /api/v1/auth/sync
Content-Type: application/json

{
  "id": "user_2abcdef123456",
  "email_addresses": [
    {
      "email_address": "user@example.com"
    }
  ],
  "first_name": "John",
  "last_name": "Doe",
  "image_url": "https://..."
}
```

### Get Current User
```bash
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Integrations

### List Integrations
```bash
GET /api/v1/integrations
Authorization: Bearer {token}
```

Response:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "INSTAGRAM",
      "status": "CONNECTED",
      "accountName": "@mybusiness",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### Connect Meta Account
```bash
POST /api/v1/integrations/meta/connect
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "oauth_authorization_code",
  "type": "INSTAGRAM"
}
```

### Disconnect Integration
```bash
DELETE /api/v1/integrations/{integrationId}
Authorization: Bearer {token}
```

## Conversations

### List Conversations
```bash
GET /api/v1/conversations?status=OPEN&page=1&limit=20
Authorization: Bearer {token}
```

Response:
```json
{
  "data": [
    {
      "id": "conv_123",
      "platform": "INSTAGRAM",
      "participantName": "John Customer",
      "lastMessageAt": "2025-01-15T14:30:00Z",
      "lastMessagePreview": "Hi, I have a question...",
      "unreadCount": 3,
      "status": "OPEN",
      "tags": ["support", "urgent"]
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

### Get Conversation Details
```bash
GET /api/v1/conversations/{conversationId}
Authorization: Bearer {token}
```

### Update Conversation
```bash
PATCH /api/v1/conversations/{conversationId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "CLOSED",
  "tags": ["support", "resolved"],
  "assignedToUserId": "user_456"
}
```

## Messages

### List Messages
```bash
GET /api/v1/conversations/{conversationId}/messages?page=1&limit=50
Authorization: Bearer {token}
```

Response:
```json
{
  "data": [
    {
      "id": "msg_789",
      "conversationId": "conv_123",
      "platform": "INSTAGRAM",
      "direction": "INBOUND",
      "type": "TEXT",
      "content": "Hello, I need help with my order",
      "senderId": "instagram_user_123",
      "timestamp": "2025-01-15T14:30:00Z",
      "status": "READ"
    }
  ]
}
```

### Send Message
```bash
POST /api/v1/conversations/{conversationId}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "TEXT",
  "content": "Thank you for reaching out! How can I help you today?"
}
```

### Send Image Message
```bash
POST /api/v1/conversations/{conversationId}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "IMAGE",
  "content": "Check out this product!",
  "mediaUrl": "https://cdn.example.com/image.jpg"
}
```

### Send Template Message (WhatsApp)
```bash
POST /api/v1/conversations/{conversationId}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "TEMPLATE",
  "content": "order_confirmation",
  "metadata": {
    "templateName": "order_confirmation",
    "language": "en",
    "parameters": {
      "1": "John",
      "2": "ORD-12345",
      "3": "$99.99"
    }
  }
}
```

## Flows (Automation)

### List Flows
```bash
GET /api/v1/flows?status=ACTIVE
Authorization: Bearer {token}
```

Response:
```json
{
  "data": [
    {
      "id": "flow_123",
      "name": "Auto-reply for DMs",
      "description": "Automatically respond to new direct messages",
      "status": "ACTIVE",
      "trigger": {
        "type": "MESSAGE_RECEIVED",
        "config": {
          "platform": "INSTAGRAM"
        }
      },
      "stats": {
        "totalRuns": 1250,
        "successfulRuns": 1248,
        "failedRuns": 2
      }
    }
  ]
}
```

### Create Flow
```bash
POST /api/v1/flows
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Story Reply Auto-responder",
  "description": "Send thank you message for story replies",
  "status": "ACTIVE",
  "trigger": {
    "type": "STORY_REPLY",
    "config": {
      "platform": "INSTAGRAM"
    }
  },
  "nodes": [
    {
      "id": "node_1",
      "type": "SEND_MESSAGE",
      "position": { "x": 100, "y": 100 },
      "data": {
        "messageType": "TEXT",
        "content": "Thanks for your reply! 🎉"
      }
    },
    {
      "id": "node_2",
      "type": "TAG_CONVERSATION",
      "position": { "x": 100, "y": 200 },
      "data": {
        "tags": ["story-engagement"]
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2"
    }
  ]
}
```

### Update Flow
```bash
PATCH /api/v1/flows/{flowId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

### Delete Flow
```bash
DELETE /api/v1/flows/{flowId}
Authorization: Bearer {token}
```

## Analytics

### Get Dashboard Stats
```bash
GET /api/v1/analytics/dashboard
Authorization: Bearer {token}
```

Response:
```json
{
  "conversations": {
    "total": 1250,
    "open": 85,
    "closed": 1165,
    "avgResponseTime": "5m 23s"
  },
  "messages": {
    "total": 15430,
    "inbound": 8230,
    "outbound": 7200,
    "thisMonth": 3420
  },
  "integrations": {
    "connected": 3,
    "byPlatform": {
      "INSTAGRAM": 1,
      "FACEBOOK": 1,
      "WHATSAPP": 1
    }
  },
  "flows": {
    "active": 5,
    "totalExecutions": 8945
  }
}
```

### Get Message Stats
```bash
GET /api/v1/analytics/messages?period=30d&platform=INSTAGRAM
Authorization: Bearer {token}
```

Response:
```json
{
  "timeline": [
    {
      "date": "2025-01-15",
      "inbound": 45,
      "outbound": 52,
      "total": 97
    }
  ],
  "byPlatform": {
    "INSTAGRAM": 450,
    "FACEBOOK": 320,
    "WHATSAPP": 180
  },
  "byType": {
    "TEXT": 850,
    "IMAGE": 75,
    "VIDEO": 25
  }
}
```

## Billing

### Get Current Subscription
```bash
GET /api/v1/billing/subscription
Authorization: Bearer {token}
```

Response:
```json
{
  "plan": "PRO",
  "status": "ACTIVE",
  "currentPeriodEnd": "2025-02-15T00:00:00Z",
  "limits": {
    "integrations": 3,
    "messagesPerMonth": 5000,
    "teamMembers": 3,
    "flows": 10
  },
  "usage": {
    "messagesThisMonth": 1250,
    "activeIntegrations": 2
  }
}
```

### Create Checkout Session
```bash
POST /api/v1/billing/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "PRO",
  "successUrl": "https://app.example.com/success",
  "cancelUrl": "https://app.example.com/pricing"
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Get Usage Stats
```bash
GET /api/v1/billing/usage
Authorization: Bearer {token}
```

Response:
```json
{
  "messagesThisMonth": 1250,
  "messagesLimit": 5000,
  "percentageUsed": 25,
  "resetDate": "2025-02-01T00:00:00Z"
}
```

## Webhooks (Outgoing)

### Create Webhook
```bash
POST /api/v1/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks",
  "events": [
    "message.received",
    "message.sent",
    "conversation.created"
  ],
  "secret": "your_webhook_secret"
}
```

### List Webhooks
```bash
GET /api/v1/webhooks
Authorization: Bearer {token}
```

### Delete Webhook
```bash
DELETE /api/v1/webhooks/{webhookId}
Authorization: Bearer {token}
```

## Team Management

### List Team Members
```bash
GET /api/v1/team/members
Authorization: Bearer {token}
```

### Invite Team Member
```bash
POST /api/v1/team/invite
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "agent@example.com",
  "role": "AGENT"
}
```

### Update Member Role
```bash
PATCH /api/v1/team/members/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "ADMIN"
}
```

### Remove Team Member
```bash
DELETE /api/v1/team/members/{userId}
Authorization: Bearer {token}
```

## Webhook Payload Examples

### Message Received
```json
{
  "event": "message.received",
  "timestamp": "2025-01-15T14:30:00Z",
  "data": {
    "messageId": "msg_789",
    "conversationId": "conv_123",
    "platform": "INSTAGRAM",
    "content": "Hello!",
    "senderId": "instagram_user_123",
    "senderName": "John Customer"
  }
}
```

### Conversation Created
```json
{
  "event": "conversation.created",
  "timestamp": "2025-01-15T14:30:00Z",
  "data": {
    "conversationId": "conv_123",
    "platform": "INSTAGRAM",
    "participantId": "instagram_user_123",
    "participantName": "John Customer"
  }
}
```

### Integration Connected
```json
{
  "event": "integration.connected",
  "timestamp": "2025-01-15T14:30:00Z",
  "data": {
    "integrationId": "int_456",
    "type": "INSTAGRAM",
    "accountName": "@mybusiness"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "content",
      "message": "content should not be empty"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limits

Rate limits vary by subscription plan:

- **Free**: 10 requests/minute
- **Pro**: 60 requests/minute
- **Business**: 300 requests/minute
- **Agency**: 600 requests/minute

Headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642252800
```
