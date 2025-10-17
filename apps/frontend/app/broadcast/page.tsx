'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Audience {
  id: string;
  name: string;
  count: number;
  description: string;
  filters?: {
    platform?: string[];
    tags?: string[];
    lastActive?: string;
  };
}

interface Template {
  id: string;
  name: string;
  content: string;
  platform: string;
  category: string;
}

export default function BroadcastPage() {
  const [step, setStep] = useState<'audience' | 'message' | 'schedule' | 'review'>('audience');
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'image' | 'video'>('text');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['INSTAGRAM']);
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Mock audiences
  const audiences: Audience[] = [
    {
      id: 'all',
      name: 'All Subscribers',
      count: 1245,
      description: 'All users who have interacted with your bot',
    },
    {
      id: 'engaged',
      name: 'Engaged Users',
      count: 892,
      description: 'Users active in the last 30 days',
      filters: { lastActive: '30d' },
    },
    {
      id: 'instagram',
      name: 'Instagram Followers',
      count: 654,
      description: 'Users from Instagram',
      filters: { platform: ['INSTAGRAM'] },
    },
    {
      id: 'vip',
      name: 'VIP Customers',
      count: 123,
      description: 'High-value customers',
      filters: { tags: ['vip', 'high-value'] },
    },
    {
      id: 'new',
      name: 'New Subscribers',
      count: 234,
      description: 'Subscribed in the last 7 days',
      filters: { lastActive: '7d' },
    },
  ];

  // Mock templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'Product Launch',
      content: '🎉 Exciting news! We just launched {product_name}. Check it out: {link}',
      platform: 'all',
      category: 'marketing',
    },
    {
      id: '2',
      name: 'Flash Sale',
      content: '⚡ FLASH SALE! Get {discount}% off for the next {hours} hours. Use code: {code}',
      platform: 'all',
      category: 'sales',
    },
    {
      id: '3',
      name: 'Weekly Update',
      content: '📰 This week\'s highlights: {highlights}',
      platform: 'all',
      category: 'newsletter',
    },
    {
      id: '4',
      name: 'Event Reminder',
      content: '📅 Reminder: {event_name} is happening {time}! Don\'t miss out!',
      platform: 'all',
      category: 'event',
    },
  ];

  const totalRecipients = audiences
    .filter((a) => selectedAudience.includes(a.id))
    .reduce((sum, a) => sum + a.count, 0);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const applyTemplate = (template: Template) => {
    setMessageContent(template.content);
    setSelectedTemplate(template.id);
  };

  const sendBroadcast = async () => {
    // TODO: API call to send broadcast
    alert(`Broadcast scheduled!\n\nRecipients: ${totalRecipients}\nPlatforms: ${selectedPlatforms.join(', ')}\nMessage: ${messageContent.substring(0, 50)}...`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📣</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Broadcast Message</h1>
                <p className="text-sm text-gray-500">Send messages to multiple users at once</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {['audience', 'message', 'schedule', 'review'].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <button
                  onClick={() => setStep(s as any)}
                  className={`flex items-center gap-2 ${
                    step === s ? 'text-purple-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      step === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="hidden md:inline font-medium capitalize">{s}</span>
                </button>
                {idx < 3 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Audience Selection */}
            {step === 'audience' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Select Audience</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose who will receive your broadcast message
                </p>

                <div className="space-y-3">
                  {audiences.map((audience) => (
                    <div
                      key={audience.id}
                      onClick={() => {
                        if (selectedAudience.includes(audience.id)) {
                          setSelectedAudience(selectedAudience.filter((id) => id !== audience.id));
                        } else {
                          setSelectedAudience([...selectedAudience, audience.id]);
                        }
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAudience.includes(audience.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{audience.name}</h3>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              {audience.count.toLocaleString()} users
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{audience.description}</p>
                          {audience.filters && (
                            <div className="flex gap-2 mt-2">
                              {audience.filters.platform && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {audience.filters.platform.join(', ')}
                                </span>
                              )}
                              {audience.filters.tags && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                  Tags: {audience.filters.tags.join(', ')}
                                </span>
                              )}
                              {audience.filters.lastActive && (
                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                  Active: Last {audience.filters.lastActive}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedAudience.includes(audience.id)
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedAudience.includes(audience.id) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep('message')}
                    disabled={selectedAudience.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next: Compose Message →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Message Composition */}
            {step === 'message' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ Compose Message</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Create your broadcast message
                </p>

                {/* Platform Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Platforms
                  </label>
                  <div className="flex gap-3">
                    {['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'WHATSAPP'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedPlatforms.includes(platform)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-xl">{getPlatformIcon(platform)}</span>
                        <span className="text-sm font-medium">{platform}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Templates */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quick Templates
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold text-sm text-gray-900">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate">{template.content}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Message Type
                  </label>
                  <div className="flex gap-3">
                    {(['text', 'image', 'video'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setMessageType(type)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          messageType === type
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        {type === 'text' && '📝 Text'}
                        {type === 'image' && '🖼️ Image'}
                        {type === 'video' && '🎥 Video'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Message Content
                  </label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here... Use {variable} for personalization"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={6}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      Variables: {'{first_name}'}, {'{last_name}'}, {'{username}'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {messageContent.length} characters
                    </div>
                  </div>
                </div>

                {messageType === 'image' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-all cursor-pointer">
                      <div className="text-4xl mb-2">📎</div>
                      <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                      <div className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('audience')}>
                    ← Back
                  </Button>
                  <Button
                    onClick={() => setStep('schedule')}
                    disabled={!messageContent.trim() || selectedPlatforms.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next: Schedule →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 'schedule' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Schedule Delivery</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose when to send your broadcast
                </p>

                <div className="space-y-4">
                  <div
                    onClick={() => setScheduleType('now')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      scheduleType === 'now'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">⚡ Send Now</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Broadcast will be sent immediately
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          scheduleType === 'now'
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {scheduleType === 'now' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setScheduleType('scheduled')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      scheduleType === 'scheduled'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">📆 Schedule for Later</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Choose a specific date and time
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          scheduleType === 'scheduled'
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {scheduleType === 'scheduled' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {scheduleType === 'scheduled' && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Time
                          </label>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep('message')}>
                    ← Back
                  </Button>
                  <Button
                    onClick={() => setStep('review')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next: Review →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Send */}
            {step === 'review' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">👀 Review & Send</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Double-check everything before sending
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Audience</h3>
                    <div className="flex flex-wrap gap-2">
                      {audiences
                        .filter((a) => selectedAudience.includes(a.id))
                        .map((audience) => (
                          <span
                            key={audience.id}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {audience.name} ({audience.count.toLocaleString()})
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Platforms</h3>
                    <div className="flex gap-2">
                      {selectedPlatforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                        >
                          {getPlatformIcon(platform)} {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Message</h3>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{messageContent}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Schedule</h3>
                    <p className="text-sm text-gray-900">
                      {scheduleType === 'now' ? (
                        <span className="flex items-center gap-2">
                          <span>⚡</span> Send immediately
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>📆</span> Scheduled for {scheduledDate} at {scheduledTime}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep('schedule')}>
                    ← Back
                  </Button>
                  <Button
                    onClick={sendBroadcast}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {scheduleType === 'now' ? '🚀 Send Now' : '📅 Schedule Broadcast'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview & Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Broadcast Summary</h3>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium mb-1">Total Recipients</div>
                  <div className="text-3xl font-bold text-purple-900">
                    {totalRecipients.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium mb-1">Platforms</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {selectedPlatforms.length}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-1">Estimated Cost</div>
                  <div className="text-2xl font-bold text-green-900">Free</div>
                </div>
              </div>

              {/* Preview */}
              {messageContent && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Message Preview</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="bg-purple-600 text-white rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                      <p className="text-sm whitespace-pre-wrap">
                        {messageContent.replace(/\{(\w+)\}/g, (match, variable) => {
                          const replacements: Record<string, string> = {
                            first_name: 'John',
                            last_name: 'Doe',
                            username: '@johndoe',
                          };
                          return replacements[variable] || match;
                        })}
                      </p>
                      <div className="text-xs text-purple-100 mt-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Personalize with variables for better engagement</li>
                  <li>• Send at optimal times (9-11 AM, 6-8 PM)</li>
                  <li>• Keep messages concise and actionable</li>
                  <li>• Test with a small audience first</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
