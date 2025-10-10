import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.user?.tenantId || 'demo-tenant-id';

    // Get tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }

    // Check if trial expired
    if (tenant.status === 'TRIALING' && tenant.currentPeriodEnd) {
      if (new Date() > tenant.currentPeriodEnd) {
        throw new HttpException(
          'Your 7-day trial has expired. Please upgrade to continue.',
          HttpStatus.PAYMENT_REQUIRED
        );
      }
    }

    // Reset monthly counter if needed
    const now = new Date();
    const lastReset = new Date(tenant.lastMessageReset);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= 30) {
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: {
          messagesThisMonth: 0,
          lastMessageReset: now,
        },
      });
      return true;
    }

    // Check daily limit (5 per day)
    const dailyLimit = Math.floor(tenant.maxMessagesPerMonth / 30);
    const messagesPerDay = Math.floor(tenant.messagesThisMonth / (daysSinceReset || 1));

    if (messagesPerDay >= dailyLimit) {
      throw new HttpException(
        `Daily limit reached. Free tier allows ${dailyLimit} calls per day. Upgrade for unlimited access.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Check monthly limit
    if (tenant.messagesThisMonth >= tenant.maxMessagesPerMonth) {
      throw new HttpException(
        `Monthly limit of ${tenant.maxMessagesPerMonth} messages reached. Upgrade to send more.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
