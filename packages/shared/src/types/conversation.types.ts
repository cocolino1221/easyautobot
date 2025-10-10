import { z } from 'zod';
import { IntegrationType } from './integration.types';

export enum ConversationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SNOOZED = 'SNOOZED',
}

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  integrationId: z.string().uuid(),
  platform: z.nativeEnum(IntegrationType),
  status: z.nativeEnum(ConversationStatus),
  participantId: z.string(),
  participantName: z.string().optional(),
  participantUsername: z.string().optional(),
  participantAvatar: z.string().optional(),
  lastMessageAt: z.date(),
  lastMessagePreview: z.string().optional(),
  unreadCount: z.number().default(0),
  tags: z.array(z.string()).default([]),
  assignedToUserId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Conversation = z.infer<typeof ConversationSchema>;
