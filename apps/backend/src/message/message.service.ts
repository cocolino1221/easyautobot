import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MessageDirection, MessageStatus, MessageType } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async findByConversation(conversationId: string, tenantId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
        tenantId,
      },
      orderBy: { timestamp: 'asc' },
      take: 100,
    });
  }

  async create(data: {
    conversationId: string;
    tenantId: string;
    integrationId: string;
    platform: any;
    direction: MessageDirection;
    type: MessageType;
    content: string;
    mediaUrl?: string;
    externalId: string;
    senderId: string;
    recipientId: string;
    metadata?: any;
  }) {
    const message = await this.prisma.message.create({
      data: {
        ...data,
        status: MessageStatus.SENT,
        timestamp: new Date(),
      },
    });

    // Update conversation last message
    await this.prisma.conversation.update({
      where: { id: data.conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessagePreview: data.content.substring(0, 100),
      },
    });

    return message;
  }

  async send(data: {
    conversationId: string;
    tenantId: string;
    type: MessageType;
    content: string;
    mediaUrl?: string;
  }) {
    // Get conversation details
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: data.conversationId,
        tenantId: data.tenantId,
      },
      include: {
        integration: true,
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Create message record
    const message = await this.create({
      conversationId: data.conversationId,
      tenantId: data.tenantId,
      integrationId: conversation.integrationId,
      platform: conversation.platform,
      direction: MessageDirection.OUTBOUND,
      type: data.type,
      content: data.content,
      mediaUrl: data.mediaUrl,
      externalId: `msg_${Date.now()}`,
      senderId: 'system',
      recipientId: conversation.participantId,
    });

    // TODO: Send message via platform API
    // This would call the appropriate SDK (Meta, TikTok, WhatsApp)

    return message;
  }

  async updateStatus(id: string, status: MessageStatus) {
    return this.prisma.message.update({
      where: { id },
      data: { status },
    });
  }
}
