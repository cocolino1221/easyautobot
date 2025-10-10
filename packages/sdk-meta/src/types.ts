export interface MetaWebhookEvent {
  object: string;
  entry: MetaWebhookEntry[];
}

export interface MetaWebhookEntry {
  id: string;
  time: number;
  messaging?: MetaMessagingEvent[];
  changes?: MetaChangeEvent[];
}

export interface MetaMessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: any[];
    quick_reply?: any;
    reply_to?: any;
  };
  postback?: any;
  read?: any;
  delivery?: any;
}

export interface MetaChangeEvent {
  field: string;
  value: any;
}

export interface InstagramStoryMention {
  media_id: string;
  media_url: string;
}

export interface InstagramStoryReply {
  story_id: string;
  reply_text: string;
}
