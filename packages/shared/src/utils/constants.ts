export const API_VERSION = 'v1';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const WEBHOOK_EVENTS = {
  MESSAGE_RECEIVED: 'message.received',
  MESSAGE_SENT: 'message.sent',
  MESSAGE_DELIVERED: 'message.delivered',
  MESSAGE_READ: 'message.read',
  MESSAGE_FAILED: 'message.failed',
  CONVERSATION_CREATED: 'conversation.created',
  CONVERSATION_UPDATED: 'conversation.updated',
  INTEGRATION_CONNECTED: 'integration.connected',
  INTEGRATION_DISCONNECTED: 'integration.disconnected',
} as const;

export const META_GRAPH_API_VERSION = 'v19.0';
export const META_GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_API_VERSION}`;

export const TIKTOK_API_BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3';

export const RATE_LIMITS = {
  FREE: {
    requestsPerMinute: 10,
    messagesPerDay: 50,
  },
  PRO: {
    requestsPerMinute: 60,
    messagesPerDay: 5000,
  },
  BUSINESS: {
    requestsPerMinute: 300,
    messagesPerDay: 999999,
  },
  AGENCY: {
    requestsPerMinute: 600,
    messagesPerDay: 999999,
  },
} as const;
