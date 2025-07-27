import React from 'react';
import { FileText, Shield, Save, Download, Lock, CheckCircle, Zap, Globe, ArrowRight, Star, Users, Award, Clock, Eye, Smartphone, Layers, BookOpen, FileCheck, Palette } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  disabled: boolean;
}

export function LoginPage({ onLogin, disabled }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
              </div>
            </div>
            
            <button
              onClick={onLogin}
              disabled={disabled}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {disabled ? 'Connecting...' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                  <Star className="w-4 h-4 mr-1" />
                  California Legal Compliance
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Create Your Legal
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Will & Trust</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Professional-grade legal document creation made simple. Secure, guided, and compliant with California law. 
                Your legacy, protected with blockchain-level security.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={onLogin}
                  disabled={disabled}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <Globe className="w-6 h-6 mr-3" />
                  {disabled ? 'Connecting...' : 'Start Creating Now'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                
                <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500">
                  <Lock className="w-4 h-4 mr-2" />
                  Secured by Internet Computer
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No passwords required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Auto-save enabled
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant downloads
                </div>
              </div>
            </div>

            {/* Right Column - Visual with Screenshot */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative">
                {/* App Screenshot */}
                <div className="relative z-10">
                  <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 transform hover:scale-105 transition-transform duration-500">
                    <div className="bg-gray-100 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="ml-4 text-xs text-gray-500">Will Wisher - Create Your Will</div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-8 bg-blue-100 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="h-12 bg-blue-50 rounded border-2 border-blue-200"></div>
                          <div className="h-12 bg-green-50 rounded border-2 border-green-200"></div>
                        </div>
                        <div className="h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-medium">
                          Create Will
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce z-20">
                  <Save className="w-8 h-8 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse z-20">
                  <Download className="w-8 h-8 text-white" />
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute -z-10 top-8 right-8 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -z-10 bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Legal Document Creation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade tools designed for California residents. Create, secure, and download your legal documents with confidence.
            </p>
          </div>

          {/* Primary Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 - Enhanced */}
            <div className="feature-card group bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Blockchain Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your sensitive legal information is protected by Internet Computer's advanced cryptography. No passwords, no data breaches.
              </p>
              <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                <Shield className="w-4 h-4 mr-2" />
                Military-grade encryption
              </div>
            </div>

            {/* Feature 2 - Enhanced */}
            <div className="feature-card group bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Auto-Save Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Never lose your progress. Our intelligent auto-save captures every change instantly as you work on your documents.
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <Clock className="w-4 h-4 mr-2" />
                Real-time backup
              </div>
            </div>

            {/* Feature 3 - Enhanced */}
            <div className="feature-card group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">California Compliant</h3>
              <p className="text-gray-600 leading-relaxed">
                Templates designed by legal experts, specifically crafted to meet California state requirements for wills and trusts.
              </p>
              <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
                <Award className="w-4 h-4 mr-2" />
                Legal expert approved
              </div>
            </div>

            {/* Feature 4 - Enhanced */}
            <div className="feature-card group bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:border-indigo-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Downloads</h3>
              <p className="text-gray-600 leading-relaxed">
                Download your completed documents as editable Word files. Print, modify, or share with your attorney immediately.
              </p>
              <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                <FileCheck className="w-4 h-4 mr-2" />
                .docx format ready
              </div>
            </div>

            {/* Feature 5 - Enhanced */}
            <div className="feature-card group bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step-by-Step Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive guided process through the entire document creation. No legal expertise required - we'll walk you through everything.
              </p>
              <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
                <Users className="w-4 h-4 mr-2" />
                User-friendly design
              </div>
            </div>

            {/* Feature 6 - Enhanced */}
            <div className="feature-card group bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 hover:border-teal-300">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sample Documents</h3>
              <p className="text-gray-600 leading-relaxed">
                View complete examples with fictional data to understand proper formatting and content before creating your own.
              </p>
              <div className="mt-4 flex items-center text-sm text-teal-600 font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Reference examples
              </div>
            </div>
          </div>

          {/* Additional Features Highlight */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Advanced Features for Professional Results</h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Discover additional capabilities that make Will Wisher the most comprehensive legal document creation platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Draft Management</h4>
                <p className="text-sm text-blue-100">Save multiple drafts and resume editing anytime</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Mobile Responsive</h4>
                <p className="text-sm text-blue-100">Create documents on any device, anywhere</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Professional Design</h4>
                <p className="text-sm text-blue-100">Clean, modern interface built for ease of use</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Internet Identity</h4>
                <p className="text-sm text-blue-100">Secure login without passwords or personal data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              Create professional legal documents in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Login</h3>
              <p className="text-gray-600">
                Authenticate with Internet Identity - no passwords, no personal data stored on servers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fill Out Forms</h3>
              <p className="text-gray-600">
                Complete guided forms with auto-save. Your progress is protected every step of the way.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Download & Use</h3>
              <p className="text-gray-600">
                Download your completed documents as Word files, ready for printing and legal use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Legacy?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of California residents who trust Will Wisher for their legal document needs.
          </p>
          
          <button
            onClick={onLogin}
            disabled={disabled}
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <Globe className="w-6 h-6 mr-3" />
            {disabled ? 'Connecting...' : 'Get Started Now'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <p className="text-sm text-blue-200 mt-4">
            Free to start • No credit card required • Secure by design
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
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
                <h3 className="text-xl font-bold">Will Wisher</h3>
                <p className="text-sm text-gray-400">Legal Will & Trust Creation</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400 mb-2">
                Secured by Internet Computer blockchain technology
              </p>
              <p className="text-sm text-gray-500">
                © 2025. Built with <span className="text-red-400">♥</span> using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
