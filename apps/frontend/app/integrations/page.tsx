'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await api.get('/api/v1/integrations');
      setIntegrations(response.data);
    } catch (error) {
      console.error('Failed to fetch integrations', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platform: string, type: string) => {
    try {
      // REAL OAuth Flow - Like ManyChat
      if (type === 'FACEBOOK' || type === 'INSTAGRAM') {
        // Get OAuth URL from backend
        const response = await api.get('/api/v1/integrations/facebook/connect');
        const { authUrl } = response.data;

        // Redirect to Facebook OAuth
        window.location.href = authUrl;
        return;
      }

      // For WhatsApp and TikTok, show setup wizard
      if (type === 'WHATSAPP') {
        alert('WhatsApp setup coming soon! You need to:\n\n1. Get WhatsApp Business API access\n2. Add phone number\n3. Verify webhook\n\nSee REAL_INTEGRATIONS_SETUP.md for details.');
        return;
      }

      if (type === 'TIKTOK') {
        // Get OAuth URL from backend
        const response = await api.get('/api/v1/integrations/tiktok/connect');
        const { authUrl } = response.data;

        console.log('🎵 TikTok OAuth URL:', authUrl);

        // Redirect to TikTok OAuth
        window.location.href = authUrl;
        return;
      }
    } catch (error: any) {
      console.error('Failed to connect platform', error);

      // Check if it's a configuration error
      if (error.response?.status === 503) {
        const setupGuide = type === 'TIKTOK' ? 'TIKTOK_OAUTH_SETUP.md' : 'REAL_INTEGRATIONS_SETUP.md';
        alert(`⚠️ Setup Required\n\nTo connect ${platform}, you need to:\n\n1. Add API credentials to backend .env file\n2. See ${setupGuide} for detailed instructions\n\nError: ${error.response?.data?.message || error.message}`);
      } else if (type === 'TIKTOK') {
        const errorMsg = error.response?.data?.message || error.message;

        if (errorMsg.includes('client_key')) {
          alert(`❌ TikTok OAuth Error: Invalid Client Key\n\nThe TikTok client_key is invalid or incorrectly configured.\n\nPlease:\n1. Go to TikTok Developer Portal: https://developers.tiktok.com/\n2. Verify your app credentials\n3. Update TIKTOK_CLIENT_KEY in backend .env file\n\nSee TIKTOK_OAUTH_SETUP.md for detailed instructions.\n\nError: ${errorMsg}`);
        } else if (errorMsg.includes('redirect_uri')) {
          alert(`❌ TikTok OAuth Error: Redirect URI Not Whitelisted\n\nYou need to add this redirect URI to your TikTok app:\n\nhttp://localhost:3003/api/v1/integrations/tiktok/callback\n\nSteps:\n1. Go to: https://developers.tiktok.com/apps\n2. Select your app\n3. Go to Login Kit → Redirect URIs\n4. Add the redirect URI above\n5. Click Save\n6. Try connecting again\n\nFor production, also add:\nhttps://yourdomain.com/api/v1/integrations/tiktok/callback\n\nError: ${errorMsg}`);
        } else {
          alert(`❌ TikTok OAuth Error\n\n${errorMsg}\n\nSee TIKTOK_OAUTH_SETUP.md for troubleshooting help.`);
        }
      } else {
        alert(`❌ Failed to connect ${platform}: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const disconnectIntegration = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return;

    try {
      await api.post(`/api/v1/integrations/${id}/disconnect`);
      await fetchIntegrations();
    } catch (error) {
      console.error('Failed to disconnect integration', error);
    }
  };

  const connectAllPlatforms = async () => {
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const platform of platforms) {
      const isConnected = integrations.some(
        (int) => int.type === platform.type && int.status === 'CONNECTED'
      );

      if (!isConnected) {
        try {
          await api.post('/api/v1/integrations', {
            type: platform.type,
            accountName: `${platform.name} Business Account`,
            accountId: `${platform.type.toLowerCase()}_${Date.now()}`,
            accessToken: `mock_token_${Date.now()}`,
            refreshToken: `mock_refresh_${Date.now()}`,
          });
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between requests
        } catch (error) {
          console.error(`Failed to connect ${platform.name}`, error);
          failCount++;
        }
      }
    }

    await fetchIntegrations();
    setLoading(false);

    if (successCount > 0) {
      alert(`✅ Successfully connected ${successCount} platform(s)!${failCount > 0 ? `\n⚠️ ${failCount} failed` : ''}`);
    } else if (failCount > 0) {
      alert(`❌ Failed to connect platforms. Please try again.`);
    } else {
      alert(`ℹ️ All platforms are already connected!`);
    }
  };

  const platforms = [
    {
      name: 'Instagram',
      type: 'INSTAGRAM',
      icon: '📷',
      description: 'Connect Instagram Direct Messages',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Facebook',
      type: 'FACEBOOK',
      icon: '👍',
      description: 'Connect Facebook Messenger',
      color: 'from-blue-600 to-blue-400',
    },
    {
      name: 'WhatsApp',
      type: 'WHATSAPP',
      icon: '💬',
      description: 'Connect WhatsApp Business',
      color: 'from-green-600 to-green-400',
    },
    {
      name: 'TikTok',
      type: 'TIKTOK',
      icon: '🎵',
      description: 'Connect TikTok Business Messages',
      color: 'from-black to-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Integrations</h1>
                <p className="text-sm text-gray-600">Connect your social media accounts</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={connectAllPlatforms}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
              >
                {loading ? 'Connecting...' : '⚡ Connect All'}
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">← Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Connected Integrations */}
        {integrations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {integration.accountName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {integration.type}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Connected on{' '}
                        {new Date(integration.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        integration.status === 'CONNECTED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => disconnectIntegration(integration.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Platforms */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform) => {
              const isConnected = integrations.some(
                (int) => int.type === platform.type && int.status === 'CONNECTED'
              );

              return (
                <div
                  key={platform.type}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div
                    className={`h-40 bg-gradient-to-br ${platform.color} flex items-center justify-center text-7xl relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      {platform.icon}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{platform.name}</h3>
                      {isConnected && (
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {platform.description}
                    </p>
                    <Button
                      className={`w-full ${!isConnected ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
                      variant={isConnected ? 'outline' : 'default'}
                      disabled={isConnected}
                      onClick={() => connectPlatform(platform.name, platform.type)}
                    >
                      {isConnected ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Connected
                        </span>
                      ) : (
                        `Connect ${platform.name}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Need help connecting?
          </h3>
          <p className="text-blue-800 text-sm mb-4">
            Follow our step-by-step guides to connect each platform. Each integration requires setting up an OAuth app and configuring webhooks.
          </p>
          <Button variant="outline" size="sm">
            View Documentation
          </Button>
        </div>
      </main>
    </div>
  );
}
