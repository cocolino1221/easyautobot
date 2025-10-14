'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  type: 'MESSAGE' | 'POST' | 'COMMENT' | 'LIKE' | 'FOLLOW';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'WHATSAPP';
  content: string;
  author: {
    name: string;
    username?: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: {
    postId?: string;
    conversationId?: string;
    likes?: number;
    comments?: number;
  };
}

export default function LivePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'MESSAGE' | 'POST' | 'COMMENT'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'WHATSAPP'>('ALL');

  useEffect(() => {
    fetchLiveActivities();

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchLiveActivities();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveActivities = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock real-time data
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'MESSAGE',
          platform: 'INSTAGRAM',
          content: 'Hey! I love your products! Do you have this in blue?',
          author: { name: 'Sarah Johnson', username: '@sarahj', avatar: '' },
          timestamp: new Date(Date.now() - 30000).toISOString(),
          metadata: { conversationId: 'conv-1' }
        },
        {
          id: '2',
          type: 'COMMENT',
          platform: 'FACEBOOK',
          content: 'This is exactly what I needed! Where can I buy?',
          author: { name: 'Mike Chen', username: 'mike.chen', avatar: '' },
          timestamp: new Date(Date.now() - 120000).toISOString(),
          metadata: { postId: 'post-1', likes: 5 }
        },
        {
          id: '3',
          type: 'POST',
          platform: 'TIKTOK',
          content: 'Just posted a new video! Check out our latest collection 🔥',
          author: { name: 'Your Business', username: '@yourbiz', avatar: '' },
          timestamp: new Date(Date.now() - 300000).toISOString(),
          metadata: { likes: 245, comments: 23 }
        },
        {
          id: '4',
          type: 'MESSAGE',
          platform: 'WHATSAPP',
          content: 'What are your business hours?',
          author: { name: 'James Wilson', username: '+1234567890', avatar: '' },
          timestamp: new Date(Date.now() - 600000).toISOString(),
          metadata: { conversationId: 'conv-2' }
        },
        {
          id: '5',
          type: 'COMMENT',
          platform: 'INSTAGRAM',
          content: 'Amazing content! Following you now 🙌',
          author: { name: 'Emma Davis', username: '@emmad', avatar: '' },
          timestamp: new Date(Date.now() - 900000).toISOString(),
          metadata: { postId: 'post-2', likes: 12 }
        },
        {
          id: '6',
          type: 'FOLLOW',
          platform: 'INSTAGRAM',
          content: 'Started following you',
          author: { name: 'Alex Martinez', username: '@alexm', avatar: '' },
          timestamp: new Date(Date.now() - 1200000).toISOString(),
        },
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to fetch live activities', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM': return '📷';
      case 'FACEBOOK': return '👍';
      case 'TIKTOK': return '🎵';
      case 'WHATSAPP': return '💬';
      default: return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'FACEBOOK': return 'bg-blue-600';
      case 'TIKTOK': return 'bg-gray-900';
      case 'WHATSAPP': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE': return '💬';
      case 'POST': return '📝';
      case 'COMMENT': return '💭';
      case 'LIKE': return '❤️';
      case 'FOLLOW': return '👤';
      default: return '📱';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MESSAGE': return 'bg-blue-100 text-blue-700';
      case 'POST': return 'bg-purple-100 text-purple-700';
      case 'COMMENT': return 'bg-green-100 text-green-700';
      case 'LIKE': return 'bg-red-100 text-red-700';
      case 'FOLLOW': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredActivities = activities
    .filter(activity => filter === 'ALL' || activity.type === filter)
    .filter(activity => platformFilter === 'ALL' || activity.platform === platformFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔴</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Live Activity</h1>
                <p className="text-xs text-gray-500">Real-time updates • Auto-refresh</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="hover:bg-gray-100">Dashboard</Button>
              </Link>
              <Link href="/inbox">
                <Button variant="ghost" className="hover:bg-gray-100">Inbox</Button>
              </Link>
              <Link href="/posts">
                <Button variant="ghost" className="hover:bg-gray-100">Posts</Button>
              </Link>
              <Link href="/flows">
                <Button variant="ghost" className="hover:bg-gray-100">Flows</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Activity Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Type</h3>
                <div className="space-y-2">
                  {['ALL', 'MESSAGE', 'POST', 'COMMENT'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === type
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type === 'ALL' ? '📊 All Activity' : `${getTypeIcon(type)} ${type.charAt(0) + type.slice(1).toLowerCase()}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Platform</h3>
                <div className="space-y-2">
                  {['ALL', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'WHATSAPP'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setPlatformFilter(platform as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        platformFilter === platform
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {platform === 'ALL' ? '🌐 All Platforms' : `${getPlatformIcon(platform)} ${platform.charAt(0) + platform.slice(1).toLowerCase()}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Activity</span>
                    <span className="font-bold text-gray-900">{filteredActivities.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Update</span>
                    <span className="font-medium text-green-600">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading live activity...</p>
                </div>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No activity yet</h3>
                <p className="text-gray-600 mb-6">Connect your accounts to start seeing live activity</p>
                <Link href="/integrations">
                  <Button className="bg-purple-600 hover:bg-purple-700">Connect Accounts</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {activity.author.name.charAt(0)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{activity.author.name}</h3>
                          {activity.author.username && (
                            <span className="text-sm text-gray-500">@{activity.author.username}</span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(activity.type)}`}>
                            {getTypeIcon(activity.type)} {activity.type}
                          </span>
                          <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium text-white ${getPlatformColor(activity.platform)}`}>
                            {getPlatformIcon(activity.platform)} {activity.platform}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{activity.content}</p>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {getTimeAgo(activity.timestamp)}
                          </span>

                          {activity.metadata?.likes && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {activity.metadata.likes}
                            </span>
                          )}

                          {activity.metadata?.comments && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {activity.metadata.comments}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                          {activity.type === 'MESSAGE' && (
                            <Link href={`/inbox`}>
                              <Button size="sm" variant="outline">Reply</Button>
                            </Link>
                          )}
                          {(activity.type === 'COMMENT' || activity.type === 'POST') && (
                            <Link href={`/posts`}>
                              <Button size="sm" variant="outline">View Post</Button>
                            </Link>
                          )}
                          <Button size="sm" variant="ghost">Dismiss</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
