import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get()
  async findAll(@Req() req, @Query() query: any) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.conversationService.findAll(tenantId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.conversationService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.conversationService.update(id, tenantId, body);
  }

  @Post(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Req() req
  ) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.conversationService.assignTo(id, tenantId, userId);
  }

  @Post(':id/tags')
  async addTags(
    @Param('id') id: string,
    @Body('tags') tags: string[],
    @Req() req
  ) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.conversationService.addTags(id, tenantId, tags);
  }
}
