import React, { useState, useEffect } from 'react';
import { FileText, User, MapPin, Calendar, Shuffle, Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface SamplePersona {
  name: string;
  county: string;
  state: string;
  date: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  hasChildren: boolean;
  hasMinorChildren: boolean;
  spouseName?: string;
  formerSpouseName?: string;
  divorceOrDeath?: 'divorce' | 'death';
  children: Array<{
    name: string;
    birthDate: string;
  }>;
  primaryExecutorName: string;
  primaryExecutorAddress: string;
  successorExecutorName?: string;
  successorExecutorAddress?: string;
  bondRequirement: 'bond' | 'no bond';
  executorBondWaived: boolean;
  personalPropertyBequests: Array<{
    description: string;
    beneficiary: string;
    alternateBeneficiary: string;
  }>;
  realPropertyBequests: Array<{
    address: string;
    beneficiary: string;
  }>;
  digitalAssets: {
    digitalExecutor: string;
    successorDigitalExecutor: string;
    emailAccounts: Array<{
      name: string;
      provider: string;
      action: string;
    }>;
    socialAccounts: Array<{
      name: string;
      platform: string;
      action: string;
    }>;
    techAccounts: Array<{
      name: string;
      platform: string;
      action: string;
    }>;
    cryptoWallets: Array<{
      name: string;
      type: string;
      beneficiary: string;
    }>;
    cryptoExchanges: Array<{
      name: string;
      platform: string;
      beneficiary: string;
    }>;
  };
  funeralInstructions: {
    remainsDisposition: 'Cremated' | 'Buried';
    buriedLocation: string;
    memorialService: 'held' | 'not held';
    funeralRepresentative: string;
    alternativeFuneralRepresentative: string;
  };
  guardianship: {
    primaryGuardian: string;
    successorGuardian: string;
    bondRequirement: 'bond' | 'no bond';
    guardianBondWaived: boolean;
  };
  beneficiaries: Array<{
    name: string;
    relation: string;
    percentage: string;
  }>;
  attestation: {
    executionDate: string;
    executionCity: string;
    county: string;
    dateOfNotarization: string;
    notaryName: string;
    notaryAddress: string;
  };
}

const SAMPLE_PERSONAS: SamplePersona[] = [
  {
    name: 'Jane Elizabeth Smith',
    county: 'Los Angeles',
    state: 'California',
    date: 'March 15, 2024',
    maritalStatus: 'married',
    hasChildren: true,
    hasMinorChildren: true,
    spouseName: 'Robert James Smith',
    children: [
      { name: 'Emily Rose Smith', birthDate: 'June 12, 2010' },
      { name: 'Thomas William Smith', birthDate: 'September 8, 2012' }
    ],
    primaryExecutorName: 'Robert James Smith',
    primaryExecutorAddress: '456 Oak Avenue, Los Angeles, CA 90210',
    successorExecutorName: 'Sarah Michelle Johnson',
    successorExecutorAddress: '789 Pine Street, Beverly Hills, CA 90212',
    bondRequirement: 'no bond',
    executorBondWaived: true,
    personalPropertyBequests: [
      {
        description: 'my grandmother\'s diamond ring',
        beneficiary: 'Emily Rose Smith',
        alternateBeneficiary: 'Thomas William Smith'
      },
      {
        description: 'my collection of first-edition books',
        beneficiary: 'Los Angeles Public Library',
        alternateBeneficiary: 'Thomas William Smith'
      },
      {
        description: 'the sum of $10,000',
        beneficiary: 'American Red Cross',
        alternateBeneficiary: 'Robert James Smith'
      }
    ],
    realPropertyBequests: [
      {
        address: '123 Main Street, Los Angeles, CA 90210',
        beneficiary: 'Emily Rose Smith'
      },
      {
        address: '456 Beach Drive, Malibu, CA 90265',
        beneficiary: 'Thomas William Smith'
      }
    ],
    digitalAssets: {
      digitalExecutor: 'Robert James Smith',
      successorDigitalExecutor: 'Sarah Michelle Johnson',
      emailAccounts: [
        { name: 'jane.smith@gmail.com', provider: 'Gmail', action: 'closed' },
        { name: 'jane.smith@yahoo.com', provider: 'Yahoo Mail', action: 'maintained' }
      ],
      socialAccounts: [
        { name: 'Jane Smith Facebook', platform: 'Meta, Instagram', action: 'closed' },
        { name: '@janesmith', platform: 'X (Twitter)', action: 'maintained' }
      ],
      techAccounts: [
        { name: 'Jane Smith YouTube', platform: 'YouTube', action: 'maintained' },
        { name: 'Jane Smith Amazon', platform: 'Amazon', action: 'closed' }
      ],
      cryptoWallets: [
        { name: 'Jane Main Wallet', type: 'MetaMask', beneficiary: 'Robert James Smith' },
        { name: 'Jane Savings Wallet', type: 'Trust Wallet', beneficiary: 'Emily Rose Smith' }
      ],
      cryptoExchanges: [
        { name: 'Jane Coinbase Account', platform: 'Coinbase', beneficiary: 'Robert James Smith' },
        { name: 'Jane Binance Account', platform: 'Binance', beneficiary: 'Thomas William Smith' }
      ]
    },
    funeralInstructions: {
      remainsDisposition: 'Cremated',
      buriedLocation: 'Forest Lawn Memorial Park, Los Angeles, CA',
      memorialService: 'held',
      funeralRepresentative: 'Robert James Smith',
      alternativeFuneralRepresentative: 'Sarah Michelle Johnson'
    },
    guardianship: {
      primaryGuardian: 'Sarah Michelle Johnson',
      successorGuardian: 'Michael David Smith',
      bondRequirement: 'no bond',
      guardianBondWaived: true
    },
    beneficiaries: [
      { name: 'Robert James Smith', relation: 'spouse', percentage: '60%' },
      { name: 'Emily Rose Smith and Thomas William Smith', relation: 'children', percentage: '40%' }
    ],
    attestation: {
      executionDate: 'March 15, 2024',
      executionCity: 'Los Angeles',
      county: 'Los Angeles',
      dateOfNotarization: 'March 15, 2024',
      notaryName: 'Maria Elena Rodriguez',
      notaryAddress: '1234 Notary Street, Los Angeles, CA 90210'
    }
  },
  {
    name: 'Michael Anthony Rodriguez',
    county: 'San Francisco',
    state: 'California',
    date: 'August 22, 2024',
    maritalStatus: 'single',
    hasChildren: false,
    hasMinorChildren: false,
    children: [],
    primaryExecutorName: 'Maria Elena Rodriguez',
    primaryExecutorAddress: '1234 Mission Street, San Francisco, CA 94103',
    successorExecutorName: 'Carlos Miguel Rodriguez',
    successorExecutorAddress: '567 Castro Street, San Francisco, CA 94114',
    bondRequirement: 'bond',
    executorBondWaived: false,
    personalPropertyBequests: [
      {
        description: 'my vintage guitar collection',
        beneficiary: 'San Francisco Music Conservatory',
        alternateBeneficiary: 'Diego Rodriguez'
      },
      {
        description: 'my art collection',
        beneficiary: 'Diego Rodriguez',
        alternateBeneficiary: 'Maria Elena Rodriguez'
      },
      {
        description: 'the sum of $25,000',
        beneficiary: 'SPCA of San Francisco',
        alternateBeneficiary: 'Carlos Miguel Rodriguez'
      }
    ],
    realPropertyBequests: [
      {
        address: '789 Valencia Street, San Francisco, CA 94110',
        beneficiary: 'Maria Elena Rodriguez'
      }
    ],
    digitalAssets: {
      digitalExecutor: 'Maria Elena Rodriguez',
      successorDigitalExecutor: 'Carlos Miguel Rodriguez',
      emailAccounts: [
        { name: 'michael.rodriguez@gmail.com', provider: 'Gmail', action: 'maintained' },
        { name: 'mike@icloud.com', provider: 'iCloud Mail', action: 'closed' }
      ],
      socialAccounts: [
        { name: '@michaelrodriguezart', platform: 'Meta, Instagram', action: 'maintained' },
        { name: 'Michael Rodriguez', platform: 'LinkedIn', action: 'maintained' }
      ],
      techAccounts: [
        { name: 'Michael Rodriguez', platform: 'YouTube', action: 'maintained' },
        { name: 'MichaelR_SF', platform: 'Netflix', action: 'closed' }
      ],
      cryptoWallets: [
        { name: 'Michael Main BTC', type: 'OISY Wallet', beneficiary: 'Maria Elena Rodriguez' }
      ],
      cryptoExchanges: [
        { name: 'Michael Kraken', platform: 'Kraken', beneficiary: 'Carlos Miguel Rodriguez' }
      ]
    },
    funeralInstructions: {
      remainsDisposition: 'Buried',
      buriedLocation: 'Colma Cemetery, Colma, CA',
      memorialService: 'held',
      funeralRepresentative: 'Maria Elena Rodriguez',
      alternativeFuneralRepresentative: 'Carlos Miguel Rodriguez'
    },
    guardianship: {
      primaryGuardian: 'Maria Elena Rodriguez',
      successorGuardian: 'Carlos Miguel Rodriguez',
      bondRequirement: 'bond',
      guardianBondWaived: false
    },
    beneficiaries: [
      { name: 'Maria Elena Rodriguez', relation: 'sister', percentage: '50%' },
      { name: 'Carlos Miguel Rodriguez', relation: 'brother', percentage: '30%' },
      { name: 'San Francisco Music Conservatory', relation: 'charitable organization', percentage: '20%' }
    ],
    attestation: {
      executionDate: 'August 22, 2024',
      executionCity: 'San Francisco',
      county: 'San Francisco',
      dateOfNotarization: 'August 22, 2024',
      notaryName: 'Jennifer Marie Williams',
      notaryAddress: '567 Notary Avenue, San Francisco, CA 94103'
    }
  },
  {
    name: 'Patricia Ann Williams',
    county: 'Orange',
    state: 'California',
    date: 'November 8, 2024',
    maritalStatus: 'divorced',
    hasChildren: true,
    hasMinorChildren: false,
    formerSpouseName: 'Mark Steven Williams',
    divorceOrDeath: 'divorce',
    children: [
      { name: 'Jennifer Marie Williams', birthDate: 'April 3, 2008' },
      { name: 'Robert Paul Williams', birthDate: 'November 15, 2011' }
    ],
    primaryExecutorName: 'Jennifer Marie Williams',
    primaryExecutorAddress: '789 Beach Boulevard, Huntington Beach, CA 92648',
    successorExecutorName: 'Robert Paul Williams',
    successorExecutorAddress: '456 Pacific Coast Highway, Newport Beach, CA 92660',
    bondRequirement: 'no bond',
    executorBondWaived: true,
    personalPropertyBequests: [
      {
        description: 'my jewelry collection',
        beneficiary: 'Jennifer Marie Williams',
        alternateBeneficiary: 'Robert Paul Williams'
      },
      {
        description: 'my beach house furniture',
        beneficiary: 'Robert Paul Williams',
        alternateBeneficiary: 'Jennifer Marie Williams'
      },
      {
        description: 'the sum of $15,000',
        beneficiary: 'Orange County Food Bank',
        alternateBeneficiary: 'Jennifer Marie Williams'
      }
    ],
    realPropertyBequests: [],
    digitalAssets: {
      digitalExecutor: 'Jennifer Marie Williams',
      successorDigitalExecutor: 'Susan Carol Thompson',
      emailAccounts: [
        { name: 'patricia.williams@yahoo.com', provider: 'Yahoo Mail', action: 'closed' }
      ],
      socialAccounts: [
        { name: 'Patricia Williams', platform: 'LinkedIn', action: 'maintained' },
        { name: 'PatriciaW_OC', platform: 'Pinterest', action: 'closed' }
      ],
      techAccounts: [
        { name: 'Patricia Williams', platform: 'Amazon', action: 'maintained' }
      ],
      cryptoWallets: [
        { name: 'Patricia DOGE Wallet', type: 'Trust Wallet', beneficiary: 'Robert Paul Williams' }
      ],
      cryptoExchanges: [
        { name: 'Patricia Robinhood', platform: 'Robinhood Crypto', beneficiary: 'Jennifer Marie Williams' }
      ]
    },
    funeralInstructions: {
      remainsDisposition: 'Cremated',
      buriedLocation: 'Pacific View Memorial Park, Newport Beach, CA',
      memorialService: 'not held',
      funeralRepresentative: 'Jennifer Marie Williams',
      alternativeFuneralRepresentative: 'Susan Carol Thompson'
    },
    guardianship: {
      primaryGuardian: 'Susan Carol Thompson',
      successorGuardian: 'Michael James Thompson',
      bondRequirement: 'no bond',
      guardianBondWaived: true
    },
    beneficiaries: [
      { name: 'Jennifer Marie Williams', relation: 'daughter', percentage: '50%' },
      { name: 'Robert Paul Williams', relation: 'son', percentage: '50%' }
    ],
    attestation: {
      executionDate: 'November 8, 2024',
      executionCity: 'Newport Beach',
      county: 'Orange',
      dateOfNotarization: 'November 8, 2024',
      notaryName: 'Harold Eugene Thompson',
      notaryAddress: '890 Legal Plaza, Newport Beach, CA 92660'
    }
  },
  {
    name: 'Harold Eugene Thompson',
    county: 'San Diego',
    state: 'California',
    date: 'January 12, 2024',
    maritalStatus: 'widowed',
    hasChildren: true,
    hasMinorChildren: false,
    formerSpouseName: 'Dorothy Mae Thompson',
    divorceOrDeath: 'death',
    children: [
      { name: 'Margaret Louise Thompson', birthDate: 'May 20, 1985' },
      { name: 'William James Thompson', birthDate: 'August 14, 1987' }
    ],
    primaryExecutorName: 'Margaret Louise Thompson',
    primaryExecutorAddress: '1122 Sunset Cliffs Boulevard, San Diego, CA 92107',
    successorExecutorName: 'William James Thompson',
    successorExecutorAddress: '3344 Balboa Park Drive, San Diego, CA 92101',
    bondRequirement: 'bond',
    executorBondWaived: false,
    personalPropertyBequests: [
      {
        description: 'my late wife\'s wedding ring',
        beneficiary: 'Margaret Louise Thompson',
        alternateBeneficiary: 'William James Thompson'
      },
      {
        description: 'my tool collection',
        beneficiary: 'William James Thompson',
        alternateBeneficiary: 'Margaret Louise Thompson'
      },
      {
        description: 'my coin collection',
        beneficiary: 'San Diego History Museum',
        alternateBeneficiary: 'Margaret Louise Thompson'
      },
      {
        description: 'the sum of $20,000',
        beneficiary: 'American Heart Association',
        alternateBeneficiary: 'William James Thompson'
      }
    ],
    realPropertyBequests: [
      {
        address: '5566 Ocean View Drive, La Jolla, CA 92037',
        beneficiary: 'Margaret Louise Thompson'
      },
      {
        address: '7788 Mountain View Road, Escondido, CA 92025',
        beneficiary: 'William James Thompson'
      }
    ],
    digitalAssets: {
      digitalExecutor: 'Margaret Louise Thompson',
      successorDigitalExecutor: 'William James Thompson',
      emailAccounts: [
        { name: 'harold.thompson@aol.com', provider: 'AOL Mail', action: 'maintained' }
      ],
      socialAccounts: [
        { name: 'Harold Thompson', platform: 'Meta, Instagram', action: 'closed' }
      ],
      techAccounts: [
        { name: 'Harold Thompson', platform: 'Amazon', action: 'maintained' },
        { name: 'HaroldT_Photos', platform: 'Go Daddy', action: 'maintained' }
      ],
      cryptoWallets: [
        { name: 'Harold BTC Savings', type: 'MetaMask', beneficiary: 'William James Thompson' }
      ],
      cryptoExchanges: [
        { name: 'Harold Coinbase', platform: 'Coinbase', beneficiary: 'Margaret Louise Thompson' }
      ]
    },
    funeralInstructions: {
      remainsDisposition: 'Buried',
      buriedLocation: 'Mount Hope Cemetery, San Diego, CA',
      memorialService: 'held',
      funeralRepresentative: 'Margaret Louise Thompson',
      alternativeFuneralRepresentative: 'William James Thompson'
    },
    guardianship: {
      primaryGuardian: 'Margaret Louise Thompson',
      successorGuardian: 'William James Thompson',
      bondRequirement: 'bond',
      guardianBondWaived: false
    },
    beneficiaries: [
      { name: 'Margaret Louise Thompson', relation: 'daughter', percentage: '40%' },
      { name: 'William James Thompson', relation: 'son', percentage: '35%' },
      { name: 'San Diego History Museum', relation: 'charitable organization', percentage: '15%' },
      { name: 'American Heart Association', relation: 'charitable organization', percentage: '10%' }
    ],
    attestation: {
      executionDate: 'January 12, 2024',
      executionCity: 'San Diego',
      county: 'San Diego',
      dateOfNotarization: 'January 12, 2024',
      notaryName: 'Lisa Catherine Chen',
      notaryAddress: '456 Legal Center, San Diego, CA 92101'
    }
  },
  {
    name: 'Lisa Catherine Chen',
    county: 'Santa Clara',
    state: 'California',
    date: 'September 30, 2024',
    maritalStatus: 'married',
    hasChildren: false,
    hasMinorChildren: false,
    spouseName: 'David Michael Chen',
    children: [],
    primaryExecutorName: 'David Michael Chen',
    primaryExecutorAddress: '2468 University Avenue, Palo Alto, CA 94301',
    successorExecutorName: 'Amy Susan Chen',
    successorExecutorAddress: '1357 Forest Avenue, San Jose, CA 95128',
    bondRequirement: 'no bond',
    executorBondWaived: true,
    personalPropertyBequests: [
      {
        description: 'my technology stock portfolio',
        beneficiary: 'Stanford University',
        alternateBeneficiary: 'David Michael Chen'
      },
      {
        description: 'my piano',
        beneficiary: 'Emily Chen',
        alternateBeneficiary: 'Amy Susan Chen'
      },
      {
        description: 'the sum of $50,000',
        beneficiary: 'Silicon Valley Community Foundation',
        alternateBeneficiary: 'David Michael Chen'
      }
    ],
    realPropertyBequests: [
      {
        address: '9876 California Street, Mountain View, CA 94041',
        beneficiary: 'David Michael Chen'
      }
    ],
    digitalAssets: {
      digitalExecutor: 'David Michael Chen',
      successorDigitalExecutor: 'Amy Susan Chen',
      emailAccounts: [
        { name: 'lisa.chen@gmail.com', provider: 'Gmail', action: 'maintained' },
        { name: 'lisa@lisachen.tech', provider: 'Other', action: 'maintained' }
      ],
      socialAccounts: [
        { name: '@lisachen_tech', platform: 'X (Twitter)', action: 'maintained' },
        { name: 'Lisa Chen', platform: 'LinkedIn', action: 'maintained' }
      ],
      techAccounts: [
        { name: 'Lisa Chen AWS', platform: 'Amazon', action: 'maintained' },
        { name: 'lisachen', platform: 'Go Daddy', action: 'maintained' },
        { name: 'lisachen_tech', platform: 'YouTube', action: 'maintained' }
      ],
      cryptoWallets: [
        { name: 'Lisa Main Portfolio', type: 'MetaMask', beneficiary: 'David Michael Chen' },
        { name: 'Lisa ETH Wallet', type: 'Trust Wallet', beneficiary: 'Amy Susan Chen' }
      ],
      cryptoExchanges: [
        { name: 'Lisa Coinbase Pro', platform: 'Coinbase', beneficiary: 'David Michael Chen' },
        { name: 'Lisa Binance', platform: 'Binance', beneficiary: 'Stanford University' }
      ]
    },
    funeralInstructions: {
      remainsDisposition: 'Cremated',
      buriedLocation: 'Alta Mesa Memorial Park, Palo Alto, CA',
      memorialService: 'held',
      funeralRepresentative: 'David Michael Chen',
      alternativeFuneralRepresentative: 'Amy Susan Chen'
    },
    guardianship: {
      primaryGuardian: 'Amy Susan Chen',
      successorGuardian: 'Jennifer Chen',
      bondRequirement: 'no bond',
      guardianBondWaived: true
    },
    beneficiaries: [
      { name: 'David Michael Chen', relation: 'spouse', percentage: '70%' },
      { name: 'Amy Susan Chen', relation: 'sister-in-law', percentage: '20%' },
      { name: 'Stanford University', relation: 'educational institution', percentage: '10%' }
    ],
    attestation: {
      executionDate: 'September 30, 2024',
      executionCity: 'Palo Alto',
      county: 'Santa Clara',
      dateOfNotarization: 'September 30, 2024',
      notaryName: 'Michael Anthony Rodriguez',
      notaryAddress: '789 Tech Plaza, Palo Alto, CA 94301'
    }
  }
];

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

export default function SampleWill() {
  const [currentPersona, setCurrentPersona] = useState<SamplePersona>(SAMPLE_PERSONAS[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const randomizePersona = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PERSONAS.length);
    setCurrentPersona(SAMPLE_PERSONAS[randomIndex]);
    setExportError(null);
    setExportSuccess(false);
  };

  const generateArticleI = (persona: SamplePersona) => {
    let articleI = `I, ${persona.name}, a resident of the State of California, being of sound mind and memory, and not acting under duress, menace, fraud, or undue influence, do hereby make, publish, and declare this to be my Last Will and Testament, revoking all prior wills and codicils made by me.\n\n`;
    
    articleI += `I am ${persona.maritalStatus}`;
    
    if (persona.maritalStatus === 'married' && persona.spouseName) {
      articleI += ` to ${persona.spouseName}`;
    } else if (persona.maritalStatus === 'divorced' && persona.formerSpouseName) {
      articleI += `. My former spouse is ${persona.formerSpouseName}, and our marriage was terminated by divorce`;
    } else if (persona.maritalStatus === 'widowed' && persona.formerSpouseName) {
      articleI += `. My former spouse was ${persona.formerSpouseName}, and our marriage was terminated by death`;
    }
    articleI += `.\n\n`;

    if (persona.hasChildren && persona.children.length > 0) {
      articleI += `I have the following children:\n`;
      persona.children.forEach(child => {
        articleI += `${child.name}, born ${child.birthDate}\n`;
      });
    } else {
      articleI += `I have no children.\n`;
    }

    return articleI;
  };

  const generateArticleIII = (persona: SamplePersona) => {
    let articleIII = `I give, devise, and bequeath all my property, both real and personal, of every kind and nature, and wherever situated, which I may own at the time of my death (my "residuary estate"), to the following beneficiaries in the proportions specified:\n\n`;
    
    persona.beneficiaries.forEach(beneficiary => {
      articleIII += `To ${beneficiary.name}, ${beneficiary.relation}, ${beneficiary.percentage} of my estate.\n\n`;
    });
    
    articleIII += `If any beneficiary named above does not survive me by the California default 120 hours (5 days), that beneficiary's share shall be distributed equally among the surviving beneficiaries named above.`;
    
    return articleIII;
  };

  const generateArticleIV = (persona: SamplePersona) => {
    let articleIV = '';
    
    // Real property bequests
    if (persona.realPropertyBequests && persona.realPropertyBequests.length > 0) {
      persona.realPropertyBequests.forEach(bequest => {
        articleIV += `I give my real property located at ${bequest.address} to ${bequest.beneficiary}, subject to any encumbrances or liens existing at the time of my death.\n\n`;
      });
    }
    
    // Personal property bequests
    if (persona.personalPropertyBequests && persona.personalPropertyBequests.length > 0) {
      persona.personalPropertyBequests.forEach(bequest => {
        articleIV += `I give ${bequest.description} to ${bequest.beneficiary}. If ${bequest.beneficiary} does not survive me, this bequest shall go to ${bequest.alternateBeneficiary}. If any beneficiary named in this section predeceases me, the gift to that beneficiary shall lapse and become part of my residuary estate unless otherwise specified.\n\n`;
      });
    }
    
    if (!articleIV.trim()) {
      articleIV = 'No specific bequests have been designated.\n\n';
    }
    
    return articleIV.trim();
  };

  const generateArticleV = (persona: SamplePersona) => {
    let articleV = `I hereby nominate and appoint ${persona.digitalAssets.digitalExecutor} as my Digital Executor to manage my digital assets. If ${persona.digitalAssets.digitalExecutor} is unable or unwilling to serve, I nominate ${persona.digitalAssets.successorDigitalExecutor} as my successor Digital Executor.\n\n`;
    
    // Add the two new legal paragraphs
    articleV += `"Digital Assets" include, without limitation, emails, social media, cloud, server, domain names, electronic files, and cryptocurrencies, regardless of their storage medium or location. I direct that the following Digital Assets to be handled as follows:\n\n`;
    
    articleV += `The Digital Executor is authorized to access, manage, control, transfer, or close Digital Assets to the extent permitted by law and provider terms. The Executor may request usernames, passwords, and decryption keys and may seek court orders, if necessary, under the Revised Uniform Fiduciary Access to Digital Assets Act (Cal. Prob. Code §§870–884). This grant does not require the Executor to violate applicable Terms of Service or criminal law; where access requires additional legal process, the Digital Executor may seek court authority. For cryptocurrency or private keys, the Testator expressly authorizes transfer of private keys and cryptocurrency to the Digital Executor.\n\n`;
    
    articleV += `DIGITAL ASSETS TO BE CLOSED OR MAINTAINED:\n\n`;
    
    // Email accounts
    if (persona.digitalAssets.emailAccounts.length > 0) {
      persona.digitalAssets.emailAccounts.forEach(account => {
        articleV += `${account.name}, ${account.provider}, should be ${account.action}\n`;
      });
      articleV += '\n';
    }
    
    // Social accounts
    if (persona.digitalAssets.socialAccounts.length > 0) {
      persona.digitalAssets.socialAccounts.forEach(account => {
        articleV += `${account.name}, ${account.platform}, should be ${account.action}\n`;
      });
      articleV += '\n';
    }
    
    // Tech accounts
    if (persona.digitalAssets.techAccounts.length > 0) {
      persona.digitalAssets.techAccounts.forEach(account => {
        articleV += `${account.name}, ${account.platform}, should be ${account.action}\n`;
      });
      articleV += '\n';
    }
    
    articleV += `DIGITAL ASSETS TO BE TRANSFERRED TO A SPECIFIC BENEFICIARY:\n\n`;
    
    // Crypto wallets
    if (persona.digitalAssets.cryptoWallets.length > 0) {
      persona.digitalAssets.cryptoWallets.forEach(wallet => {
        articleV += `${wallet.name}, ${wallet.type}, shall be transferred to ${wallet.beneficiary}\n`;
      });
      articleV += '\n';
    }
    
    // Crypto exchanges
    if (persona.digitalAssets.cryptoExchanges.length > 0) {
      persona.digitalAssets.cryptoExchanges.forEach(exchange => {
        articleV += `${exchange.name}, ${exchange.platform}, shall be transferred to ${exchange.beneficiary}\n`;
      });
    }
    
    return articleV.trim();
  };

  const generateArticleVI = (persona: SamplePersona) => {
    return `I direct that my remains be ${persona.funeralInstructions.remainsDisposition} at ${persona.funeralInstructions.buriedLocation}. A funeral or memorial service shall be ${persona.funeralInstructions.memorialService} as per my written or verbal instructions provided to my Executor. I nominate ${persona.funeralInstructions.funeralRepresentative} as the individual responsible for arranging my funeral and burial services. If ${persona.funeralInstructions.funeralRepresentative} is unable or unwilling to serve, I nominate ${persona.funeralInstructions.alternativeFuneralRepresentative} as a substitute.`;
  };

  const generateArticleVII = (persona: SamplePersona) => {
    const bondText = persona.executorBondWaived ? 'no bond' : 'bond';
    return `I hereby nominate and appoint ${persona.primaryExecutorName} as the Executor of this Will. If ${persona.primaryExecutorName} is unable or unwilling to serve, I nominate ${persona.successorExecutorName || '[Full Name of Successor Executor]'} as Successor Executor.\n\nI grant to my Executor full power and authority to sell, transfer, and convey any and all property, real or personal, at public or private sale, with or without notice, and to execute and deliver any and all deeds, assignments, and other instruments necessary to carry out the provisions of this Will.\n\nI direct that ${bondText} be required of any Executor named herein to post bond for the faithful performance of their duties.`;
  };

  const generateArticleVIII = (persona: SamplePersona) => {
    if (!persona.hasMinorChildren) {
      return null; // Skip this article entirely
    }
    const bondText = persona.guardianship.guardianBondWaived ? 'no bond' : 'bond';
    return `If I have any minor children at the time of my death, I nominate ${persona.guardianship.primaryGuardian} to serve as Guardian of the person and estate of my minor children. If ${persona.guardianship.primaryGuardian} is unable or unwilling to serve, I nominate ${persona.guardianship.successorGuardian} as Successor Guardian.\n\nI direct that ${bondText} be required of any Guardian named herein to post bond for the faithful performance of their duties.`;
  };

  const generateArticleIX = () => {
    return `No Contest: If any person contests or attempts to invalidate any provision of this Will without probable cause, such person shall forfeit any interest in my estate.\n\nSimultaneous Death: If any beneficiary and I die under circumstances where the order of death cannot be determined, it shall be presumed that I survived the beneficiary.\n\nSeverability Clause: If any provision of this Will is determined to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.\n\nGoverning Law: This Will shall be governed by the laws of the State of California.`;
  };

  const generateArticleX = (persona: SamplePersona) => {
    return `I declare that this document is my Last Will and Testament. I sign it knowingly and voluntarily, in the presence of the witnesses below.\n\nExecuted on ${persona.attestation.executionDate}, at ${persona.attestation.executionCity}, California.\n\n\n\n\nSignature of Testator: ____________________________\nPrinted Name of Testator: ${persona.name}\n\nWITNESSES' ATTESTATION\n\nWe, the undersigned, declare:\n\nThe Testator signed this Will in our presence.\nWe signed as witnesses in the presence of the Testator and each other.\n\nWitness 1: ____________________________\nName: ____________________________\nAddress: ____________________________\n\n\n\nWitness 2: ____________________________\nName: ____________________________\nAddress: ____________________________\n\nNOTARIZATION\n\nState of California\n${persona.attestation.county} of the US\n\nOn this ${persona.attestation.dateOfNotarization}, before me personally appeared ${persona.name}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.\n\nI certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.\n\nWITNESS my hand and official seal.\n\n____________________________\n${persona.attestation.notaryName}\n${persona.attestation.notaryAddress}`;
  };

  const createDocumentStructure = (docx: any) => {
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

    try {
      const paragraphs: any[] = [];

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
              text: currentPersona.name.toUpperCase(),
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

      const articleIText = generateArticleI(currentPersona);
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

      const articleIIIText = generateArticleIII(currentPersona);
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

      const articleIVText = generateArticleIV(currentPersona);
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

      const articleVText = generateArticleV(currentPersona);
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
            text: generateArticleVI(currentPersona), 
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

      const articleVIIText = generateArticleVII(currentPersona);
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
      const articleVIIIText = generateArticleVIII(currentPersona);
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
      const executionDate = formatDateToFullText(currentPersona.attestation.executionDate);
      const executionCity = currentPersona.attestation.executionCity;
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
            text: `Printed Name of Testator: ${currentPersona.name}`, 
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
            text: `${currentPersona.attestation.county} of the US`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `On this ${formatDateToFullText(currentPersona.attestation.dateOfNotarization)}, before me personally appeared ${currentPersona.name}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.`, 
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
            text: `${currentPersona.attestation.notaryName}`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `${currentPersona.attestation.notaryAddress}`, 
            size: 24, // 12pt
            font: "Times New Roman"
          })],
          spacing: { after: 240, line: 360 }, // Professional spacing
        })
      );

      // Enhanced sample watermark with professional styling - Times New Roman throughout
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "SAMPLE - FOR DEMONSTRATION PURPOSES ONLY",
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

  const handleDownloadDocx = async () => {
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
      const fileName = `Sample_Will_${currentPersona.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      
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
      console.error('Sample will export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during document generation.';
      setExportError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-blue-900">Sample California Will</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={randomizePersona}
              disabled={isExporting}
              className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Randomize
            </button>
            <button
              onClick={handleDownloadDocx}
              disabled={isExporting}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating DOCX...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download DOCX
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-blue-700">
          This is a complete example of a California will created using our template. 
          All information is fictional and for demonstration purposes only. Click "Randomize" to see different scenarios or "Download DOCX" to get a Word document.
        </p>
        
        {/* Success Message */}
        {exportSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Document Generated Successfully</h3>
                <p className="mt-1 text-sm text-green-700">Your sample will has been downloaded as a professionally formatted Word document with consistent Times New Roman font throughout, 12pt body text and 14pt headings, justified text alignment, appropriate paragraph spacing, bold formatting for all article headings, and enhanced formatting for the witness attestation, notarization, and notary sections with maximum spacing (6+ lines) for handwritten signatures and proper notary name and address placement.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {exportError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Document Generation Failed</h3>
                <p className="mt-1 text-sm text-red-700">{exportError}</p>
                <div className="mt-2">
                  <button
                    onClick={handleDownloadDocx}
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
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 font-inter">LAST WILL AND TESTAMENT</h3>
            <div className="text-sm text-gray-500 bg-red-100 px-2 py-1 rounded font-inter">
              SAMPLE - DRAFT
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8 font-inter">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 font-inter leading-tight">LAST WILL AND TESTAMENT</h1>
            <h2 className="text-xl font-semibold text-gray-700 font-inter">OF</h2>
            <h1 className="text-2xl font-bold text-gray-900 font-inter leading-tight">{currentPersona.name.toUpperCase()}</h1>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500 font-inter">Testator</div>
                  <div className="font-medium font-inter">{currentPersona.name}</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500 font-inter">State</div>
                  <div className="font-medium font-inter">{currentPersona.state}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500 font-inter">Date</div>
                  <div className="font-medium font-inter">{currentPersona.date}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-inter">
                Status: {currentPersona.maritalStatus.charAt(0).toUpperCase() + currentPersona.maritalStatus.slice(1)}
                {currentPersona.hasChildren ? ' • Has Children' : ' • No Children'}
                {currentPersona.hasMinorChildren ? ' • Has Minor Children' : ' • No Minor Children'}
                {' • '}{currentPersona.beneficiaries.length} Beneficiaries
                {currentPersona.realPropertyBequests.length > 0 ? ` • ${currentPersona.realPropertyBequests.length} Real Property Bequests` : ''}
                {currentPersona.personalPropertyBequests.length > 0 ? ` • ${currentPersona.personalPropertyBequests.length} Personal Property Bequests` : ''}
                {' • Digital Assets • Funeral Instructions • Executor: '}{currentPersona.executorBondWaived ? 'no bond' : 'bond'}
                {currentPersona.hasMinorChildren ? ` • Guardian: ${currentPersona.guardianship.guardianBondWaived ? 'no bond' : 'bond'}` : ''}
                {' • Attestation with Notarization'}
              </span>
            </div>
          </div>

          {/* Will Content */}
          <div className="will-content space-y-8">
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE I - DECLARATION</h3>
              <div className="space-y-4 text-gray-700 font-inter leading-relaxed">
                <p className="text-base">
                  I, <strong className="font-semibold">{currentPersona.name}</strong>, a resident of the State of California, being of sound mind and memory, and not acting under duress, menace, fraud, or undue influence, do hereby make, publish, and declare this to be my Last Will and Testament, revoking all prior wills and codicils made by me.
                </p>
                <p className="text-base">
                  I am {currentPersona.maritalStatus}
                  {currentPersona.maritalStatus === 'married' && currentPersona.spouseName && (
                    <> to <strong className="font-semibold">{currentPersona.spouseName}</strong></>
                  )}
                  {currentPersona.maritalStatus === 'divorced' && currentPersona.formerSpouseName && (
                    <>. My former spouse is <strong className="font-semibold">{currentPersona.formerSpouseName}</strong>, and our marriage was terminated by divorce</>
                  )}
                  {currentPersona.maritalStatus === 'widowed' && currentPersona.formerSpouseName && (
                    <>. My former spouse was <strong className="font-semibold">{currentPersona.formerSpouseName}</strong>, and our marriage was terminated by death</>
                  )}
                  .
                </p>
                {currentPersona.hasChildren && currentPersona.children.length > 0 ? (
                  <div>
                    <p className="text-base">I have the following children:</p>
                    <ul className="list-none ml-4 space-y-1">
                      {currentPersona.children.map((child, index) => (
                        <li key={index} className="text-base"><strong className="font-semibold">{child.name}</strong>, born {child.birthDate}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-base">I have no children.</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE II - DEBTS AND EXPENSES</h3>
              <p className="text-base text-gray-700 font-inter leading-relaxed">
                I direct that all my legally enforceable debts, funeral expenses, expenses of last illness and administration of my estate be paid as soon as practicable after my death.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE III - RESIDUARY ESTATE</h3>
              <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                <p className="text-base">
                  I give, devise, and bequeath all my property, both real and personal, of every kind and nature, and wherever situated, which I may own at the time of my death (my "residuary estate"), to the following beneficiaries in the proportions specified:
                </p>
                {currentPersona.beneficiaries.map((beneficiary, index) => (
                  <p key={index} className="text-base">
                    To <strong className="font-semibold">{beneficiary.name}</strong>, {beneficiary.relation}, {beneficiary.percentage} of my estate.
                  </p>
                ))}
                <p className="text-base">
                  If any beneficiary named above does not survive me by the California default 120 hours (5 days), that beneficiary's share shall be distributed equally among the surviving beneficiaries named above.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE IV - SPECIFIC BEQUESTS</h3>
              <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                {currentPersona.realPropertyBequests && currentPersona.realPropertyBequests.length > 0 && (
                  <div>
                    <p className="font-semibold text-base">Real Property Bequests:</p>
                    {currentPersona.realPropertyBequests.map((bequest, index) => (
                      <p key={index} className="text-base">
                        I give my real property located at <strong className="font-semibold">{bequest.address}</strong> to <strong className="font-semibold">{bequest.beneficiary}</strong>, subject to any encumbrances or liens existing at the time of my death.
                      </p>
                    ))}
                  </div>
                )}
                {currentPersona.personalPropertyBequests && currentPersona.personalPropertyBequests.length > 0 && (
                  <div>
                    <p className="font-semibold text-base">Personal Property Bequests:</p>
                    {currentPersona.personalPropertyBequests.map((bequest, index) => (
                      <p key={index} className="text-base">
                        I give <strong className="font-semibold">{bequest.description}</strong> to <strong className="font-semibold">{bequest.beneficiary}</strong>. If <strong className="font-semibold">{bequest.beneficiary}</strong> does not survive me, this bequest shall go to <strong className="font-semibold">{bequest.alternateBeneficiary}</strong>. If any beneficiary named in this section predeceases me, the gift to that beneficiary shall lapse and become part of my residuary estate unless otherwise specified.
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE V - DIGITAL ASSETS</h3>
              <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                <p className="text-base">
                  I hereby nominate and appoint <strong className="font-semibold">{currentPersona.digitalAssets.digitalExecutor}</strong> as my Digital Executor to manage my digital assets. If <strong className="font-semibold">{currentPersona.digitalAssets.digitalExecutor}</strong> is unable or unwilling to serve, I nominate <strong className="font-semibold">{currentPersona.digitalAssets.successorDigitalExecutor}</strong> as my successor Digital Executor.
                </p>

                <p className="text-base">
                  "Digital Assets" include, without limitation, emails, social media, cloud, server, domain names, electronic files, and cryptocurrencies, regardless of their storage medium or location. I direct that the following Digital Assets to be handled as follows:
                </p>

                <p className="text-base">
                  The Digital Executor is authorized to access, manage, control, transfer, or close Digital Assets to the extent permitted by law and provider terms. The Executor may request usernames, passwords, and decryption keys and may seek court orders, if necessary, under the Revised Uniform Fiduciary Access to Digital Assets Act (Cal. Prob. Code §§870–884). This grant does not require the Executor to violate applicable Terms of Service or criminal law; where access requires additional legal process, the Digital Executor may seek court authority. For cryptocurrency or private keys, the Testator expressly authorizes transfer of private keys and cryptocurrency to the Digital Executor.
                </p>

                <p className="font-semibold text-base">DIGITAL ASSETS TO BE CLOSED OR MAINTAINED:</p>

                {currentPersona.digitalAssets.emailAccounts.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm">Email Accounts:</p>
                    {currentPersona.digitalAssets.emailAccounts.map((account, index) => (
                      <p key={index} className="text-sm">{account.name}, {account.provider}, should be {account.action}</p>
                    ))}
                  </div>
                )}

                {currentPersona.digitalAssets.socialAccounts.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm">Social Accounts:</p>
                    {currentPersona.digitalAssets.socialAccounts.map((account, index) => (
                      <p key={index} className="text-sm">{account.name}, {account.platform}, should be {account.action}</p>
                    ))}
                  </div>
                )}

                {currentPersona.digitalAssets.techAccounts.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm">Tech Accounts:</p>
                    {currentPersona.digitalAssets.techAccounts.map((account, index) => (
                      <p key={index} className="text-sm">{account.name}, {account.platform}, should be {account.action}</p>
                    ))}
                  </div>
                )}

                <p className="font-semibold text-base">DIGITAL ASSETS TO BE TRANSFERRED TO A SPECIFIC BENEFICIARY:</p>

                {currentPersona.digitalAssets.cryptoWallets.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm">Crypto Wallets:</p>
                    {currentPersona.digitalAssets.cryptoWallets.map((wallet, index) => (
                      <p key={index} className="text-sm">{wallet.name}, {wallet.type}, shall be transferred to <strong className="font-semibold">{wallet.beneficiary}</strong></p>
                    ))}
                  </div>
                )}

                {currentPersona.digitalAssets.cryptoExchanges.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm">Crypto Exchanges:</p>
                    {currentPersona.digitalAssets.cryptoExchanges.map((exchange, index) => (
                      <p key={index} className="text-sm">{exchange.name}, {exchange.platform}, shall be transferred to <strong className="font-semibold">{exchange.beneficiary}</strong></p>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE VI - FUNERAL AND BURIAL INSTRUCTIONS</h3>
              <div className="text-gray-700 font-inter leading-relaxed">
                <p className="text-base">
                  I direct that my remains be <strong className="font-semibold">{currentPersona.funeralInstructions.remainsDisposition}</strong> at <strong className="font-semibold">{currentPersona.funeralInstructions.buriedLocation}</strong>. A funeral or memorial service shall be <strong className="font-semibold">{currentPersona.funeralInstructions.memorialService}</strong> as per my written or verbal instructions provided to my Executor. I nominate <strong className="font-semibold">{currentPersona.funeralInstructions.funeralRepresentative}</strong> as the individual responsible for arranging my funeral and burial services. If <strong className="font-semibold">{currentPersona.funeralInstructions.funeralRepresentative}</strong> is unable or unwilling to serve, I nominate <strong className="font-semibold">{currentPersona.funeralInstructions.alternativeFuneralRepresentative}</strong> as a substitute.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE VII - EXECUTOR</h3>
              <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                <p className="text-base">
                  I hereby nominate and appoint <strong className="font-semibold">{currentPersona.primaryExecutorName}</strong> as the Executor of this Will. If <strong className="font-semibold">{currentPersona.primaryExecutorName}</strong> is unable or unwilling to serve, I nominate <strong className="font-semibold">{currentPersona.successorExecutorName}</strong> as Successor Executor.
                </p>
                <p className="text-base">
                  I grant to my Executor full power and authority to sell, transfer, and convey any and all property, real or personal, at public or private sale, with or without notice, and to execute and deliver any and all deeds, assignments, and other instruments necessary to carry out the provisions of this Will.
                </p>
                <p className="text-base">
                  I direct that <strong className="font-semibold">{currentPersona.executorBondWaived ? 'no bond' : 'bond'}</strong> be required of any Executor named herein to post bond for the faithful performance of their duties.
                </p>
              </div>
            </section>

            {currentPersona.hasMinorChildren && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE VIII - GUARDIANSHIP</h3>
                <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                  <p className="text-base">
                    If I have any minor children at the time of my death, I nominate <strong className="font-semibold">{currentPersona.guardianship.primaryGuardian}</strong> to serve as Guardian of the person and estate of my minor children. If <strong className="font-semibold">{currentPersona.guardianship.primaryGuardian}</strong> is unable or unwilling to serve, I nominate <strong className="font-semibold">{currentPersona.guardianship.successorGuardian}</strong> as Successor Guardian.
                  </p>
                  <p className="text-base">
                    I direct that <strong className="font-semibold">{currentPersona.guardianship.guardianBondWaived ? 'no bond' : 'bond'}</strong> be required of any Guardian named herein to post bond for the faithful performance of their duties.
                  </p>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE IX - MISCELLANEOUS PROVISIONS</h3>
              <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                <p className="text-base">
                  <strong className="font-semibold">No Contest:</strong> If any person contests or attempts to invalidate any provision of this Will without probable cause, such person shall forfeit any interest in my estate.
                </p>
                <p className="text-base">
                  <strong className="font-semibold">Simultaneous Death:</strong> If any beneficiary and I die under circumstances where the order of death cannot be determined, it shall be presumed that I survived the beneficiary.
                </p>
                <p className="text-base">
                  <strong className="font-semibold">Severability Clause:</strong> If any provision of this Will is determined to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
                <p className="text-base">
                  <strong className="font-semibold">Governing Law:</strong> This Will shall be governed by the laws of the State of California.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-inter leading-tight">ARTICLE X - ATTESTATION</h3>
              <div className="text-gray-700 space-y-4 font-inter leading-relaxed">
                <p className="text-base">
                  I declare that this document is my Last Will and Testament. I sign it knowingly and voluntarily, in the presence of the witnesses below.
                </p>
                <p className="text-base">
                  Executed on <strong className="font-semibold">{currentPersona.attestation.executionDate}</strong>, at <strong className="font-semibold">{currentPersona.attestation.executionCity}</strong>, California.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm leading-relaxed">
                  <p className="mb-2">Signature of Testator: ____________________________</p>
                  <p className="mb-4">Printed Name of Testator: {currentPersona.name}</p>
                  
                  <p className="font-bold mb-4">WITNESSES' ATTESTATION</p>
                  
                  <p className="mb-2">We, the undersigned, declare:</p>
                  
                  <p className="mb-2">The Testator signed this Will in our presence.</p>
                  <p className="mb-4">We signed as witnesses in the presence of the Testator and each other.</p>
                  
                  <p className="mb-2">Witness 1: ____________________________</p>
                  <p className="mb-2">Name: ____________________________</p>
                  <p className="mb-6">Address: ____________________________</p>
                  
                  <p className="mb-2">Witness 2: ____________________________</p>
                  <p className="mb-2">Name: ____________________________</p>
                  <p className="mb-6">Address: ____________________________</p>
                  
                  <p className="font-bold mb-4">NOTARIZATION</p>
                  
                  <p className="mb-2">State of California</p>
                  <p className="mb-2">{currentPersona.attestation.county} of the US</p>
                  
                  <p className="mb-4">On this {currentPersona.attestation.dateOfNotarization}, before me personally appeared {currentPersona.name}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.</p>
                  
                  <p className="mb-4">I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.</p>
                  
                  <p className="mb-4">WITNESS my hand and official seal.</p>
                  
                  <p className="mb-2">____________________________</p>
                  <p className="mb-2"><strong>{currentPersona.attestation.notaryName}</strong></p>
                  <p><strong>{currentPersona.attestation.notaryAddress}</strong></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
