'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with real API calls
  const mockStats = {
    overview: {
      messagesSent: 1245,
      messagesChange: '+15%',
      newContacts: 89,
      contactsChange: '+22%',
      activeFlows: 12,
      flowsChange: '+3',
      growthRate: 15,
      growthChange: '+5%'
    },
    activeFlows: [
      { id: '1', name: 'Welcome Sequence', todayCount: 125, status: 'active', platform: 'instagram' },
      { id: '2', name: 'FAQ Bot', todayCount: 89, status: 'active', platform: 'tiktok' },
      { id: '3', name: 'Cart Reminder', todayCount: 34, status: 'active', platform: 'facebook' },
      { id: '4', name: 'Product Launch', todayCount: 28, status: 'active', platform: 'whatsapp' },
    ],
    recentActivity: [
      { id: '1', type: 'message', text: 'New message from @johndoe', time: '2 minutes ago', icon: '💬' },
      { id: '2', type: 'flow', text: 'Welcome Sequence completed for 5 users', time: '15 minutes ago', icon: '✅' },
      { id: '3', type: 'integration', text: 'Instagram connected successfully', time: '1 hour ago', icon: '🔗' },
      { id: '4', type: 'contact', text: '12 new contacts added', time: '2 hours ago', icon: '👥' },
    ]
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/v1/analytics/dashboard');
      // Validate response has expected structure
      if (response.data && response.data.overview) {
        setStats(response.data);
      } else {
        console.log('Invalid API response structure, using mock data');
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
      // Use mock data if API fails
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📷';
      case 'facebook': return '👍';
      case 'tiktok': return '🎵';
      case 'whatsapp': return '💬';
      default: return '📱';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const displayStats = stats || mockStats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <nav className="flex gap-2">
              <Link href="/live">
                <Button variant="outline" className="h-9 text-sm border-green-500 text-green-700 hover:bg-green-50">
                  🔴 Live
                </Button>
              </Link>
              <Link href="/flows">
                <Button className="bg-purple-600 hover:bg-purple-700 h-9 text-sm">
                  + New Flow
                </Button>
              </Link>
              <Link href="/integrations">
                <Button variant="outline" className="h-9 text-sm">
                  🔌 Connect
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Overview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📊 Overview</h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Messages Sent */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Messages Sent</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {displayStats.overview.messagesChange}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {displayStats.overview.messagesSent.toLocaleString()}
              </div>
            </div>

            {/* New Contacts */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">New Contacts</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {displayStats.overview.contactsChange}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {displayStats.overview.newContacts}
              </div>
            </div>

            {/* Active Flows */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Flows</span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {displayStats.overview.flowsChange}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {displayStats.overview.activeFlows}
              </div>
            </div>

            {/* Growth Rate */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {displayStats.overview.growthChange}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                +{displayStats.overview.growthRate}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quick Actions & Active Flows */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/flows/builder/new">
                  <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">
                      ➕
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">New Flow</div>
                      <div className="text-xs text-gray-500">Create automation</div>
                    </div>
                  </button>
                </Link>

                <Link href="/live">
                  <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all text-left">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">
                      🔴
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Live Activity</div>
                      <div className="text-xs text-gray-500">Real-time updates</div>
                    </div>
                  </button>
                </Link>

                <Link href="/broadcast">
                  <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-lg">
                      📣
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Broadcast</div>
                      <div className="text-xs text-gray-500">Send to all</div>
                    </div>
                  </button>
                </Link>

                <Link href="/flows">
                  <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-lg">
                      📊
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">View Reports</div>
                      <div className="text-xs text-gray-500">Analytics</div>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Active Flows */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">🔥 Active Flows</h2>
                <span className="text-sm text-gray-500">Real-time</span>
              </div>
              <div className="space-y-3">
                {displayStats.activeFlows.map((flow: any) => (
                  <Link key={flow.id} href={`/flows/builder/${flow.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{getPlatformIcon(flow.platform)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{flow.name}</div>
                          <div className="text-xs text-gray-500">{flow.todayCount} messages today</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-xs text-gray-500">Active</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/flows">
                <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All Flows →
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🕐 Recent Activity</h2>
              <div className="space-y-4">
                {displayStats.recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-tight">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                View All Activity →
              </button>
            </div>
          </div>
        </div>

        {/* Platform Connections Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔌 Connected Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <span className="text-2xl">📷</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Instagram</div>
                <div className="text-xs text-green-600">● Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-2xl">👍</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Facebook</div>
                <div className="text-xs text-green-600">● Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">🎵</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">TikTok</div>
                <div className="text-xs text-gray-400">○ Not connected</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">WhatsApp</div>
                <div className="text-xs text-green-600">● Connected</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
