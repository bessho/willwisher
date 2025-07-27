import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, FileText, Download, ArrowLeft, Save, Check, Plus, Eye } from 'lucide-react';
import { WillData, WillDraft } from '../backend';
import { useWillQueries } from '../hooks/useQueries';
import { generateWillDocument } from '../utils/documentGenerator';

const STEPS = [
  { id: 1, title: 'Personal Information', description: 'Basic details about you' },
  { id: 2, title: 'Executor', description: 'Who will execute your will' },
  { id: 3, title: 'Guardian', description: 'Guardian for minor children' },
  { id: 4, title: 'Specific Gifts', description: 'Specific items to beneficiaries' },
  { id: 5, title: 'Residuary Estate', description: 'Distribution of remaining assets' },
  { id: 6, title: 'Witnesses', description: 'Required witnesses' },
  { id: 7, title: 'Review', description: 'Review and finalize' }
];

interface WillCreatorProps {
  editingDraft?: WillDraft | null;
  onClearEditingDraft?: () => void;
  onComplete?: () => void;
}

export function WillCreator({ editingDraft, onClearEditingDraft, onComplete }: WillCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasCreatedDraft, setHasCreatedDraft] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [willData, setWillData] = useState<WillData>({
    testatorName: '',
    executorName: '',
    alternateExecutorName: '',
    guardianName: '',
    alternateGuardianName: '',
    specificGifts: [],
    residuaryBeneficiaries: [],
    witnesses: ['', ''],
    completionStatus: BigInt(0)
  });

  const { saveWillDraftMutation } = useWillQueries();

  // Load draft data when editing
  useEffect(() => {
    if (editingDraft) {
      setWillData(editingDraft.data);
      setHasCreatedDraft(true);
      setCurrentDraftId(editingDraft.id);
      // Determine which step to start on based on completion
      const data = editingDraft.data;
      let startStep = 1;
      
      if (data.testatorName) startStep = 2;
      if (data.executorName) startStep = 3;
      if (data.guardianName) startStep = 4;
      if (data.specificGifts.length > 0) startStep = 5;
      if (data.residuaryBeneficiaries.length > 0) startStep = 6;
      if (data.witnesses.every(w => w.trim())) startStep = 7;
      
      setCurrentStep(startStep);
    } else {
      // Reset state for new will creation
      setHasCreatedDraft(false);
      setCurrentDraftId(null);
      setCurrentStep(1);
      setWillData({
        testatorName: '',
        executorName: '',
        alternateExecutorName: '',
        guardianName: '',
        alternateGuardianName: '',
        specificGifts: [],
        residuaryBeneficiaries: [],
        witnesses: ['', ''],
        completionStatus: BigInt(0)
      });
    }
  }, [editingDraft]);

  // Create new will draft
  const handleCreateWill = async () => {
    const draftId = `draft_${Date.now()}`;
    setCurrentDraftId(draftId);
    setHasCreatedDraft(true);
    
    // Save initial empty draft
    try {
      await saveWillDraftMutation.mutateAsync({ draftId, willData });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to create will draft:', error);
    }
  };

  // Immediate auto-save function (only works after draft is created)
  const autoSave = useCallback(async (dataToSave: WillData) => {
    if (!hasCreatedDraft || !currentDraftId) return;
    
    setIsSaving(true);
    try {
      await saveWillDraftMutation.mutateAsync({ draftId: currentDraftId, willData: dataToSave });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to auto-save draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [hasCreatedDraft, currentDraftId, saveWillDraftMutation]);

  const updateWillData = useCallback((updates: Partial<WillData>) => {
    const newData = { ...willData, ...updates };
    setWillData(newData);
    // Only trigger auto-save if draft has been created
    if (hasCreatedDraft) {
      autoSave(newData);
    }
  }, [willData, hasCreatedDraft, autoSave]);

  const calculateCompletionStatus = useCallback(() => {
    let completed = 0;
    const total = 7;

    if (willData.testatorName) completed++;
    if (willData.executorName) completed++;
    if (willData.guardianName) completed++;
    if (willData.specificGifts.length > 0) completed++;
    if (willData.residuaryBeneficiaries.length > 0) completed++;
    if (willData.witnesses.every(w => w.trim())) completed++;
    if (currentStep === 7) completed++;

    return Math.round((completed / total) * 100);
  }, [willData, currentStep]);

  useEffect(() => {
    const status = calculateCompletionStatus();
    if (Number(willData.completionStatus) !== status) {
      updateWillData({ completionStatus: BigInt(status) });
    }
  }, [willData.testatorName, willData.executorName, willData.guardianName, willData.specificGifts, willData.residuaryBeneficiaries, willData.witnesses, currentStep, calculateCompletionStatus, updateWillData]);

  const handleDownloadWill = async () => {
    setIsGeneratingDocument(true);
    try {
      await generateWillDocument(willData);
    } catch (error) {
      console.error('Failed to generate document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const handleBackToDrafts = () => {
    if (onClearEditingDraft) {
      onClearEditingDraft();
    }
  };

  const handleCompleteWill = async () => {
    if (!hasCreatedDraft || !currentDraftId) return;
    
    // Save final state
    try {
      await saveWillDraftMutation.mutateAsync({ draftId: currentDraftId, willData });
      // Navigate back to drafts
      if (onComplete) {
        onComplete();
      } else if (onClearEditingDraft) {
        onClearEditingDraft();
      }
    } catch (error) {
      console.error('Failed to save final will:', error);
    }
  };

  const handleReviewWill = () => {
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

  const isWillComplete = () => {
    return willData.testatorName && 
           willData.executorName && 
           willData.guardianName && 
           willData.witnesses.every(w => w.trim()) &&
           willData.residuaryBeneficiaries.length > 0;
  };

  // Show create will button if no draft has been created and not editing
  if (!hasCreatedDraft && !editingDraft) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Will</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start the process of creating your legal will for California. This guided process will help you 
            document your wishes and create a legally compliant will document.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-3">What you'll need:</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left">
              <li>• Your full legal name and personal information</li>
              <li>• Names of executors and guardians (if applicable)</li>
              <li>• List of specific gifts and beneficiaries</li>
              <li>• Names and addresses of two witnesses</li>
            </ul>
          </div>
          
          <button
            onClick={handleCreateWill}
            disabled={saveWillDraftMutation.isPending}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-6 h-6 mr-3" />
            {saveWillDraftMutation.isPending ? 'Creating Will...' : 'Create Will'}
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
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Legal Name
              </label>
              <input
                type="text"
                value={willData.testatorName}
                onChange={(e) => updateWillData({ testatorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full legal name as it appears on official documents"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Executor Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Executor
              </label>
              <input
                type="text"
                value={willData.executorName}
                onChange={(e) => updateWillData({ executorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of your primary executor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Executor
              </label>
              <input
                type="text"
                value={willData.alternateExecutorName}
                onChange={(e) => updateWillData({ alternateExecutorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of your alternate executor"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Guardian for Minor Children</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Guardian
              </label>
              <input
                type="text"
                value={willData.guardianName}
                onChange={(e) => updateWillData({ guardianName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of primary guardian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Guardian
              </label>
              <input
                type="text"
                value={willData.alternateGuardianName}
                onChange={(e) => updateWillData({ alternateGuardianName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of alternate guardian"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Specific Gifts</h3>
            <p className="text-sm text-gray-600">
              Specify particular items or amounts to give to specific beneficiaries.
            </p>
            {willData.specificGifts.map((gift, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary
                  </label>
                  <input
                    type="text"
                    value={gift[0]}
                    onChange={(e) => {
                      const newGifts = [...willData.specificGifts];
                      newGifts[index] = [e.target.value, gift[1]];
                      updateWillData({ specificGifts: newGifts });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Beneficiary name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gift Description
                  </label>
                  <input
                    type="text"
                    value={gift[1]}
                    onChange={(e) => {
                      const newGifts = [...willData.specificGifts];
                      newGifts[index] = [gift[0], e.target.value];
                      updateWillData({ specificGifts: newGifts });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description of gift"
                  />
                </div>
                <button
                  onClick={() => {
                    const newGifts = willData.specificGifts.filter((_, i) => i !== index);
                    updateWillData({ specificGifts: newGifts });
                  }}
                  className="col-span-2 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Gift
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateWillData({ specificGifts: [...willData.specificGifts, ['', '']] });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Specific Gift
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Residuary Estate</h3>
            <p className="text-sm text-gray-600">
              Distribute the remainder of your estate after specific gifts.
            </p>
            {willData.residuaryBeneficiaries.map((beneficiary, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary
                  </label>
                  <input
                    type="text"
                    value={beneficiary[0]}
                    onChange={(e) => {
                      const newBeneficiaries = [...willData.residuaryBeneficiaries];
                      newBeneficiaries[index] = [e.target.value, beneficiary[1]];
                      updateWillData({ residuaryBeneficiaries: newBeneficiaries });
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
                      const newBeneficiaries = [...willData.residuaryBeneficiaries];
                      newBeneficiaries[index] = [beneficiary[0], BigInt(e.target.value || 0)];
                      updateWillData({ residuaryBeneficiaries: newBeneficiaries });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <button
                  onClick={() => {
                    const newBeneficiaries = willData.residuaryBeneficiaries.filter((_, i) => i !== index);
                    updateWillData({ residuaryBeneficiaries: newBeneficiaries });
                  }}
                  className="col-span-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Beneficiary
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateWillData({ residuaryBeneficiaries: [...willData.residuaryBeneficiaries, ['', BigInt(0)]] });
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
            <h3 className="text-lg font-semibold text-gray-900">Witnesses</h3>
            <p className="text-sm text-gray-600">
              California law requires two witnesses for a valid will.
            </p>
            {willData.witnesses.map((witness, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witness {index + 1}
                </label>
                <input
                  type="text"
                  value={witness}
                  onChange={(e) => {
                    const newWitnesses = [...willData.witnesses];
                    newWitnesses[index] = e.target.value;
                    updateWillData({ witnesses: newWitnesses });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Full name of witness ${index + 1}`}
                />
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Will</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review all the information you've entered. This preview shows your auto-saved data at any stage of completion.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Testator</h4>
                <p className="text-gray-700">
                  {willData.testatorName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Executor</h4>
                <p className="text-gray-700">
                  {willData.executorName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
                {willData.alternateExecutorName && (
                  <p className="text-gray-600 text-sm">Alternate: {willData.alternateExecutorName}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Guardian</h4>
                <p className="text-gray-700">
                  {willData.guardianName || <span className="text-gray-400 italic">Not yet specified</span>}
                </p>
                {willData.alternateGuardianName && (
                  <p className="text-gray-600 text-sm">Alternate: {willData.alternateGuardianName}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Specific Gifts</h4>
                {willData.specificGifts.length > 0 ? (
                  willData.specificGifts.map((gift, index) => (
                    <p key={index} className="text-gray-700 text-sm">
                      {gift[1] || <span className="text-gray-400 italic">Gift description</span>} → {gift[0] || <span className="text-gray-400 italic">Beneficiary name</span>}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No specific gifts added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Residuary Beneficiaries</h4>
                {willData.residuaryBeneficiaries.length > 0 ? (
                  willData.residuaryBeneficiaries.map((beneficiary, index) => (
                    <p key={index} className="text-gray-700 text-sm">
                      {beneficiary[0] || <span className="text-gray-400 italic">Beneficiary name</span>} - {Number(beneficiary[1])}%
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No residuary beneficiaries added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Witnesses</h4>
                {willData.witnesses.map((witness, index) => (
                  <p key={index} className="text-gray-700 text-sm">
                    Witness {index + 1}: {witness || <span className="text-gray-400 italic">Not yet specified</span>}
                  </p>
                ))}
              </div>
            </div>

            {/* Completion status and actions */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Completion Status</h4>
                <span className="text-sm text-gray-600">{Number(willData.completionStatus)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Number(willData.completionStatus)}%` }}
                />
              </div>
              
              {isWillComplete() ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Will Complete!</h4>
                  <p className="text-sm text-green-800 mb-4">
                    Your will is complete and ready to download. The document will be generated using the California legal will template.
                  </p>
                  <button
                    onClick={handleDownloadWill}
                    disabled={isGeneratingDocument}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingDocument ? 'Generating Document...' : 'Download Will (.docx)'}
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Will In Progress</h4>
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
            {editingDraft ? 'Edit Your Will' : 'Create Your Will'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {Number(willData.completionStatus)}% Complete
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
            style={{ width: `${Number(willData.completionStatus)}%` }}
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
              onClick={handleReviewWill}
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
              onClick={handleCompleteWill}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Complete Will
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
