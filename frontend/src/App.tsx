import { useState } from 'react';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { useQueryClient } from '@tanstack/react-query';
import { WillCreator } from './components/WillCreator';
import { TrustCreator } from './components/TrustCreator';
import { DraftManager } from './components/DraftManager';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { ApprovalGate } from './components/ApprovalGate';
import { ProfileSetup } from './components/ProfileSetup';
import { DraftViewer } from './components/DraftViewer';
import { SampleDocuments } from './components/SampleDocuments';
import { LoginPage } from './components/LoginPage';
import { Heart } from 'lucide-react';
import { useUserProfile, useIsCurrentUserAdmin } from './hooks/useQueries';
import { WillDraft, TrustDraft } from './backend';

function App() {
  const { isLoggingIn, login, clear, identity, loginStatus } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<'create-will' | 'create-trust' | 'drafts' | 'profile' | 'admin' | 'view-draft' | 'samples'>('create-will');
  const [editingWillDraft, setEditingWillDraft] = useState<WillDraft | null>(null);
  const [editingTrustDraft, setEditingTrustDraft] = useState<TrustDraft | null>(null);
  const [viewingWillDraft, setViewingWillDraft] = useState<WillDraft | null>(null);
  const [viewingTrustDraft, setViewingTrustDraft] = useState<TrustDraft | null>(null);
  const queryClient = useQueryClient();
  const { data: userProfileResult } = useUserProfile();
  const { data: isAdmin } = useIsCurrentUserAdmin();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await clear();
      queryClient.clear();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEditWillDraft = (draft: WillDraft) => {
    setEditingWillDraft(draft);
    setEditingTrustDraft(null);
    setViewingWillDraft(null);
    setViewingTrustDraft(null);
    setActiveTab('create-will');
  };

  const handleEditTrustDraft = (draft: TrustDraft) => {
    setEditingTrustDraft(draft);
    setEditingWillDraft(null);
    setViewingWillDraft(null);
    setViewingTrustDraft(null);
    setActiveTab('create-trust');
  };

  const handleViewWillDraft = (draft: WillDraft) => {
    setViewingWillDraft(draft);
    setViewingTrustDraft(null);
    setEditingWillDraft(null);
    setEditingTrustDraft(null);
    setActiveTab('view-draft');
  };

  const handleViewTrustDraft = (draft: TrustDraft) => {
    setViewingTrustDraft(draft);
    setViewingWillDraft(null);
    setEditingWillDraft(null);
    setEditingTrustDraft(null);
    setActiveTab('view-draft');
  };

  const handleClearEditingDrafts = () => {
    setEditingWillDraft(null);
    setEditingTrustDraft(null);
    setViewingWillDraft(null);
    setViewingTrustDraft(null);
  };

  const handleCompleteDocument = () => {
    // Clear editing drafts and navigate to drafts tab
    setEditingWillDraft(null);
    setEditingTrustDraft(null);
    setViewingWillDraft(null);
    setViewingTrustDraft(null);
    setActiveTab('drafts');
  };

  const handleBackToDrafts = () => {
    setViewingWillDraft(null);
    setViewingTrustDraft(null);
    setActiveTab('drafts');
  };

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} disabled={disabled} />;
  }

  // Check if user needs to set up profile
  const hasProfile = userProfileResult && 'ok' in userProfileResult;
  if (!hasProfile) {
    return <ProfileSetup />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex items-center mr-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Will Wisher</h1>
                  <span className="text-xs text-gray-500">Legal Will & Trust Creation</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => {
                    setActiveTab('create-will');
                    setEditingWillDraft(null);
                    setEditingTrustDraft(null);
                    setViewingWillDraft(null);
                    setViewingTrustDraft(null);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'create-will'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Create Will
                </button>
                <button
                  onClick={() => {
                    setActiveTab('create-trust');
                    setEditingWillDraft(null);
                    setEditingTrustDraft(null);
                    setViewingWillDraft(null);
                    setViewingTrustDraft(null);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'create-trust'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Create Trust
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'drafts'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Drafts
                </button>
                <button
                  onClick={() => setActiveTab('samples')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'samples'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sample Documents
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Admin
                  </button>
                )}
              </nav>
              
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApprovalGate>
          {activeTab === 'create-will' && (
            <WillCreator 
              editingDraft={editingWillDraft} 
              onClearEditingDraft={handleClearEditingDrafts}
              onComplete={handleCompleteDocument}
            />
          )}
          {activeTab === 'create-trust' && (
            <TrustCreator 
              editingDraft={editingTrustDraft} 
              onClearEditingDraft={handleClearEditingDrafts}
              onComplete={handleCompleteDocument}
            />
          )}
          {activeTab === 'drafts' && (
            <DraftManager 
              onEditWillDraft={handleEditWillDraft}
              onEditTrustDraft={handleEditTrustDraft}
              onViewWillDraft={handleViewWillDraft}
              onViewTrustDraft={handleViewTrustDraft}
            />
          )}
          {activeTab === 'view-draft' && (
            <DraftViewer
              willDraft={viewingWillDraft}
              trustDraft={viewingTrustDraft}
              onBack={handleBackToDrafts}
            />
          )}
          {activeTab === 'samples' && <SampleDocuments />}
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'admin' && isAdmin && <AdminDashboard />}
        </ApprovalGate>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            © 2025. Built with <Heart className="inline w-4 h-4 text-red-500 mx-1" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
