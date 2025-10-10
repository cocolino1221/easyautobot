import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(tenantId: string) {
    const [
      totalConversations,
      openConversations,
      totalMessages,
      activeIntegrations,
    ] = await Promise.all([
      this.prisma.conversation.count({ where: { tenantId } }),
      this.prisma.conversation.count({
        where: { tenantId, status: 'OPEN' },
      }),
      this.prisma.message.count({ where: { tenantId } }),
      this.prisma.integration.count({
        where: { tenantId, status: 'CONNECTED' },
      }),
    ]);

    return {
      conversations: {
        total: totalConversations,
        open: openConversations,
        closed: totalConversations - openConversations,
      },
      messages: {
        total: totalMessages,
      },
      integrations: {
        active: activeIntegrations,
      },
    };
  }
}
