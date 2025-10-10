import axios, { AxiosInstance } from 'axios';
import { META_GRAPH_BASE_URL } from '@saas-platform/shared';

export class MetaClient {
  private client: AxiosInstance;

  constructor(private accessToken: string) {
    this.client = axios.create({
      baseURL: META_GRAPH_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Facebook/Instagram Messaging
  async sendMessage(recipientId: string, message: any, pageId: string) {
    const response = await this.client.post(`/${pageId}/messages`, {
      recipient: { id: recipientId },
      message,
    });
    return response.data;
  }

  // Get Page Access Token
  async getPageAccessToken(pageId: string) {
    const response = await this.client.get(`/${pageId}`, {
      params: { fields: 'access_token' },
    });
    return response.data.access_token;
  }

  // Get User Profile
  async getUserProfile(userId: string) {
    const response = await this.client.get(`/${userId}`, {
      params: { fields: 'id,name,profile_pic' },
    });
    return response.data;
  }

  // Get Conversations
  async getConversations(pageId: string) {
    const response = await this.client.get(`/${pageId}/conversations`, {
      params: { fields: 'participants,messages' },
    });
    return response.data;
  }

  // Get Messages from Conversation
  async getMessages(conversationId: string) {
    const response = await this.client.get(`/${conversationId}/messages`, {
      params: { fields: 'id,created_time,from,to,message' },
    });
    return response.data;
  }

  // Send Instagram Story Reply
  async sendStoryReply(recipientId: string, storyId: string, message: string, pageId: string) {
    const response = await this.client.post(`/${pageId}/messages`, {
      recipient: { id: recipientId },
      message: { text: message },
      messaging_type: 'RESPONSE',
      context: { story_id: storyId },
    });
    return response.data;
  }

  // Subscribe Page to Webhooks
  async subscribePageWebhooks(pageId: string) {
    const response = await this.client.post(`/${pageId}/subscribed_apps`, {
      subscribed_fields: ['messages', 'messaging_postbacks', 'messaging_optins', 'message_deliveries', 'message_reads'],
    });
    return response.data;
  }
}
