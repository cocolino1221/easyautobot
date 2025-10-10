import { z } from 'zod';

export enum IntegrationType {
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  WHATSAPP = 'WHATSAPP',
  TIKTOK = 'TIKTOK',
}

export enum IntegrationStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
}

export const IntegrationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: z.nativeEnum(IntegrationType),
  status: z.nativeEnum(IntegrationStatus),
  accountId: z.string(),
  accountName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
  webhookSecret: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Integration = z.infer<typeof IntegrationSchema>;
