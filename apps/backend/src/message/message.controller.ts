import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('messages')
@Controller('conversations/:conversationId/messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  async findAll(@Param('conversationId') conversationId: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.messageService.findByConversation(conversationId, tenantId);
  }

  @Post()
  async send(
    @Param('conversationId') conversationId: string,
    @Body() body: any,
    @Req() req
  ) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.messageService.send({
      conversationId,
      tenantId,
      ...body,
    });
  }
}
