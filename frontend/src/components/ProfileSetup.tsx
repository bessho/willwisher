import React, { useState } from 'react';
import { useSaveUserProfile } from '../hooks/useQueries';
import { User, FileText } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        await saveProfile.mutateAsync({ name: name.trim() });
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to Will Wisher</h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's get started by setting up your profile
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Full Legal Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full legal name"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This name will be used throughout your will documents
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={!name.trim() || saveProfile.isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveProfile.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Setting up...
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </button>
          </div>

          {saveProfile.error && (
            <div className="text-red-600 text-sm text-center">
              Failed to save profile. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
