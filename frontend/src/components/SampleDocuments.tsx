import React, { useState } from 'react';
import { FileText, Shield, Download, Eye, Info } from 'lucide-react';
import { generateWillDocument } from '../utils/documentGenerator';
import { generateTrustDocument } from '../utils/trustDocumentGenerator';
import { WillData, TrustData } from '../backend';

// Sample fictional persona data
const sampleWillData: WillData = {
  testatorName: 'Sarah Elizabeth Johnson',
  executorName: 'Michael Robert Johnson',
  alternateExecutorName: 'Jennifer Marie Thompson',
  guardianName: 'David William Anderson',
  alternateGuardianName: 'Lisa Catherine Anderson',
  specificGifts: [
    ['Emily Rose Johnson', 'My grandmother\'s diamond engagement ring and jewelry collection'],
    ['James Michael Johnson', 'My 2018 Honda Accord and all tools in the garage'],
    ['St. Mary\'s Children\'s Hospital', '$10,000 for pediatric care programs']
  ],
  residuaryBeneficiaries: [
    ['Emily Rose Johnson', BigInt(50)],
    ['James Michael Johnson', BigInt(50)]
  ],
  witnesses: ['Robert Charles Wilson', 'Maria Elena Rodriguez'],
  completionStatus: BigInt(100)
};

const sampleTrustData: TrustData = {
  trustorName: 'Sarah Elizabeth Johnson',
  trusteeName: 'Sarah Elizabeth Johnson',
  successorTrusteeName: 'Michael Robert Johnson',
  trustName: 'The Sarah E. Johnson Revocable Living Trust',
  trustAssets: [
    ['Real Estate', 'Primary residence at 1234 Oak Street, Sacramento, CA 95814'],
    ['Bank Account', 'Wells Fargo Checking Account #1234567890'],
    ['Investment Account', 'Fidelity Investment Account #9876543210'],
    ['Personal Property', 'All household furnishings, artwork, and personal effects']
  ],
  beneficiaries: [
    ['Emily Rose Johnson', BigInt(50)],
    ['James Michael Johnson', BigInt(50)]
  ],
  distributionTerms: 'Upon my death, distribute all trust assets equally to my children Emily Rose Johnson and James Michael Johnson. If either child predeceases me, their share shall go to their surviving children, or if none, to the surviving child.',
  completionStatus: BigInt(100)
};

export function SampleDocuments() {
  const [isGeneratingWill, setIsGeneratingWill] = useState(false);
  const [isGeneratingTrust, setIsGeneratingTrust] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'will' | 'trust'>('overview');

  const handleDownloadSampleWill = async () => {
    setIsGeneratingWill(true);
    try {
      await generateWillDocument(sampleWillData, true); // Pass true for sample mode
    } catch (error) {
      console.error('Failed to generate sample will:', error);
      alert('Failed to generate sample will document. Please try again.');
    } finally {
      setIsGeneratingWill(false);
    }
  };

  const handleDownloadSampleTrust = async () => {
    setIsGeneratingTrust(true);
    try {
      await generateTrustDocument(sampleTrustData, true); // Pass true for sample mode
    } catch (error) {
      console.error('Failed to generate sample trust:', error);
      alert('Failed to generate sample trust document. Please try again.');
    } finally {
      setIsGeneratingTrust(false);
    }
  };

  if (activeView === 'will') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            ← Back to Sample Documents
          </button>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="font-medium text-yellow-900">Sample for Reference Only</h3>
                <p className="text-sm text-yellow-800">
                  This is a fictional example using made-up information. Use this as a reference to understand how to complete your own will.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sample Will</h2>
                <p className="text-gray-600">Complete example using fictional persona</p>
              </div>
            </div>
            
            <button
              onClick={handleDownloadSampleWill}
              disabled={isGeneratingWill}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingWill ? 'Generating...' : 'Download Sample Will'}
            </button>
          </div>
        </div>

        {/* Sample Will Content Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 sample-document">
          <div className="text-center">
            <div className="sample-watermark">SAMPLE FOR REFERENCE</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">LAST WILL AND TESTAMENT</h3>
            <h4 className="text-lg font-semibold text-gray-800">OF {sampleWillData.testatorName.toUpperCase()}</h4>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Testator:</strong> {sampleWillData.testatorName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Executor Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Primary Executor:</strong> {sampleWillData.executorName}</p>
                <p><strong>Alternate Executor:</strong> {sampleWillData.alternateExecutorName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Guardian for Minor Children</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Primary Guardian:</strong> {sampleWillData.guardianName}</p>
                <p><strong>Alternate Guardian:</strong> {sampleWillData.alternateGuardianName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Specific Gifts</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {sampleWillData.specificGifts.map((gift, index) => (
                  <p key={index} className="text-sm">
                    <strong>{gift[0]}:</strong> {gift[1]}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Residuary Estate</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {sampleWillData.residuaryBeneficiaries.map((beneficiary, index) => (
                  <p key={index} className="text-sm">
                    <strong>{beneficiary[0]}:</strong> {Number(beneficiary[1])}%
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Witnesses</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {sampleWillData.witnesses.map((witness, index) => (
                  <p key={index} className="text-sm">
                    <strong>Witness {index + 1}:</strong> {witness}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'trust') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            ← Back to Sample Documents
          </button>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="font-medium text-yellow-900">Sample for Reference Only</h3>
                <p className="text-sm text-yellow-800">
                  This is a fictional example using made-up information. Use this as a reference to understand how to complete your own trust.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sample Trust</h2>
                <p className="text-gray-600">Complete example using fictional persona</p>
              </div>
            </div>
            
            <button
              onClick={handleDownloadSampleTrust}
              disabled={isGeneratingTrust}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingTrust ? 'Generating...' : 'Download Sample Trust'}
            </button>
          </div>
        </div>

        {/* Sample Trust Content Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 sample-document">
          <div className="text-center">
            <div className="sample-watermark">SAMPLE FOR REFERENCE</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">REVOCABLE LIVING TRUST AGREEMENT</h3>
            <h4 className="text-lg font-semibold text-gray-800">{sampleTrustData.trustName.toUpperCase()}</h4>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trust Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Trustor:</strong> {sampleTrustData.trustorName}</p>
                <p><strong>Trust Name:</strong> {sampleTrustData.trustName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trustee Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Initial Trustee:</strong> {sampleTrustData.trusteeName}</p>
                <p><strong>Successor Trustee:</strong> {sampleTrustData.successorTrusteeName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trust Assets</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {sampleTrustData.trustAssets.map((asset, index) => (
                  <p key={index} className="text-sm">
                    <strong>{asset[0]}:</strong> {asset[1]}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Beneficiaries</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {sampleTrustData.beneficiaries.map((beneficiary, index) => (
                  <p key={index} className="text-sm">
                    <strong>{beneficiary[0]}:</strong> {Number(beneficiary[1])}%
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Distribution Terms</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{sampleTrustData.distributionTerms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample Documents</h2>
        <p className="text-gray-600">
          View complete examples of properly filled will and trust documents using fictional persona data
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
            <p className="text-sm text-yellow-800 mb-2">
              These sample documents use completely fictional information for demonstration purposes only. 
              They are provided as reference examples to help you understand how to properly complete your own legal documents.
            </p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• All names, addresses, and details are fictional</li>
              <li>• Use these samples as a guide for formatting and content</li>
              <li>• Downloaded sample documents include "DRAFT" watermarks</li>
              <li>• Always consult with a legal professional for your actual documents</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Sample Will Card */}
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sample Will</h3>
                <p className="text-sm text-gray-600">Complete Last Will and Testament example</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-600">
                <p><strong>Fictional Testator:</strong> Sarah Elizabeth Johnson</p>
                <p><strong>Executor:</strong> Michael Robert Johnson</p>
                <p><strong>Specific Gifts:</strong> 3 items</p>
                <p><strong>Beneficiaries:</strong> 2 people</p>
                <p><strong>Witnesses:</strong> 2 witnesses</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setActiveView('will')}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Sample Will
              </button>
              
              <button
                onClick={handleDownloadSampleWill}
                disabled={isGeneratingWill}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingWill ? 'Generating...' : 'Download Sample Will'}
              </button>
            </div>
          </div>
        </div>

        {/* Sample Trust Card */}
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sample Trust</h3>
                <p className="text-sm text-gray-600">Complete Revocable Living Trust example</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-600">
                <p><strong>Fictional Trustor:</strong> Sarah Elizabeth Johnson</p>
                <p><strong>Trust Name:</strong> The Sarah E. Johnson Revocable Living Trust</p>
                <p><strong>Trust Assets:</strong> 4 categories</p>
                <p><strong>Beneficiaries:</strong> 2 people</p>
                <p><strong>Successor Trustee:</strong> Michael Robert Johnson</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setActiveView('trust')}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Sample Trust
              </button>
              
              <button
                onClick={handleDownloadSampleTrust}
                disabled={isGeneratingTrust}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingTrust ? 'Generating...' : 'Download Sample Trust'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">How Sample Documents Help You</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Understanding Structure</h4>
            <p className="text-sm text-blue-700">
              See how a complete will or trust is organized and what information goes in each section.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Proper Formatting</h4>
            <p className="text-sm text-blue-700">
              Learn the correct way to format names, percentages, and legal language.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Complete Examples</h4>
            <p className="text-sm text-blue-700">
              View fully completed documents to understand what your finished document should look like.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Reference Guide</h4>
            <p className="text-sm text-blue-700">
              Use as a reference while creating your own documents to ensure completeness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
