import React, { useState } from 'react';
import { Calendar, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';

interface WillFormProps {
  initialData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
  testatorName: string;
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const WILL_SECTIONS: FormSection[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    fields: [
      { id: 'testatorName', label: 'Full Legal Name of Testator', type: 'text', required: true },
      { id: 'county', label: 'County', type: 'text', placeholder: 'Los Angeles', required: true },
      { id: 'state', label: 'State', type: 'text', placeholder: 'California', required: true },
    ]
  },
  {
    id: 'declaration',
    title: 'Article I - Declaration',
    fields: [
      { id: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['single', 'married', 'divorced', 'widowed'], required: true },
      { id: 'spouseName', label: 'Full Name of Present Spouse', type: 'text' },
      { id: 'formerSpouseName', label: 'Full Name of Former Spouse', type: 'text' },
      { id: 'divorceOrDeath', label: 'Marriage terminated by', type: 'select', options: ['divorce', 'death'] },
      { id: 'hasChildren', label: 'Do you have children?', type: 'select', options: ['Yes', 'No'], required: true },
    ]
  },
  {
    id: 'debts-static',
    title: 'Article II - Debts and Expenses',
    fields: []
  },
  {
    id: 'residuary',
    title: 'Article III - Residuary Estate',
    fields: []
  },
  {
    id: 'specific-bequests',
    title: 'Article IV - Specific Bequests',
    fields: [
      { id: 'hasRealPropertyBequests', label: 'Do you wish to give real property to a beneficiary?', type: 'checkbox' },
      { id: 'hasPersonalPropertyBequests', label: 'Do you wish to give personal property to a beneficiary?', type: 'checkbox' }
    ]
  },
  {
    id: 'digital-assets',
    title: 'Article V - Digital Assets',
    fields: [
      { id: 'digitalExecutor', label: 'Full Name of Digital Executor', type: 'text', required: true },
      { id: 'successorDigitalExecutor', label: 'Full Name of Successor Digital Executor', type: 'text', required: true }
    ]
  },
  {
    id: 'funeral-burial',
    title: 'Article VI - Funeral and Burial Instructions',
    fields: [
      { id: 'remainsDisposition', label: 'Remains Disposition', type: 'select', options: ['Cremated', 'Buried'], required: true },
      { id: 'buriedLocation', label: 'Buried Location', type: 'text', required: true, placeholder: 'Enter cemetery or burial location' },
      { id: 'memorialService', label: 'Memorial Service', type: 'select', options: ['held', 'not held'], required: true },
      { id: 'funeralRepresentative', label: 'Full Name of Funeral Representative', type: 'text', required: true },
      { id: 'alternativeFuneralRepresentative', label: 'Full Name of Alternative Funeral Representative', type: 'text', required: true }
    ]
  },
  {
    id: 'executor',
    title: 'Article VII - Executor',
    fields: [
      { id: 'primaryExecutorName', label: 'Full Name of Primary Executor', type: 'text', required: true },
      { id: 'successorExecutorName', label: 'Full Name of Successor Executor', type: 'text', required: true },
      { id: 'executorBondWaived', label: 'Expressly waive bond requirement for Executor', type: 'checkbox' }
    ]
  },
  {
    id: 'guardianship',
    title: 'Article VIII - Guardianship',
    fields: [
      { id: 'hasMinorChildren', label: 'Do you have minor children?', type: 'checkbox' },
      { id: 'primaryGuardianName', label: 'Full Name of Primary Guardian', type: 'text' },
      { id: 'successorGuardianName', label: 'Full Name of Successor Guardian', type: 'text' },
      { id: 'guardianBondWaived', label: 'Expressly waive bond requirement for Guardian', type: 'checkbox' }
    ]
  },
  {
    id: 'miscellaneous',
    title: 'Article IX - Miscellaneous Provisions',
    fields: []
  },
  {
    id: 'attestation',
    title: 'Article X - Attestation',
    fields: [
      { id: 'executionDate', label: 'Execution Date', type: 'date', required: true },
      { id: 'executionCity', label: 'Execution City', type: 'text', required: true, placeholder: 'Los Angeles' },
      { id: 'dateOfNotarization', label: 'Date of Notarization', type: 'date', required: true },
      { id: 'notaryName', label: 'Notary Name', type: 'text', required: true, placeholder: 'Full name of notary public' },
      { id: 'notaryAddress', label: 'Notary Address', type: 'text', required: true, placeholder: 'Full address of notary public' }
    ]
  }
];

export default function WillForm({ initialData, onChange, testatorName }: WillFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    testatorName,
    state: 'California',
    executorBondWaived: 'false', // Default to bond required
    guardianBondWaived: 'false', // Default to bond required
    ...initialData,
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic-info']));
  const [childrenCount, setChildrenCount] = useState(() => {
    // Count existing children in form data
    let count = 0;
    while (formData[`child${count + 1}Name`] || formData[`child${count + 1}BirthDate`]) {
      count++;
    }
    return Math.max(count, 2); // Start with at least 2 children fields
  });
  const [beneficiaryCount, setBeneficiaryCount] = useState(() => {
    // Count existing beneficiaries in form data
    let count = 0;
    while (formData[`beneficiary${count + 1}Name`] || formData[`beneficiary${count + 1}Relation`] || formData[`beneficiary${count + 1}Percentage`]) {
      count++;
    }
    return Math.max(count, 2); // Start with at least 2 beneficiaries
  });
  const [realPropertyCount, setRealPropertyCount] = useState(() => {
    // Count existing real property bequests in form data
    let count = 0;
    while (formData[`realProperty${count + 1}Address`] || formData[`realProperty${count + 1}Beneficiary`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 real property field
  });
  const [personalPropertyCount, setPersonalPropertyCount] = useState(() => {
    // Count existing personal property bequests in form data
    let count = 0;
    while (formData[`personalProperty${count + 1}Description`] || formData[`personalProperty${count + 1}Beneficiary`] || formData[`personalProperty${count + 1}AlternateBeneficiary`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 personal property field
  });
  const [emailAccountCount, setEmailAccountCount] = useState(() => {
    // Count existing email accounts in form data
    let count = 0;
    while (formData[`emailAccount${count + 1}Name`] || formData[`emailAccount${count + 1}Provider`] || formData[`emailAccount${count + 1}Action`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 entry
  });
  const [socialAccountCount, setSocialAccountCount] = useState(() => {
    // Count existing social accounts in form data
    let count = 0;
    while (formData[`socialAccount${count + 1}Name`] || formData[`socialAccount${count + 1}Platform`] || formData[`socialAccount${count + 1}Action`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 entry
  });
  const [techAccountCount, setTechAccountCount] = useState(() => {
    // Count existing tech accounts in form data
    let count = 0;
    while (formData[`techAccount${count + 1}Name`] || formData[`techAccount${count + 1}Platform`] || formData[`techAccount${count + 1}Action`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 entry
  });
  const [cryptoWalletCount, setCryptoWalletCount] = useState(() => {
    // Count existing crypto wallets in form data
    let count = 0;
    while (formData[`cryptoWallet${count + 1}Name`] || formData[`cryptoWallet${count + 1}Type`] || formData[`cryptoWallet${count + 1}Beneficiary`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 entry
  });
  const [cryptoExchangeCount, setCryptoExchangeCount] = useState(() => {
    // Count existing crypto exchanges in form data
    let count = 0;
    while (formData[`cryptoExchange${count + 1}Name`] || formData[`cryptoExchange${count + 1}Platform`] || formData[`cryptoExchange${count + 1}Beneficiary`]) {
      count++;
    }
    return Math.max(count, 1); // Start with at least 1 entry
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
    onChange(newData);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addChild = () => {
    setChildrenCount(prev => prev + 1);
  };

  const removeChild = (index: number) => {
    if (childrenCount > 1) {
      const newData = { ...formData };
      // Remove the child at the specified index and shift others up
      for (let i = index; i < childrenCount - 1; i++) {
        newData[`child${i + 1}Name`] = newData[`child${i + 2}Name`] || '';
        newData[`child${i + 1}BirthDate`] = newData[`child${i + 2}BirthDate`] || '';
      }
      // Remove the last child's data
      delete newData[`child${childrenCount}Name`];
      delete newData[`child${childrenCount}BirthDate`];
      
      setFormData(newData);
      onChange(newData);
      setChildrenCount(prev => prev - 1);
    }
  };

  const addBeneficiary = () => {
    setBeneficiaryCount(prev => prev + 1);
  };

  const removeBeneficiary = (index: number) => {
    if (beneficiaryCount > 1) {
      const newData = { ...formData };
      // Remove the beneficiary at the specified index and shift others up
      for (let i = index; i < beneficiaryCount - 1; i++) {
        newData[`beneficiary${i + 1}Name`] = newData[`beneficiary${i + 2}Name`] || '';
        newData[`beneficiary${i + 1}Relation`] = newData[`beneficiary${i + 2}Relation`] || '';
        newData[`beneficiary${i + 1}Percentage`] = newData[`beneficiary${i + 2}Percentage`] || '';
      }
      // Remove the last beneficiary's data
      delete newData[`beneficiary${beneficiaryCount}Name`];
      delete newData[`beneficiary${beneficiaryCount}Relation`];
      delete newData[`beneficiary${beneficiaryCount}Percentage`];
      
      setFormData(newData);
      onChange(newData);
      setBeneficiaryCount(prev => prev - 1);
    }
  };

  const addRealProperty = () => {
    setRealPropertyCount(prev => prev + 1);
  };

  const removeRealProperty = (index: number) => {
    if (realPropertyCount > 1) {
      const newData = { ...formData };
      // Remove the real property at the specified index and shift others up
      for (let i = index; i < realPropertyCount - 1; i++) {
        newData[`realProperty${i + 1}Address`] = newData[`realProperty${i + 2}Address`] || '';
        newData[`realProperty${i + 1}Beneficiary`] = newData[`realProperty${i + 2}Beneficiary`] || '';
      }
      // Remove the last real property's data
      delete newData[`realProperty${realPropertyCount}Address`];
      delete newData[`realProperty${realPropertyCount}Beneficiary`];
      
      setFormData(newData);
      onChange(newData);
      setRealPropertyCount(prev => prev - 1);
    }
  };

  const addPersonalProperty = () => {
    setPersonalPropertyCount(prev => prev + 1);
  };

  const removePersonalProperty = (index: number) => {
    if (personalPropertyCount > 1) {
      const newData = { ...formData };
      // Remove the personal property at the specified index and shift others up
      for (let i = index; i < personalPropertyCount - 1; i++) {
        newData[`personalProperty${i + 1}Description`] = newData[`personalProperty${i + 2}Description`] || '';
        newData[`personalProperty${i + 1}Beneficiary`] = newData[`personalProperty${i + 2}Beneficiary`] || '';
        newData[`personalProperty${i + 1}AlternateBeneficiary`] = newData[`personalProperty${i + 2}AlternateBeneficiary`] || '';
      }
      // Remove the last personal property's data
      delete newData[`personalProperty${personalPropertyCount}Description`];
      delete newData[`personalProperty${personalPropertyCount}Beneficiary`];
      delete newData[`personalProperty${personalPropertyCount}AlternateBeneficiary`];
      
      setFormData(newData);
      onChange(newData);
      setPersonalPropertyCount(prev => prev - 1);
    }
  };

  const addEmailAccount = () => {
    setEmailAccountCount(prev => prev + 1);
  };

  const removeEmailAccount = (index: number) => {
    if (emailAccountCount > 1) {
      const newData = { ...formData };
      // Remove the entry at the specified index and shift others up
      for (let i = index; i < emailAccountCount - 1; i++) {
        newData[`emailAccount${i + 1}Name`] = newData[`emailAccount${i + 2}Name`] || '';
        newData[`emailAccount${i + 1}Provider`] = newData[`emailAccount${i + 2}Provider`] || '';
        newData[`emailAccount${i + 1}Action`] = newData[`emailAccount${i + 2}Action`] || '';
      }
      // Remove the last entry's data
      delete newData[`emailAccount${emailAccountCount}Name`];
      delete newData[`emailAccount${emailAccountCount}Provider`];
      delete newData[`emailAccount${emailAccountCount}Action`];
      
      setFormData(newData);
      onChange(newData);
      setEmailAccountCount(prev => prev - 1);
    }
  };

  const addSocialAccount = () => {
    setSocialAccountCount(prev => prev + 1);
  };

  const removeSocialAccount = (index: number) => {
    if (socialAccountCount > 1) {
      const newData = { ...formData };
      // Remove the entry at the specified index and shift others up
      for (let i = index; i < socialAccountCount - 1; i++) {
        newData[`socialAccount${i + 1}Name`] = newData[`socialAccount${i + 2}Name`] || '';
        newData[`socialAccount${i + 1}Platform`] = newData[`socialAccount${i + 2}Platform`] || '';
        newData[`socialAccount${i + 1}Action`] = newData[`socialAccount${i + 2}Action`] || '';
      }
      // Remove the last entry's data
      delete newData[`socialAccount${socialAccountCount}Name`];
      delete newData[`socialAccount${socialAccountCount}Platform`];
      delete newData[`socialAccount${socialAccountCount}Action`];
      
      setFormData(newData);
      onChange(newData);
      setSocialAccountCount(prev => prev - 1);
    }
  };

  const addTechAccount = () => {
    setTechAccountCount(prev => prev + 1);
  };

  const removeTechAccount = (index: number) => {
    if (techAccountCount > 1) {
      const newData = { ...formData };
      // Remove the entry at the specified index and shift others up
      for (let i = index; i < techAccountCount - 1; i++) {
        newData[`techAccount${i + 1}Name`] = newData[`techAccount${i + 2}Name`] || '';
        newData[`techAccount${i + 1}Platform`] = newData[`techAccount${i + 2}Platform`] || '';
        newData[`techAccount${i + 1}Action`] = newData[`techAccount${i + 2}Action`] || '';
      }
      // Remove the last entry's data
      delete newData[`techAccount${techAccountCount}Name`];
      delete newData[`techAccount${techAccountCount}Platform`];
      delete newData[`techAccount${techAccountCount}Action`];
      
      setFormData(newData);
      onChange(newData);
      setTechAccountCount(prev => prev - 1);
    }
  };

  const addCryptoWallet = () => {
    setCryptoWalletCount(prev => prev + 1);
  };

  const removeCryptoWallet = (index: number) => {
    if (cryptoWalletCount > 1) {
      const newData = { ...formData };
      // Remove the entry at the specified index and shift others up
      for (let i = index; i < cryptoWalletCount - 1; i++) {
        newData[`cryptoWallet${i + 1}Name`] = newData[`cryptoWallet${i + 2}Name`] || '';
        newData[`cryptoWallet${i + 1}Type`] = newData[`cryptoWallet${i + 2}Type`] || '';
        newData[`cryptoWallet${i + 1}Beneficiary`] = newData[`cryptoWallet${i + 2}Beneficiary`] || '';
      }
      // Remove the last entry's data
      delete newData[`cryptoWallet${cryptoWalletCount}Name`];
      delete newData[`cryptoWallet${cryptoWalletCount}Type`];
      delete newData[`cryptoWallet${cryptoWalletCount}Beneficiary`];
      
      setFormData(newData);
      onChange(newData);
      setCryptoWalletCount(prev => prev - 1);
    }
  };

  const addCryptoExchange = () => {
    setCryptoExchangeCount(prev => prev + 1);
  };

  const removeCryptoExchange = (index: number) => {
    if (cryptoExchangeCount > 1) {
      const newData = { ...formData };
      // Remove the entry at the specified index and shift others up
      for (let i = index; i < cryptoExchangeCount - 1; i++) {
        newData[`cryptoExchange${i + 1}Name`] = newData[`cryptoExchange${i + 2}Name`] || '';
        newData[`cryptoExchange${i + 1}Platform`] = newData[`cryptoExchange${i + 2}Platform`] || '';
        newData[`cryptoExchange${i + 1}Beneficiary`] = newData[`cryptoExchange${i + 2}Beneficiary`] || '';
      }
      // Remove the last entry's data
      delete newData[`cryptoExchange${cryptoExchangeCount}Name`];
      delete newData[`cryptoExchange${cryptoExchangeCount}Platform`];
      delete newData[`cryptoExchange${cryptoExchangeCount}Beneficiary`];
      
      setFormData(newData);
      onChange(newData);
      setCryptoExchangeCount(prev => prev - 1);
    }
  };

  const calculateTotalPercentage = () => {
    let total = 0;
    for (let i = 1; i <= beneficiaryCount; i++) {
      const percentage = formData[`beneficiary${i}Percentage`];
      if (percentage) {
        const numValue = parseFloat(percentage.replace('%', ''));
        if (!isNaN(numValue)) {
          total += numValue;
        }
      }
    }
    return total;
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    
    // Skip spouse name if not married
    if (field.id === 'spouseName' && formData.maritalStatus !== 'married') {
      return null;
    }

    // Skip former spouse fields if single or married
    if ((field.id === 'formerSpouseName' || field.id === 'divorceOrDeath') && 
        (formData.maritalStatus === 'single' || formData.maritalStatus === 'married')) {
      return null;
    }

    // Skip divorce/death selector if no former spouse name
    if (field.id === 'divorceOrDeath' && !formData.formerSpouseName) {
      return null;
    }

    // Skip guardian fields if no minor children
    if ((field.id === 'primaryGuardianName' || field.id === 'successorGuardianName' || field.id === 'guardianBondWaived') && 
        formData.hasMinorChildren !== 'true') {
      return null;
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.id === 'testatorName'} // Testator name is pre-filled and readonly
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'date':
        return (
          <div className="mt-1 relative">
            <input
              type="date"
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pl-10"
              required={field.required}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                id={field.id}
                checked={value === 'true'}
                onChange={(e) => handleFieldChange(field.id, e.target.checked ? 'true' : 'false')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderChildrenFields = () => {
    if (formData.hasChildren !== 'Yes') return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-700">Children Information</h5>
          <button
            type="button"
            onClick={addChild}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Child
          </button>
        </div>
        
        {Array.from({ length: childrenCount }, (_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-gray-600">Child {index + 1}</h6>
              {childrenCount > 1 && (
                <button
                  type="button"
                  onClick={() => removeChild(index + 1)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name of Child {index + 1}
                </label>
                <input
                  type="text"
                  value={formData[`child${index + 1}Name`] || ''}
                  onChange={(e) => handleFieldChange(`child${index + 1}Name`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Full name of child ${index + 1}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth of Child {index + 1}
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    value={formData[`child${index + 1}BirthDate`] || ''}
                    onChange={(e) => handleFieldChange(`child${index + 1}BirthDate`, e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBeneficiaryFields = () => {
    const totalPercentage = calculateTotalPercentage();
    const isPercentageValid = totalPercentage === 100;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-700">Residuary Beneficiaries</h5>
          <button
            type="button"
            onClick={addBeneficiary}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Beneficiary
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> I give, devise, and bequeath all my property, both real and personal, of every kind and nature, and wherever situated, which I may own at the time of my death (my "residuary estate"), to the following beneficiaries in the proportions specified:
          </p>
        </div>
        
        {Array.from({ length: beneficiaryCount }, (_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-gray-600">Beneficiary {index + 1}</h6>
              {beneficiaryCount > 1 && (
                <button
                  type="button"
                  onClick={() => removeBeneficiary(index + 1)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name of Beneficiary {index + 1} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[`beneficiary${index + 1}Name`] || ''}
                  onChange={(e) => handleFieldChange(`beneficiary${index + 1}Name`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Full name of beneficiary ${index + 1}`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[`beneficiary${index + 1}Relation`] || ''}
                  onChange={(e) => handleFieldChange(`beneficiary${index + 1}Relation`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., spouse, child, sibling"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Percentage of Estate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[`beneficiary${index + 1}Percentage`] || ''}
                  onChange={(e) => handleFieldChange(`beneficiary${index + 1}Percentage`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 50%"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              Total Percentage: {totalPercentage.toFixed(1)}%
            </span>
            {!isPercentageValid && (
              <span className="text-sm text-red-600">
                Must total 100%
              </span>
            )}
            {isPercentageValid && (
              <span className="text-sm text-green-600">
                ✓ Valid
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Survivorship Clause:</strong> If any beneficiary named above does not survive me by the California default 120 hours (5 days), that beneficiary's share shall be distributed equally among the surviving beneficiaries named above.
          </p>
        </div>
      </div>
    );
  };

  const renderRealPropertyFields = () => {
    if (formData.hasRealPropertyBequests !== 'true') return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-700">Real Property Bequests</h5>
          <button
            type="button"
            onClick={addRealProperty}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Real Property Bequest
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> I give my real property located at [Address or Legal Description of Property] to [Full Name of Beneficiary], subject to any encumbrances or liens existing at the time of my death.
          </p>
        </div>
        
        {Array.from({ length: realPropertyCount }, (_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-gray-600">Real Property Bequest {index + 1}</h6>
              {realPropertyCount > 1 && (
                <button
                  type="button"
                  onClick={() => removeRealProperty(index + 1)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address or Legal Description of Property <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData[`realProperty${index + 1}Address`] || ''}
                  onChange={(e) => handleFieldChange(`realProperty${index + 1}Address`, e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter the complete address or legal description of the property"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name of Beneficiary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[`realProperty${index + 1}Beneficiary`] || ''}
                  onChange={(e) => handleFieldChange(`realProperty${index + 1}Beneficiary`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full name of the beneficiary"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPersonalPropertyFields = () => {
    if (formData.hasPersonalPropertyBequests !== 'true') return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-700">Personal Property Bequests</h5>
          <button
            type="button"
            onClick={addPersonalProperty}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Personal Property Bequest
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> I give [Description of Property] to [Full Name of Specific Beneficiary]. If [Full Name of Specific Beneficiary] does not survive me, this bequest shall go to [Full Name of Alternate Beneficiary]. If any beneficiary named in this section predeceases me, the gift to that beneficiary shall lapse and become part of my residuary estate unless otherwise specified.
          </p>
        </div>
        
        {Array.from({ length: personalPropertyCount }, (_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-gray-600">Personal Property Bequest {index + 1}</h6>
              {personalPropertyCount > 1 && (
                <button
                  type="button"
                  onClick={() => removePersonalProperty(index + 1)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description of Property <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData[`personalProperty${index + 1}Description`] || ''}
                  onChange={(e) => handleFieldChange(`personalProperty${index + 1}Description`, e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., my grandmother's diamond ring, my collection of books, the sum of $10,000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name of Specific Beneficiary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[`personalProperty${index + 1}Beneficiary`] || ''}
                  onChange={(e) => handleFieldChange(`personalProperty${index + 1}Beneficiary`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full name of the primary beneficiary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name of Alternate Beneficiary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[`personalProperty${index + 1}AlternateBeneficiary`] || ''}
                  onChange={(e) => handleFieldChange(`personalProperty${index + 1}AlternateBeneficiary`, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full name of the alternate beneficiary"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDigitalAssetsFields = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> I hereby nominate and appoint [Full Name of Digital Executor] as my Digital Executor to manage my digital assets. If [Full Name of Digital Executor] is unable or unwilling to serve, I nominate [Full Name of Successor Digital Executor] as my successor Digital Executor.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <strong>Legal Paragraphs:</strong> "Digital Assets" include, without limitation, emails, social media, cloud, server, domain names, electronic files, and cryptocurrencies, regardless of their storage medium or location. I direct that the following Digital Assets to be handled as follows:
          </p>
          <p className="text-sm text-gray-700 mt-2">
            The Digital Executor is authorized to access, manage, control, transfer, or close Digital Assets to the extent permitted by law and provider terms. The Executor may request usernames, passwords, and decryption keys and may seek court orders, if necessary, under the Revised Uniform Fiduciary Access to Digital Assets Act (Cal. Prob. Code §§870–884). This grant does not require the Executor to violate applicable Terms of Service or criminal law; where access requires additional legal process, the Digital Executor may seek court authority. For cryptocurrency or private keys, the Testator expressly authorizes transfer of private keys and cryptocurrency to the Digital Executor.
          </p>
        </div>

        {/* Email Accounts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-700">Email Accounts</h5>
            <button
              type="button"
              onClick={addEmailAccount}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Email Account
            </button>
          </div>
          
          {Array.from({ length: emailAccountCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-medium text-gray-600">Email Account {index + 1}</h6>
                {emailAccountCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmailAccount(index + 1)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`emailAccount${index + 1}Name`] || ''}
                    onChange={(e) => handleFieldChange(`emailAccount${index + 1}Name`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., john.doe@gmail.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Provider <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`emailAccount${index + 1}Provider`] || ''}
                    onChange={(e) => handleFieldChange(`emailAccount${index + 1}Provider`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select provider</option>
                    <option value="Gmail">Gmail</option>
                    <option value="Yahoo Mail">Yahoo Mail</option>
                    <option value="Microsoft Mail">Microsoft Mail</option>
                    <option value="AOL Mail">AOL Mail</option>
                    <option value="iCloud Mail">iCloud Mail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Should be <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`emailAccount${index + 1}Action`] || ''}
                    onChange={(e) => handleFieldChange(`emailAccount${index + 1}Action`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select action</option>
                    <option value="closed">closed</option>
                    <option value="maintained">maintained</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Accounts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-700">Social Accounts</h5>
            <button
              type="button"
              onClick={addSocialAccount}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Social Account
            </button>
          </div>
          
          {Array.from({ length: socialAccountCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-medium text-gray-600">Social Account {index + 1}</h6>
                {socialAccountCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSocialAccount(index + 1)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Social Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`socialAccount${index + 1}Name`] || ''}
                    onChange={(e) => handleFieldChange(`socialAccount${index + 1}Name`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., John Doe Facebook, @johndoe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Social Platform <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`socialAccount${index + 1}Platform`] || ''}
                    onChange={(e) => handleFieldChange(`socialAccount${index + 1}Platform`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select platform</option>
                    <option value="Meta, Instagram">Meta, Instagram</option>
                    <option value="Meta Messenger">Meta Messenger</option>
                    <option value="TikTok">TikTok</option>
                    <option value="iMessage">iMessage</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Reddit">Reddit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Should be <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`socialAccount${index + 1}Action`] || ''}
                    onChange={(e) => handleFieldChange(`socialAccount${index + 1}Action`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select action</option>
                    <option value="closed">closed</option>
                    <option value="maintained">maintained</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Accounts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-700">Tech Accounts</h5>
            <button
              type="button"
              onClick={addTechAccount}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Tech Account
            </button>
          </div>
          
          {Array.from({ length: techAccountCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-medium text-gray-600">Tech Account {index + 1}</h6>
                {techAccountCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTechAccount(index + 1)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tech Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`techAccount${index + 1}Name`] || ''}
                    onChange={(e) => handleFieldChange(`techAccount${index + 1}Name`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., John Doe YouTube, John Amazon Account"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tech Platform <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`techAccount${index + 1}Platform`] || ''}
                    onChange={(e) => handleFieldChange(`techAccount${index + 1}Platform`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select platform</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Amazon">Amazon</option>
                    <option value="eBay">eBay</option>
                    <option value="Etsy">Etsy</option>
                    <option value="Walmart">Walmart</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Discord">Discord</option>
                    <option value="Go Daddy">Go Daddy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Should be <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`techAccount${index + 1}Action`] || ''}
                    onChange={(e) => handleFieldChange(`techAccount${index + 1}Action`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select action</option>
                    <option value="closed">closed</option>
                    <option value="maintained">maintained</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Crypto Wallets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-700">Crypto Wallets</h5>
            <button
              type="button"
              onClick={addCryptoWallet}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Crypto Wallet
            </button>
          </div>
          
          {Array.from({ length: cryptoWalletCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-medium text-gray-600">Crypto Wallet {index + 1}</h6>
                {cryptoWalletCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCryptoWallet(index + 1)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crypto Wallet Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`cryptoWallet${index + 1}Name`] || ''}
                    onChange={(e) => handleFieldChange(`cryptoWallet${index + 1}Name`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., John Main Wallet, BTC Savings Wallet"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Wallet Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`cryptoWallet${index + 1}Type`] || ''}
                    onChange={(e) => handleFieldChange(`cryptoWallet${index + 1}Type`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select wallet type</option>
                    <option value="OISY Wallet">OISY Wallet</option>
                    <option value="MetaMask">MetaMask</option>
                    <option value="Trust Wallet">Trust Wallet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Shall be transferred to <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`cryptoWallet${index + 1}Beneficiary`] || ''}
                    onChange={(e) => handleFieldChange(`cryptoWallet${index + 1}Beneficiary`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Full name of beneficiary"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Crypto Exchanges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-700">Crypto Exchanges</h5>
            <button
              type="button"
              onClick={addCryptoExchange}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Crypto Exchange
            </button>
          </div>
          
          {Array.from({ length: cryptoExchangeCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-medium text-gray-600">Crypto Exchange {index + 1}</h6>
                {cryptoExchangeCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCryptoExchange(index + 1)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crypto Exchange Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`cryptoExchange${index + 1}Name`] || ''}
                    onChange={(e) => handleFieldChange(`cryptoExchange${index + 1}Name`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., John Coinbase Account, Main Binance"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Exchange Platform <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData[`cryptoExchange${index + 1}Platform`] || ''}
                    onChange={(e) => handleFieldChange(`cryptoExchange${index + 1}Platform`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select exchange platform</option>
                    <option value="Coinbase">Coinbase</option>
                    <option value="Binance">Binance</option>
                    <option value="Kraken">Kraken</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Crypto.com">Crypto.com</option>
                    <option value="Robinhood Crypto">Robinhood Crypto</option>
                    <option value="Bitstamp">Bitstamp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Shall be transferred to <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`cryptoExchange${index + 1}Beneficiary`] || ''}
                    onChange={(e) => handleFieldChange(`cryptoExchange${index + 1}Beneficiary`, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Full name of beneficiary"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStaticDebtsSection = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700 text-sm leading-relaxed">
          <strong>Static Content:</strong> I direct that all my legally enforceable debts, funeral expenses, expenses of last illness and administration of my estate be paid as soon as practicable after my death.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This article contains standard legal language and requires no user input.
        </p>
      </div>
    );
  };

  const renderFuneralBurialSection = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> I direct that my remains be [Cremated/Buried] at [Buried Location]. A funeral or memorial service shall be [held/not held] as per my written or verbal instructions provided to my Executor. I nominate [Full Name of Funeral Representative] as the individual responsible for arranging my funeral and burial services. If [Full Name of Funeral Representative] is unable or unwilling to serve, I nominate [Full Name of Alternative Funeral Representative] as a substitute.
          </p>
        </div>
      </div>
    );
  };

  const renderExecutorSection = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> I hereby nominate and appoint [Full Name of Primary Executor] as the Executor of this Will. If [Full Name of Primary Executor] is unable or unwilling to serve, I nominate [Full Name of Successor Executor] as Successor Executor. I grant to my Executor full power and authority to sell, transfer, and convey any and all property, real or personal, at public or private sale, with or without notice, and to execute and deliver any and all deeds, assignments, and other instruments necessary to carry out the provisions of this Will. I direct that [bond] be required of any Executor named herein to post bond for the faithful performance of their duties.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Bond Requirement:</strong> By default, bond is required for the Executor. You can expressly waive this requirement by checking the box below. If waived, "no bond" will appear in the document instead of "bond".
          </p>
        </div>
      </div>
    );
  };

  const renderGuardianshipSection = () => {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>Note:</strong> If you do not have minor children, you can skip this entire section by leaving the checkbox unchecked. The GUARDIANSHIP article will be completely omitted from your will.
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Template Language:</strong> If I have any minor children at the time of my death, I nominate [Full Name of Primary Guardian] to serve as Guardian of the person and estate of my minor children. If [Full Name of Primary Guardian] is unable or unwilling to serve, I nominate [Full Name of Successor Guardian] as Successor Guardian. I direct that [bond] be required of any Guardian named herein to post bond for the faithful performance of their duties.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Bond Requirement:</strong> By default, bond is required for the Guardian. You can expressly waive this requirement by checking the box below. If waived, "no bond" will appear in the document instead of "bond".
          </p>
        </div>
      </div>
    );
  };

  const renderMiscellaneousSection = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700 text-sm leading-relaxed">
          <strong>Static Content:</strong> No Contest: If any person contests or attempts to invalidate any provision of this Will without probable cause, such person shall forfeit any interest in my estate. Simultaneous Death: If any beneficiary and I die under circumstances where the order of death cannot be determined, it shall be presumed that I survived the beneficiary. Severability Clause: If any provision of this Will is determined to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. Governing Law: This Will shall be governed by the laws of the State of California.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This article contains standard legal provisions and requires no user input.
        </p>
      </div>
    );
  };

  const renderAttestationSection = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed font-legal">
            <strong>Template Language:</strong> I declare that this document is my Last Will and Testament. I sign it knowingly and voluntarily, in the presence of the witnesses below. Executed on [Execution Date], at [Execution City], California.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed font-legal mt-3">
            <strong>WITNESSES' ATTESTATION</strong> We, the undersigned, declare: The Testator signed this Will in our presence. We signed as witnesses in the presence of the Testator and each other.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed font-legal mt-3">
            <strong>NOTARIZATION</strong> State of California [County] of the US On this [Date of Notarization], before me personally appeared [Full Legal Name of Testator], who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity, and that by his/her signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument. I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct. WITNESS my hand and official seal. [Notary Name] Notary Public Name: [Notary Address] Address:
          </p>
          <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mt-3">
            <strong>Important:</strong> Witness names, addresses, and signature lines are displayed as plain text placeholders in the document since these must be signed in person. Only the dates, locations, and notary information are collected in this form.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">California Will Template</h3>
        <p className="mt-1 text-sm text-gray-600">
          Complete each section to create your legally compliant California will. Your progress is automatically saved.
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {WILL_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 mr-3" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <h4 className="text-base font-medium text-gray-900">{section.title}</h4>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4">
                  {section.id === 'debts-static' ? (
                    renderStaticDebtsSection()
                  ) : section.id === 'residuary' ? (
                    renderBeneficiaryFields()
                  ) : section.id === 'specific-bequests' ? (
                    <>
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                      {renderRealPropertyFields()}
                      {renderPersonalPropertyFields()}
                    </>
                  ) : section.id === 'digital-assets' ? (
                    <>
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                      {renderDigitalAssetsFields()}
                    </>
                  ) : section.id === 'funeral-burial' ? (
                    <>
                      {renderFuneralBurialSection()}
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                    </>
                  ) : section.id === 'executor' ? (
                    <>
                      {renderExecutorSection()}
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                    </>
                  ) : section.id === 'guardianship' ? (
                    <>
                      {renderGuardianshipSection()}
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                    </>
                  ) : section.id === 'miscellaneous' ? (
                    renderMiscellaneousSection()
                  ) : section.id === 'attestation' ? (
                    <>
                      {renderAttestationSection()}
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {section.fields.map((field) => {
                        const fieldElement = renderField(field);
                        if (!fieldElement) return null;

                        return (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {fieldElement}
                          </div>
                        );
                      })}
                      
                      {/* Add children fields after hasChildren field in declaration section */}
                      {section.id === 'declaration' && renderChildrenFields()}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
