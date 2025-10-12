'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Panel,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

// Node Configuration Side Panel
const NodeConfigPanel = ({ node, isOpen, onClose, onUpdate }: any) => {
  const [config, setConfig] = useState(node?.data || {});

  if (!isOpen || !node) return null;

  const handleSave = () => {
    onUpdate(node.id, config);
    onClose();
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l-2 border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Configure Node</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="space-y-6">
          {/* Node Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Node Name</label>
            <input
              type="text"
              value={config.label || ''}
              onChange={(e) => setConfig({ ...config, label: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
              placeholder="Enter node name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
            <textarea
              value={config.description || ''}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none resize-none"
              rows={3}
              placeholder="Enter description"
            />
          </div>

          {/* AI Agent Settings */}
          {node.type === 'aiAgent' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">AI Model</label>
                <select
                  value={config.aiModel || 'gpt-4'}
                  onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">System Prompt</label>
                <textarea
                  value={config.systemPrompt || ''}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none resize-none"
                  rows={4}
                  placeholder="Enter system prompt..."
                />
              </div>
            </>
          )}

          {/* Action Settings */}
          {node.type === 'action' && (
            <>
              {config.actionType === 'send_voice_message' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Voice Message Audio</label>
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setConfig({ ...config, voiceFile: file.name, voiceSize: (file.size / 1024).toFixed(2) + ' KB' });
                          }
                        }}
                        className="hidden"
                        id="voice-upload"
                      />
                      <label htmlFor="voice-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2">🎤</div>
                        <div className="text-sm font-semibold text-purple-700 mb-1">
                          {config.voiceFile || 'Upload Voice Message'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {config.voiceSize || 'Max 60 seconds • MP3, WAV, M4A'}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Voice Message Tips:</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>• Keep it under 60 seconds (TikTok/Instagram limit)</li>
                          <li>• Use clear audio with no background noise</li>
                          <li>• Record in a friendly, conversational tone</li>
                          <li>• Include your brand name or call-to-action</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Message Template</label>
                    <textarea
                      value={config.messageTemplate || ''}
                      onChange={(e) => setConfig({ ...config, messageTemplate: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none resize-none"
                      rows={4}
                      placeholder="Enter message template..."
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  value={config.delay || 0}
                  onChange={(e) => setConfig({ ...config, delay: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  min="0"
                />
              </div>
            </>
          )}

          {/* Condition Settings */}
          {node.type === 'condition' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Condition Type</label>
                <select
                  value={config.conditionType || 'contains'}
                  onChange={(e) => setConfig({ ...config, conditionType: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="starts_with">Starts With</option>
                  <option value="regex">Regex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Value to Check</label>
                <input
                  type="text"
                  value={config.checkValue || ''}
                  onChange={(e) => setConfig({ ...config, checkValue: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  placeholder="Enter value..."
                />
              </div>
            </>
          )}

          {/* Node Status */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig({ ...config, status: 'active' })}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                  config.status === 'active' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200'
                }`}
              >
                ✅ Active
              </button>
              <button
                onClick={() => setConfig({ ...config, status: 'paused' })}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                  config.status === 'paused' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'border-gray-200'
                }`}
              >
                ⏸️ Paused
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Trigger Configuration Modal
const TriggerConfigModal = ({ isOpen, onClose, onSave, initialConfig }: any) => {
  const [config, setConfig] = useState(initialConfig || {
    platform: '',
    contentType: '',
    interactionType: '',
    keywords: [],
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordError, setKeywordError] = useState('');

  if (!isOpen) return null;

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'from-pink-500 to-purple-600' },
    { id: 'facebook', name: 'Facebook', icon: '👍', color: 'from-blue-600 to-blue-700' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'from-green-500 to-green-600' },
  ];

  // Platform-specific content types
  const platformContentTypes: Record<string, any[]> = {
    instagram: [
      { id: 'post', name: 'Post', icon: '📝', desc: 'Regular Instagram posts' },
      { id: 'story', name: 'Story', icon: '📸', desc: '24-hour stories' },
      { id: 'reel', name: 'Reel', icon: '🎬', desc: 'Short-form videos' },
      { id: 'carousel', name: 'Carousel', icon: '🎠', desc: 'Multiple images/videos' },
      { id: 'live', name: 'Live', icon: '🔴', desc: 'Live broadcasts' },
      { id: 'ad', name: 'Ad', icon: '📢', desc: 'Sponsored content' },
    ],
    facebook: [
      { id: 'post', name: 'Post', icon: '📝', desc: 'Regular posts' },
      { id: 'video', name: 'Video', icon: '🎥', desc: 'Video posts' },
      { id: 'story', name: 'Story', icon: '📸', desc: '24-hour stories' },
      { id: 'reel', name: 'Reel', icon: '🎬', desc: 'Short-form videos' },
      { id: 'group', name: 'Group Post', icon: '👥', desc: 'Posts in groups' },
      { id: 'marketplace', name: 'Marketplace', icon: '🛒', desc: 'Product listings' },
      { id: 'ad', name: 'Ad', icon: '📢', desc: 'Sponsored content' },
    ],
    tiktok: [
      { id: 'video', name: 'Video', icon: '🎥', desc: 'Regular TikTok videos' },
      { id: 'duet', name: 'Duet', icon: '🎭', desc: 'Side-by-side videos' },
      { id: 'stitch', name: 'Stitch', icon: '✂️', desc: 'Video remixes' },
      { id: 'live', name: 'Live', icon: '🔴', desc: 'Live streams' },
    ],
    whatsapp: [
      { id: 'message', name: 'Message', icon: '💬', desc: 'Direct messages' },
      { id: 'broadcast', name: 'Broadcast', icon: '📡', desc: 'Bulk messages' },
      { id: 'template', name: 'Template', icon: '📋', desc: 'Pre-approved templates' },
    ],
  };

  // Platform-specific interaction types
  const platformInteractionTypes: Record<string, any[]> = {
    instagram: [
      { id: 'all', name: 'All Comments', icon: '💬', desc: 'Respond to all comments' },
      { id: 'organic', name: 'Organic Comments', icon: '🌱', desc: 'Non-ad comments only' },
      { id: 'ad', name: 'Ad Comments', icon: '📢', desc: 'Ad comments only' },
      { id: 'story_reply', name: 'Story Replies', icon: '💭', desc: 'Replies to stories' },
      { id: 'keyword', name: 'Specific Keywords', icon: '🔑', desc: 'Keyword-based triggers' },
    ],
    facebook: [
      { id: 'all', name: 'All Comments', icon: '💬', desc: 'Respond to all comments' },
      { id: 'page', name: 'Page Comments', icon: '📄', desc: 'Page comments only' },
      { id: 'group', name: 'Group Comments', icon: '👥', desc: 'Group comments only' },
      { id: 'ad', name: 'Ad Comments', icon: '📢', desc: 'Ad comments only' },
      { id: 'keyword', name: 'Specific Keywords', icon: '🔑', desc: 'Keyword-based triggers' },
    ],
    tiktok: [
      { id: 'all', name: 'All Comments', icon: '💬', desc: 'Respond to all comments' },
      { id: 'video', name: 'Video Comments', icon: '🎥', desc: 'Regular video comments' },
      { id: 'duet', name: 'Duet Comments', icon: '🎭', desc: 'Comments on duets' },
      { id: 'stitch', name: 'Stitch Comments', icon: '✂️', desc: 'Comments on stitches' },
      { id: 'keyword', name: 'Specific Keywords', icon: '🔑', desc: 'Keyword-based triggers' },
    ],
    whatsapp: [
      { id: 'individual', name: 'Individual Message', icon: '👤', desc: 'One-on-one messages' },
      { id: 'group', name: 'Group Message', icon: '👥', desc: 'Group messages' },
      { id: 'broadcast', name: 'Broadcast Reply', icon: '📡', desc: 'Replies to broadcasts' },
      { id: 'template', name: 'Template Response', icon: '📋', desc: 'Template message replies' },
      { id: 'button', name: 'Button Click', icon: '🔘', desc: 'Interactive button clicks' },
      { id: 'keyword', name: 'Specific Keywords', icon: '🔑', desc: 'Keyword-based triggers' },
    ],
  };

  const contentTypes = config.platform ? platformContentTypes[config.platform] || [] : [];
  const interactionTypes = config.platform ? platformInteractionTypes[config.platform] || [] : [];

  const addKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();

    if (!trimmed) {
      setKeywordError('Keyword cannot be empty');
      return;
    }

    if (trimmed.length < 2) {
      setKeywordError('Keyword must be at least 2 characters');
      return;
    }

    if (trimmed.length > 50) {
      setKeywordError('Keyword too long (max 50 characters)');
      return;
    }

    if (config.keywords.includes(trimmed)) {
      setKeywordError('Keyword already added');
      return;
    }

    if (config.keywords.length >= 20) {
      setKeywordError('Maximum 20 keywords allowed');
      return;
    }

    setConfig({ ...config, keywords: [...config.keywords, trimmed] });
    setKeywordInput('');
    setKeywordError('');
  };

  const removeKeyword = (keyword: string) => {
    setConfig({ ...config, keywords: config.keywords.filter((k: string) => k !== keyword) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Configure Trigger</h2>
              <p className="text-sm text-gray-500">Set up when this automation should run</p>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-4 text-gray-700">1. Select Platform</label>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setConfig({ platform: platform.id, contentType: '', interactionType: '', keywords: [] })}
                  className={`p-5 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    config.platform === platform.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-3">{platform.icon}</div>
                  <div className="font-semibold text-lg">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Selection */}
          {config.platform && contentTypes.length > 0 && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-4 text-gray-700">
                2. Choose Content Type
                <span className="ml-2 text-xs text-gray-500 font-normal">({contentTypes.length} types available)</span>
              </label>
              <div className={`grid ${contentTypes.length === 3 ? 'grid-cols-3' : contentTypes.length <= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3`}>
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, contentType: type.id, interactionType: '', keywords: [] })}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                      config.contentType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-semibold mb-1">{type.name}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interaction Type Selection */}
          {config.contentType && interactionTypes.length > 0 && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-4 text-gray-700">
                3. Choose Trigger Type
                <span className="ml-2 text-xs text-gray-500 font-normal">({interactionTypes.length} options)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interactionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, interactionType: type.id, keywords: type.id === 'keyword' ? config.keywords : [] })}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-102 ${
                      config.interactionType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{type.name}</div>
                        <div className="text-xs text-gray-500">{type.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Keywords Input */}
          {config.interactionType === 'keyword' && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-4 text-gray-700">4. Enter Trigger Keywords</label>
              <div className="space-y-4">
                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => {
                      setKeywordInput(e.target.value);
                      setKeywordError('');
                    }}
                    onKeyPress={handleKeyPress}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      keywordError ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-purple-500'
                    }`}
                    placeholder="e.g., buy, interested, price"
                  />
                  <Button
                    onClick={addKeyword}
                    type="button"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 px-6"
                  >
                    ➕ Add
                  </Button>
                </div>

                {/* Error Message */}
                {keywordError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    <span>⚠️</span>
                    <span>{keywordError}</span>
                  </div>
                )}

                {/* Keywords List */}
                {config.keywords.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 font-semibold">
                        {config.keywords.length} keyword{config.keywords.length !== 1 ? 's' : ''} added (max 20)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {config.keywords.map((keyword: string, idx: number) => (
                        <div
                          key={idx}
                          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-all"
                        >
                          <span className="font-semibold text-purple-700">🔑 {keyword}</span>
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                            title="Remove keyword"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  💡 Press Enter or click Add to include a keyword. Automation triggers when ANY keyword is found.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(config);
                onClose();
              }}
              disabled={!config.platform || !config.contentType || !config.interactionType}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-8"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Node Components with Quick Actions
const NodeWrapper = ({ children, id, onDuplicate, onDelete, onConfigure, selected }: any) => (
  <div className="relative group">
    {children}
    {selected && (
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button
          onClick={() => onConfigure(id)}
          className="px-3 py-1.5 hover:bg-purple-50 rounded text-xs font-semibold text-purple-600"
          title="Configure"
        >
          ⚙️ Config
        </button>
        <button
          onClick={() => onDuplicate(id)}
          className="px-3 py-1.5 hover:bg-blue-50 rounded text-xs font-semibold text-blue-600"
          title="Duplicate"
        >
          📋 Copy
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-3 py-1.5 hover:bg-red-50 rounded text-xs font-semibold text-red-600"
          title="Delete"
        >
          🗑️ Delete
        </button>
      </div>
    )}
  </div>
);

const TriggerNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-lg shadow-md border ${selected ? 'border-purple-500 shadow-lg' : 'border-gray-300'} transition-all w-[280px]`}>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500 border-2 border-white" />

    {/* Header */}
    <div className="bg-purple-500 px-3 py-2 rounded-t-lg flex items-center gap-2">
      <span className="text-lg">⚡</span>
      <div className="text-white flex-1">
        <div className="text-xs font-medium">Trigger</div>
        <div className="font-semibold text-sm">{data.config?.platform || 'Not Configured'}</div>
      </div>
    </div>

    {/* Body */}
    <div className="p-3">
      {data.config?.platform ? (
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Platform:</span>
            <span className="font-semibold capitalize text-gray-900">{data.config.platform}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Content:</span>
            <span className="font-semibold capitalize text-gray-900">{data.config.contentType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Trigger:</span>
            <span className="font-semibold capitalize text-gray-900">{data.config.interactionType?.replace('_', ' ')}</span>
          </div>
          {data.config.keywords && data.config.keywords.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-gray-600 mb-1">Keywords ({data.config.keywords.length}):</div>
              <div className="flex flex-wrap gap-1">
                {data.config.keywords.slice(0, 3).map((kw: string, idx: number) => (
                  <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    {kw}
                  </span>
                ))}
                {data.config.keywords.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    +{data.config.keywords.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-400 text-center py-2">Click to configure</div>
      )}
    </div>
  </div>
);

const ActionNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-lg shadow-md border ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'} transition-all w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white" />

    <div className="bg-blue-500 px-3 py-2 rounded-t-lg flex items-center gap-2">
      <span className="text-lg">{data.icon || '💬'}</span>
      <div className="text-white flex-1">
        <div className="text-xs font-medium">Action</div>
        <div className="font-semibold text-sm truncate">{data.label}</div>
      </div>
    </div>

    <div className="p-3">
      <div className="text-xs text-gray-600 mb-2">{data.description}</div>
      {data.messageTemplate && data.actionType !== 'send_voice_message' && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200">
          "{data.messageTemplate.substring(0, 60)}{data.messageTemplate.length > 60 ? '...' : ''}"
        </div>
      )}
      {data.actionType === 'send_voice_message' && data.voiceFile && (
        <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
          <div className="flex items-center gap-2 text-xs">
            <span>🎤</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-purple-700 truncate">{data.voiceFile}</div>
              <div className="text-purple-600 text-xs">{data.voiceSize || 'Audio file'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const AIAgentNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-lg shadow-md border ${selected ? 'border-indigo-500 shadow-lg' : 'border-gray-300'} transition-all w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500 border-2 border-white" />

    <div className="bg-indigo-500 px-3 py-2 rounded-t-lg flex items-center gap-2">
      <span className="text-lg">{data.icon || '🤖'}</span>
      <div className="text-white flex-1">
        <div className="text-xs font-medium">AI Agent</div>
        <div className="font-semibold text-sm truncate">{data.label}</div>
      </div>
    </div>

    <div className="p-3">
      <div className="text-xs text-gray-600 mb-2">{data.description}</div>
      {data.aiModel && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-gray-500">Model:</span>
          <span className="font-semibold bg-indigo-50 px-2 py-1 rounded text-indigo-700">{data.aiModel}</span>
        </div>
      )}
    </div>
  </div>
);

const ConditionNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-lg shadow-md border ${selected ? 'border-orange-500 shadow-lg' : 'border-gray-300'} transition-all w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500 border-2 border-white" id="yes" style={{ left: '35%' }} />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-red-500 border-2 border-white" id="no" style={{ left: '65%' }} />

    <div className="bg-orange-500 px-3 py-2 rounded-t-lg flex items-center gap-2">
      <span className="text-lg">❓</span>
      <div className="text-white flex-1">
        <div className="text-xs font-medium">Condition</div>
        <div className="font-semibold text-sm truncate">{data.label}</div>
      </div>
    </div>

    <div className="p-3">
      <div className="text-xs text-gray-600 mb-2">{data.description}</div>
      <div className="flex gap-2 mt-2">
        <div className="flex-1 px-2 py-1.5 bg-green-50 rounded text-center border border-green-300">
          <div className="text-green-700 font-semibold text-xs">✓ Yes</div>
        </div>
        <div className="flex-1 px-2 py-1.5 bg-red-50 rounded text-center border border-red-300">
          <div className="text-red-700 font-semibold text-xs">✗ No</div>
        </div>
      </div>
    </div>
  </div>
);

const DelayNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-lg shadow-md border ${selected ? 'border-cyan-500 shadow-lg' : 'border-gray-300'} transition-all w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-500 border-2 border-white" />

    <div className="bg-cyan-500 px-3 py-2 rounded-t-lg flex items-center gap-2">
      <span className="text-lg">⏰</span>
      <div className="text-white flex-1">
        <div className="text-xs font-medium">Delay</div>
        <div className="font-semibold text-sm truncate">{data.label}</div>
      </div>
    </div>

    <div className="p-3">
      <div className="text-xs text-gray-600 mb-2">{data.description}</div>
      <div className="mt-2 px-3 py-2 bg-cyan-50 rounded text-center border border-cyan-200">
        <div className="text-cyan-700 font-semibold text-sm">{data.duration || '5 minutes'}</div>
      </div>
    </div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  aiAgent: AIAgentNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function FlowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [isSaving, setIsSaving] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [configPanelNode, setConfigPanelNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [showProTips, setShowProTips] = useState(true);

  // Connection line style state
  const [connectionLineType, setConnectionLineType] = useState<ConnectionLineType>(ConnectionLineType.SmoothStep);

  // Connection validation - prevent invalid connections
  const isValidConnection = useCallback((connection: Connection | Edge) => {
    // Prevent self-connection
    if (connection.source === connection.target) {
      return false;
    }

    // Prevent duplicate connections
    const existingConnection = edges.find(
      edge => edge.source === connection.source && edge.target === connection.target
    );
    if (existingConnection) {
      return false;
    }

    // Get source and target nodes
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    // Trigger nodes can only connect to action, condition, or AI agent nodes
    if (sourceNode?.type === 'trigger') {
      return targetNode?.type === 'action' || targetNode?.type === 'aiAgent' || targetNode?.type === 'condition';
    }

    // Condition nodes must use specific handles (yes/no)
    if (sourceNode?.type === 'condition') {
      return connection.sourceHandle === 'yes' || connection.sourceHandle === 'no';
    }

    return true;
  }, [nodes, edges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Validate connection
      if (!isValidConnection(connection)) {
        console.warn('Invalid connection attempted');
        return;
      }

      const newEdge = {
        ...connection,
        type: connectionLineType,
        animated: true,
        style: { stroke: '#9333ea', strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#9333ea' },
        label: connection.sourceHandle === 'yes' ? '✓ YES' : connection.sourceHandle === 'no' ? '✗ NO' : '',
        labelStyle: { fill: '#fff', fontWeight: 700, fontSize: 12 },
        labelBgStyle: { fill: connection.sourceHandle === 'yes' ? '#22c55e' : connection.sourceHandle === 'no' ? '#ef4444' : '#9333ea', fillOpacity: 0.9 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 8,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, connectionLineType, isValidConnection]
  );

  // Auto-arrange function - ManyChat inspired
  const autoArrange = useCallback(() => {
    const nodesCopy = [...nodes];

    // Build adjacency list
    const adjacency = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodesCopy.forEach(node => {
      adjacency.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
      adjacency.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Topological sort to get layers
    const layers: string[][] = [];
    const queue: string[] = [];
    const visited = new Set<string>();

    // Start with nodes that have no incoming edges
    nodesCopy.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push(node.id);
      }
    });

    while (queue.length > 0) {
      const layerSize = queue.length;
      const currentLayer: string[] = [];

      for (let i = 0; i < layerSize; i++) {
        const nodeId = queue.shift()!;
        currentLayer.push(nodeId);
        visited.add(nodeId);

        adjacency.get(nodeId)?.forEach(neighbor => {
          const newDegree = (inDegree.get(neighbor) || 0) - 1;
          inDegree.set(neighbor, newDegree);
          if (newDegree === 0 && !visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }

      if (currentLayer.length > 0) {
        layers.push(currentLayer);
      }
    }

    // Add any disconnected nodes as a separate layer
    const disconnected = nodesCopy.filter(n => !visited.has(n.id)).map(n => n.id);
    if (disconnected.length > 0) {
      layers.push(disconnected);
    }

    // Position nodes
    const horizontalSpacing = 400;
    const verticalSpacing = 200;

    const arranged = nodesCopy.map(node => {
      let layerIndex = -1;
      let positionInLayer = -1;

      for (let i = 0; i < layers.length; i++) {
        const pos = layers[i].indexOf(node.id);
        if (pos !== -1) {
          layerIndex = i;
          positionInLayer = pos;
          break;
        }
      }

      if (layerIndex === -1) return node;

      const layerWidth = layers[layerIndex].length * horizontalSpacing;
      const startX = -layerWidth / 2 + horizontalSpacing / 2;

      return {
        ...node,
        position: {
          x: startX + positionInLayer * horizontalSpacing,
          y: layerIndex * verticalSpacing
        }
      };
    });

    setNodes(arranged);
  }, [nodes, edges, setNodes]);

  // Enhanced Block templates
  const blockTemplates = [
    {
      category: 'Triggers',
      color: 'purple',
      icon: '⚡',
      blocks: [
        { type: 'trigger', label: 'Comment Trigger', description: 'Respond to comments', icon: '💬', triggerType: 'comment', status: 'active' },
        { type: 'trigger', label: 'DM Trigger', description: 'Handle direct messages', icon: '📨', triggerType: 'message', status: 'active' },
        { type: 'trigger', label: 'Follower Trigger', description: 'New follower events', icon: '👤', triggerType: 'follower', status: 'active' },
        { type: 'trigger', label: 'Story Mention', description: 'Tagged in stories', icon: '📸', triggerType: 'story_mention', status: 'active' },
      ]
    },
    {
      category: 'AI Agents',
      color: 'indigo',
      icon: '🤖',
      blocks: [
        { type: 'aiAgent', label: 'GPT Response', description: 'AI-powered reply generation', icon: '🤖', agentType: 'gpt_response', aiModel: 'gpt-4', status: 'active' },
        { type: 'aiAgent', label: 'Sentiment Analysis', description: 'Detect emotion & tone', icon: '😊', agentType: 'sentiment', status: 'active' },
        { type: 'aiAgent', label: 'Language Detection', description: 'Identify language', icon: '🌍', agentType: 'language', status: 'active' },
        { type: 'aiAgent', label: 'Intent Classification', description: 'Understand user intent', icon: '🎯', agentType: 'intent', status: 'active' },
        { type: 'aiAgent', label: 'Custom AI Prompt', description: 'Your own AI logic', icon: '✨', agentType: 'custom_prompt', status: 'active' },
      ]
    },
    {
      category: 'Actions',
      color: 'blue',
      icon: '⚙️',
      blocks: [
        { type: 'action', label: 'Send Message', description: 'Send text message', icon: '📤', actionType: 'send_message', status: 'active' },
        { type: 'action', label: 'Send Voice Message', description: 'Auto-send voice note (60s)', icon: '🎤', actionType: 'send_voice_message', voiceDuration: '0s', status: 'active' },
        { type: 'action', label: 'Quick Replies', description: 'Send buttons (max 12)', icon: '🔘', actionType: 'quick_replies', quickReplies: ['Option 1', 'Option 2'], status: 'active' },
        { type: 'action', label: 'Reply Comment', description: 'Reply to comment', icon: '↩️', actionType: 'reply_comment', status: 'active' },
        { type: 'action', label: 'Auto-Reply', description: 'Send templated response', icon: '💬', actionType: 'auto_reply', status: 'active' },
        { type: 'action', label: 'Add Tag', description: 'Tag the user', icon: '🏷️', actionType: 'add_tag', status: 'active' },
        { type: 'action', label: 'Remove Tag', description: 'Remove user tag', icon: '🗑️', actionType: 'remove_tag', status: 'active' },
        { type: 'action', label: 'Subscribe', description: 'Add to sequence', icon: '➕', actionType: 'subscribe', status: 'active' },
        { type: 'action', label: 'Unsubscribe', description: 'Remove from sequence', icon: '➖', actionType: 'unsubscribe', status: 'active' },
        { type: 'action', label: 'Save to CRM', description: 'Store in database', icon: '💾', actionType: 'save_crm', status: 'active' },
        { type: 'action', label: 'Send Email', description: 'Email notification', icon: '📧', actionType: 'send_email', status: 'active' },
        { type: 'action', label: 'Start Flow', description: 'Trigger another automation', icon: '🔄', actionType: 'start_flow', status: 'active' },
        { type: 'action', label: 'Set Field', description: 'Update user data', icon: '📝', actionType: 'set_field', status: 'active' },
      ]
    },
    {
      category: 'Logic',
      color: 'amber',
      icon: '🔀',
      blocks: [
        { type: 'condition', label: 'If/Else', description: 'Conditional branching', icon: '❓', conditionType: 'if_else', status: 'active' },
        { type: 'condition', label: 'Contains Keyword', description: 'Check for keywords', icon: '🔍', conditionType: 'contains', status: 'active' },
        { type: 'condition', label: 'User Filter', description: 'Filter by user data', icon: '👥', conditionType: 'user_filter', status: 'active' },
        { type: 'delay', label: 'Wait', description: 'Add delay', icon: '⏰', delayType: 'wait', duration: '5 minutes', status: 'active' },
      ]
    }
  ];

  const filteredBlocks = blockTemplates.map(category => ({
    ...category,
    blocks: category.blocks.filter(block =>
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.blocks.length > 0);

  const addNode = (block: any) => {
    if (block.type === 'trigger') {
      setSelectedNode(block);
      setShowTriggerModal(true);
    } else {
      const newNode: Node = {
        id: `${Date.now()}`,
        type: block.type,
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 150
        },
        data: {
          label: block.label,
          description: block.description,
          ...block
        },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  };

  const saveTriggerConfig = (config: any) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: `${config.platform} ${config.contentType}`,
        config,
        status: 'active',
        ...selectedNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const deletedIds = deleted.map((d) => d.id);
      setNodes((nds) => nds.filter((node) => !deletedIds.includes(node.id)));
    },
    [setNodes]
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const deletedIds = deleted.map((d) => d.id);
      setEdges((eds) => eds.filter((edge) => !deletedIds.includes(edge.id)));
    },
    [setEdges]
  );

  const duplicateNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode = {
        ...node,
        id: `${Date.now()}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        data: { ...node.data, label: `${node.data.label} (Copy)` }
      };
      setNodes((nds) => [...nds, newNode]);
    }
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const configureNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      if (node.type === 'trigger') {
        setSelectedNode(node.data);
        setShowTriggerModal(true);
      } else {
        setConfigPanelNode(node);
        setShowConfigPanel(true);
      }
    }
  };

  const updateNodeConfig = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  const toggleSection = (category: string) => {
    setCollapsedSections(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Load existing flow data
  useEffect(() => {
    const loadFlow = async () => {
      if (params.id && params.id !== 'new') {
        try {
          const response = await api.get(`/api/v1/flows/${params.id}`);
          const flowData = response.data;

          if (flowData.name) {
            setFlowName(flowData.name);
          }

          if (flowData.nodes && Array.isArray(flowData.nodes)) {
            setNodes(flowData.nodes);
          }

          if (flowData.edges && Array.isArray(flowData.edges)) {
            setEdges(flowData.edges);
          }
        } catch (error) {
          console.error('Failed to load flow', error);
        }
      }
    };

    loadFlow();
  }, [params.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        const selectedEdges = edges.filter((edge) => edge.selected);

        if (selectedNodes.length > 0) {
          onNodesDelete(selectedNodes);
        }
        if (selectedEdges.length > 0) {
          onEdgesDelete(selectedEdges);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, onNodesDelete, onEdgesDelete]);

  const saveFlow = async () => {
    setIsSaving(true);
    try {
      const flowData = {
        name: flowName,
        nodes: (nodes as { id: string; type?: string; position: { x: number; y: number }; data: any }[]).map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: (edges as { id: string; source: string; target: string }[]).map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
        status: 'ACTIVE',
      };

      if (params.id === 'new') {
        await api.post('/api/v1/flows', flowData);
        alert('✅ Flow created successfully!');
      } else {
        await api.patch(`/api/v1/flows/${params.id}`, flowData);
        alert('✅ Flow updated successfully!');
      }

      router.push('/flows');
    } catch (error) {
      console.error('Failed to save flow', error);
      alert('❌ Failed to save flow');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TriggerConfigModal
        isOpen={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        onSave={saveTriggerConfig}
      />

      <NodeConfigPanel
        node={configPanelNode}
        isOpen={showConfigPanel}
        onClose={() => setShowConfigPanel(false)}
        onUpdate={updateNodeConfig}
      />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/flows')} className="gap-2 text-sm h-9">
            <span>←</span> Back
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="text-lg font-semibold border-none outline-none bg-transparent px-2 py-1 hover:bg-gray-50 rounded transition-colors"
            placeholder="Flow Name"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-sm h-9">
            <span>▶️</span> Test Flow
          </Button>
          <Button variant="outline" className="gap-2 text-sm h-9">
            <span>📊</span> Analytics
          </Button>
          <Button
            onClick={saveFlow}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 gap-2 text-sm h-9"
          >
            <span>💾</span> {isSaving ? 'Saving...' : 'Save Flow'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[320px] bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blocks..."
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:border-purple-500 outline-none transition-all text-sm"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <h3 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-700">
              <span>Blocks</span>
              <span className="ml-auto text-xs font-normal text-gray-500">{filteredBlocks.reduce((acc, cat) => acc + cat.blocks.length, 0)}</span>
            </h3>

            {filteredBlocks.map((category) => (
              <div key={category.category} className="mb-5">
                <button
                  onClick={() => toggleSection(category.category)}
                  className="flex items-center gap-2 mb-2 w-full hover:bg-gray-50 p-2 rounded transition-all"
                >
                  <span className="text-base">{category.icon}</span>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex-1 text-left">
                    {category.category}
                  </h4>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-medium text-gray-600">{category.blocks.length}</span>
                  <span className={`text-gray-400 text-xs transform transition-transform ${collapsedSections.includes(category.category) ? '' : 'rotate-90'}`}>
                    ▶
                  </span>
                </button>

                {!collapsedSections.includes(category.category) && (
                  <div className="space-y-2">
                    {category.blocks.map((block, idx) => (
                      <button
                        key={idx}
                        onClick={() => addNode(block)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/reactflow', JSON.stringify(block));
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all bg-white group cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-lg">{block.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900">{block.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{block.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            onNodeClick={(_, node) => configureNode(node.id)}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            connectionLineType={connectionLineType}
            fitView
            className="bg-white"
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
              type: connectionLineType,
              animated: true,
              style: { stroke: '#9333ea', strokeWidth: 2 },
            }}
          >
            <Background color="#f3f4f6" gap={16} size={1} />
            <Controls className="bg-white rounded-lg shadow-md border border-gray-200 m-4" />
            <MiniMap
              className="bg-white rounded-lg shadow-md border border-gray-200 m-4"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'trigger': return '#a855f7';
                  case 'action': return '#3b82f6';
                  case 'aiAgent': return '#6366f1';
                  case 'condition': return '#f97316';
                  case 'delay': return '#06b6d4';
                  default: return '#6b7280';
                }
              }}
            />
            <Panel position="top-right" className="flex flex-col gap-2 m-4">
              <div className="flex gap-2">
                <Button
                  onClick={autoArrange}
                  className="bg-purple-600 hover:bg-purple-700 shadow-md text-white font-medium px-3 py-2 rounded-lg text-sm h-9"
                  title="Auto-arrange nodes"
                >
                  <span className="mr-1">🎯</span>
                  Auto-Arrange
                </Button>
                <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>{nodes.length} Nodes</span>
                    <span className="text-gray-300">|</span>
                    <span>{edges.length} Edges</span>
                  </div>
                </div>
              </div>

              {/* Connection Line Style Selector */}
              <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Connection Style</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setConnectionLineType(ConnectionLineType.SmoothStep)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${connectionLineType === ConnectionLineType.SmoothStep ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Smooth
                  </button>
                  <button
                    onClick={() => setConnectionLineType(ConnectionLineType.Bezier)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${connectionLineType === ConnectionLineType.Bezier ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Curve
                  </button>
                  <button
                    onClick={() => setConnectionLineType(ConnectionLineType.Step)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${connectionLineType === ConnectionLineType.Step ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Step
                  </button>
                  <button
                    onClick={() => setConnectionLineType(ConnectionLineType.Straight)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${connectionLineType === ConnectionLineType.Straight ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Straight
                  </button>
                </div>
              </div>
            </Panel>
            {showProTips && (
              <Panel position="top-center" className="bg-purple-600 px-4 py-2 rounded-lg shadow-md border border-purple-700 m-4">
                <div className="text-xs text-white flex items-center gap-2">
                  <span>💡</span>
                  <div className="flex-1">
                    <span className="font-medium">Drag blocks • Click to configure • Auto-arrange for clean layout</span>
                  </div>
                  <button
                    onClick={() => setShowProTips(false)}
                    className="ml-2 w-5 h-5 flex items-center justify-center rounded hover:bg-purple-700 transition-all text-white"
                    title="Close tips"
                  >
                    ✕
                  </button>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
