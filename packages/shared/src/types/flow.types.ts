import { z } from 'zod';

export enum FlowTriggerType {
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  STORY_REPLY = 'STORY_REPLY',
  STORY_MENTION = 'STORY_MENTION',
  KEYWORD_MATCH = 'KEYWORD_MATCH',
  SCHEDULED = 'SCHEDULED',
  WEBHOOK = 'WEBHOOK',
}

export enum FlowActionType {
  SEND_MESSAGE = 'SEND_MESSAGE',
  TAG_CONVERSATION = 'TAG_CONVERSATION',
  ASSIGN_TO_USER = 'ASSIGN_TO_USER',
  API_REQUEST = 'API_REQUEST',
  WAIT = 'WAIT',
  CONDITION = 'CONDITION',
  ADD_TO_CRM = 'ADD_TO_CRM',
  SEND_EMAIL = 'SEND_EMAIL',
}

export enum FlowStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.union([z.nativeEnum(FlowTriggerType), z.nativeEnum(FlowActionType)]),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()),
});

export type FlowNode = z.infer<typeof FlowNodeSchema>;

export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
});

export type FlowEdge = z.infer<typeof FlowEdgeSchema>;

export const FlowSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(FlowStatus),
  trigger: z.object({
    type: z.nativeEnum(FlowTriggerType),
    config: z.record(z.any()),
  }),
  nodes: z.array(FlowNodeSchema),
  edges: z.array(FlowEdgeSchema),
  stats: z.object({
    totalRuns: z.number().default(0),
    successfulRuns: z.number().default(0),
    failedRuns: z.number().default(0),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Flow = z.infer<typeof FlowSchema>;
