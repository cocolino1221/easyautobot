'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ScheduledPost {
  id: string;
  title: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'WHATSAPP';
  content: string;
  mediaUrl?: string;
  scheduledTime: Date;
  status: 'scheduled' | 'published' | 'failed';
}

export default function PlannerPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock scheduled posts
  const scheduledPosts: ScheduledPost[] = [
    {
      id: '1',
      title: 'Product Launch Announcement',
      platform: 'INSTAGRAM',
      content: 'Exciting news! Our new product is launching next week! 🚀',
      scheduledTime: new Date(2025, 9, 15, 10, 0), // Oct 15, 2025 at 10:00 AM
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      platform: 'TIKTOK',
      content: 'Check out what goes on behind the scenes! 🎬',
      scheduledTime: new Date(2025, 9, 16, 14, 30),
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Customer Testimonial',
      platform: 'FACEBOOK',
      content: 'See what our customers are saying! ⭐⭐⭐⭐⭐',
      scheduledTime: new Date(2025, 9, 18, 9, 0),
      status: 'scheduled'
    },
  ];

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
      case 'INSTAGRAM': return 'from-purple-500 to-pink-500';
      case 'FACEBOOK': return 'from-blue-500 to-blue-600';
      case 'TIKTOK': return 'from-black to-gray-800';
      case 'WHATSAPP': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'published': return 'bg-green-100 text-green-700 border-green-300';
      case 'failed': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getPostsForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return scheduledPosts.filter(post => {
      const postDate = post.scheduledTime;
      return postDate.getFullYear() === year &&
             postDate.getMonth() === month &&
             postDate.getDate() === day;
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Content Planner</h1>
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
              <Link href="/planner">
                <Button variant="ghost" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Planner</Button>
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
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Schedule Post
              </Button>

              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${view === 'month' ? 'bg-white shadow-md text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${view === 'week' ? 'bg-white shadow-md text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${view === 'day' ? 'bg-white shadow-md text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Day
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={previousMonth}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <span className="text-lg font-bold text-gray-900 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button variant="outline" onClick={nextMonth}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {view === 'month' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-bold text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((day, index) => {
                const postsForDay = day ? getPostsForDay(day) : [];
                const isToday = day &&
                               day === new Date().getDate() &&
                               currentDate.getMonth() === new Date().getMonth() &&
                               currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-3 rounded-xl border-2 transition-all ${
                      day
                        ? isToday
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:shadow-md'
                        : 'border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {postsForDay.slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className={`text-xs p-2 rounded-lg bg-gradient-to-r ${getPlatformColor(post.platform)} text-white shadow-sm truncate cursor-pointer hover:shadow-md transition-all`}
                              title={post.title}
                            >
                              <div className="flex items-center gap-1">
                                <span>{getPlatformIcon(post.platform)}</span>
                                <span className="truncate">{post.title}</span>
                              </div>
                              <div className="text-[10px] opacity-90 mt-0.5">
                                {post.scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ))}
                          {postsForDay.length > 3 && (
                            <div className="text-xs text-gray-600 font-semibold text-center">
                              +{postsForDay.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Posts List */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upcoming Posts
          </h2>
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPlatformColor(post.platform)} flex items-center justify-center text-2xl shadow-lg`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {post.scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getStatusColor(post.status)}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Post Modal - simplified placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Post</h2>
            <p className="text-gray-600 mb-6">This feature will allow you to create and schedule posts across all your connected platforms.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                Create & Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
