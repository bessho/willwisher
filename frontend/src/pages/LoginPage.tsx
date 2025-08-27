import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { FileText, Shield, Download, Users } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Will Wisher</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Create Your California Will
            <span className="block text-blue-600">With Confidence</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            A professional, guided platform to create legally compliant California wills. 
            Step-by-step guidance, instant saving, and secure document export.
          </p>
          
          <div className="mt-10">
            <button
              onClick={login}
              disabled={isLoggingIn}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingIn ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Logging in...
                </>
              ) : (
                'Get Started - Login Securely'
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Secure & Private</h3>
            <p className="mt-2 text-gray-600">Your data is encrypted and stored securely with Internet Identity authentication.</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Legal Template</h3>
            <p className="mt-2 text-gray-600">Uses the exact California will legal template with proper formatting and structure.</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mx-auto">
              <Download className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Export Ready</h3>
            <p className="mt-2 text-gray-600">Generate fully editable Word documents with proper formatting and DRAFT watermark.</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mx-auto">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Multi-User</h3>
            <p className="mt-2 text-gray-600">Each user has their own private workspace to create and manage multiple drafts.</p>
          </div>
        </div>
      </div>

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
