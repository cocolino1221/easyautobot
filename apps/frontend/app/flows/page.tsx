'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Flow {
  id: string;
  name: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  folder: string;
  platforms: ('instagram' | 'facebook' | 'tiktok' | 'whatsapp')[];
  lastEdited: string;
  messagesSent: number;
  completionRate: number;
}

interface Folder {
  id: string;
  name: string;
  icon: string;
  count: number;
  isExpanded: boolean;
}

export default function FlowsPage() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'all', name: 'All Flows', icon: '📁', count: 8, isExpanded: true },
    { id: 'welcome', name: 'Welcome Sequences', icon: '👋', count: 3, isExpanded: true },
    { id: 'sales', name: 'Sales Funnels', icon: '💰', count: 2, isExpanded: false },
    { id: 'support', name: 'Customer Support', icon: '💬', count: 2, isExpanded: false },
    { id: 'uncategorized', name: 'Uncategorized', icon: '📂', count: 1, isExpanded: false },
  ]);

  const [flows, setFlows] = useState<Flow[]>([
    {
      id: '1',
      name: 'Welcome New Subscribers',
      status: 'ACTIVE',
      folder: 'welcome',
      platforms: ['instagram', 'facebook'],
      lastEdited: '2 hours ago',
      messagesSent: 245,
      completionRate: 87,
    },
    {
      id: '2',
      name: 'Re-engagement Flow',
      status: 'ACTIVE',
      folder: 'welcome',
      platforms: ['instagram'],
      lastEdited: '1 day ago',
      messagesSent: 89,
      completionRate: 92,
    },
    {
      id: '3',
      name: 'Birthday Greetings',
      status: 'PAUSED',
      folder: 'welcome',
      platforms: ['facebook', 'whatsapp'],
      lastEdited: '3 days ago',
      messagesSent: 156,
      completionRate: 95,
    },
    {
      id: '4',
      name: 'Product Launch Sequence',
      status: 'ACTIVE',
      folder: 'sales',
      platforms: ['instagram', 'tiktok'],
      lastEdited: '5 hours ago',
      messagesSent: 412,
      completionRate: 76,
    },
    {
      id: '5',
      name: 'Cart Abandonment',
      status: 'DRAFT',
      folder: 'sales',
      platforms: ['facebook'],
      lastEdited: '1 week ago',
      messagesSent: 0,
      completionRate: 0,
    },
    {
      id: '6',
      name: 'FAQ Handler',
      status: 'ACTIVE',
      folder: 'support',
      platforms: ['whatsapp', 'instagram'],
      lastEdited: '10 minutes ago',
      messagesSent: 1247,
      completionRate: 94,
    },
    {
      id: '7',
      name: 'Return Request Flow',
      status: 'ACTIVE',
      folder: 'support',
      platforms: ['whatsapp'],
      lastEdited: '2 days ago',
      messagesSent: 67,
      completionRate: 88,
    },
    {
      id: '8',
      name: 'Test Flow',
      status: 'DRAFT',
      folder: 'uncategorized',
      platforms: ['instagram'],
      lastEdited: '3 weeks ago',
      messagesSent: 0,
      completionRate: 0,
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f
    ));
  };

  const filteredFlows = flows.filter(flow => {
    const matchesFolder = selectedFolder === 'all' || flow.folder === selectedFolder;
    const matchesSearch = flow.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📷';
      case 'facebook': return '👍';
      case 'tiktok': return '🎵';
      case 'whatsapp': return '💬';
      default: return '📱';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ Active</span>;
      case 'PAUSED':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">⏸ Paused</span>;
      case 'DRAFT':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">○ Draft</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span>←</span>
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="text-xl font-semibold text-gray-900">Flows</h1>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
              <Link href="/flows/builder/new">
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm h-9">
                  + New Flow
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar with Folders */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id}>
                  <button
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      if (folder.id !== 'all') toggleFolder(folder.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFolder === folder.id
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{folder.icon}</span>
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{folder.count}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                <span>+</span>
                <span>New Folder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1">Total Flows</div>
              <div className="text-2xl font-semibold text-gray-900">{flows.length}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-2xl font-semibold text-green-600">
                {flows.filter(f => f.status === 'ACTIVE').length}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1">Messages Sent</div>
              <div className="text-2xl font-semibold text-gray-900">
                {flows.reduce((sum, f) => sum + f.messagesSent, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1">Avg. Completion</div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(flows.reduce((sum, f) => sum + f.completionRate, 0) / flows.length)}%
              </div>
            </div>
          </div>

          {/* Flows Grid */}
          {filteredFlows.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No flows found</h3>
              <p className="text-gray-600 mb-6">Create your first automation flow to get started</p>
              <Link href="/flows/builder/new">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  + Create New Flow
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlows.map((flow) => (
                <Link key={flow.id} href={`/flows/builder/${flow.id}`}>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                          {flow.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(flow.status)}
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        ⋯
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {flow.platforms.map((platform) => (
                        <span key={platform} className="text-base" title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Messages sent:</span>
                        <span className="font-medium text-gray-900">{flow.messagesSent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion:</span>
                        <span className="font-medium text-gray-900">{flow.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last edited:</span>
                        <span className="font-medium text-gray-900">{flow.lastEdited}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Templates Section */}
          {selectedFolder === 'all' && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Start from Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Welcome Series', desc: 'Greet new subscribers', icon: '🎉', color: 'purple' },
                  { name: 'Abandoned Cart', desc: 'Recover lost sales', icon: '🛒', color: 'blue' },
                  { name: 'FAQ Bot', desc: 'Answer common questions', icon: '❓', color: 'green' },
                  { name: 'Product Launch', desc: 'Build hype', icon: '🚀', color: 'orange' },
                  { name: 'Review Request', desc: 'Ask for reviews', icon: '⭐', color: 'yellow' },
                  { name: 'Birthday Message', desc: 'Send birthday wishes', icon: '🎁', color: 'pink' },
                ].map((template, idx) => (
                  <Link key={idx} href="/flows/builder/new">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-xs text-gray-600">{template.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
