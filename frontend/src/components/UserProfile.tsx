import { useState, useEffect } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { useWillQueries } from '../hooks/useQueries';

export function UserProfile() {
  const { getUserProfileQuery, saveUserProfileMutation } = useWillQueries();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const result = getUserProfileQuery.data;
    if (result && 'ok' in result) {
      const profile = result.ok;
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [getUserProfileQuery.data]);

  const handleSaveProfile = async () => {
    try {
      await saveUserProfileMutation.mutateAsync({ name, email });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (getUserProfileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const result = getUserProfileQuery.data;
  const hasError = result && 'err' in result;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {result.err}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {name || 'Your Name'}
              </h3>
              <p className="text-gray-600">{email || 'your.email@example.com'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveUserProfileMutation.isPending}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveUserProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Privacy & Security</h4>
        <p className="text-sm text-blue-800">
          Your data is encrypted and stored securely on the Internet Computer blockchain. 
          Only you can access your will drafts and personal information.
        </p>
      </div>
    </div>
  );
}
