import React, { useState, useEffect } from 'react';
import { useGetWillDraft, useSaveWillDraft, useGetCallerUserProfile } from '../hooks/useQueries';
import { ArrowLeft, Save, Check, Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import WillForm from './WillForm';

interface WillEditorProps {
  onBack: () => void;
}

// Robust DOCX library loading with multiple fallback strategies
const loadDocxLibrary = async (): Promise<any> => {
  try {
    // Check if docx is already loaded
    if (typeof window !== 'undefined' && (window as any).docx) {
      return (window as any).docx;
    }

    // Primary CDN sources with different versions for maximum compatibility
    const cdnSources = [
      'https://unpkg.com/docx@8.5.0/build/index.js',
      'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js',
      'https://unpkg.com/docx@7.8.2/build/index.js',
      'https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.js'
    ];

    let lastError: Error | null = null;

    for (const src of cdnSources) {
      try {
        console.log(`Attempting to load docx library from: ${src}`);
        
        await new Promise<void>((resolve, reject) => {
          // Remove any existing script tags for docx
          const existingScripts = document.querySelectorAll('script[src*="docx"]');
          existingScripts.forEach(script => script.remove());

          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          
          const timeout = setTimeout(() => {
            script.remove();
            reject(new Error(`Timeout loading from ${src}`));
          }, 15000); // 15 second timeout

          script.onload = () => {
            clearTimeout(timeout);
            // Wait for the library to initialize properly
            setTimeout(() => {
              if ((window as any).docx && (window as any).docx.Document && (window as any).docx.Packer) {
                console.log(`Successfully loaded docx library from: ${src}`);
                resolve();
              } else {
                script.remove();
                reject(new Error(`Library loaded but not properly initialized from ${src}`));
              }
            }, 1000);
          };
          
          script.onerror = () => {
            clearTimeout(timeout);
            script.remove();
            reject(new Error(`Failed to load script from ${src}`));
          };
          
          document.head.appendChild(script);
        });
        
        return (window as any).docx;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(`Failed to load from ${src}`);
        console.warn(`Failed to load docx from ${src}:`, error);
        continue;
      }
    }

    throw lastError || new Error('Failed to load docx library from all CDN sources');
  } catch (error) {
    console.error('Critical error loading docx library:', error);
    throw new Error('Unable to load document generation library. Please check your internet connection and try again.');
  }
};

// Date formatting utility function - ensures consistent full text formatting
const formatDateToFullText = (dateString: string): string => {
  if (!dateString) return dateString;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateString;
  }
};

// Enhanced form data serialization and restoration utilities
const serializeFormData = (formData: Record<string, string>): string => {
  try {
    // Create a complete copy with all necessary metadata
    const serializedData = {
      ...formData,
      _version: '2.0', // Updated version for better compatibility
      _timestamp: Date.now(),
      _serialized: true
    };
    
    return JSON.stringify(serializedData);
  } catch (error) {
    console.error('Error serializing form data:', error);
    return JSON.stringify(formData);
  }
};

const deserializeFormData = (content: string): Record<string, string> => {
  try {
    if (!content) return {};
    
    const parsed = JSON.parse(content);
    
    // Remove metadata fields
    const { _version, _timestamp, _serialized, ...formData } = parsed;
    
    return formData;
  } catch (error) {
    console.error('Error deserializing form data:', error);
    return {};
  }
};

// Enhanced dynamic list count detection with comprehensive field scanning
const detectDynamicListCounts = (formData: Record<string, string>) => {
  const counts = {
    childrenCount: 0,
    beneficiaryCount: 0,
    realPropertyCount: 0,
    personalPropertyCount: 0,
    emailAccountCount: 0,
    socialAccountCount: 0,
    techAccountCount: 0,
    cryptoWalletCount: 0,
    cryptoExchangeCount: 0,
  };

  // Detect children count
  let maxChildIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^child(\d+)(Name|BirthDate)$/);
    if (match) {
      maxChildIndex = Math.max(maxChildIndex, parseInt(match[1]));
    }
  });
  counts.childrenCount = Math.max(maxChildIndex, 2); // Minimum 2

  // Detect beneficiary count
  let maxBeneficiaryIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^beneficiary(\d+)(Name|Relation|Percentage)$/);
    if (match) {
      maxBeneficiaryIndex = Math.max(maxBeneficiaryIndex, parseInt(match[1]));
    }
  });
  counts.beneficiaryCount = Math.max(maxBeneficiaryIndex, 2); // Minimum 2

  // Detect real property count
  let maxRealPropertyIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^realProperty(\d+)(Address|Beneficiary)$/);
    if (match) {
      maxRealPropertyIndex = Math.max(maxRealPropertyIndex, parseInt(match[1]));
    }
  });
  counts.realPropertyCount = Math.max(maxRealPropertyIndex, 1); // Minimum 1

  // Detect personal property count
  let maxPersonalPropertyIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^personalProperty(\d+)(Description|Beneficiary|AlternateBeneficiary)$/);
    if (match) {
      maxPersonalPropertyIndex = Math.max(maxPersonalPropertyIndex, parseInt(match[1]));
    }
  });
  counts.personalPropertyCount = Math.max(maxPersonalPropertyIndex, 1); // Minimum 1

  // Detect email account count
  let maxEmailAccountIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^emailAccount(\d+)(Name|Provider|Action)$/);
    if (match) {
      maxEmailAccountIndex = Math.max(maxEmailAccountIndex, parseInt(match[1]));
    }
  });
  counts.emailAccountCount = Math.max(maxEmailAccountIndex, 1); // Minimum 1

  // Detect social account count
  let maxSocialAccountIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^socialAccount(\d+)(Name|Platform|Action)$/);
    if (match) {
      maxSocialAccountIndex = Math.max(maxSocialAccountIndex, parseInt(match[1]));
    }
  });
  counts.socialAccountCount = Math.max(maxSocialAccountIndex, 1); // Minimum 1

  // Detect tech account count
  let maxTechAccountIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^techAccount(\d+)(Name|Platform|Action)$/);
    if (match) {
      maxTechAccountIndex = Math.max(maxTechAccountIndex, parseInt(match[1]));
    }
  });
  counts.techAccountCount = Math.max(maxTechAccountIndex, 1); // Minimum 1

  // Detect crypto wallet count
  let maxCryptoWalletIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^cryptoWallet(\d+)(Name|Type|Beneficiary)$/);
    if (match) {
      maxCryptoWalletIndex = Math.max(maxCryptoWalletIndex, parseInt(match[1]));
    }
  });
  counts.cryptoWalletCount = Math.max(maxCryptoWalletIndex, 1); // Minimum 1

  // Detect crypto exchange count
  let maxCryptoExchangeIndex = 0;
  Object.keys(formData).forEach(key => {
    const match = key.match(/^cryptoExchange(\d+)(Name|Platform|Beneficiary)$/);
    if (match) {
      maxCryptoExchangeIndex = Math.max(maxCryptoExchangeIndex, parseInt(match[1]));
    }
  });
  counts.cryptoExchangeCount = Math.max(maxCryptoExchangeIndex, 1); // Minimum 1

  return counts;
};

export default function WillEditor({ onBack }: WillEditorProps) {
  const { data: draft, isLoading: draftLoading } = useGetWillDraft();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveWillDraft = useSaveWillDraft();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form data with comprehensive defaults and draft restoration
  useEffect(() => {
    if (!isInitialized && userProfile) {
      let initialData: Record<string, string> = {
        // Basic defaults with comprehensive field coverage
        testatorName: userProfile.name,
        state: 'California',
        county: '',
        maritalStatus: '',
        spouseName: '',
        formerSpouseName: '',
        divorceOrDeath: '',
        hasChildren: 'No',
        hasMinorChildren: 'false',
        hasRealPropertyBequests: 'false',
        hasPersonalPropertyBequests: 'false',
        digitalExecutor: '',
        successorDigitalExecutor: '',
        remainsDisposition: '',
        buriedLocation: '',
        memorialService: '',
        funeralRepresentative: '',
        alternativeFuneralRepresentative: '',
        primaryExecutorName: '',
        successorExecutorName: '',
        executorBondWaived: 'false',
        primaryGuardianName: '',
        successorGuardianName: '',
        guardianBondWaived: 'false',
        executionDate: '',
        executionCity: '',
        dateOfNotarization: '',
        notaryName: '',
        notaryAddress: '',
        // Dynamic list counts with defaults
        childrenCount: '2',
        beneficiaryCount: '2',
        realPropertyCount: '1',
        personalPropertyCount: '1',
        emailAccountCount: '1',
        socialAccountCount: '1',
        techAccountCount: '1',
        cryptoWalletCount: '1',
        cryptoExchangeCount: '1',
      };

      // If we have a draft, parse and merge its content with comprehensive restoration
      if (draft && draft.content) {
        try {
          const parsedContent = deserializeFormData(draft.content);
          console.log('Parsing draft content, found fields:', Object.keys(parsedContent).length);
          
          // Merge parsed content with defaults, giving priority to parsed content
          initialData = { ...initialData, ...parsedContent };
          
          // Detect and restore dynamic list counts with enhanced detection
          const detectedCounts = detectDynamicListCounts(parsedContent);
          
          // Store counts in form data for proper restoration
          Object.entries(detectedCounts).forEach(([key, value]) => {
            initialData[key] = value.toString();
          });
          
          console.log('Restored draft data with detected counts:', detectedCounts);
          console.log('Total fields restored:', Object.keys(initialData).length);
        } catch (error) {
          console.error('Failed to parse draft content:', error);
        }
      }

      setFormData(initialData);
      setIsInitialized(true);
      console.log('Form initialized with', Object.keys(initialData).length, 'fields');
    }
  }, [draft, userProfile, isInitialized]);

  // Enhanced auto-save functionality with comprehensive data serialization
  useEffect(() => {
    if (hasUnsavedChanges && Object.keys(formData).length > 0 && isInitialized) {
      const timeoutId = setTimeout(async () => {
        try {
          await performSave();
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData, hasUnsavedChanges, isInitialized]);

  // Enhanced save function with complete data serialization and validation
  const performSave = async () => {
    if (!userProfile) return;

    try {
      // Create a complete copy of form data for serialization
      const completeFormData = { ...formData };
      
      // Ensure all dynamic list counts are properly stored
      const detectedCounts = detectDynamicListCounts(formData);
      Object.entries(detectedCounts).forEach(([key, value]) => {
        completeFormData[key] = value.toString();
      });

      // Ensure all dynamic list entries are preserved with comprehensive field coverage
      const { childrenCount, beneficiaryCount, realPropertyCount, personalPropertyCount, 
              emailAccountCount, socialAccountCount, techAccountCount, 
              cryptoWalletCount, cryptoExchangeCount } = detectedCounts;

      // Preserve all children data
      for (let i = 1; i <= childrenCount; i++) {
        ['Name', 'BirthDate'].forEach(field => {
          const key = `child${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      // Preserve all beneficiary data
      for (let i = 1; i <= beneficiaryCount; i++) {
        ['Name', 'Relation', 'Percentage'].forEach(field => {
          const key = `beneficiary${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      // Preserve all real property data
      for (let i = 1; i <= realPropertyCount; i++) {
        ['Address', 'Beneficiary'].forEach(field => {
          const key = `realProperty${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      // Preserve all personal property data
      for (let i = 1; i <= personalPropertyCount; i++) {
        ['Description', 'Beneficiary', 'AlternateBeneficiary'].forEach(field => {
          const key = `personalProperty${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      // Preserve all digital asset data with comprehensive field coverage
      for (let i = 1; i <= emailAccountCount; i++) {
        ['Name', 'Provider', 'Action'].forEach(field => {
          const key = `emailAccount${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      for (let i = 1; i <= socialAccountCount; i++) {
        ['Name', 'Platform', 'Action'].forEach(field => {
          const key = `socialAccount${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      for (let i = 1; i <= techAccountCount; i++) {
        ['Name', 'Platform', 'Action'].forEach(field => {
          const key = `techAccount${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      for (let i = 1; i <= cryptoWalletCount; i++) {
        ['Name', 'Type', 'Beneficiary'].forEach(field => {
          const key = `cryptoWallet${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      for (let i = 1; i <= cryptoExchangeCount; i++) {
        ['Name', 'Platform', 'Beneficiary'].forEach(field => {
          const key = `cryptoExchange${i}${field}`;
          if (formData[key] !== undefined) {
            completeFormData[key] = formData[key] || '';
          }
        });
      }

      // Ensure all static fields are preserved
      const staticFields = [
        'testatorName', 'state', 'county', 'maritalStatus', 'spouseName', 'formerSpouseName',
        'divorceOrDeath', 'hasChildren', 'hasMinorChildren', 'hasRealPropertyBequests',
        'hasPersonalPropertyBequests', 'digitalExecutor', 'successorDigitalExecutor',
        'remainsDisposition', 'buriedLocation', 'memorialService', 'funeralRepresentative',
        'alternativeFuneralRepresentative', 'primaryExecutorName', 'successorExecutorName',
        'executorBondWaived', 'primaryGuardianName', 'successorGuardianName',
        'guardianBondWaived', 'executionDate', 'executionCity', 'dateOfNotarization',
        'notaryName', 'notaryAddress'
      ];

      staticFields.forEach(field => {
        if (formData[field] !== undefined) {
          completeFormData[field] = formData[field] || '';
        }
      });

      const draftData = {
        id: draft?.id || 'will-draft-1',
        title: `${userProfile.name} Will Draft`,
        content: serializeFormData(completeFormData),
        lastModified: BigInt(Date.now() * 1000000),
      };
      
      console.log('Saving draft with', Object.keys(completeFormData).length, 'fields');
      await saveWillDraft.mutateAsync(draftData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      console.log('Save completed successfully');
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  };

  const handleFormChange = (newData: Record<string, string>) => {
    console.log('Form data changed, new field count:', Object.keys(newData).length);
    setFormData(newData);
    setHasUnsavedChanges(true);
  };

  const handleManualSave = async () => {
    try {
      await performSave();
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  };

  const generateArticleI = (data: Record<string, string>) => {
    let articleI = `I, ${data.testatorName || '[Full Legal Name of Testator]'}, a resident of the State of California, being of sound mind and memory, and not acting under duress, menace, fraud, or undue influence, do hereby make, publish, and declare this to be my Last Will and Testament, revoking all prior wills and codicils made by me.\n\n`;
    
    const maritalStatus = data.maritalStatus || '[single/married/divorced/widowed]';
    articleI += `I am ${maritalStatus}`;
    
    if (maritalStatus === 'married' && data.spouseName) {
      articleI += ` to ${data.spouseName}`;
    } else if (maritalStatus === 'divorced' && data.formerSpouseName) {
      articleI += `. My former spouse is ${data.formerSpouseName}, and our marriage was terminated by divorce`;
    } else if (maritalStatus === 'widowed' && data.formerSpouseName) {
      articleI += `. My former spouse was ${data.formerSpouseName}, and our marriage was terminated by death`;
    }
    articleI += `.\n\n`;

    if (data.hasChildren === 'Yes') {
      articleI += `I have the following children:\n`;
      // Parse children data with consistent date formatting
      const childrenData = [];
      const childrenCount = parseInt(data.childrenCount || '2');
      for (let i = 1; i <= childrenCount; i++) {
        if (data[`child${i}Name`] || data[`child${i}BirthDate`]) {
          const childName = data[`child${i}Name`] || `[Full Name of Child ${i}]`;
          const childBirthDate = data[`child${i}BirthDate`] ? formatDateToFullText(data[`child${i}BirthDate`]) : `[Date of Birth of Child ${i}]`;
          childrenData.push({ name: childName, birthDate: childBirthDate });
        }
      }
      
      if (childrenData.length === 0) {
        // Default placeholders if no children entered yet
        articleI += `[Full Name of Child 1], born [Date of Birth of Child 1]\n`;
        articleI += `[Full Name of Child 2], born [Date of Birth of Child 2]\n`;
      } else {
        childrenData.forEach(child => {
          articleI += `${child.name}, born ${child.birthDate}\n`;
        });
      }
    } else {
      articleI += `I have no children.\n`;
    }

    return articleI;
  };

  const generateArticleIII = (data: Record<string, string>) => {
    let articleIII = `I give, devise, and bequeath all my property, both real and personal, of every kind and nature, and wherever situated, which I may own at the time of my death (my "residuary estate"), to the following beneficiaries in the proportions specified:\n\n`;
    
    // Parse beneficiary data
    const beneficiaries = [];
    const beneficiaryCount = parseInt(data.beneficiaryCount || '2');
    for (let i = 1; i <= beneficiaryCount; i++) {
      if (data[`beneficiary${i}Name`] || data[`beneficiary${i}Relation`] || data[`beneficiary${i}Percentage`]) {
        const name = data[`beneficiary${i}Name`] || `[Full Name of Residuary Beneficiary ${i}]`;
        const relation = data[`beneficiary${i}Relation`] || `[Your Relationship]`;
        const percentage = data[`beneficiary${i}Percentage`] || `[%]`;
        beneficiaries.push({ name, relation, percentage });
      }
    }
    
    if (beneficiaries.length === 0) {
      // Default placeholders if no beneficiaries entered yet
      articleIII += `To [Full Name of Residuary Beneficiary 1], [Your Relationship], [%] of my estate.\n\n`;
      articleIII += `To [Full Name of Residuary Beneficiary 2], [Your Relationship], [%] of my estate.\n\n`;
    } else {
      beneficiaries.forEach(beneficiary => {
        articleIII += `To ${beneficiary.name}, ${beneficiary.relation}, ${beneficiary.percentage} of my estate.\n\n`;
      });
    }
    
    articleIII += `If any beneficiary named above does not survive me by the California default 120 hours (5 days), that beneficiary's share shall be distributed equally among the surviving beneficiaries named above.`;
    
    return articleIII;
  };

  const generateArticleIV = (data: Record<string, string>) => {
    let articleIV = '';
    
    // Real property bequests
    if (data.hasRealPropertyBequests === 'true') {
      const realPropertyBequests = [];
      const realPropertyCount = parseInt(data.realPropertyCount || '1');
      for (let i = 1; i <= realPropertyCount; i++) {
        if (data[`realProperty${i}Address`] || data[`realProperty${i}Beneficiary`]) {
          const address = data[`realProperty${i}Address`] || `[Address or Legal Description of Property ${i}]`;
          const beneficiary = data[`realProperty${i}Beneficiary`] || `[Full Name of Beneficiary ${i}]`;
          realPropertyBequests.push({ address, beneficiary });
        }
      }
      
      if (realPropertyBequests.length > 0) {
        realPropertyBequests.forEach(bequest => {
          articleIV += `I give my real property located at ${bequest.address} to ${bequest.beneficiary}, subject to any encumbrances or liens existing at the time of my death.\n\n`;
        });
      }
    }
    
    // Personal property bequests
    if (data.hasPersonalPropertyBequests === 'true') {
      const personalPropertyBequests = [];
      const personalPropertyCount = parseInt(data.personalPropertyCount || '1');
      for (let i = 1; i <= personalPropertyCount; i++) {
        if (data[`personalProperty${i}Description`] || data[`personalProperty${i}Beneficiary`] || data[`personalProperty${i}AlternateBeneficiary`]) {
          const description = data[`personalProperty${i}Description`] || `[Description of Property ${i}]`;
          const beneficiary = data[`personalProperty${i}Beneficiary`] || `[Full Name of Specific Beneficiary ${i}]`;
          const alternateBeneficiary = data[`personalProperty${i}AlternateBeneficiary`] || `[Full Name of Alternate Beneficiary ${i}]`;
          personalPropertyBequests.push({ description, beneficiary, alternateBeneficiary });
        }
      }
      
      if (personalPropertyBequests.length > 0) {
        personalPropertyBequests.forEach(bequest => {
          articleIV += `I give ${bequest.description} to ${bequest.beneficiary}. If ${bequest.beneficiary} does not survive me, this bequest shall go to ${bequest.alternateBeneficiary}. If any beneficiary named in this section predeceases me, the gift to that beneficiary shall lapse and become part of my residuary estate unless otherwise specified.\n\n`;
        });
      }
    }
    
    if (!articleIV.trim()) {
      articleIV = 'No specific bequests have been designated.\n\n';
    }
    
    return articleIV.trim();
  };

  const generateArticleV = (data: Record<string, string>) => {
    const digitalExecutor = data.digitalExecutor || '[Full Name of Digital Executor]';
    const successorDigitalExecutor = data.successorDigitalExecutor || '[Full Name of Successor Digital Executor]';
    
    let articleV = `I hereby nominate and appoint ${digitalExecutor} as my Digital Executor to manage my digital assets. If ${digitalExecutor} is unable or unwilling to serve, I nominate ${successorDigitalExecutor} as my successor Digital Executor.\n\n`;
    
    // Add the two new legal paragraphs
    articleV += `"Digital Assets" include, without limitation, emails, social media, cloud, server, domain names, electronic files, and cryptocurrencies, regardless of their storage medium or location. I direct that the following Digital Assets to be handled as follows:\n\n`;
    
    articleV += `The Digital Executor is authorized to access, manage, control, transfer, or close Digital Assets to the extent permitted by law and provider terms. The Executor may request usernames, passwords, and decryption keys and may seek court orders, if necessary, under the Revised Uniform Fiduciary Access to Digital Assets Act (Cal. Prob. Code §§870–884). This grant does not require the Executor to violate applicable Terms of Service or criminal law; where access requires additional legal process, the Digital Executor may seek court authority. For cryptocurrency or private keys, the Testator expressly authorizes transfer of private keys and cryptocurrency to the Digital Executor.\n\n`;
    
    articleV += `DIGITAL ASSETS TO BE CLOSED OR MAINTAINED:\n\n`;
    
    // Email accounts
    const emailAccounts = [];
    const emailAccountCount = parseInt(data.emailAccountCount || '1');
    for (let i = 1; i <= emailAccountCount; i++) {
      if (data[`emailAccount${i}Name`] || data[`emailAccount${i}Provider`] || data[`emailAccount${i}Action`]) {
        const name = data[`emailAccount${i}Name`] || `[Email Account Name]`;
        const provider = data[`emailAccount${i}Provider`] || `[Gmail / Yahoo Mail / Microsoft Mail / AOL Mail / iCloud Mail / Other]`;
        const action = data[`emailAccount${i}Action`] || `[closed / maintained]`;
        emailAccounts.push({ name, provider, action });
      }
    }
    
    if (emailAccounts.length > 0) {
      emailAccounts.forEach(account => {
        articleV += `${account.name}, ${account.provider}, should be ${account.action}\n`;
      });
      articleV += '\n';
    }
    
    // Social accounts
    const socialAccounts = [];
    const socialAccountCount = parseInt(data.socialAccountCount || '1');
    for (let i = 1; i <= socialAccountCount; i++) {
      if (data[`socialAccount${i}Name`] || data[`socialAccount${i}Platform`] || data[`socialAccount${i}Action`]) {
        const name = data[`socialAccount${i}Name`] || `[Social Account Name]`;
        const platform = data[`socialAccount${i}Platform`] || `[Meta, Instagram / Meta Messenger / TikTok / iMessage / X (Twitter) / Pinterest / Snapchat / LinkedIn / Reddit / Other]`;
        const action = data[`socialAccount${i}Action`] || `[closed / maintained]`;
        socialAccounts.push({ name, platform, action });
      }
    }
    
    if (socialAccounts.length > 0) {
      socialAccounts.forEach(account => {
        articleV += `${account.name}, ${account.platform}, should be ${account.action}\n`;
      });
      articleV += '\n';
    }
    
    // Tech accounts
    const techAccounts = [];
    const techAccountCount = parseInt(data.techAccountCount || '1');
    for (let i = 1; i <= techAccountCount; i++) {
      if (data[`techAccount${i}Name`] || data[`techAccount${i}Platform`] || data[`techAccount${i}Action`]) {
        const name = data[`techAccount${i}Name`] || `[Tech Account Name]`;
        const platform = data[`techAccount${i}Platform`] || `[YouTube / Amazon / eBay / Etsy / Walmart / Netflix / Discord / Go Daddy / Other]`;
        const action = data[`techAccount${i}Action`] || `[closed / maintained]`;
        techAccounts.push({ name, platform, action });
      }
    }
    
    if (techAccounts.length > 0) {
      techAccounts.forEach(account => {
        articleV += `${account.name}, ${account.platform}, should be ${account.action}\n`;
      });
      articleV += '\n';
    }
    
    articleV += `DIGITAL ASSETS TO BE TRANSFERRED TO A SPECIFIC BENEFICIARY:\n\n`;
    
    // Crypto wallets
    const cryptoWallets = [];
    const cryptoWalletCount = parseInt(data.cryptoWalletCount || '1');
    for (let i = 1; i <= cryptoWalletCount; i++) {
      if (data[`cryptoWallet${i}Name`] || data[`cryptoWallet${i}Type`] || data[`cryptoWallet${i}Beneficiary`]) {
        const name = data[`cryptoWallet${i}Name`] || `[Crypto Wallet Name]`;
        const type = data[`cryptoWallet${i}Type`] || `[OISY Wallet / MetaMask / Trust Wallet / Other]`;
        const beneficiary = data[`cryptoWallet${i}Beneficiary`] || `[Digital Assets Beneficiary]`;
        cryptoWallets.push({ name, type, beneficiary });
      }
    }
    
    if (cryptoWallets.length > 0) {
      cryptoWallets.forEach(wallet => {
        articleV += `${wallet.name}, ${wallet.type}, shall be transferred to ${wallet.beneficiary}\n`;
      });
      articleV += '\n';
    }
    
    // Crypto exchanges
    const cryptoExchanges = [];
    const cryptoExchangeCount = parseInt(data.cryptoExchangeCount || '1');
    for (let i = 1; i <= cryptoExchangeCount; i++) {
      if (data[`cryptoExchange${i}Name`] || data[`cryptoExchange${i}Platform`] || data[`cryptoExchange${i}Beneficiary`]) {
        const name = data[`cryptoExchange${i}Name`] || `[Crypto Exchange Name]`;
        const platform = data[`cryptoExchange${i}Platform`] || `[Coinbase / Binance / Kraken / Gemini / Crypto.com / Robinbood Crypto / Bitstamp / Other]`;
        const beneficiary = data[`cryptoExchange${i}Beneficiary`] || `[Digital Assets Beneficiary]`;
        cryptoExchanges.push({ name, platform, beneficiary });
      }
    }
    
    if (cryptoExchanges.length > 0) {
      cryptoExchanges.forEach(exchange => {
        articleV += `${exchange.name}, ${exchange.platform}, shall be transferred to ${exchange.beneficiary}\n`;
      });
    }
    
    return articleV.trim();
  };

  const generateArticleVI = (data: Record<string, string>) => {
    const remainsDisposition = data.remainsDisposition || '[Cremated/Buried]';
    const buriedLocation = data.buriedLocation || '[Buried Location]';
    const memorialService = data.memorialService || '[held/not held]';
    const funeralRepresentative = data.funeralRepresentative || '[Full Name of Funeral Representative]';
    const alternativeFuneralRepresentative = data.alternativeFuneralRepresentative || '[Full Name of Alternative Funeral Representative]';
    
    return `I direct that my remains be ${remainsDisposition} at ${buriedLocation}. A funeral or memorial service shall be ${memorialService} as per my written or verbal instructions provided to my Executor. I nominate ${funeralRepresentative} as the individual responsible for arranging my funeral and burial services. If ${funeralRepresentative} is unable or unwilling to serve, I nominate ${alternativeFuneralRepresentative} as a substitute.`;
  };

  const generateArticleVII = (data: Record<string, string>) => {
    const primaryExecutor = data.primaryExecutorName || '[Full Name of Primary Executor]';
    const successorExecutor = data.successorExecutorName || '[Full Name of Successor Executor]';
    const bondRequirement = data.executorBondWaived === 'true' ? 'no bond' : 'bond';
    
    return `I hereby nominate and appoint ${primaryExecutor} as the Executor of this Will. If ${primaryExecutor} is unable or unwilling to serve, I nominate ${successorExecutor} as Successor Executor.\n\nI grant to my Executor full power and authority to sell, transfer, and convey any and all property, real or personal, at public or private sale, with or without notice, and to execute and deliver any and all deeds, assignments, and other instruments necessary to carry out the provisions of this Will.\n\nI direct that ${bondRequirement} be required of any Executor named herein to post bond for the faithful performance of their duties.`;
  };

  const generateArticleVIII = (data: Record<string, string>) => {
    // Skip if user indicated they have no minor children
    if (data.hasMinorChildren !== 'true') {
      return null;
    }
    
    const primaryGuardian = data.primaryGuardianName || '[Full Name of Primary Guardian]';
    const successorGuardian = data.successorGuardianName || '[Full Name of Successor Guardian]';
    const guardianBondRequirement = data.guardianBondWaived === 'true' ? 'no bond' : 'bond';
    
    return `If I have any minor children at the time of my death, I nominate ${primaryGuardian} to serve as Guardian of the person and estate of my minor children. If ${primaryGuardian} is unable or unwilling to serve, I nominate ${successorGuardian} as Successor Guardian.\n\nI direct that ${guardianBondRequirement} be required of any Guardian named herein to post bond for the faithful performance of their duties.`;
  };

  const generateArticleIX = () => {
    return `No Contest: If any person contests or attempts to invalidate any provision of this Will without probable cause, such person shall forfeit any interest in my estate.\n\nSimultaneous Death: If any beneficiary and I die under circumstances where the order of death cannot be determined, it shall be presumed that I survived the beneficiary.\n\nSeverability Clause: If any provision of this Will is determined to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.\n\nGoverning Law: This Will shall be governed by the laws of the State of California.`;
  };

  const generateArticleX = (data: Record<string, string>) => {
    const testatorName = data.testatorName || userProfile?.name || '[Full Legal Name of Testator]';
    const executionDate = data.executionDate ? formatDateToFullText(data.executionDate) : '[Execution Date]';
    const executionCity = data.executionCity || '[Execution City]';
    const county = data.county || '[County]';
    const dateOfNotarization = data.dateOfNotarization ? formatDateToFullText(data.dateOfNotarization) : '[Date of Notarization]';
    const notaryName = data.notaryName || '[Notary Name]';
    const notaryAddress = data.notaryAddress || '[Notary Address]';
    
    return `I declare that this document is my Last Will and Testament. I sign it knowingly and voluntarily, in the presence of the witnesses below.\n\nExecuted on ${executionDate}, at ${executionCity}, California.\n\n\n\n\nSignature of Testator: ____________________________\nPrinted Name of Testator: ${testatorName}\n\nWITNESSES' ATTESTATION\n\nWe, the undersigned, declare:\n\nThe Testator signed this Will in our presence.\nWe signed as witnesses in the presence of the Testator and each other.\n\nWitness 1: ____________________________\nName: ____________________________\nAddress: ____________________________\n\n\n\nWitness 2: ____________________________\nName: ____________________________\nAddress: ____________________________\n\nNOTARIZATION\n\nState of California\n${county} of the US\n\nOn this ${dateOfNotarization}, before me personally appeared ${testatorName}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.\n\nI certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.\n\nWITNESS my hand and official seal.\n\n____________________________\n${notaryName}\n${notaryAddress}`;
  };

  const createDocumentStructure = (docx: any) => {
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

    try {
      const testatorName = formData.testatorName || userProfile?.name || '[TESTATOR NAME]';

      const paragraphs = [];

      // Title section with ENHANCED professional legal formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "LAST WILL AND TESTAMENT",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 480, line: 360 }, // Enhanced spacing with proper line height
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "OF",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 480, line: 360 }, // Enhanced spacing with proper line height
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: testatorName.toUpperCase(),
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 720, line: 360 }, // Large spacing before content with proper line height
        })
      );

      // Article I - DECLARATION with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE I - DECLARATION",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing with proper line height
        })
      );

      const articleIText = generateArticleI(formData);
      const articleIParagraphs = articleIText.split('\n\n').filter(para => para.trim());
      articleIParagraphs.forEach(para => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ 
              text: para.trim(), 
              size: 24, // 12pt
              font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED, // Professional justified text
            spacing: { after: 240, line: 360 }, // 1.5 line spacing for readability
          })
        );
      });

      // Article II - DEBTS AND EXPENSES with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE II - DEBTS AND EXPENSES",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "I direct that all my legally enforceable debts, funeral expenses, expenses of last illness and administration of my estate be paid as soon as practicable after my death.",
              size: 24, // 12pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Proper line spacing
        })
      );

      // Article III - RESIDUARY ESTATE with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE III - RESIDUARY ESTATE",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        })
      );

      const articleIIIText = generateArticleIII(formData);
      const articleIIIParagraphs = articleIIIText.split('\n\n').filter(para => para.trim());
      articleIIIParagraphs.forEach(para => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ 
              text: para.trim(), 
              size: 24, // 12pt
              font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED, // Professional justified text
            spacing: { after: 240, line: 360 }, // Proper line spacing
          })
        );
      });

      // Article IV - SPECIFIC BEQUESTS with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE IV - SPECIFIC BEQUESTS",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        })
      );

      const articleIVText = generateArticleIV(formData);
      const articleIVParagraphs = articleIVText.split('\n\n').filter(para => para.trim());
      articleIVParagraphs.forEach(para => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ 
              text: para.trim(), 
              size: 24, // 12pt
              font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED, // Professional justified text
            spacing: { after: 240, line: 360 }, // Proper line spacing
          })
        );
      });

      // Article V - DIGITAL ASSETS with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE V - DIGITAL ASSETS",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        })
      );

      const articleVText = generateArticleV(formData);
      const articleVParagraphs = articleVText.split('\n\n').filter(para => para.trim());
      articleVParagraphs.forEach(para => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ 
              text: para.trim(), 
              size: 24, // 12pt
              font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED, // Professional justified text
            spacing: { after: 240, line: 360 }, // Proper line spacing
          })
        );
      });

      // Article VI - FUNERAL AND BURIAL INSTRUCTIONS with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE VI - FUNERAL AND BURIAL INSTRUCTIONS",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: generateArticleVI(formData), 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Proper line spacing
        })
      );

      // Article VII - EXECUTOR with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE VII - EXECUTOR",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        })
      );

      const articleVIIText = generateArticleVII(formData);
      const articleVIIParagraphs = articleVIIText.split('\n\n').filter(para => para.trim());
      articleVIIParagraphs.forEach(para => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ 
              text: para.trim(), 
              size: 24, // 12pt
              font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED, // Professional justified text
            spacing: { after: 240, line: 360 }, // Proper line spacing
          })
        );
      });

      // Article VIII - GUARDIANSHIP (only if has minor children) with ENHANCED professional formatting - Times New Roman throughout
      const articleVIIIText = generateArticleVIII(formData);
      if (articleVIIIText) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "ARTICLE VIII - GUARDIANSHIP",
                bold: true,
                size: 28, // 14pt
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
          })
        );

        const articleVIIIParagraphs = articleVIIIText.split('\n\n').filter(para => para.trim());
        articleVIIIParagraphs.forEach(para => {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ 
                text: para.trim(), 
                size: 24, // 12pt
                font: "Times New Roman"
              })],
              alignment: AlignmentType.JUSTIFIED, // Professional justified text
              spacing: { after: 240, line: 360 }, // Proper line spacing
            })
          );
        });
      }

      // Article IX - MISCELLANEOUS PROVISIONS with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE IX - MISCELLANEOUS PROVISIONS",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        })
      );

      const articleIXText = generateArticleIX();
      const articleIXParagraphs = articleIXText.split('\n\n').filter(para => para.trim());
      articleIXParagraphs.forEach(para => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ 
              text: para.trim(), 
              size: 24, // 12pt
              font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED, // Professional justified text
            spacing: { after: 240, line: 360 }, // Proper line spacing
          })
        );
      });

      // Article X - ATTESTATION with MAXIMUM ENHANCED professional legal formatting and SPECIAL ATTENTION to signature spacing
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ARTICLE X - ATTESTATION",
              bold: true,
              size: 28, // 14pt
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 360 }, // Professional spacing
        })
      );

      // Main attestation paragraph with ENHANCED professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ 
            text: "I declare that this document is my Last Will and Testament. I sign it knowingly and voluntarily, in the presence of the witnesses below.", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Proper line spacing
        })
      );

      // Execution details with ENHANCED professional formatting - Times New Roman throughout
      const executionDate = formData.executionDate ? formatDateToFullText(formData.executionDate) : '[Execution Date]';
      const executionCity = formData.executionCity || '[Execution City]';
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ 
            text: `Executed on ${executionDate}, at ${executionCity}, California.`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 480, line: 360 }, // Large spacing before signature section
        })
      );

      // MAXIMUM ENHANCED testator signature block with SPECIAL ATTENTION to spacing for handwritten signatures (minimum 6 lines)
      paragraphs.push(
        // Add MAXIMUM EXTRA space before signature line for handwritten signature (6 lines minimum)
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 1 of signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 2 of signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 3 of signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 4 of signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 5 of signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 6 of signature space (MAXIMUM for handwritten signature)
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Signature of Testator: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `Printed Name of Testator: ${formData.testatorName || userProfile?.name || '[Full Legal Name of Testator]'}`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 480, line: 360 }, // Large spacing before witnesses section
        })
      );

      // MAXIMUM ENHANCED Witnesses' Attestation with professional formatting and clear hierarchy - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ 
            text: "WITNESSES' ATTESTATION", 
            bold: true,
            size: 26, // Slightly larger for section heading
            font: "Times New Roman"
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "We, the undersigned, declare:", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "The Testator signed this Will in our presence.", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "We signed as witnesses in the presence of the Testator and each other.", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 480, line: 360 }, // Large spacing before witness signatures
        })
      );

      // MAXIMUM ENHANCED witness signature blocks with SPECIAL ATTENTION to spacing for handwritten signatures (minimum 6 lines each)
      paragraphs.push(
        // MAXIMUM EXTRA space before witness 1 signature (6 lines minimum)
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 1 of witness 1 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 2 of witness 1 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 3 of witness 1 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 4 of witness 1 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 5 of witness 1 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 6 of witness 1 signature space (MAXIMUM)
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Witness 1: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Name: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Address: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 360, line: 360 }, // Spacing between witnesses
        }),
        // MAXIMUM EXTRA space between witnesses for clarity
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Extra separation line
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Extra separation line 2
        }),
        // MAXIMUM EXTRA space before witness 2 signature (6 lines minimum)
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 1 of witness 2 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 2 of witness 2 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 3 of witness 2 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 4 of witness 2 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 5 of witness 2 signature space
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "", 
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 240 }, // Line 6 of witness 2 signature space (MAXIMUM)
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Witness 2: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Name: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Address: ____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 480, line: 360 }, // Large spacing before notarization section
        })
      );

      // NOTARIZATION section with professional formatting - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ 
            text: "NOTARIZATION", 
            bold: true,
            size: 26, // Slightly larger for section heading
            font: "Times New Roman"
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "State of California", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `${formData.county || '[County]'} of the US`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `On this ${formData.dateOfNotarization ? formatDateToFullText(formData.dateOfNotarization) : '[Date of Notarization]'}, before me personally appeared ${formData.testatorName || userProfile?.name || '[Full Legal Name of Testator]'}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          alignment: AlignmentType.JUSTIFIED, // Professional justified text
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "WITNESS my hand and official seal.", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 480, line: 360 }, // Large spacing before notary signature
        })
      );

      // Notary section with proper formatting and spacing - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ 
            text: "____________________________", 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `${formData.notaryName || '[Notary Name]'}`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `${formData.notaryAddress || '[Notary Address]'}`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        })
      );

      // Enhanced draft watermark with professional styling - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "DRAFT - FOR REVIEW PURPOSES ONLY",
              bold: true,
              size: 32, // 16pt
              color: "FF0000",
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 720 }, // Large spacing before watermark
        })
      );

      return new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });
    } catch (error) {
      console.error('Error creating document structure:', error);
      throw new Error('Failed to create document structure. Please try again.');
    }
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      console.log('Starting DOCX export process...');
      
      // Load the docx library with enhanced error handling
      const docx = await loadDocxLibrary();
      
      if (!docx || !docx.Document || !docx.Packer) {
        throw new Error('Document generation library is not properly loaded. Please refresh the page and try again.');
      }

      console.log('DOCX library loaded successfully, creating document...');

      // Create the document structure
      const doc = createDocumentStructure(docx);

      console.log('Document structure created, generating blob...');

      // Generate blob with enhanced timeout and error handling
      const generateBlob = async (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Document generation timed out after 45 seconds. Please try again.'));
          }, 45000);

          docx.Packer.toBlob(doc)
            .then((blob: Blob) => {
              clearTimeout(timeout);
              if (!blob || blob.size === 0) {
                reject(new Error('Generated document is empty. Please try again.'));
              } else {
                console.log(`Document blob generated successfully, size: ${blob.size} bytes`);
                resolve(blob);
              }
            })
            .catch((error: any) => {
              clearTimeout(timeout);
              console.error('Blob generation error:', error);
              reject(new Error(`Document generation failed: ${error.message || 'Unknown error'}`));
            });
        });
      };

      const blob = await generateBlob();

      // Create and trigger download
      const testatorName = formData.testatorName || userProfile?.name || 'Will';
      const fileName = `${testatorName.replace(/\s+/g, '_')}_Will_Draft_${new Date().toISOString().split('T')[0]}.docx`;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      console.log('Download initiated successfully');

      // Show success message
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);

    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during document generation.';
      setExportError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  if (draftLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drafts
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {draft ? 'Edit Will Draft' : 'Create New Will'}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Save Status */}
          <div className="flex items-center text-sm">
            {saveWillDraft.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span className="text-gray-600">Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <span className="text-orange-600">Unsaved changes</span>
            ) : lastSaved ? (
              <>
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </>
            ) : null}
          </div>

          {/* Export Button - Always visible and functional */}
          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating DOCX...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export DOCX
              </>
            )}
          </button>

          {/* Manual Save Button - Always available */}
          <button
            onClick={handleManualSave}
            disabled={saveWillDraft.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveWillDraft.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {exportSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Document Generated Successfully</h3>
              <p className="mt-1 text-sm text-green-700">Your will draft has been downloaded as a professionally formatted Word document with consistent Times New Roman font throughout, 12pt body text and 14pt headings, justified text alignment, appropriate paragraph spacing, bold formatting for all article headings, and enhanced formatting for the witness attestation, notarization, and notary sections with maximum spacing (6+ lines) for handwritten signatures and proper notary name and address placement.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {exportError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Document Export Failed</h3>
              <p className="mt-1 text-sm text-red-700">{exportError}</p>
              <div className="mt-2">
                <button
                  onClick={handleExportDocx}
                  disabled={isExporting}
                  className="text-sm text-red-600 hover:text-red-800 underline disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <WillForm
        initialData={formData}
        onChange={handleFormChange}
        testatorName={userProfile?.name || ''}
      />
    </div>
  );
}



