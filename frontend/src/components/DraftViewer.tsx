import React from 'react';
import { ArrowLeft, FileText, Shield, Calendar, User, Users, Gift, Scale, Eye, Download } from 'lucide-react';
import { WillDraft, TrustDraft } from '../backend';
import { generateWillDocument } from '../utils/documentGenerator';
import { generateTrustDocument } from '../utils/trustDocumentGenerator';

interface DraftViewerProps {
  willDraft?: WillDraft | null;
  trustDraft?: TrustDraft | null;
  onBack: () => void;
}

export function DraftViewer({ willDraft, trustDraft, onBack }: DraftViewerProps) {
  const [isGeneratingDocument, setIsGeneratingDocument] = React.useState(false);

  const handleDownloadWill = async () => {
    if (!willDraft) return;
    
    setIsGeneratingDocument(true);
    try {
      await generateWillDocument(willDraft.data);
    } catch (error) {
      console.error('Failed to generate will document:', error);
      alert('Failed to generate will document. Please try again.');
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const handleDownloadTrust = async () => {
    if (!trustDraft) return;
    
    setIsGeneratingDocument(true);
    try {
      await generateTrustDocument(trustDraft.data);
    } catch (error) {
      console.error('Failed to generate trust document:', error);
      alert('Failed to generate trust document. Please try again.');
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const isWillComplete = (draft: WillDraft) => {
    const data = draft.data;
    return data.testatorName && 
           data.executorName && 
           data.guardianName && 
           data.witnesses.every(w => w.trim()) &&
           data.residuaryBeneficiaries.length > 0;
  };

  const isTrustComplete = (draft: TrustDraft) => {
    const data = draft.data;
    return data.trustorName && 
           data.trustName &&
           data.trusteeName && 
           data.successorTrusteeName &&
           data.trustAssets.length > 0 &&
           data.beneficiaries.length > 0 &&
           data.distributionTerms;
  };

  if (willDraft) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Drafts
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {willDraft.data.testatorName || 'Untitled Will'}
                </h2>
                <p className="text-gray-600">Will Draft - Read Only View</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {Number(willDraft.data.completionStatus)}% Complete
                </div>
                <div className="text-xs text-gray-400">
                  Last modified: {new Date(Number(willDraft.lastModified) / 1000000).toLocaleDateString()}
                </div>
              </div>
              
              {isWillComplete(willDraft) && (
                <button
                  onClick={handleDownloadWill}
                  disabled={isGeneratingDocument}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingDocument ? 'Generating...' : 'Download Will'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Number(willDraft.data.completionStatus)}%` }}
            />
          </div>
        </div>

        {/* Will Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
          {/* Personal Information */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testator Name</label>
                  <p className="text-gray-900">
                    {willDraft.data.testatorName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Executor Information */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Scale className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Executor Information</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Executor</label>
                  <p className="text-gray-900">
                    {willDraft.data.executorName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Executor</label>
                  <p className="text-gray-900">
                    {willDraft.data.alternateExecutorName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Guardian for Minor Children</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Guardian</label>
                  <p className="text-gray-900">
                    {willDraft.data.guardianName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Guardian</label>
                  <p className="text-gray-900">
                    {willDraft.data.alternateGuardianName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Specific Gifts */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Gift className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Specific Gifts</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              {willDraft.data.specificGifts.length > 0 ? (
                <div className="space-y-3">
                  {willDraft.data.specificGifts.map((gift, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Beneficiary</label>
                          <p className="text-gray-900">{gift[0] || <span className="text-gray-400 italic">Not specified</span>}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Gift Description</label>
                          <p className="text-gray-900">{gift[1] || <span className="text-gray-400 italic">Not specified</span>}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No specific gifts added yet</p>
              )}
            </div>
          </div>

          {/* Residuary Estate */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Scale className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Residuary Estate</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              {willDraft.data.residuaryBeneficiaries.length > 0 ? (
                <div className="space-y-3">
                  {willDraft.data.residuaryBeneficiaries.map((beneficiary, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Beneficiary</label>
                          <p className="text-gray-900">{beneficiary[0] || <span className="text-gray-400 italic">Not specified</span>}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Percentage</label>
                          <p className="text-gray-900 font-medium">{Number(beneficiary[1])}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No residuary beneficiaries added yet</p>
              )}
            </div>
          </div>

          {/* Witnesses */}
          <div>
            <div className="flex items-center mb-4">
              <Eye className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Witnesses</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {willDraft.data.witnesses.map((witness, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Witness {index + 1}</label>
                    <p className="text-gray-900">
                      {witness || <span className="text-gray-400 italic">Not specified</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion Status */}
          <div className="mt-8 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Completion Status</h4>
              <span className="text-sm text-gray-600">{Number(willDraft.data.completionStatus)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Number(willDraft.data.completionStatus)}%` }}
              />
            </div>
            
            {isWillComplete(willDraft) ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Will Complete!</h4>
                <p className="text-sm text-green-800">
                  Your will is complete and ready to download. The document will be generated using the California legal will template.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Will In Progress</h4>
                <p className="text-sm text-blue-800">
                  This will is still being completed. You can continue editing to finish all required sections.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (trustDraft) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Drafts
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {trustDraft.data.trustName || 'Untitled Trust'}
                </h2>
                <p className="text-gray-600">Trust Draft - Read Only View</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {Number(trustDraft.data.completionStatus)}% Complete
                </div>
                <div className="text-xs text-gray-400">
                  Last modified: {new Date(Number(trustDraft.lastModified) / 1000000).toLocaleDateString()}
                </div>
              </div>
              
              {isTrustComplete(trustDraft) && (
                <button
                  onClick={handleDownloadTrust}
                  disabled={isGeneratingDocument}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingDocument ? 'Generating...' : 'Download Trust'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Number(trustDraft.data.completionStatus)}%` }}
            />
          </div>
        </div>

        {/* Trust Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
          {/* Trust Information */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Trust Information</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trustor Name</label>
                  <p className="text-gray-900">
                    {trustDraft.data.trustorName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trust Name</label>
                  <p className="text-gray-900">
                    {trustDraft.data.trustName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trustee Information */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Trustee Information</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Trustee</label>
                  <p className="text-gray-900">
                    {trustDraft.data.trusteeName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Successor Trustee</label>
                  <p className="text-gray-900">
                    {trustDraft.data.successorTrusteeName || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Assets */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Gift className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Trust Assets</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              {trustDraft.data.trustAssets.length > 0 ? (
                <div className="space-y-3">
                  {trustDraft.data.trustAssets.map((asset, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Asset Type</label>
                          <p className="text-gray-900">{asset[0] || <span className="text-gray-400 italic">Not specified</span>}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Asset Description</label>
                          <p className="text-gray-900">{asset[1] || <span className="text-gray-400 italic">Not specified</span>}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No trust assets added yet</p>
              )}
            </div>
          </div>

          {/* Beneficiaries */}
          <div className="border-b pb-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Beneficiaries</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              {trustDraft.data.beneficiaries.length > 0 ? (
                <div className="space-y-3">
                  {trustDraft.data.beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Beneficiary</label>
                          <p className="text-gray-900">{beneficiary[0] || <span className="text-gray-400 italic">Not specified</span>}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Percentage</label>
                          <p className="text-gray-900 font-medium">{Number(beneficiary[1])}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No beneficiaries added yet</p>
              )}
            </div>
          </div>

          {/* Distribution Terms */}
          <div>
            <div className="flex items-center mb-4">
              <Scale className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Distribution Terms</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {trustDraft.data.distributionTerms || <span className="text-gray-400 italic">Not specified</span>}
              </p>
            </div>
          </div>

          {/* Completion Status */}
          <div className="mt-8 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Completion Status</h4>
              <span className="text-sm text-gray-600">{Number(trustDraft.data.completionStatus)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Number(trustDraft.data.completionStatus)}%` }}
              />
            </div>
            
            {isTrustComplete(trustDraft) ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Trust Complete!</h4>
                <p className="text-sm text-green-800">
                  Your revocable living trust is complete and ready to download. The document will be generated using the California legal trust template.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Trust In Progress</h4>
                <p className="text-sm text-blue-800">
                  This trust is still being completed. You can continue editing to finish all required sections.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-600">No draft selected for viewing.</p>
    </div>
  );
}
