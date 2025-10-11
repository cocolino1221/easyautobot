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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  className={`p-5 rounded-xl border-2 transition-all ${
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
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-sm">{type.name}</div>
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
                    className={`p-4 rounded-xl border-2 transition-all ${
                      config.commentType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="font-semibold text-sm text-left">{type.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Input */}
          {config.commentType === 'keyword' && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-semibold mb-3 text-gray-700">4. Enter Keyword</label>
              <input
                type="text"
                value={config.keyword}
                onChange={(e) => setConfig({ ...config, keyword: e.target.value })}
                placeholder="e.g., 'price', 'info', 'details'"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

// Modern Node Components - ManyChat/n8n Style
const TriggerNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-purple-500 shadow-xl' : 'border-gray-200'} transition-all min-w-[280px]`}>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500 border-2 border-white" />

    {/* Header */}
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <div className="text-white">
          <div className="text-xs font-medium opacity-90">TRIGGER</div>
          <div className="font-bold text-sm">{data.config?.platform || 'Not Configured'}</div>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-4">
      {data.config?.platform ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Platform:</span>
            <span className="font-semibold capitalize">{data.config.platform}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Content:</span>
            <span className="font-semibold capitalize">{data.config.contentType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Type:</span>
            <span className="font-semibold capitalize">{data.config.commentType}</span>
          </div>
          {data.config.keyword && (
            <div className="mt-3 px-3 py-2 bg-purple-50 rounded-lg">
              <div className="text-xs text-purple-600 font-semibold">🔑 Keyword: "{data.config.keyword}"</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-400 text-center py-2">Click to configure</div>
      )}
    </div>
  </div>
);

const ActionNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-blue-500 shadow-xl' : 'border-gray-200'} transition-all min-w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white" />

    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <span className="text-2xl">{data.icon || '💬'}</span>
        </div>
        <div className="text-white">
          <div className="text-xs font-medium opacity-90">ACTION</div>
          <div className="font-bold text-sm">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600">{data.description}</div>
      {data.actionType && (
        <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700 font-medium">
          Type: {data.actionType.replace('_', ' ')}
        </div>
      )}
    </div>
  </div>
);

const AIAgentNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-indigo-500 shadow-xl' : 'border-gray-200'} transition-all min-w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500 border-2 border-white" />

    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <span className="text-2xl">{data.icon || '🤖'}</span>
        </div>
        <div className="text-white">
          <div className="text-xs font-medium opacity-90">AI AGENT</div>
          <div className="font-bold text-sm">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600">{data.description}</div>
      {data.agentType && (
        <div className="mt-3 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div className="text-xs text-indigo-700 font-semibold">✨ {data.agentType.replace('_', ' ')}</div>
        </div>
      )}
    </div>
  </div>
);

const ConditionNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-amber-500 shadow-xl' : 'border-gray-200'} transition-all min-w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-amber-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500 border-2 border-white" id="yes" style={{ left: '30%' }} />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-red-500 border-2 border-white" id="no" style={{ left: '70%' }} />

    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <span className="text-2xl">❓</span>
        </div>
        <div className="text-white">
          <div className="text-xs font-medium opacity-90">CONDITION</div>
          <div className="font-bold text-sm">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600 mb-3">{data.description}</div>
      <div className="flex gap-2">
        <div className="flex-1 px-2 py-1 bg-green-50 rounded text-xs text-green-700 font-semibold text-center">✓ YES</div>
        <div className="flex-1 px-2 py-1 bg-red-50 rounded text-xs text-red-700 font-semibold text-center">✗ NO</div>
      </div>
    </div>
  </div>
);

const DelayNode = ({ id, data, selected }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${selected ? 'border-orange-500 shadow-xl' : 'border-gray-200'} transition-all min-w-[280px]`}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-500 border-2 border-white" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-500 border-2 border-white" />

    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <span className="text-2xl">⏰</span>
        </div>
        <div className="text-white">
          <div className="text-xs font-medium opacity-90">DELAY</div>
          <div className="font-bold text-sm">{data.label}</div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="text-sm text-gray-600">{data.description}</div>
      <div className="mt-3 px-3 py-2 bg-orange-50 rounded-lg text-xs text-orange-700 font-semibold">
        ⏱️ Wait: {data.duration || '5 minutes'}
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

export default function FlowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [isSaving, setIsSaving] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Enhanced Block templates with AI Agents
  const blockTemplates = [
    {
      category: 'Triggers',
      color: 'purple',
      blocks: [
        { type: 'trigger', label: 'Comment Trigger', description: 'Respond to comments', icon: '💬', triggerType: 'comment' },
        { type: 'trigger', label: 'DM Trigger', description: 'Handle direct messages', icon: '📨', triggerType: 'message' },
        { type: 'trigger', label: 'Follower Trigger', description: 'New follower events', icon: '👤', triggerType: 'follower' },
        { type: 'trigger', label: 'Story Mention', description: 'Tagged in stories', icon: '📸', triggerType: 'story_mention' },
      ]
    },
    {
      category: 'AI Agents',
      color: 'indigo',
      blocks: [
        { type: 'aiAgent', label: 'GPT Response', description: 'AI-powered reply generation', icon: '🤖', agentType: 'gpt_response' },
        { type: 'aiAgent', label: 'Sentiment Analysis', description: 'Detect emotion & tone', icon: '😊', agentType: 'sentiment' },
        { type: 'aiAgent', label: 'Language Detection', description: 'Identify language', icon: '🌍', agentType: 'language' },
        { type: 'aiAgent', label: 'Intent Classification', description: 'Understand user intent', icon: '🎯', agentType: 'intent' },
        { type: 'aiAgent', label: 'Custom AI Prompt', description: 'Your own AI logic', icon: '✨', agentType: 'custom_prompt' },
      ]
    },
    {
      category: 'Actions',
      color: 'blue',
      blocks: [
        { type: 'action', label: 'Send DM', description: 'Send direct message', icon: '📤', actionType: 'send_message' },
        { type: 'action', label: 'Reply Comment', description: 'Reply to comment', icon: '↩️', actionType: 'reply_comment' },
        { type: 'action', label: 'Auto-Reply', description: 'Send templated response', icon: '💬', actionType: 'auto_reply' },
        { type: 'action', label: 'Add Tag', description: 'Tag the user', icon: '🏷️', actionType: 'add_tag' },
        { type: 'action', label: 'Save to CRM', description: 'Store in database', icon: '💾', actionType: 'save_crm' },
        { type: 'action', label: 'Send Email', description: 'Email notification', icon: '📧', actionType: 'send_email' },
      ]
    },
    {
      category: 'Logic',
      color: 'amber',
      blocks: [
        { type: 'condition', label: 'If/Else', description: 'Conditional branching', icon: '❓', conditionType: 'if_else' },
        { type: 'condition', label: 'Contains Keyword', description: 'Check for keywords', icon: '🔍', conditionType: 'contains' },
        { type: 'condition', label: 'User Filter', description: 'Filter by user data', icon: '👥', conditionType: 'user_filter' },
        { type: 'delay', label: 'Wait', description: 'Add delay', icon: '⏰', delayType: 'wait', duration: '5 minutes' },
      ]
    }
  ];

  const addNode = (block: any) => {
    if (block.type === 'trigger') {
      setSelectedNode(block);
      setShowTriggerModal(true);
    } else {
      const newNode: Node = {
        id: `${Date.now()}`,
        type: block.type,
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 200 },
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
        ...selectedNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setNodes((nds) => nds.filter((node) => !deleted.find((d) => d.id === node.id)));
    },
    [setNodes]
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      setEdges((eds) => eds.filter((edge) => !deleted.find((d) => d.id === edge.id)));
    },
    [setEdges]
  );

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
        nodes: nodes.map(node => ({
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TriggerConfigModal
        isOpen={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        onSave={saveTriggerConfig}
      />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/flows')} className="gap-2">
            <span>←</span> Back to Flows
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="text-xl font-bold border-none outline-none bg-transparent px-2 py-1 hover:bg-gray-50 rounded"
            placeholder="Flow Name"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <span>▶️</span> Test
          </Button>
          <Button
            onClick={saveFlow}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
          >
            <span>💾</span> {isSaving ? 'Saving...' : 'Save Flow'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Block Palette */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              <span>Automation Blocks</span>
            </h3>

            {blockTemplates.map((category) => (
              <div key={category.category} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1 h-4 bg-${category.color}-500 rounded-full`} />
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {category.category}
                  </h4>
                </div>
                <div className="space-y-2">
                  {category.blocks.map((block, idx) => (
                    <button
                      key={idx}
                      onClick={() => addNode(block)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all bg-white group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl group-hover:scale-110 transition-transform">{block.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900">{block.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{block.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
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
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-gray-50 to-gray-100"
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#9333ea', strokeWidth: 2 },
            }}
          >
            <Background color="#e5e7eb" gap={20} size={1} />
            <Controls className="bg-white rounded-xl shadow-lg border-2 border-gray-200" />
            <MiniMap className="bg-white rounded-xl shadow-lg border-2 border-gray-200" />
            <Panel position="top-center" className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-lg border-2 border-gray-200">
              <div className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-xl">💡</span>
                <strong>Tip:</strong> Drag blocks • Click trigger to configure • Connect with arrows • Press Delete to remove
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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
