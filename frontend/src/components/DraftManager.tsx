import { useState } from 'react';
import { FileText, Trash2, Edit, Calendar, Download, Shield, Eye } from 'lucide-react';
import { useWillQueries, useTrustQueries } from '../hooks/useQueries';
import { WillDraft, TrustDraft } from '../backend';
import { generateWillDocument } from '../utils/documentGenerator';
import { generateTrustDocument } from '../utils/trustDocumentGenerator';

interface DraftManagerProps {
  onEditWillDraft: (draft: WillDraft) => void;
  onEditTrustDraft: (draft: TrustDraft) => void;
  onViewWillDraft: (draft: WillDraft) => void;
  onViewTrustDraft: (draft: TrustDraft) => void;
}

export function DraftManager({ onEditWillDraft, onEditTrustDraft, onViewWillDraft, onViewTrustDraft }: DraftManagerProps) {
  const { getAllWillDraftsQuery, deleteWillDraftMutation } = useWillQueries();
  const { getAllTrustDraftsQuery, deleteTrustDraftMutation } = useTrustQueries();
  const [generatingDocuments, setGeneratingDocuments] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'wills' | 'trusts'>('wills');

  const handleDeleteWillDraft = async (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this will draft?')) {
      try {
        await deleteWillDraftMutation.mutateAsync(draftId);
      } catch (error) {
        console.error('Failed to delete will draft:', error);
      }
    }
  };

  const handleDeleteTrustDraft = async (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this trust draft?')) {
      try {
        await deleteTrustDraftMutation.mutateAsync(draftId);
      } catch (error) {
        console.error('Failed to delete trust draft:', error);
      }
    }
  };

  const handleDownloadWillDraft = async (draft: WillDraft) => {
    setGeneratingDocuments(prev => new Set(prev).add(draft.id));
    try {
      await generateWillDocument(draft.data);
    } catch (error) {
      console.error('Failed to generate will document:', error);
      alert('Failed to generate will document. Please try again.');
    } finally {
      setGeneratingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(draft.id);
        return newSet;
      });
    }
  };

  const handleDownloadTrustDraft = async (draft: TrustDraft) => {
    setGeneratingDocuments(prev => new Set(prev).add(draft.id));
    try {
      await generateTrustDocument(draft.data);
    } catch (error) {
      console.error('Failed to generate trust document:', error);
      alert('Failed to generate trust document. Please try again.');
    } finally {
      setGeneratingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(draft.id);
        return newSet;
      });
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

  const isLoading = getAllWillDraftsQuery.isLoading || getAllTrustDraftsQuery.isLoading;
  const hasError = getAllWillDraftsQuery.isError || getAllTrustDraftsQuery.isError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load drafts. Please try again.</p>
      </div>
    );
  }

  const willResult = getAllWillDraftsQuery.data;
  const trustResult = getAllTrustDraftsQuery.data;
  const willDrafts: WillDraft[] = (willResult && 'ok' in willResult) ? willResult.ok : [];
  const trustDrafts: TrustDraft[] = (trustResult && 'ok' in trustResult) ? trustResult.ok : [];

  const hasAnyDrafts = willDrafts.length > 0 || trustDrafts.length > 0;

  if (!hasAnyDrafts) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Drafts Yet</h3>
        <p className="text-gray-600">Start creating your will or trust to save drafts here.</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Your drafts are now automatically saved as you type - no need to click save buttons!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Drafts</h2>
        <p className="text-gray-600">Manage your saved will and trust drafts</p>
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✨ Auto-save is now enabled! Your changes are automatically saved as you type.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('wills')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'wills'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Wills ({willDrafts.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trusts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trusts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Trusts ({trustDrafts.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Will Drafts */}
      {activeTab === 'wills' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {willDrafts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Will Drafts</h3>
              <p className="text-gray-600">Start creating your will to save drafts here.</p>
            </div>
          ) : (
            willDrafts.map((draft: WillDraft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {draft.data.testatorName || 'Untitled Will'}
                        </h3>
                        <p className="text-sm text-gray-500">Will Draft</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWillDraft(draft.id)}
                      disabled={deleteWillDraftMutation.isPending}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Number(draft.data.completionStatus)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Number(draft.data.completionStatus)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last modified: {new Date(Number(draft.lastModified) / 1000000).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-500 space-y-1">
                        {draft.data.executorName && (
                          <p>Executor: {draft.data.executorName}</p>
                        )}
                        {draft.data.specificGifts.length > 0 && (
                          <p>Specific gifts: {draft.data.specificGifts.length}</p>
                        )}
                        {draft.data.residuaryBeneficiaries.length > 0 && (
                          <p>Beneficiaries: {draft.data.residuaryBeneficiaries.length}</p>
                        )}
                      </div>
                    </div>

                    {isWillComplete(draft) && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center text-xs text-green-600 mb-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          Will Complete
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onViewWillDraft(draft)}
                        className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => onEditWillDraft(draft)}
                        className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>

                    {isWillComplete(draft) && (
                      <button
                        onClick={() => handleDownloadWillDraft(draft)}
                        disabled={generatingDocuments.has(draft.id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {generatingDocuments.has(draft.id) ? 'Generating...' : 'Download Will'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Trust Drafts */}
      {activeTab === 'trusts' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trustDrafts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Trust Drafts</h3>
              <p className="text-gray-600">Start creating your trust to save drafts here.</p>
            </div>
          ) : (
            trustDrafts.map((draft: TrustDraft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Shield className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {draft.data.trustName || 'Untitled Trust'}
                        </h3>
                        <p className="text-sm text-gray-500">Trust Draft</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTrustDraft(draft.id)}
                      disabled={deleteTrustDraftMutation.isPending}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Number(draft.data.completionStatus)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Number(draft.data.completionStatus)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last modified: {new Date(Number(draft.lastModified) / 1000000).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-500 space-y-1">
                        {draft.data.trustorName && (
                          <p>Trustor: {draft.data.trustorName}</p>
                        )}
                        {draft.data.trusteeName && (
                          <p>Trustee: {draft.data.trusteeName}</p>
                        )}
                        {draft.data.trustAssets.length > 0 && (
                          <p>Assets: {draft.data.trustAssets.length}</p>
                        )}
                        {draft.data.beneficiaries.length > 0 && (
                          <p>Beneficiaries: {draft.data.beneficiaries.length}</p>
                        )}
                      </div>
                    </div>

                    {isTrustComplete(draft) && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center text-xs text-green-600 mb-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          Trust Complete
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onViewTrustDraft(draft)}
                        className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => onEditTrustDraft(draft)}
                        className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>

                    {isTrustComplete(draft) && (
                      <button
                        onClick={() => handleDownloadTrustDraft(draft)}
                        disabled={generatingDocuments.has(draft.id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {generatingDocuments.has(draft.id) ? 'Generating...' : 'Download Trust'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
