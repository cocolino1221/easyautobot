import { z } from 'zod';
import { IntegrationType } from './integration.types';

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  TEMPLATE = 'TEMPLATE',
  CAROUSEL = 'CAROUSEL',
  STORY_REPLY = 'STORY_REPLY',
  STORY_MENTION = 'STORY_MENTION',
}

export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  tenantId: z.string().uuid(),
  integrationId: z.string().uuid(),
  platform: z.nativeEnum(IntegrationType),
  direction: z.nativeEnum(MessageDirection),
  status: z.nativeEnum(MessageStatus),
  type: z.nativeEnum(MessageType),
  content: z.string(),
  mediaUrl: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  externalId: z.string(),
  senderId: z.string(),
  recipientId: z.string(),
  timestamp: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

export const SendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  type: z.nativeEnum(MessageType),
  content: z.string(),
  mediaUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export type SendMessage = z.infer<typeof SendMessageSchema>;
