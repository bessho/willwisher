import React, { useState } from 'react';
import { UserProfile } from '../backend';
import { FileText, Plus, User, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import WillEditor from '../components/WillEditor';
import MyDrafts from '../components/MyDrafts';
import SampleWill from '../components/SampleWill';

interface DashboardProps {
  userProfile: UserProfile | null;
}

type ActiveView = 'drafts' | 'editor' | 'sample';

export default function Dashboard({ userProfile }: DashboardProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<ActiveView>('drafts');

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleNewWill = () => {
    setActiveView('editor');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Will Wisher</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{userProfile?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveView('drafts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'drafts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Drafts
            </button>
            <button
              onClick={() => setActiveView('sample')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'sample'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sample Will
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'drafts' && (
          <MyDrafts onNewWill={handleNewWill} onEditWill={() => setActiveView('editor')} />
        )}
        {activeView === 'editor' && (
          <WillEditor onBack={() => setActiveView('drafts')} />
        )}
        {activeView === 'sample' && <SampleWill />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            © 2025. Built with ❤️ using{' '}
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
