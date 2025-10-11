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

// Custom Node Types
const TriggerNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-purple-500 bg-white min-w-[200px]">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
        ⚡
      </div>
      <div className="font-bold text-sm">TRIGGER</div>
    </div>
    <div className="text-xs text-gray-600">{data.label}</div>
    <div className="text-xs text-gray-400 mt-1">{data.description}</div>
  </div>
);

const ActionNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-500 bg-white min-w-[200px]">
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

const ConditionNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-yellow-500 bg-white min-w-[200px]">
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

const DelayNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-orange-500 bg-white min-w-[200px]">
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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: {
      label: 'New Comment',
      description: 'When someone comments on your post',
      triggerType: 'comment'
    },
  },
];

export default function FlowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Block templates
  const blockTemplates = [
    {
      category: 'Triggers',
      blocks: [
        { type: 'trigger', label: 'New Comment', description: 'When someone comments', icon: '💬', triggerType: 'comment' },
        { type: 'trigger', label: 'New Message', description: 'When someone sends DM', icon: '📨', triggerType: 'message' },
        { type: 'trigger', label: 'New Follower', description: 'When you get a follower', icon: '👤', triggerType: 'follower' },
        { type: 'trigger', label: 'Keyword', description: 'When keyword is mentioned', icon: '🔑', triggerType: 'keyword' },
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
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: block.type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 200 },
      data: {
        label: block.label,
        description: block.description,
        ...block
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

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
        edges: edges.map((edge: Edge) => ({
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
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Background color="#ddd" gap={16} />
            <Controls />
            <MiniMap />
            <Panel position="top-center" className="bg-white px-4 py-2 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Drag blocks from the left panel onto the canvas, then connect them
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
