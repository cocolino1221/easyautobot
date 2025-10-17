import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics with overview stats, active flows, and recent activity' })
  async getDashboardStats(@Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.analyticsService.getDashboardStats(tenantId);
  }

  @Get('flow/:flowId')
  @ApiOperation({ summary: 'Get flow-specific analytics including node-level statistics for heat maps' })
  @ApiParam({ name: 'flowId', description: 'Flow ID' })
  async getFlowAnalytics(@Req() req, @Param('flowId') flowId: string) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.analyticsService.getFlowAnalytics(tenantId, flowId);
  }

  @Get('activity/realtime')
  @ApiOperation({ summary: 'Get real-time activity stream for live feed' })
  async getRealtimeActivity(@Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.analyticsService.getRealtimeActivity(tenantId);
  }
}
