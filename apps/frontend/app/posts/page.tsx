'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK';
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK'>('ALL');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      const mockPosts: Post[] = [
        {
          id: '1',
          platform: 'INSTAGRAM',
          content: 'Check out our new product launch! 🚀 #NewProduct #Launch',
          mediaUrl: 'https://via.placeholder.com/400',
          likes: 245,
          comments: 23,
          shares: 12,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          author: { name: 'Your Business', avatar: '' }
        },
        {
          id: '2',
          platform: 'FACEBOOK',
          content: 'Happy to announce our partnership with @partner! Together we\'re making great things happen.',
          likes: 189,
          comments: 45,
          shares: 34,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          author: { name: 'Your Business', avatar: '' }
        },
        {
          id: '3',
          platform: 'TIKTOK',
          content: 'Behind the scenes at our office! 🎬',
          mediaUrl: 'https://via.placeholder.com/400',
          likes: 1240,
          comments: 89,
          shares: 156,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          author: { name: 'Your Business', avatar: '' }
        },
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return '📷';
      case 'FACEBOOK':
        return '👍';
      case 'TIKTOK':
        return '🎵';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return 'from-purple-500 to-pink-500';
      case 'FACEBOOK':
        return 'from-blue-500 to-blue-600';
      case 'TIKTOK':
        return 'from-black to-gray-800';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredPosts = filter === 'ALL' ? posts : posts.filter(p => p.platform === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Posts</h1>
            </div>
            <nav className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="hover:bg-gray-100">Dashboard</Button>
              </Link>
              <Link href="/inbox">
                <Button variant="ghost" className="hover:bg-gray-100">Inbox</Button>
              </Link>
              <Link href="/posts">
                <Button variant="ghost" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Posts</Button>
              </Link>
              <Link href="/flows">
                <Button variant="ghost" className="hover:bg-gray-100">Flows</Button>
              </Link>
              <Link href="/integrations">
                <Button variant="ghost" className="hover:bg-gray-100">Integrations</Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" className="hover:bg-gray-100">Settings</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Filter by Platform</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilter('ALL')}
                variant={filter === 'ALL' ? 'default' : 'outline'}
                className={filter === 'ALL' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                All Posts
              </Button>
              <Button
                onClick={() => setFilter('INSTAGRAM')}
                variant={filter === 'INSTAGRAM' ? 'default' : 'outline'}
                className={filter === 'INSTAGRAM' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
              >
                📷 Instagram
              </Button>
              <Button
                onClick={() => setFilter('FACEBOOK')}
                variant={filter === 'FACEBOOK' ? 'default' : 'outline'}
                className={filter === 'FACEBOOK' ? 'bg-blue-600' : ''}
              >
                👍 Facebook
              </Button>
              <Button
                onClick={() => setFilter('TIKTOK')}
                variant={filter === 'TIKTOK' ? 'default' : 'outline'}
                className={filter === 'TIKTOK' ? 'bg-gray-900' : ''}
              >
                🎵 TikTok
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">Connect your social media accounts to see your posts here</p>
            <Link href="/integrations">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Connect Accounts
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Platform Badge */}
                <div className={`px-4 py-2 bg-gradient-to-r ${getPlatformColor(post.platform)} text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                    <span className="font-semibold text-sm">{post.platform}</span>
                  </div>
                  <span className="text-xs opacity-90">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Media */}
                {post.mediaUrl && (
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={post.mediaUrl}
                      alt="Post media"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-900 mb-4 line-clamp-3">{post.content}</p>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="font-semibold">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="font-semibold">{post.shares}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Button variant="outline" className="flex-1 text-sm">
                      View Comments
                    </Button>
                    <Button variant="outline" className="flex-1 text-sm">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
