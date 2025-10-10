'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/v1/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation: any) => {
    setSelectedConversation(conversation);
    try {
      const response = await api.get(
        `/api/v1/conversations/${conversation.id}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const response = await api.post(
        `/api/v1/conversations/${selectedConversation.id}/messages`,
        {
          type: 'TEXT',
          content: messageText,
        }
      );
      setMessages([...messages, response.data]);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mt-2">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
              <br />
              <Link href="/integrations" className="mt-2 inline-block">
                <Button size="sm" className="mt-2">
                  Connect a Platform
                </Button>
              </Link>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {conv.participantName || conv.participantUsername || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {conv.lastMessagePreview || 'No messages yet'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <span className="capitalize">{conv.platform?.toLowerCase()}</span>
                  <span className="mx-1">•</span>
                  <span className="capitalize">{conv.status?.toLowerCase()}</span>
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
            <div className="bg-white border-b p-4">
              <h3 className="font-semibold">
                {selectedConversation.participantName ||
                  selectedConversation.participantUsername ||
                  'Unknown'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.platform} • {selectedConversation.status}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No messages in this conversation
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-lg ${
                        msg.direction === 'OUTBOUND'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.direction === 'OUTBOUND'
                            ? 'text-blue-100'
                            : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
