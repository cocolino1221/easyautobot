import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FlowService } from './flow.service';

@ApiTags('flows')
@Controller('flows')
export class FlowController {
  constructor(private flowService: FlowService) {}

  @Get()
  async findAll(@Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.flowService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.flowService.findOne(id, tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.flowService.create({
      ...body,
      tenantId,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.flowService.update(id, body, tenantId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.flowService.delete(id, tenantId);
  }

  @Post(':id/execute')
  async executeFlow(
    @Param('id') id: string,
    @Body() triggerData: any,
    @Req() req,
  ) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.flowService.executeFlow(id, triggerData, tenantId);
  }
}
