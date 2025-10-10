import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConversationStatus } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, filters?: any) {
    const where: any = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.platform) {
      where.platform = filters.platform;
    }
    if (filters?.assignedToUserId) {
      where.assignedToUserId = filters.assignedToUserId;
    }

    return this.prisma.conversation.findMany({
      where,
      include: {
        integration: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        integration: true,
        assignedTo: true,
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 50,
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.conversation.create({
      data,
    });
  }

  async update(id: string, tenantId: string, data: any) {
    return this.prisma.conversation.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, tenantId: string, status: ConversationStatus) {
    return this.prisma.conversation.update({
      where: { id },
      data: { status },
    });
  }

  async assignTo(id: string, tenantId: string, userId: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: { assignedToUserId: userId },
    });
  }

  async addTags(id: string, tenantId: string, tags: string[]) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, tenantId },
    });

    const uniqueTags = Array.from(new Set([...conversation.tags, ...tags]));

    return this.prisma.conversation.update({
      where: { id },
      data: { tags: uniqueTags },
    });
  }
}
