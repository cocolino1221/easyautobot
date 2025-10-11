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
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'facebook', name: 'Facebook', icon: '👍' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">⚡ Configure Trigger</h2>

          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Select Platform</label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setConfig({ ...config, platform: platform.id })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    config.platform === platform.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{platform.icon}</div>
                  <div className="font-semibold">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Selection */}
          {config.platform && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Content Type</label>
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, contentType: type.id })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      config.contentType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="font-semibold text-sm">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comment Type Selection */}
          {config.contentType && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Comment Type</label>
              <div className="grid grid-cols-2 gap-3">
                {commentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, commentType: type.id })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      config.commentType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="font-semibold text-xs">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Input */}
          {config.commentType === 'keyword' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Keyword to Trigger</label>
              <input
                type="text"
                value={config.keyword}
                onChange={(e) => setConfig({ ...config, keyword: e.target.value })}
                placeholder="Enter keyword (e.g., 'price', 'info')"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(config);
                onClose();
              }}
              disabled={!config.platform || !config.contentType || !config.commentType}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Node Types with Delete Button
const TriggerNode = ({ id, data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? 'border-purple-600' : 'border-purple-500'} bg-white min-w-[220px]`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
          ⚡
        </div>
        <div className="font-bold text-sm">TRIGGER</div>
      </div>
    </div>
    <div className="text-xs font-semibold text-gray-700">{data.label}</div>
    {data.config?.platform && (
      <div className="mt-2 space-y-1">
        <div className="text-xs text-gray-600">📱 {data.config.platform}</div>
        <div className="text-xs text-gray-600">📝 {data.config.contentType}</div>
        <div className="text-xs text-gray-600">💬 {data.config.commentType}</div>
        {data.config.keyword && (
          <div className="text-xs text-purple-600 font-semibold">🔑 "{data.config.keyword}"</div>
        )}
      </div>
    )}
  </div>
);

const ActionNode = ({ id, data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? 'border-blue-600' : 'border-blue-500'} bg-white min-w-[200px]`}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
        💬
      </div>
      <div className="font-bold text-sm">ACTION</div>
    </div>
    <div className="text-xs text-gray-600">{data.label}</div>
    <div className="text-xs text-gray-400 mt-1">{data.description}</div>
  </div>
);

const ConditionNode = ({ id, data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? 'border-yellow-600' : 'border-yellow-500'} bg-white min-w-[200px]`}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
        ❓
      </div>
      <div className="font-bold text-sm">CONDITION</div>
    </div>
    <div className="text-xs text-gray-600">{data.label}</div>
    <div className="text-xs text-gray-400 mt-1">{data.description}</div>
  </div>
);

const DelayNode = ({ id, data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? 'border-orange-600' : 'border-orange-500'} bg-white min-w-[200px]`}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
        ⏰
      </div>
      <div className="font-bold text-sm">DELAY</div>
    </div>
    <div className="text-xs text-gray-600">{data.label}</div>
    <div className="text-xs text-gray-400 mt-1">{data.description}</div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
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

  // Block templates
  const blockTemplates = [
    {
      category: 'Triggers',
      blocks: [
        { type: 'trigger', label: 'Comment Trigger', description: 'Configure comment trigger', icon: '💬', triggerType: 'comment' },
        { type: 'trigger', label: 'DM Trigger', description: 'When someone sends DM', icon: '📨', triggerType: 'message' },
        { type: 'trigger', label: 'Follower Trigger', description: 'New follower trigger', icon: '👤', triggerType: 'follower' },
      ]
    },
    {
      category: 'Actions',
      blocks: [
        { type: 'action', label: 'Send Message', description: 'Send a DM to user', icon: '📤', actionType: 'send_message' },
        { type: 'action', label: 'Reply to Comment', description: 'Reply to the comment', icon: '↩️', actionType: 'reply_comment' },
        { type: 'action', label: 'Send Auto-Reply', description: 'Auto-respond with text', icon: '🤖', actionType: 'auto_reply' },
        { type: 'action', label: 'Add Tag', description: 'Tag the user', icon: '🏷️', actionType: 'add_tag' },
      ]
    },
    {
      category: 'Logic',
      blocks: [
        { type: 'condition', label: 'If/Else', description: 'Check a condition', icon: '❓', conditionType: 'if_else' },
        { type: 'condition', label: 'Contains Keyword', description: 'If text contains word', icon: '🔍', conditionType: 'contains' },
        { type: 'delay', label: 'Wait', description: 'Wait before next step', icon: '⏰', delayType: 'wait' },
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
        label: `${config.platform} ${config.contentType} - ${config.commentType}`,
        config,
        ...selectedNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Delete selected nodes
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setNodes((nds) => nds.filter((node) => !deleted.find((d) => d.id === node.id)));
    },
    [setNodes]
  );

  // Delete selected edges
  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      setEdges((eds) => eds.filter((edge) => !deleted.find((d) => d.id === edge.id)));
    },
    [setEdges]
  );

  // Handle keyboard delete
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
    <div className="h-screen flex flex-col bg-gray-50">
      <TriggerConfigModal
        isOpen={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        onSave={saveTriggerConfig}
      />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/flows')}>
            ← Back
          </Button>
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="text-xl font-bold border-none outline-none bg-transparent"
            placeholder="Flow Name"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Test Flow</Button>
          <Button
            onClick={saveFlow}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSaving ? 'Saving...' : '💾 Save Flow'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Block Palette */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Automation Blocks</h3>

            {blockTemplates.map((category) => (
              <div key={category.category} className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.blocks.map((block, idx) => (
                    <button
                      key={idx}
                      onClick={() => addNode(block)}
                      className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{block.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{block.label}</div>
                          <div className="text-xs text-gray-500">{block.description}</div>
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
            className="bg-gray-50"
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Background color="#ddd" gap={16} />
            <Controls />
            <MiniMap />
            <Panel position="top-center" className="bg-white px-4 py-2 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Click trigger to configure • Connect blocks • Press Delete to remove
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
