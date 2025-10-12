'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Toast } from '@/components/ui/toast';

export default function SettingsPage() {
  const router = useRouter();
  const [tenant, setTenant] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [workspaceName, setWorkspaceName] = useState('');
  const [userName, setUserName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('AGENT');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get user from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setUserName(userData.name || '');
      }

      const [tenantResponse, membersResponse] = await Promise.all([
        api.get('/api/v1/tenant'),
        api.get('/api/v1/tenant/members'),
      ]);
      setTenant(tenantResponse.data);
      setWorkspaceName(tenantResponse.data.name);
      setMembers(membersResponse.data);
    } catch (error: any) {
      console.error('Failed to fetch data', error);
      showToast(error.response?.data?.message || '❌ Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const saveWorkspaceSettings = async () => {
    setSaving(true);
    try {
      await api.patch('/api/v1/tenant', {
        name: workspaceName,
      });
      await fetchData();
      showToast('✅ Workspace settings saved successfully!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || '❌ Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      showToast('📧 Please provide a valid email address', 'error');
      return;
    }

    try {
      await api.post('/api/v1/tenant/members', {
        email: inviteEmail,
        role: inviteRole,
      });
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('AGENT');
      await fetchData();
      showToast('✅ Team member invited successfully!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || '❌ Failed to invite member', 'error');
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      await api.delete(`/api/v1/tenant/members/${memberId}`);
      await fetchData();
      showToast('✅ Team member removed successfully', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || '❌ Failed to remove member', 'error');
    }
  };

  const upgradePlan = async (plan: string) => {
    try {
      await api.patch('/api/v1/tenant', {
        plan,
      });
      await fetchData();
      showToast(`✅ Successfully upgraded to ${plan} plan!`, 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || '❌ Failed to upgrade plan', 'error');
    }
  };

  const generateAPIKey = async () => {
    try {
      const response = await api.post('/api/v1/tenant/api-keys');
      showToast('✅ API key generated successfully!', 'success');
      // TODO: Display the API key
    } catch (error: any) {
      showToast(error.response?.data?.message || '❌ Failed to generate API key', 'error');
    }
  };

  const saveAccountSettings = async () => {
    setSaving(true);
    try {
      // Update user name in localStorage
      if (user) {
        const updatedUser = { ...user, name: userName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      showToast('✅ Account settings saved successfully!', 'success');
    } catch (error: any) {
      showToast('❌ Failed to save account settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Clear cookie
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';

      // Show toast
      showToast('👋 Logged out successfully', 'success');

      // Redirect to signin after a brief delay
      setTimeout(() => {
        router.push('/signin');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your workspace and preferences
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'account'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                👤 Account
              </button>
              <button
                onClick={() => setActiveTab('workspace')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'workspace'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                🏢 Workspace
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'team'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                👥 Team Members
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'billing'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                💳 Billing & Plan
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'api'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                🔑 API Keys
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6">Loading...</div>
            ) : (
              <>
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-6">Account Settings</h2>

                    {/* User Profile */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 pb-6 border-b">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {userName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{userName || user?.name || 'User'}</h3>
                          <p className="text-gray-600">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                            {user?.role || 'AGENT'}
                          </span>
                        </div>
                      </div>

                      {/* Account Details */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account ID
                        </label>
                        <input
                          type="text"
                          value={user?.id || ''}
                          disabled
                          className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed font-mono text-sm"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          className="w-full sm:w-auto"
                          onClick={saveAccountSettings}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : '💾 Save Changes'}
                        </Button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session & Security</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-red-900 mb-1">Log Out</h4>
                            <p className="text-sm text-red-700">
                              Sign out of your account on this device
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                            onClick={handleLogout}
                          >
                            🚪 Log Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workspace Tab */}
                {activeTab === 'workspace' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Workspace Settings
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Workspace Name
                        </label>
                        <input
                          type="text"
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="My Workspace"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan
                        </label>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="font-semibold">
                            {tenant?.plan || 'FREE'}
                          </span>
                          <Button size="sm" onClick={() => setActiveTab('billing')}>
                            Upgrade
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Usage This Month
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Messages</span>
                            <span>
                              {tenant?.messagesThisMonth || 0} /{' '}
                              {tenant?.maxMessagesPerMonth || 50}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  ((tenant?.messagesThisMonth || 0) /
                                    (tenant?.maxMessagesPerMonth || 50)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="mt-4"
                        onClick={saveWorkspaceSettings}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Team Members</h2>
                      <Button size="sm" onClick={() => setShowInviteModal(true)}>
                        + Invite Member
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {members.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No team members yet. Invite your first member!
                        </div>
                      ) : (
                        members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{member.name || member.email}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 capitalize">
                                {member.role?.toLowerCase()}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => removeMember(member.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Billing & Subscription
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Current Plan</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-lg">
                                {tenant?.plan || 'FREE'} Plan
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {tenant?.plan === 'FREE'
                                  ? '€0/month'
                                  : tenant?.plan === 'PRO'
                                  ? '€49/month'
                                  : tenant?.plan === 'BUSINESS'
                                  ? '€149/month'
                                  : 'Custom pricing'}
                              </p>
                            </div>
                            <Button onClick={() => upgradePlan('PRO')}>
                              {tenant?.plan === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Available Plans</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className={`border rounded-lg p-4 ${tenant?.plan === 'FREE' ? 'border-2 border-green-500 bg-green-50' : ''}`}>
                            <h4 className="font-semibold">Free</h4>
                            <p className="text-2xl font-bold mt-2">€0</p>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1">
                              <li>✓ 1 integration</li>
                              <li>✓ 50 messages/month</li>
                              <li>✓ 1 team member</li>
                            </ul>
                            {tenant?.plan !== 'FREE' && (
                              <Button size="sm" className="w-full mt-4" variant="outline" onClick={() => upgradePlan('FREE')}>
                                Downgrade
                              </Button>
                            )}
                          </div>
                          <div className={`border rounded-lg p-4 ${tenant?.plan === 'PRO' ? 'border-2 border-blue-600 bg-blue-50' : 'border-2 border-blue-200'}`}>
                            <h4 className="font-semibold text-blue-600">Pro</h4>
                            <p className="text-2xl font-bold mt-2">€49</p>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1">
                              <li>✓ 3 integrations</li>
                              <li>✓ 5,000 messages/month</li>
                              <li>✓ 3 team members</li>
                            </ul>
                            {tenant?.plan !== 'PRO' && (
                              <Button size="sm" className="w-full mt-4" onClick={() => upgradePlan('PRO')}>
                                {tenant?.plan === 'FREE' ? 'Upgrade' : 'Switch'}
                              </Button>
                            )}
                          </div>
                          <div className={`border rounded-lg p-4 ${tenant?.plan === 'BUSINESS' ? 'border-2 border-purple-600 bg-purple-50' : ''}`}>
                            <h4 className="font-semibold">Business</h4>
                            <p className="text-2xl font-bold mt-2">€149</p>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1">
                              <li>✓ Unlimited integrations</li>
                              <li>✓ Unlimited messages</li>
                              <li>✓ Unlimited team</li>
                            </ul>
                            {tenant?.plan !== 'BUSINESS' && (
                              <Button size="sm" className="w-full mt-4" onClick={() => upgradePlan('BUSINESS')}>
                                {tenant?.plan === 'FREE' ? 'Upgrade' : 'Switch'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Keys Tab */}
                {activeTab === 'api' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">API Keys</h2>
                      <Button size="sm" onClick={generateAPIKey}>
                        🔑 Generate New Key
                      </Button>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      No API keys generated yet
                    </div>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        🔒 API keys allow you to integrate our platform with your own applications. Keep your keys secure and never share them publicly.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="colleague@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1"
                  onClick={inviteMember}
                >
                  Send Invite
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setInviteRole('AGENT');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
