import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, FileText, Download, ArrowLeft, Save, Check, Plus, Eye } from 'lucide-react';
import { TrustData, TrustDraft } from '../backend';
import { useTrustQueries } from '../hooks/useQueries';
import { generateTrustDocument } from '../utils/trustDocumentGenerator';

const STEPS = [
  { id: 1, title: 'Trust Information', description: 'Basic trust details' },
  { id: 2, title: 'Trustee', description: 'Who will manage the trust' },
  { id: 3, title: 'Successor Trustee', description: 'Backup trustee information' },
  { id: 4, title: 'Trust Assets', description: 'Assets to be placed in trust' },
  { id: 5, title: 'Beneficiaries', description: 'Who will benefit from the trust' },
  { id: 6, title: 'Distribution Terms', description: 'How and when to distribute assets' },
  { id: 7, title: 'Review', description: 'Review and finalize' }
];

interface TrustCreatorProps {
  editingDraft?: TrustDraft | null;
  onClearEditingDraft?: () => void;
  onComplete?: () => void;
}

export function TrustCreator({ editingDraft, onClearEditingDraft, onComplete }: TrustCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasCreatedDraft, setHasCreatedDraft] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [trustData, setTrustData] = useState<TrustData>({
    trustorName: '',
    trusteeName: '',
    successorTrusteeName: '',
    trustName: '',
    trustAssets: [],
    beneficiaries: [],
    distributionTerms: '',
    completionStatus: BigInt(0)
  });

  const { saveTrustDraftMutation } = useTrustQueries();

  // Load draft data when editing
  useEffect(() => {
    if (editingDraft) {
      setTrustData(editingDraft.data);
      setHasCreatedDraft(true);
      setCurrentDraftId(editingDraft.id);
      // Determine which step to start on based on completion
      const data = editingDraft.data;
      let startStep = 1;
      
      if (data.trustorName && data.trustName) startStep = 2;
      if (data.trusteeName) startStep = 3;
      if (data.successorTrusteeName) startStep = 4;
      if (data.trustAssets.length > 0) startStep = 5;
      if (data.beneficiaries.length > 0) startStep = 6;
      if (data.distributionTerms) startStep = 7;
      
      setCurrentStep(startStep);
    } else {
      // Reset state for new trust creation
      setHasCreatedDraft(false);
      setCurrentDraftId(null);
      setCurrentStep(1);
      setTrustData({
        trustorName: '',
        trusteeName: '',
        successorTrusteeName: '',
        trustName: '',
        trustAssets: [],
        beneficiaries: [],
        distributionTerms: '',
        completionStatus: BigInt(0)
      });
    }
  }, [editingDraft]);

  // Create new trust draft
  const handleCreateTrust = async () => {
    const draftId = `trust_draft_${Date.now()}`;
    setCurrentDraftId(draftId);
    setHasCreatedDraft(true);
    
    // Save initial empty draft
    try {
      await saveTrustDraftMutation.mutateAsync({ draftId, trustData });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to create trust draft:', error);
    }
  };

  // Immediate auto-save function (only works after draft is created)
  const autoSave = useCallback(async (dataToSave: TrustData) => {
    if (!hasCreatedDraft || !currentDraftId) return;
    
    setIsSaving(true);
    try {
      await saveTrustDraftMutation.mutateAsync({ draftId: currentDraftId, trustData: dataToSave });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to auto-save trust draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [hasCreatedDraft, currentDraftId, saveTrustDraftMutation]);

  const updateTrustData = useCallback((updates: Partial<TrustData>) => {
    const newData = { ...trustData, ...updates };
    setTrustData(newData);
    // Only trigger auto-save if draft has been created
    if (hasCreatedDraft) {
      autoSave(newData);
    }
  }, [trustData, hasCreatedDraft, autoSave]);

  const calculateCompletionStatus = useCallback(() => {
    let completed = 0;
    const total = 7;

    if (trustData.trustorName && trustData.trustName) completed++;
    if (trustData.trusteeName) completed++;
    if (trustData.successorTrusteeName) completed++;
    if (trustData.trustAssets.length > 0) completed++;
    if (trustData.beneficiaries.length > 0) completed++;
    if (trustData.distributionTerms) completed++;
    if (currentStep === 7) completed++;

    return Math.round((completed / total) * 100);
  }, [trustData, currentStep]);

  useEffect(() => {
    const status = calculateCompletionStatus();
    if (Number(trustData.completionStatus) !== status) {
      updateTrustData({ completionStatus: BigInt(status) });
    }
  }, [trustData.trustorName, trustData.trustName, trustData.trusteeName, trustData.successorTrusteeName, trustData.trustAssets, trustData.beneficiaries, trustData.distributionTerms, currentStep, calculateCompletionStatus, updateTrustData]);

  const handleDownloadTrust = async () => {
    setIsGeneratingDocument(true);
    try {
      await generateTrustDocument(trustData);
    } catch (error) {
      console.error('Failed to generate trust document:', error);
      alert('Failed to generate trust document. Please try again.');
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const handleBackToDrafts = () => {
    if (onClearEditingDraft) {
      onClearEditingDraft();
    }
  };

  const handleCompleteTrust = async () => {
    if (!hasCreatedDraft || !currentDraftId) return;
    
    // Save final state
    try {
      await saveTrustDraftMutation.mutateAsync({ draftId: currentDraftId, trustData });
      // Navigate back to drafts
      if (onComplete) {
        onComplete();
      } else if (onClearEditingDraft) {
        onClearEditingDraft();
      }
    } catch (error) {
      console.error('Failed to save final trust:', error);
    }
  };

  const handleReviewTrust = () => {
    setCurrentStep(7);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isTrustComplete = () => {
    return trustData.trustorName && 
           trustData.trustName &&
           trustData.trusteeName && 
           trustData.successorTrusteeName &&
           trustData.trustAssets.length > 0 &&
           trustData.beneficiaries.length > 0 &&
           trustData.distributionTerms;
  };

  // Show create trust button if no draft has been created and not editing
  if (!hasCreatedDraft && !editingDraft) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Trust</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start the process of creating your revocable living trust for California. This guided process will help you 
            document your wishes and create a legally compliant trust agreement.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-900 mb-3">What you'll need:</h3>
            <ul className="text-sm text-green-800 space-y-2 text-left">
              <li>• Your full legal name and trust name</li>
              <li>• Names of trustees and successor trustees</li>
              <li>• List of assets to be placed in the trust</li>
              <li>• Names and percentages for beneficiaries</li>
              <li>• Distribution terms and instructions</li>
            </ul>
          </div>
          
          <button
            onClick={handleCreateTrust}
            disabled={saveTrustDraftMutation.isPending}
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-6 h-6 mr-3" />
            {saveTrustDraftMutation.isPending ? 'Creating Trust...' : 'Create Trust'}
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Your progress will be automatically saved as you work
          </p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Trust Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trustor Name (Your Full Legal Name)
              </label>
              <input
                type="text"
                value={trustData.trustorName}
                onChange={(e) => updateTrustData({ trustorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full legal name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trust Name
              </label>
              <input
                type="text"
                value={trustData.trustName}
                onChange={(e) => updateTrustData({ trustName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., The Smith Family Revocable Living Trust"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Initial Trustee</h3>
            <p className="text-sm text-gray-600">
              The initial trustee manages the trust assets. Typically, you serve as your own trustee.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Trustee Name
              </label>
              <input
                type="text"
                value={trustData.trusteeName}
                onChange={(e) => updateTrustData({ trusteeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of initial trustee"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Successor Trustee</h3>
            <p className="text-sm text-gray-600">
              The successor trustee will manage the trust if you become unable to do so or after your death.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Successor Trustee Name
              </label>
              <input
                type="text"
                value={trustData.successorTrusteeName}
                onChange={(e) => updateTrustData({ successorTrusteeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of successor trustee"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Trust Assets</h3>
            <p className="text-sm text-gray-600">
              List the assets you want to place in the trust (real estate, bank accounts, investments, etc.).
            </p>
            {trustData.trustAssets.map((asset: [string, string], index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Type
                    </label>
                    <input
                      type="text"
                      value={asset[0]}
                      onChange={(e) => {
                        const newAssets = [...trustData.trustAssets];
                        newAssets[index] = [e.target.value, asset[1]];
                        updateTrustData({ trustAssets: newAssets });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Real Estate, Bank Account"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Description
                    </label>
                    <input
                      type="text"
                      value={asset[1]}
                      onChange={(e) => {
                        const newAssets = [...trustData.trustAssets];
                        newAssets[index] = [asset[0], e.target.value];
                        updateTrustData({ trustAssets: newAssets });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed description of the asset"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newAssets = trustData.trustAssets.filter((_: [string, string], i: number) => i !== index);
                    updateTrustData({ trustAssets: newAssets });
                  }}
                  className="mt-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Asset
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateTrustData({ trustAssets: [...trustData.trustAssets, ['', '']] });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Trust Asset
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Beneficiaries</h3>
            <p className="text-sm text-gray-600">
              Specify who will benefit from the trust and their percentage share.
            </p>
            {trustData.beneficiaries.map((beneficiary: [string, bigint], index: number) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={beneficiary[0]}
                    onChange={(e) => {
                      const newBeneficiaries = [...trustData.beneficiaries];
                      newBeneficiaries[index] = [e.target.value, beneficiary[1]];
                      updateTrustData({ beneficiaries: newBeneficiaries });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Beneficiary name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={Number(beneficiary[1])}
                    onChange={(e) => {
                      const newBeneficiaries = [...trustData.beneficiaries];
                      newBeneficiaries[index] = [beneficiary[0], BigInt(e.target.value || 0)];
                      updateTrustData({ beneficiaries: newBeneficiaries });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <button
                  onClick={() => {
                    const newBeneficiaries = trustData.beneficiaries.filter((_: [string, bigint], i: number) => i !== index);
                    updateTrustData({ beneficiaries: newBeneficiaries });
                  }}
                  className="col-span-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Beneficiary
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateTrustData({ beneficiaries: [...trustData.beneficiaries, ['', BigInt(0)]] });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Beneficiary
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Distribution Terms</h3>
            <p className="text-sm text-gray-600">
              Specify how and when the trust assets should be distributed to beneficiaries.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distribution Instructions
              </label>
              <textarea
                value={trustData.distributionTerms}
                onChange={(e) => updateTrustData({ distributionTerms: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe when and how assets should be distributed (e.g., 'Upon my death, distribute all assets equally to beneficiaries' or 'Distribute income annually, principal at age 25')"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Trust</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review all the information you've entered. This preview shows your auto-saved data at any stage of completion.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Trust Name</h4>
                <p className="text-gray-700">
                  {trustData.trustName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Trustor</h4>
                <p className="text-gray-700">
                  {trustData.trustorName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Initial Trustee</h4>
                <p className="text-gray-700">
                  {trustData.trusteeName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Successor Trustee</h4>
                <p className="text-gray-700">
                  {trustData.successorTrusteeName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Trust Assets</h4>
                {trustData.trustAssets.length > 0 ? (
                  trustData.trustAssets.map((asset: [string, string], index: number) => (
                    <p key={index} className="text-gray-700 text-sm">
                      {asset[0] || <span className="text-gray-400 italic">Asset type</span>}: {asset[1] || <span className="text-gray-400 italic">Asset description</span>}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No assets added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Beneficiaries</h4>
                {trustData.beneficiaries.length > 0 ? (
                  trustData.beneficiaries.map((beneficiary: [string, bigint], index: number) => (
                    <p key={index} className="text-gray-700 text-sm">
                      {beneficiary[0] || <span className="text-gray-400 italic">Beneficiary name</span>} - {Number(beneficiary[1])}%
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No beneficiaries added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Distribution Terms</h4>
                <p className="text-gray-700 text-sm">
                  {trustData.distributionTerms || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
              </div>
            </div>

            {/* Completion status and actions */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Completion Status</h4>
                <span className="text-sm text-gray-600">{Number(trustData.completionStatus)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Number(trustData.completionStatus)}%` }}
                />
              </div>
              
              {isTrustComplete() ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Trust Complete!</h4>
                  <p className="text-sm text-green-800 mb-4">
                    Your revocable living trust is complete and ready to download. The document will be generated using the California legal trust template.
                  </p>
                  <button
                    onClick={handleDownloadTrust}
                    disabled={isGeneratingDocument}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingDocument ? 'Generating Document...' : 'Download Trust (.docx)'}
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Trust In Progress</h4>
                  <p className="text-sm text-blue-800">
                    Complete all required sections to enable document download. You can continue editing and your progress will be automatically saved.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button if editing */}
      {editingDraft && (
        <div className="mb-6">
          <button
            onClick={handleBackToDrafts}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Drafts
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingDraft ? 'Edit Your Trust' : 'Create Your Revocable Living Trust'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {Number(trustData.completionStatus)}% Complete
            </span>
            {/* Auto-save status indicator */}
            {hasCreatedDraft && (
              <div className="flex items-center text-sm">
                {isSaving ? (
                  <div className="flex items-center text-blue-600">
                    <Save className="w-4 h-4 mr-1 animate-pulse" />
                    Saving...
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Number(trustData.completionStatus)}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : currentStep > step.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <h3 className="font-medium text-gray-900">{STEPS[currentStep - 1].title}</h3>
          <p className="text-sm text-gray-600">{STEPS[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="flex space-x-3">
          {/* Review button - only show if draft has been created and not on review step */}
          {hasCreatedDraft && currentStep !== 7 && (
            <button
              onClick={handleReviewTrust}
              className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review
            </button>
          )}
          
          {currentStep < STEPS.length ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleCompleteTrust}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Complete Trust
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
