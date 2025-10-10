import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { IntegrationService } from './integration.service';
import { FacebookOAuthService } from './services/facebook-oauth.service';
import { TikTokOAuthService } from './services/tiktok-oauth.service';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationController {
  constructor(
    private integrationService: IntegrationService,
    private facebookOAuth: FacebookOAuthService,
    private tiktokOAuth: TikTokOAuthService,
  ) {}

  @Get()
  async findAll(@Req() req) {
    // For demo: use a default tenant ID if not authenticated
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.integrationService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.integrationService.findOne(id, tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.integrationService.create({
      ...body,
      tenantId,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.integrationService.delete(id, tenantId);
  }

  @Post(':id/disconnect')
  async disconnect(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.integrationService.disconnect(id, tenantId);
  }

  // REAL OAuth Flows - Like ManyChat

  @Get('facebook/connect')
  async connectFacebook(@Req() req, @Res() res: Response) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    const state = Buffer.from(JSON.stringify({ tenantId })).toString('base64');

    const authUrl = this.facebookOAuth.getAuthUrl(state);
    return res.json({ authUrl });
  }

  @Get('facebook/callback')
  async facebookCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const { tenantId } = JSON.parse(Buffer.from(state, 'base64').toString());

      console.log('✅ Facebook OAuth callback received');
      console.log(`   Tenant ID: ${tenantId}`);

      // Exchange code for token
      const tokenData = await this.facebookOAuth.getAccessToken(code);
      console.log('✅ Got Facebook access token');

      // Get user's pages
      const pages = await this.facebookOAuth.getUserPages(tokenData.access_token);
      console.log(`✅ Found ${pages.length} Facebook pages`);

      // If no pages, create a personal profile integration
      if (pages.length === 0) {
        console.log('ℹ️  No pages found - creating personal profile integration');
        await this.facebookOAuth.saveIntegration(
          tenantId,
          {
            id: 'personal-profile',
            name: 'Facebook Personal Profile',
            access_token: tokenData.access_token,
          },
          tokenData.access_token
        );
        return res.redirect(`${process.env.FRONTEND_URL}/integrations?success=facebook`);
      }

      // If only one page, auto-connect it
      if (pages.length === 1) {
        console.log(`✅ Auto-connecting page: ${pages[0].name}`);
        await this.facebookOAuth.saveIntegration(tenantId, pages[0], tokenData.access_token);
        return res.redirect(`${process.env.FRONTEND_URL}/integrations?success=facebook`);
      }

      // Otherwise, redirect to page selector
      console.log(`🔀 Redirecting to page selector (${pages.length} pages)`);
      return res.redirect(
        `${process.env.FRONTEND_URL}/integrations/select-page?` +
        `token=${encodeURIComponent(tokenData.access_token)}&` +
        `pages=${encodeURIComponent(JSON.stringify(pages))}`
      );
    } catch (error: any) {
      console.error('❌ Facebook OAuth callback error:', error.message);
      return res.redirect(`${process.env.FRONTEND_URL}/integrations?error=${encodeURIComponent(error.message || 'OAuth failed')}`);
    }
  }

  @Post('facebook/save-page')
  async saveFacebookPage(@Body() body: any, @Req() req) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    return this.facebookOAuth.saveIntegration(tenantId, body.page, body.userToken);
  }

  // TikTok OAuth Flow

  @Get('tiktok/connect')
  async connectTikTok(@Req() req, @Res() res: Response) {
    const tenantId = req.user?.tenantId || 'demo-tenant-id';
    const state = Buffer.from(JSON.stringify({ tenantId })).toString('base64');

    const authUrl = this.tiktokOAuth.getAuthUrl(state);
    return res.json({ authUrl });
  }

  @Get('tiktok/callback')
  async tiktokCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const { tenantId } = JSON.parse(Buffer.from(state, 'base64').toString());

      // Exchange code for token with PKCE
      const tokenData = await this.tiktokOAuth.getAccessToken(code, state);

      // Get user info
      const userInfo = await this.tiktokOAuth.getUserInfo(tokenData.access_token, tokenData.open_id);

      // Save integration
      await this.tiktokOAuth.saveIntegration(tenantId, tokenData, userInfo);

      return res.redirect(`${process.env.FRONTEND_URL}/integrations?success=tiktok`);
    } catch (error: any) {
      return res.redirect(`${process.env.FRONTEND_URL}/integrations?error=${error.message}`);
    }
  }
}
