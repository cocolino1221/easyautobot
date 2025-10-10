import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class TikTokOAuthService {
  private readonly clientKey: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private pkceStore: Map<string, { verifier: string; challenge: string }> = new Map();

  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.clientKey = this.config.get('TIKTOK_CLIENT_KEY') || '';
    this.clientSecret = this.config.get('TIKTOK_CLIENT_SECRET') || '';
    this.redirectUri = this.config.get('TIKTOK_REDIRECT_URI') || 'http://localhost:3003/api/v1/integrations/tiktok/callback';
  }

  /**
   * Generate PKCE code verifier and challenge
   */
  private generatePKCE(): { verifier: string; challenge: string } {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');

    return { verifier, challenge };
  }

  /**
   * Generate OAuth URL for TikTok authorization with PKCE
   */
  getAuthUrl(state: string): string {
    if (!this.clientKey) {
      throw new HttpException(
        '🔧 TikTok Client Key not configured. Please add TIKTOK_CLIENT_KEY to .env file. See TIKTOK_OAUTH_SETUP.md for setup instructions.',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    // Validate client key format
    if (this.clientKey.length < 20) {
      console.warn(`⚠️ TikTok Client Key appears too short (${this.clientKey.length} chars). Expected 20-30 characters.`);
      console.warn(`Current key: ${this.clientKey}`);
      console.warn(`Please verify your TikTok app credentials in the Developer Portal.`);
    }

    // Using minimal scopes for testing - add more after basic OAuth works
    const scopes = [
      'user.info.basic',
    ].join(',');

    // Generate PKCE for this request
    const pkce = this.generatePKCE();
    this.pkceStore.set(state, pkce);

    const params = new URLSearchParams({
      client_key: this.clientKey,
      redirect_uri: this.redirectUri,
      state,
      scope: scopes,
      response_type: 'code',
      code_challenge: pkce.challenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`;

    console.log('🔗 TikTok OAuth URL generated:');
    console.log(`   Client Key: ${this.clientKey.substring(0, 5)}...`);
    console.log(`   Redirect URI: ${this.redirectUri}`);
    console.log(`   Scopes: ${scopes}`);
    console.log(`   Code Challenge: ${pkce.challenge.substring(0, 10)}...`);
    console.log(`   Full URL: ${authUrl}`);

    return authUrl;
  }

  /**
   * Exchange authorization code for access token with PKCE
   */
  async getAccessToken(code: string, state: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    open_id: string;
  }> {
    if (!this.clientKey || !this.clientSecret) {
      throw new HttpException(
        'TikTok credentials not configured',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    // Get stored PKCE verifier
    const pkce = this.pkceStore.get(state);
    if (!pkce) {
      throw new HttpException(
        'PKCE verifier not found. Please restart OAuth flow.',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      console.log('🔄 Exchanging TikTok authorization code for token...');
      console.log(`   Using Client Key: ${this.clientKey.substring(0, 5)}...`);

      const response = await firstValueFrom(
        this.httpService.post('https://open.tiktokapis.com/v2/oauth/token/', {
          client_key: this.clientKey,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
          code_verifier: pkce.verifier,
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      // Clean up PKCE store
      this.pkceStore.delete(state);

      console.log('✅ TikTok token exchange successful!');
      return response.data.data;
    } catch (error: any) {
      this.pkceStore.delete(state);

      console.error('❌ TikTok token exchange failed:');
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Error: ${JSON.stringify(error.response?.data, null, 2)}`);

      const errorMessage = error.response?.data?.error_description
        || error.response?.data?.message
        || 'Failed to exchange code for access token. Please check your TikTok app credentials.';

      throw new HttpException(
        `🎵 TikTok OAuth Error: ${errorMessage}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(accessToken: string, openId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://open.tiktokapis.com/v2/user/info/', {
          params: {
            fields: 'open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      return response.data.data.user;
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch user info',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('https://open.tiktokapis.com/v2/oauth/token/', {
          client_key: this.clientKey,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      return response.data.data.access_token;
    } catch (error: any) {
      throw new HttpException(
        'Failed to refresh token',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Save TikTok integration
   */
  async saveIntegration(tenantId: string, tokenData: any, userInfo: any) {
    const integration = await this.prisma.integration.create({
      data: {
        tenantId,
        type: 'TIKTOK',
        status: 'CONNECTED',
        accountId: userInfo.open_id,
        accountName: userInfo.display_name || userInfo.username,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        metadata: {
          openId: userInfo.open_id,
          username: userInfo.username,
          displayName: userInfo.display_name,
          avatarUrl: userInfo.avatar_url,
          followerCount: userInfo.follower_count,
          followingCount: userInfo.following_count,
          likesCount: userInfo.likes_count,
          videoCount: userInfo.video_count,
        },
      },
    });

    return integration;
  }
}
