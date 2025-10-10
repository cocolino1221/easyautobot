import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';

@Module({
  imports: [HttpModule],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
