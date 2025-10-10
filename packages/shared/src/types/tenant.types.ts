import { z } from 'zod';

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
  AGENCY = 'AGENCY',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
}

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  plan: z.nativeEnum(SubscriptionPlan),
  status: z.nativeEnum(SubscriptionStatus),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  currentPeriodEnd: z.date().optional(),
  limits: z.object({
    integrations: z.number(),
    messagesPerMonth: z.number(),
    teamMembers: z.number(),
    flows: z.number(),
  }),
  usage: z.object({
    messagesThisMonth: z.number(),
    activeIntegrations: z.number(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Tenant = z.infer<typeof TenantSchema>;

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: {
    integrations: 1,
    messagesPerMonth: 50,
    teamMembers: 1,
    flows: 1,
  },
  [SubscriptionPlan.PRO]: {
    integrations: 3,
    messagesPerMonth: 5000,
    teamMembers: 3,
    flows: 10,
  },
  [SubscriptionPlan.BUSINESS]: {
    integrations: 999,
    messagesPerMonth: 999999,
    teamMembers: 999,
    flows: 999,
  },
  [SubscriptionPlan.AGENCY]: {
    integrations: 999,
    messagesPerMonth: 999999,
    teamMembers: 999,
    flows: 999,
  },
};
