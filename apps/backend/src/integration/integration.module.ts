import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { FacebookOAuthService } from './services/facebook-oauth.service';
import { TikTokOAuthService } from './services/tiktok-oauth.service';

@Module({
  imports: [HttpModule],
  controllers: [IntegrationController],
  providers: [IntegrationService, FacebookOAuthService, TikTokOAuthService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
