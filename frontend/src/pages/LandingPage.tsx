import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  Users, 
  Zap, 
  Lock, 
  Award,
  ArrowRight,
  Play,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '../components/LoadingSpinner';

const heroImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.pexels.com/photos/6347974/pexels-photo-6347974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/4458414/pexels-photo-4458414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateWill = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await login();
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Will Wisher</h1>
            </div>
            <Button 
              onClick={handleCreateWill}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoggingIn ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Logging in...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero background ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Will, Secured Forever
            <span className="block text-accent">on the Blockchain</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Simple. Affordable. Tamper-Proof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleCreateWill}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 rounded-full"
            >
              {isLoggingIn ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create My Will Now – $99'
              )}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('features')}
              className="text-lg px-8 py-4 rounded-full border-white text-white hover:bg-white hover:text-gray-900"
            >
              <Play className="h-5 w-5 mr-2" />
              See How It Works
            </Button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badge Row */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Legally Valid</h3>
              <p className="text-gray-600">California-compliant will template approved by legal experts</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Verified</h3>
              <p className="text-gray-600">Immutable storage on the Internet Computer blockchain</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">One-Time Fee</h3>
              <p className="text-gray-600">No subscriptions, no hidden costs, unlimited edits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Your Will
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform guides you through every step of creating a legally compliant California will
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Guided Will Drafting */}
            <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {/* Guided Will Drafting Icon - Replace with your preferred icon */}
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Guided Will Drafting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Step-by-step guidance through California's legal requirements with smart forms that adapt to your situation
                </p>
              </CardContent>
            </Card>

            {/* Feature 2: Blockchain Storage & Verification */}
            <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {/* Blockchain Storage Icon - Replace with your preferred icon */}
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Blockchain Storage & Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your will is stored immutably on the Internet Computer blockchain, ensuring it can never be lost or tampered with
                </p>
              </CardContent>
            </Card>

            {/* Feature 3: Legal Compliance Checker */}
            <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {/* Legal Compliance Icon - Replace with your preferred icon */}
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Compliance Checker</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time validation ensures your will meets all California legal requirements before finalization
                </p>
              </CardContent>
            </Card>

            {/* Feature 4: Secure Authentication */}
            <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Authentication</h3>
                <p className="text-gray-600 leading-relaxed">
                  Internet Identity provides passwordless, secure access to your documents with military-grade encryption
                </p>
              </CardContent>
            </Card>

            {/* Feature 5: User Support */}
            <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated support team to help you through the process and answer any questions about your will
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees, no subscriptions. Pay once, use forever.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Pricing Card */}
              <Card className="rounded-2xl border-2 border-primary shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Will Package</h3>
                    <div className="text-5xl font-bold text-primary mb-2">$99</div>
                    <p className="text-gray-600">One-time payment</p>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Guided will creation process</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Unlimited edits and revisions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Blockchain storage and verification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Professional Word document export</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Legal compliance checking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Secure Internet Identity authentication</span>
                    </li>
                  </ul>
                  <Button 
                    size="lg"
                    onClick={handleCreateWill}
                    disabled={isLoggingIn}
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-4 rounded-full"
                  >
                    {isLoggingIn ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Getting Started...
                      </>
                    ) : (
                      'Start Creating Your Will'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Optional Storage Add-on */}
              <Card className="rounded-2xl border shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Extended Storage</h3>
                    <div className="text-4xl font-bold text-gray-700 mb-2">$20</div>
                    <p className="text-gray-600">Optional add-on</p>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Extended blockchain storage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Additional backup copies</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Priority support access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Advanced document versioning</span>
                    </li>
                  </ul>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full text-lg py-4 rounded-full"
                  >
                    Add Extended Storage
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Protect Your Legacy. Start Today.
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Don't leave your family's future to chance. Create your legally compliant California will in minutes, 
            secured forever on the blockchain.
          </p>
          <Button 
            size="lg"
            onClick={handleCreateWill}
            disabled={isLoggingIn}
            className="bg-white text-primary hover:bg-gray-100 text-lg px-12 py-4 rounded-full font-semibold"
          >
            {isLoggingIn ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Your Account...
              </>
            ) : (
              <>
                Create My Will Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          <p className="text-sm text-blue-200 mt-4">
            Secure • Private • Legally Compliant
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Will Wisher</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Secure, blockchain-powered will creation for California residents
            </p>
            <div className="text-gray-400">
              © 2025. Built with <Heart className="h-4 w-4 inline text-red-500" /> using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
