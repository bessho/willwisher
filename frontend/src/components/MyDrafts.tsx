import React from 'react';
import { useGetWillDraft } from '../hooks/useQueries';
import { Plus, FileText, Clock, Edit3 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface MyDraftsProps {
  onNewWill: () => void;
  onEditWill: () => void;
}

export default function MyDrafts({ onNewWill, onEditWill }: MyDraftsProps) {
  const { data: draft, isLoading } = useGetWillDraft();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Drafts</h2>
        <button
          onClick={onNewWill}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Will
        </button>
      </div>

      {!draft ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first will draft.</p>
          <div className="mt-6">
            <button
              onClick={onNewWill}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Will
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{draft.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Last modified: {formatDate(draft.lastModified)}
                  </div>
                </div>
              </div>
              <button
                onClick={onEditWill}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
