import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FacebookOAuthService {
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly redirectUri: string;

  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.appId = this.config.get('META_APP_ID') || '';
    this.appSecret = this.config.get('META_APP_SECRET') || '';
    this.redirectUri = this.config.get('META_REDIRECT_URI') || 'http://localhost:3003/api/v1/integrations/facebook/callback';
  }

  /**
   * Generate OAuth URL for user to authorize
   * This is what users click to connect their Facebook/Instagram
   */
  getAuthUrl(state: string): string {
    if (!this.appId) {
      throw new HttpException(
        'Facebook App ID not configured. Please add META_APP_ID to .env file',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    // Using minimal valid scopes - only what's available without app review
    const scopes = [
      'public_profile',  // Basic profile information (always available)
      'pages_show_list', // List user's Facebook pages (available in dev mode)
    ].join(',');

    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      state,
      scope: scopes,
      response_type: 'code',
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in?: number;
  }> {
    if (!this.appId || !this.appSecret) {
      throw new HttpException(
        'Facebook credentials not configured',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    try {
      console.log('🔄 Exchanging Facebook code for token...');
      console.log(`   App ID: ${this.appId.substring(0, 5)}...`);
      console.log(`   Redirect URI: ${this.redirectUri}`);

      const response = await firstValueFrom(
        this.httpService.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            client_id: this.appId,
            client_secret: this.appSecret,
            redirect_uri: this.redirectUri,
            code,
          },
        })
      );

      console.log('✅ Facebook token exchange successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Facebook token exchange failed:');
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Error Code: ${error.code}`);
      console.error(`   Error Message: ${error.message}`);
      console.error(`   Response Data: ${JSON.stringify(error.response?.data, null, 2)}`);

      // Check for network errors
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new HttpException(
          `Network Error: Unable to connect to Facebook servers. Please check your internet connection.`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      const errorMessage = error.response?.data?.error?.message
        || error.response?.data?.message
        || error.message
        || 'Failed to exchange code for access token';

      throw new HttpException(
        `Facebook OAuth Error: ${errorMessage}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get long-lived token (60 days)
   */
  async getLongLivedToken(shortToken: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: this.appId,
            client_secret: this.appSecret,
            fb_exchange_token: shortToken,
          },
        })
      );

      return response.data.access_token;
    } catch (error: any) {
      throw new HttpException(
        'Failed to get long-lived token',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get user's Facebook pages
   */
  async getUserPages(accessToken: string): Promise<any[]> {
    try {
      console.log('📄 Fetching user Facebook pages...');
      const response = await firstValueFrom(
        this.httpService.get('https://graph.facebook.com/v18.0/me/accounts', {
          params: {
            access_token: accessToken,
            fields: 'id,name,access_token,instagram_business_account',
          },
        })
      );

      return response.data.data || [];
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch user pages',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get Instagram account connected to a Facebook page
   */
  async getInstagramAccount(pageId: string, pageAccessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://graph.facebook.com/v18.0/${pageId}`, {
          params: {
            access_token: pageAccessToken,
            fields: 'instagram_business_account{id,username,name,profile_picture_url}',
          },
        })
      );

      return response.data.instagram_business_account;
    } catch (error: any) {
      return null;
    }
  }

  /**
   * Subscribe page to webhooks
   */
  async subscribeToWebhooks(pageId: string, pageAccessToken: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps`,
          {},
          {
            params: {
              access_token: pageAccessToken,
              subscribed_fields: 'messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads',
            },
          }
        )
      );

      return true;
    } catch (error: any) {
      console.error('Failed to subscribe to webhooks:', error);
      return false;
    }
  }

  /**
   * Save Facebook page integration
   */
  async saveIntegration(tenantId: string, page: any, userToken: string) {
    const longLivedToken = await this.getLongLivedToken(page.access_token);

    // Check if Instagram is connected
    const instagram = await this.getInstagramAccount(page.id, page.access_token);

    // Subscribe to webhooks
    await this.subscribeToWebhooks(page.id, page.access_token);

    // Save Facebook integration
    const integration = await this.prisma.integration.create({
      data: {
        tenantId,
        type: 'FACEBOOK',
        status: 'CONNECTED',
        accountId: page.id,
        accountName: page.name,
        accessToken: longLivedToken,
        refreshToken: userToken,
        metadata: {
          pageId: page.id,
          pageName: page.name,
          hasInstagram: !!instagram,
          instagramId: instagram?.id,
          instagramUsername: instagram?.username,
        },
      },
    });

    // If Instagram is connected, create separate integration
    if (instagram) {
      await this.prisma.integration.create({
        data: {
          tenantId,
          type: 'INSTAGRAM',
          status: 'CONNECTED',
          accountId: instagram.id,
          accountName: instagram.username,
          accessToken: longLivedToken,
          refreshToken: userToken,
          metadata: {
            instagramId: instagram.id,
            username: instagram.username,
            name: instagram.name,
            profilePicture: instagram.profile_picture_url,
            connectedPageId: page.id,
          },
        },
      });
    }

    return integration;
  }
}
