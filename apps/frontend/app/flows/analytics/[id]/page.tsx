'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface NodeStats {
  nodeId: string;
  triggered: number;
  completed: number;
  dropoffRate: number;
  avgTimeSpent: number; // in seconds
}

interface FlowAnalytics {
  flowId: string;
  flowName: string;
  totalExecutions: number;
  completionRate: number;
  avgCompletionTime: number;
  nodeStats: NodeStats[];
  dateRange: { start: string; end: string };
}

export default function FlowAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const flowId = params.id as string;

  const [analytics, setAnalytics] = useState<FlowAnalytics | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatMapMode, setHeatMapMode] = useState<'triggered' | 'dropoff' | 'time'>('triggered');

  useEffect(() => {
    fetchFlowAnalytics();
  }, [flowId]);

  const fetchFlowAnalytics = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockAnalytics: FlowAnalytics = {
        flowId,
        flowName: 'Welcome Sequence',
        totalExecutions: 1245,
        completionRate: 78.5,
        avgCompletionTime: 145, // seconds
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        },
        nodeStats: [
          { nodeId: 'trigger-1', triggered: 1245, completed: 1245, dropoffRate: 0, avgTimeSpent: 0 },
          { nodeId: 'action-1', triggered: 1245, completed: 1198, dropoffRate: 3.8, avgTimeSpent: 12 },
          { nodeId: 'action-2', triggered: 1198, completed: 1087, dropoffRate: 9.3, avgTimeSpent: 45 },
          { nodeId: 'condition-1', triggered: 1087, completed: 1087, dropoffRate: 0, avgTimeSpent: 2 },
          { nodeId: 'action-3', triggered: 789, completed: 756, dropoffRate: 4.2, avgTimeSpent: 28 },
          { nodeId: 'action-4', triggered: 298, completed: 221, dropoffRate: 25.8, avgTimeSpent: 67 },
          { nodeId: 'delay-1', triggered: 756, completed: 756, dropoffRate: 0, avgTimeSpent: 3600 },
          { nodeId: 'action-5', triggered: 756, completed: 689, dropoffRate: 8.9, avgTimeSpent: 34 },
        ],
      };

      // Mock flow structure
      const mockNodes: Node[] = [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 400, y: 50 },
          data: { label: 'DM Trigger', triggerType: 'dm' },
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 400, y: 180 },
          data: { label: 'Send Welcome', actionType: 'text' },
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 400, y: 310 },
          data: { label: 'Send Product Info', actionType: 'text' },
        },
        {
          id: 'condition-1',
          type: 'condition',
          position: { x: 400, y: 440 },
          data: { label: 'Interested?', conditionType: 'text_contains' },
        },
        {
          id: 'action-3',
          type: 'action',
          position: { x: 150, y: 600 },
          data: { label: 'Send Discount', actionType: 'text' },
        },
        {
          id: 'delay-1',
          type: 'delay',
          position: { x: 150, y: 730 },
          data: { label: 'Wait 1 hour', duration: 3600 },
        },
        {
          id: 'action-5',
          type: 'action',
          position: { x: 150, y: 860 },
          data: { label: 'Follow Up', actionType: 'text' },
        },
        {
          id: 'action-4',
          type: 'action',
          position: { x: 650, y: 600 },
          data: { label: 'Send FAQ', actionType: 'text' },
        },
      ];

      const mockEdges: Edge[] = [
        { id: 'e-trigger-action1', source: 'trigger-1', target: 'action-1' },
        { id: 'e-action1-action2', source: 'action-1', target: 'action-2' },
        { id: 'e-action2-condition', source: 'action-2', target: 'condition-1' },
        { id: 'e-condition-yes', source: 'condition-1', target: 'action-3', label: '✓ Yes' },
        { id: 'e-action3-delay', source: 'action-3', target: 'delay-1' },
        { id: 'e-delay-action5', source: 'delay-1', target: 'action-5' },
        { id: 'e-condition-no', source: 'condition-1', target: 'action-4', label: '✗ No' },
      ];

      setAnalytics(mockAnalytics);
      setNodes(mockNodes);
      setEdges(mockEdges);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const getNodeStats = (nodeId: string): NodeStats | undefined => {
    return analytics?.nodeStats.find(stat => stat.nodeId === nodeId);
  };

  const getHeatMapColor = (nodeId: string): string => {
    const stats = getNodeStats(nodeId);
    if (!stats || !analytics) return 'rgba(156, 163, 175, 0.3)'; // gray-400

    if (heatMapMode === 'triggered') {
      // Green intensity based on trigger count
      const intensity = Math.min(stats.triggered / analytics.totalExecutions, 1);
      return `rgba(34, 197, 94, ${0.3 + intensity * 0.6})`; // green-500
    } else if (heatMapMode === 'dropoff') {
      // Red intensity based on dropoff rate
      const intensity = Math.min(stats.dropoffRate / 30, 1); // 30% dropoff = max red
      return `rgba(239, 68, 68, ${0.3 + intensity * 0.6})`; // red-500
    } else {
      // Blue intensity based on time spent
      const maxTime = Math.max(...analytics.nodeStats.map(s => s.avgTimeSpent));
      const intensity = maxTime > 0 ? Math.min(stats.avgTimeSpent / maxTime, 1) : 0;
      return `rgba(59, 130, 246, ${0.3 + intensity * 0.6})`; // blue-500
    }
  };

  const getBorderColor = (nodeId: string): string => {
    const stats = getNodeStats(nodeId);
    if (!stats) return '#d1d5db'; // gray-300

    if (heatMapMode === 'triggered') {
      return stats.triggered > 500 ? '#16a34a' : '#86efac'; // green-600 or green-300
    } else if (heatMapMode === 'dropoff') {
      return stats.dropoffRate > 15 ? '#dc2626' : stats.dropoffRate > 5 ? '#fb923c' : '#86efac';
    } else {
      return stats.avgTimeSpent > 60 ? '#2563eb' : '#93c5fd'; // blue-600 or blue-300
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  // Custom node components with heat map styling
  const HeatMapNode = ({ id, data, type }: any) => {
    const stats = getNodeStats(id);
    const bgColor = getHeatMapColor(id);
    const borderColor = getBorderColor(id);

    return (
      <div
        className="rounded-lg shadow-lg p-4 min-w-[240px] transition-all"
        style={{
          backgroundColor: bgColor,
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: borderColor,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900">{data.label}</span>
          <span className="text-xs px-2 py-1 bg-white bg-opacity-80 rounded font-medium">
            {type}
          </span>
        </div>
        {stats && (
          <div className="space-y-1 text-xs bg-white bg-opacity-90 p-2 rounded">
            <div className="flex justify-between">
              <span className="text-gray-600">Triggered:</span>
              <span className="font-bold text-gray-900">{stats.triggered.toLocaleString()}</span>
            </div>
            {stats.dropoffRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Drop-off:</span>
                <span className={`font-bold ${stats.dropoffRate > 15 ? 'text-red-600' : stats.dropoffRate > 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  {stats.dropoffRate.toFixed(1)}%
                </span>
              </div>
            )}
            {stats.avgTimeSpent > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Time:</span>
                <span className="font-bold text-gray-900">{formatTime(stats.avgTimeSpent)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const nodeTypes = {
    trigger: HeatMapNode,
    action: HeatMapNode,
    condition: HeatMapNode,
    delay: HeatMapNode,
    aiAgent: HeatMapNode,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Failed to load analytics</p>
          <Button onClick={() => router.push('/flows')} className="mt-4">
            Back to Flows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/flows">
              <Button variant="ghost" size="sm">← Back</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 {analytics.flowName}</h1>
              <p className="text-sm text-gray-500">
                Analytics for last 7 days • {analytics.totalExecutions.toLocaleString()} total executions
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/flows/builder/${flowId}`}>
              <Button variant="outline">Edit Flow</Button>
            </Link>
            <Button variant="outline">Export Data</Button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium mb-1">Total Executions</div>
            <div className="text-3xl font-bold text-purple-900">{analytics.totalExecutions.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 font-medium mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-green-900">{analytics.completionRate.toFixed(1)}%</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium mb-1">Avg Completion Time</div>
            <div className="text-3xl font-bold text-blue-900">{formatTime(analytics.avgCompletionTime)}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-orange-600 font-medium mb-1">Active Users</div>
            <div className="text-3xl font-bold text-orange-900">{Math.floor(analytics.totalExecutions * 0.68).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Heat Map Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Heat Map Mode:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setHeatMapMode('triggered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  heatMapMode === 'triggered'
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔥 Triggered Count
              </button>
              <button
                onClick={() => setHeatMapMode('dropoff')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  heatMapMode === 'dropoff'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚠️ Drop-off Rate
              </button>
              <button
                onClick={() => setHeatMapMode('time')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  heatMapMode === 'time'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⏱️ Time Spent
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {heatMapMode === 'triggered' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }}></div>
                <span>Low</span>
                <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(to right, rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.9))' }}></div>
                <span>High</span>
              </div>
            )}
            {heatMapMode === 'dropoff' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }}></div>
                <span>Good (&lt;5%)</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(251, 146, 60, 0.6)' }}></div>
                <span>Warning (5-15%)</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
                <span>Critical (&gt;15%)</span>
              </div>
            )}
            {heatMapMode === 'time' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.4)' }}></div>
                <span>Fast</span>
                <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(to right, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.9))' }}></div>
                <span>Slow</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={true}
          panOnScroll={true}
          className="bg-gray-50"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const color = getHeatMapColor(node.id);
              return color;
            }}
            className="bg-white border border-gray-300"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
