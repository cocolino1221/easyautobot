'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  direction: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE';
  metadata?: {
    imageUrl?: string;
    fileName?: string;
    fileSize?: string;
  };
  status?: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
}

interface Conversation {
  id: string;
  participantName: string;
  participantUsername?: string;
  participantAvatar?: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'WHATSAPP';
  status: 'OPEN' | 'RESOLVED' | 'PENDING';
  lastMessagePreview: string;
  lastMessageTime: string;
  unreadCount: number;
  tags?: string[];
  assignedTo?: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED' | 'PENDING'>('ALL');
  const [filterPlatform, setFilterPlatform] = useState<'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'WHATSAPP'>('ALL');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Try API first
      const response = await api.get('/api/v1/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations, using mock data', error);
      // Fallback to mock data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participantName: 'Sarah Johnson',
          participantUsername: '@sarahj',
          platform: 'INSTAGRAM',
          status: 'OPEN',
          lastMessagePreview: 'Hey! Do you have this in blue?',
          lastMessageTime: new Date(Date.now() - 2 * 60000).toISOString(),
          unreadCount: 2,
          tags: ['product-inquiry', 'high-priority'],
        },
        {
          id: '2',
          participantName: 'Mike Chen',
          participantUsername: '@mikechen',
          platform: 'FACEBOOK',
          status: 'OPEN',
          lastMessagePreview: 'Thanks for the quick response!',
          lastMessageTime: new Date(Date.now() - 15 * 60000).toISOString(),
          unreadCount: 0,
          assignedTo: 'You',
        },
        {
          id: '3',
          participantName: 'Emma Davis',
          participantUsername: '@emmad',
          platform: 'INSTAGRAM',
          status: 'PENDING',
          lastMessagePreview: 'What are your business hours?',
          lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(),
          unreadCount: 1,
          tags: ['support'],
        },
        {
          id: '4',
          participantName: 'Alex Martinez',
          participantUsername: '+1234567890',
          platform: 'WHATSAPP',
          status: 'OPEN',
          lastMessagePreview: 'I love your products!',
          lastMessageTime: new Date(Date.now() - 2 * 3600000).toISOString(),
          unreadCount: 0,
        },
        {
          id: '5',
          participantName: 'Lisa Wong',
          participantUsername: '@lisawong',
          platform: 'TIKTOK',
          status: 'RESOLVED',
          lastMessagePreview: 'Perfect! Thank you so much!',
          lastMessageTime: new Date(Date.now() - 24 * 3600000).toISOString(),
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
      const response = await api.get(`/api/v1/conversations/${conversation.id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages, using mock data', error);
      // Mock messages for demonstration
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi! I saw your latest post and I\'m interested in buying.',
          direction: 'INBOUND',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'TEXT',
          status: 'READ',
        },
        {
          id: '2',
          content: 'Hello! Thanks for reaching out. I\'d be happy to help you. What would you like to know?',
          direction: 'OUTBOUND',
          timestamp: new Date(Date.now() - 3540000).toISOString(),
          type: 'TEXT',
          status: 'READ',
        },
        {
          id: '3',
          content: 'Do you have this in blue?',
          direction: 'INBOUND',
          timestamp: new Date(Date.now() - 3480000).toISOString(),
          type: 'TEXT',
          status: 'READ',
        },
        {
          id: '4',
          content: 'Yes! We have it in blue. Let me show you:',
          direction: 'OUTBOUND',
          timestamp: new Date(Date.now() - 3420000).toISOString(),
          type: 'TEXT',
          status: 'READ',
        },
        {
          id: '5',
          content: 'Here\'s the blue version',
          direction: 'OUTBOUND',
          timestamp: new Date(Date.now() - 3360000).toISOString(),
          type: 'IMAGE',
          status: 'READ',
          metadata: {
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          },
        },
        {
          id: '6',
          content: 'Perfect! How much is it?',
          direction: 'INBOUND',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'TEXT',
          status: 'READ',
        },
      ];
      setMessages(mockMessages);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageText,
      direction: 'OUTBOUND',
      timestamp: new Date().toISOString(),
      type: 'TEXT',
      status: 'SENT',
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    try {
      const response = await api.post(`/api/v1/conversations/${selectedConversation.id}/messages`, {
        type: 'TEXT',
        content: messageText,
      });
      // Update with server response
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? response.data : msg)));
    } catch (error) {
      console.error('Failed to send message', error);
      // Keep the optimistic update
    }

    // Simulate typing response after a delay
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const autoReply: Message = {
          id: `auto-${Date.now()}`,
          content: 'Thanks for your message! I\'ll get back to you shortly.',
          direction: 'INBOUND',
          timestamp: new Date().toISOString(),
          type: 'TEXT',
          status: 'SENT',
        };
        setMessages((prev) => [...prev, autoReply]);
      }, 2000);
    }, 1000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return '📷';
      case 'FACEBOOK':
        return '👍';
      case 'TIKTOK':
        return '🎵';
      case 'WHATSAPP':
        return '💬';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'FACEBOOK':
        return 'bg-blue-600';
      case 'TIKTOK':
        return 'bg-gray-900';
      case 'WHATSAPP':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-700';
      case 'RESOLVED':
        return 'bg-gray-100 text-gray-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredConversations = conversations
    .filter((conv) => {
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        return (
          conv.participantName.toLowerCase().includes(search) ||
          conv.participantUsername?.toLowerCase().includes(search) ||
          conv.lastMessagePreview.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .filter((conv) => filterStatus === 'ALL' || conv.status === filterStatus)
    .filter((conv) => filterPlatform === 'ALL' || conv.platform === filterPlatform);

  const updateConversationStatus = (status: 'OPEN' | 'RESOLVED' | 'PENDING') => {
    if (!selectedConversation) return;
    setConversations((prev) =>
      prev.map((conv) => (conv.id === selectedConversation.id ? { ...conv, status } : conv))
    );
    setSelectedConversation({ ...selectedConversation, status });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-96 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">💬 Inbox</h2>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-8">
                ← Dashboard
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full px-3 py-2 pl-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as any)}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Platforms</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="TIKTOK">TikTok</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 bg-gray-50 border-b flex gap-4 text-xs">
          <div>
            <span className="text-gray-600">Total:</span>{' '}
            <span className="font-bold text-gray-900">{filteredConversations.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Unread:</span>{' '}
            <span className="font-bold text-purple-600">
              {filteredConversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
              <div className="text-sm text-gray-600">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">No conversations</div>
              <p className="text-xs text-gray-500 mb-4">Connect your accounts to start receiving messages</p>
              <Link href="/integrations">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Connect Accounts
                </Button>
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {conv.participantName.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{conv.participantName}</h3>
                      <span className="text-xs text-gray-500 ml-2">{getTimeAgo(conv.lastMessageTime)}</span>
                    </div>

                    {conv.participantUsername && (
                      <div className="text-xs text-gray-500 mb-1">@{conv.participantUsername}</div>
                    )}

                    <p className="text-sm text-gray-600 truncate mb-2">{conv.lastMessagePreview}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getPlatformColor(conv.platform)}`}>
                        {getPlatformIcon(conv.platform)} {conv.platform}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-purple-600">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {conv.tags && conv.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {conv.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedConversation.participantName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation.participantName}</h3>
                  <p className="text-sm text-gray-500">
                    {getPlatformIcon(selectedConversation.platform)} {selectedConversation.platform}
                    {selectedConversation.participantUsername && ` • @${selectedConversation.participantUsername}`}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <select
                  value={selectedConversation.status}
                  onChange={(e) => updateConversationStatus(e.target.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(selectedConversation.status)}`}
                >
                  <option value="OPEN">Open</option>
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <Button variant="outline" size="sm">
                  🏷️ Tag
                </Button>
                <Button variant="outline" size="sm">
                  👤 Assign
                </Button>
                <Button variant="outline" size="sm">
                  ⋯
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="text-sm">No messages yet</div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md ${
                        msg.direction === 'OUTBOUND'
                          ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm'
                      } p-3`}
                    >
                      {msg.type === 'IMAGE' && msg.metadata?.imageUrl && (
                        <img
                          src={msg.metadata.imageUrl}
                          alt="Message attachment"
                          className="rounded-lg mb-2 max-w-full"
                        />
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`text-xs ${
                            msg.direction === 'OUTBOUND' ? 'text-purple-100' : 'text-gray-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {msg.direction === 'OUTBOUND' && msg.status && (
                          <span className="text-xs text-purple-100 ml-2">
                            {msg.status === 'READ' ? '✓✓' : msg.status === 'DELIVERED' ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2 items-end">
                <Button variant="outline" size="sm" className="h-10">
                  📎
                </Button>
                <Button variant="outline" size="sm" className="h-10">
                  😊
                </Button>
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                </div>
                <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700 h-10 px-6">
                  Send
                </Button>
              </div>

              {/* Quick Replies */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessageText('Thanks for your message! How can I help you today?')}
                  className="text-xs"
                >
                  👋 Greeting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessageText('Our business hours are Monday-Friday, 9 AM - 6 PM EST.')}
                  className="text-xs"
                >
                  🕐 Hours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessageText('I\'ll get back to you shortly with more information.')}
                  className="text-xs"
                >
                  ⏳ Follow-up
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
