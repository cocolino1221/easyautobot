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
    commentType: '',
    keyword: '',
  });

  if (!isOpen) return null;

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'from-pink-500 to-purple-600' },
    { id: 'facebook', name: 'Facebook', icon: '👍', color: 'from-blue-600 to-blue-700' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'from-green-500 to-green-600' },
  ];

  const contentTypes = [
    { id: 'post', name: 'Post', icon: '📝' },
    { id: 'story', name: 'Story', icon: '📸' },
    { id: 'reel', name: 'Reel', icon: '🎬' },
    { id: 'ad', name: 'Ad', icon: '📢' },
  ];

  const commentTypes = [
    { id: 'all', name: 'All Comments', icon: '💬' },
    { id: 'organic', name: 'Organic Only', icon: '🌱' },
    { id: 'ad', name: 'Ad Comments Only', icon: '📢' },
    { id: 'keyword', name: 'Specific Keyword', icon: '🔑' },
  ];

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
                  onClick={() => setConfig({ ...config, platform: platform.id })}
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
          {config.platform && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-4 text-gray-700">2. Choose Content Type</label>
              <div className="grid grid-cols-4 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, contentType: type.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      config.contentType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-semibold">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comment Type Selection */}
          {config.contentType && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-4 text-gray-700">3. Filter Comments</label>
              <div className="grid grid-cols-2 gap-3">
                {commentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, commentType: type.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      config.commentType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-semibold">{type.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Input */}
          {config.commentType === 'keyword' && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-4 text-gray-700">4. Enter Keyword</label>
              <input
                type="text"
                value={config.keyword}
                onChange={(e) => setConfig({ ...config, keyword: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                placeholder="e.g., buy, interested, price"
              />
              <p className="text-xs text-gray-500 mt-2">Enter the word that should trigger this automation</p>
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
              disabled={!config.platform || !config.contentType || !config.commentType}
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
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-purple-500 shadow-2xl ring-4 ring-purple-200' : 'border-gray-200 hover:shadow-xl'} transition-all min-w-[300px] transform hover:scale-105`}>
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-purple-500 border-2 border-white shadow-lg" />

    {/* Status Badge */}
    <div className="absolute -top-2 -right-2 z-10">
      <div className={`px-2 py-1 rounded-full text-xs font-bold ${data.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} text-white shadow-lg`}>
        {data.status === 'active' ? '● Active' : '○ Paused'}
      </div>
    </div>

    {/* Header */}
    <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-3xl">⚡</span>
        </div>
        <div className="text-white flex-1">
          <div className="text-xs font-bold opacity-90 tracking-wider">TRIGGER</div>
          <div className="font-bold text-base">{data.config?.platform || 'Not Configured'}</div>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-4">
      {data.config?.platform ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Platform:</span>
            <span className="font-bold capitalize bg-purple-100 px-3 py-1 rounded-full text-purple-700">{data.config.platform}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Content:</span>
            <span className="font-bold capitalize bg-blue-100 px-3 py-1 rounded-full text-blue-700">{data.config.contentType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Type:</span>
            <span className="font-bold capitalize bg-green-100 px-3 py-1 rounded-full text-green-700">{data.config.commentType}</span>
          </div>
          {data.config.keyword && (
            <div className="mt-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="text-xs text-purple-700 font-bold">🔑 Keyword: "{data.config.keyword}"</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-400 text-center py-3 font-medium">Click to configure trigger</div>
      )}
    </div>
  </div>
);

const ActionNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-blue-500 shadow-2xl ring-4 ring-blue-200' : 'border-gray-200 hover:shadow-xl'} transition-all min-w-[300px] transform hover:scale-105`}>
    <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-500 border-2 border-white shadow-lg" />
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-blue-500 border-2 border-white shadow-lg" />

    <div className="absolute -top-2 -right-2 z-10">
      <div className={`px-2 py-1 rounded-full text-xs font-bold ${data.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} text-white shadow-lg`}>
        {data.status === 'active' ? '● Active' : '○ Paused'}
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-3xl">{data.icon || '💬'}</span>
        </div>
        <div className="text-white flex-1">
          <div className="text-xs font-bold opacity-90 tracking-wider">ACTION</div>
          <div className="font-bold text-base">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600 mb-3">{data.description}</div>
      {data.actionType && (
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg text-xs text-blue-700 font-bold border-2 border-blue-200">
          Type: {data.actionType.replace('_', ' ').toUpperCase()}
        </div>
      )}
      {data.messageTemplate && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 italic border border-gray-200">
          "{data.messageTemplate.substring(0, 50)}{data.messageTemplate.length > 50 ? '...' : ''}"
        </div>
      )}
    </div>
  </div>
);

const AIAgentNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-200' : 'border-gray-200 hover:shadow-xl'} transition-all min-w-[300px] transform hover:scale-105`}>
    <Handle type="target" position={Position.Top} className="w-4 h-4 bg-indigo-500 border-2 border-white shadow-lg" />
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-indigo-500 border-2 border-white shadow-lg" />

    <div className="absolute -top-2 -right-2 z-10">
      <div className={`px-2 py-1 rounded-full text-xs font-bold ${data.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} text-white shadow-lg`}>
        {data.status === 'active' ? '● Active' : '○ Paused'}
      </div>
    </div>

    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-3xl">{data.icon || '🤖'}</span>
        </div>
        <div className="text-white flex-1">
          <div className="text-xs font-bold opacity-90 tracking-wider">AI AGENT</div>
          <div className="font-bold text-base">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600 mb-3">{data.description}</div>
      {data.agentType && (
        <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border-2 border-indigo-200">
          <div className="text-xs text-indigo-700 font-bold">✨ {data.agentType.replace('_', ' ').toUpperCase()}</div>
        </div>
      )}
      {data.aiModel && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Model:</span>
          <span className="text-xs font-bold bg-indigo-100 px-2 py-1 rounded text-indigo-700">{data.aiModel}</span>
        </div>
      )}
    </div>
  </div>
);

const ConditionNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-amber-500 shadow-2xl ring-4 ring-amber-200' : 'border-gray-200 hover:shadow-xl'} transition-all min-w-[300px] transform hover:scale-105`}>
    <Handle type="target" position={Position.Top} className="w-4 h-4 bg-amber-500 border-2 border-white shadow-lg" />
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-green-500 border-2 border-white shadow-lg" id="yes" style={{ left: '30%' }} />
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-red-500 border-2 border-white shadow-lg" id="no" style={{ left: '70%' }} />

    <div className="absolute -top-2 -right-2 z-10">
      <div className={`px-2 py-1 rounded-full text-xs font-bold ${data.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} text-white shadow-lg`}>
        {data.status === 'active' ? '● Active' : '○ Paused'}
      </div>
    </div>

    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-3xl">❓</span>
        </div>
        <div className="text-white flex-1">
          <div className="text-xs font-bold opacity-90 tracking-wider">CONDITION</div>
          <div className="font-bold text-base">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600 mb-3">{data.description}</div>
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 bg-green-50 rounded-lg text-center border-2 border-green-300">
          <div className="text-green-700 font-bold text-xs">✓ YES</div>
        </div>
        <div className="flex-1 px-3 py-2 bg-red-50 rounded-lg text-center border-2 border-red-300">
          <div className="text-red-700 font-bold text-xs">✗ NO</div>
        </div>
      </div>
      {data.conditionType && (
        <div className="mt-3 px-4 py-2 bg-amber-50 rounded-lg text-xs text-amber-700 font-bold border-2 border-amber-200">
          Type: {data.conditionType.replace('_', ' ').toUpperCase()}
        </div>
      )}
    </div>
  </div>
);

const DelayNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-200' : 'border-gray-200 hover:shadow-xl'} transition-all min-w-[280px] transform hover:scale-105`}>
    <Handle type="target" position={Position.Top} className="w-4 h-4 bg-indigo-500 border-2 border-white shadow-lg" />
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-indigo-500 border-2 border-white shadow-lg" />

    <div className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-3xl">⏰</span>
        </div>
        <div className="text-white flex-1">
          <div className="text-xs font-bold opacity-90 tracking-wider">DELAY</div>
          <div className="font-bold text-base">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600">{data.description}</div>
      <div className="mt-3 px-4 py-2 bg-indigo-50 rounded-lg text-center border-2 border-indigo-200">
        <div className="text-indigo-700 font-bold">{data.duration || '5 minutes'}</div>
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

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        type: 'smoothstep',
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
    [setEdges]
  );

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
        { type: 'action', label: 'Send DM', description: 'Send direct message', icon: '📤', actionType: 'send_message', status: 'active' },
        { type: 'action', label: 'Reply Comment', description: 'Reply to comment', icon: '↩️', actionType: 'reply_comment', status: 'active' },
        { type: 'action', label: 'Auto-Reply', description: 'Send templated response', icon: '💬', actionType: 'auto_reply', status: 'active' },
        { type: 'action', label: 'Add Tag', description: 'Tag the user', icon: '🏷️', actionType: 'add_tag', status: 'active' },
        { type: 'action', label: 'Save to CRM', description: 'Store in database', icon: '💾', actionType: 'save_crm', status: 'active' },
        { type: 'action', label: 'Send Email', description: 'Email notification', icon: '📧', actionType: 'send_email', status: 'active' },
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/flows')} className="gap-2 font-semibold">
            <span>←</span> Back
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="text-xl font-bold border-none outline-none bg-transparent px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            placeholder="Flow Name"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 font-semibold">
            <span>▶️</span> Test Flow
          </Button>
          <Button variant="outline" className="gap-2 font-semibold">
            <span>📊</span> Analytics
          </Button>
          <Button
            onClick={saveFlow}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span>💾</span> {isSaving ? 'Saving...' : 'Save Flow'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Sidebar */}
        <div className="w-[420px] bg-white border-r-2 border-gray-200 overflow-y-auto shadow-xl">
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search blocks..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
              </div>
            </div>

            <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
              <span className="text-3xl">🧩</span>
              <span>Blocks</span>
              <span className="ml-auto text-sm font-normal text-gray-500">{filteredBlocks.reduce((acc, cat) => acc + cat.blocks.length, 0)} blocks</span>
            </h3>

            {filteredBlocks.map((category) => (
              <div key={category.category} className="mb-8">
                <button
                  onClick={() => toggleSection(category.category)}
                  className="flex items-center gap-3 mb-4 w-full hover:bg-gray-50 p-2 rounded-lg transition-all"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex-1 text-left">
                    {category.category}
                  </h4>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-bold">{category.blocks.length}</span>
                  <span className={`text-gray-400 transform transition-transform ${collapsedSections.includes(category.category) ? '' : 'rotate-90'}`}>
                    ▶
                  </span>
                </button>

                {!collapsedSections.includes(category.category) && (
                  <div className="space-y-3 pl-2">
                    {category.blocks.map((block, idx) => (
                      <button
                        key={idx}
                        onClick={() => addNode(block)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/reactflow', JSON.stringify(block));
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50 group cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{block.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-gray-900 mb-1">{block.label}</div>
                            <div className="text-xs text-gray-500 leading-relaxed">{block.description}</div>
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
            fitView
            className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#9333ea', strokeWidth: 3 },
            }}
          >
            <Background color="#e5e7eb" gap={24} size={2} />
            <Controls className="bg-white rounded-xl shadow-xl border-2 border-gray-200 m-4" />
            <MiniMap
              className="bg-white rounded-xl shadow-xl border-2 border-gray-200 m-4"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'trigger': return '#a855f7';
                  case 'action': return '#3b82f6';
                  case 'aiAgent': return '#6366f1';
                  case 'condition': return '#f59e0b';
                  default: return '#6b7280';
                }
              }}
            />
            <Panel position="top-right" className="flex gap-2 m-4">
              <div className="bg-white/95 backdrop-blur-lg px-4 py-3 rounded-xl shadow-lg border-2 border-gray-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>{nodes.length} Nodes</span>
                  <span className="mx-2">|</span>
                  <span>{edges.length} Connections</span>
                </div>
              </div>
            </Panel>
            <Panel position="top-center" className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-lg px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/20 m-4">
              <div className="text-sm text-white flex items-center gap-3 font-semibold">
                <span className="text-2xl animate-pulse">💡</span>
                <div>
                  <strong className="block">Pro Tips:</strong>
                  <span className="text-xs opacity-90">Drag blocks from sidebar • Click nodes to configure • Connect with handles • Delete with Backspace</span>
                </div>
              </div>
            </Panel>
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
