import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { IntegrationType, IntegrationStatus } from '@prisma/client';

@Injectable()
export class IntegrationService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.integration.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.integration.findFirst({
      where: { id, tenantId },
    });
  }

  async create(data: {
    tenantId: string;
    type: IntegrationType;
    accountId: string;
    accountName: string;
    accessToken: string;
    refreshToken?: string;
    metadata?: any;
  }) {
    return this.prisma.integration.create({
      data: {
        ...data,
        status: IntegrationStatus.CONNECTED,
      },
    });
  }

  async update(id: string, tenantId: string, data: any) {
    return this.prisma.integration.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.integration.delete({
      where: { id },
    });
  }

  async disconnect(id: string, tenantId: string) {
    return this.prisma.integration.update({
      where: { id },
      data: { status: IntegrationStatus.DISCONNECTED },
    });
  }
}
