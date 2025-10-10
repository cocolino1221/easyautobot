import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@Controller('tenant')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async getTenant(@Req() req) {
    return this.tenantService.findOne(req.user.tenantId);
  }

  @Patch()
  async updateTenant(@Body() body: any, @Req() req) {
    return this.tenantService.update(req.user.tenantId, body);
  }

  @Get('members')
  async getMembers(@Req() req) {
    return this.tenantService.getMembers(req.user.tenantId);
  }
}
