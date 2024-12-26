import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { supabase } from '../lib/supabase';

function Button({ children, className, ...props }) {
  return (
    <button className={`px-4 py-2 rounded ${className}`} {...props}>
      {children}
    </button>
  );
}

function Input({ className, ...props }) {
  return (
    <input className={`w-full p-2 border rounded ${className}`} {...props} />
  );
}

function Select({ children, ...props }) {
  return (
    <select className="w-full p-2 border rounded" {...props}>
      {children}
    </select>
  );
}

function RadioGroup({ children }) {
  return (
    <div className="flex items-center space-x-4 mt-2">
      {children}
    </div>
  );
}

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block mb-2 font-medium">
      {children}
    </label>
  );
}

function StepContent({ step, setStep, sigPad, clear, formData, handleInputChange, handleFileUpload }) {
  if (step === 1) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
        <p className="text-gray-600 mb-6">Text for Function or description of stage</p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="spvName">SPV Name</Label>
            <Input id="spvName" value={formData.basicInfo.spvName} onChange={(e) => handleInputChange('basicInfo', 'spvName', e.target.value)} />
          </div>

          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" value={formData.basicInfo.companyName} onChange={(e) => handleInputChange('basicInfo', 'companyName', e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.basicInfo.description} onChange={(e) => handleInputChange('basicInfo', 'description', e.target.value)} />
          </div>

          <div>
            <Label htmlFor="countryOfIncorporation">Country of Incorporation</Label>
            <Select 
              id="countryOfIncorporation" 
              value={formData.basicInfo.countryOfIncorporation} 
              onChange={(e) => handleInputChange('basicInfo', 'countryOfIncorporation', e.target.value)}
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="NL">Netherlands</option>
              <option value="SE">Sweden</option>
              <option value="CH">Switzerland</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
              <option value="ZA">South Africa</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SG">Singapore</option>
              <option value="HK">Hong Kong</option>
              <option value="NZ">New Zealand</option>
              <option value="IE">Ireland</option>
              <option value="DK">Denmark</option>
              <option value="NO">Norway</option>
              <option value="FI">Finland</option>
              <option value="BE">Belgium</option>
              <option value="AT">Austria</option>
              <option value="PT">Portugal</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="typeOfIncorporation">Type of Incorporation</Label>
            <Select 
              id="typeOfIncorporation" 
              value={formData.basicInfo.typeOfIncorporation} 
              onChange={(e) => handleInputChange('basicInfo', 'typeOfIncorporation', e.target.value)}
            >
              <option value="">Select type</option>
              <option value="LLC">LLC</option>
              <option value="C-Corp">C-Corp</option>
              <option value="S-Corp">S-Corp</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="companyStage">Company Stage</Label>
            <Select id="companyStage">
              <option value="">Select Company Stage</option>
              <option value="pre-revenue">Pre-Revenue</option>
              <option value="pre-launch">Pre-Launch</option>
              <option value="post-revenue">Post-Revenue</option>
              <option value="profitable">Profitable</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="monthsRunway">Months of Runway</Label>
            <Select id="monthsRunway">
              <option value="">Select months runway</option>
              <option value="Under 12">Fewer than 12 Months</option>
              <option value="Over 12">More than 12 Months</option>
            </Select>
          </div>

          <div>
            <Label>Will the SPV receive Pro-Rata Rights?</Label>
            <RadioGroup>
              <label className="flex items-center space-x-2">
                <input type="radio" name="proRataRights" value="yes" defaultChecked />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="proRataRights" value="no" />
                <span>No</span>
              </label>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="targetClosingDate">Target Closing Date</Label>
            <Input id="targetClosingDate" type="date" placeholder="e.g dd/mm/yyyy" />
          </div>

          <div>
            <Label htmlFor="minimumTicket">Minimum Ticket</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input id="minimumTicket" className="pl-6" placeholder="e.g 100.0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Terms</h2>
        <p className="text-gray-600 mb-6">Text for Function or description of Terms</p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select id="transactionType" value={formData.terms.transactionType} onChange={(e) => handleInputChange('terms', 'transactionType', e.target.value)}>
              <option value="">Select transaction type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="instrument">Instrument</Label>
            <Select id="instrument" value={formData.terms.instrumentType} onChange={(e) => handleInputChange('terms', 'instrumentType', e.target.value)}>
              <option value="">Select instrument</option>
              <option value="Equity">Equity</option>
              <option value="SAFE">SAFE</option>
              <option value="Convertible Note">Convertible Note</option>
            </Select>
          </div>

          <div>
            <Label>Upload Document</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0], 'terms', 'documentUrl')}
                accept=".pdf,.doc,.docx"
              />
              <div className="flex flex-col items-center">
                {formData.terms.documentUrl ? (
                  <>
                    <span className="text-green-600">✓ File uploaded</span>
                    <span className="text-sm text-gray-500 mt-1">{formData.terms.documentUrl.split('/').pop()}</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600">Drop your file here, or</span>
                    <button type="button" className="text-[#1B3B36] font-medium">browse</button>
                    <div className="mt-2 text-sm text-gray-500">Max file size 10 MB</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="valuationType">Valuation Type</Label>
            <Select id="valuationType" value={formData.terms.valuationType} onChange={(e) => handleInputChange('terms', 'valuationType', e.target.value)}>
              <option value="">Select valuation type</option>
              <option value="Pre-Money">Pre-Money</option>
              <option value="Post-Money">Post-Money</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="shareClass">Share Class</Label>
            <Select id="shareClass" value={formData.terms.shareClass} onChange={(e) => handleInputChange('terms', 'shareClass', e.target.value)}>
              <option value="">Select share class</option>
              <option value="Common">Common</option>
              <option value="Preferred">Preferred</option>
              <option value="Series Seed">Series Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="roundType">Round Type</Label>
            <Select id="roundType" value={formData.terms.roundType} onChange={(e) => handleInputChange('terms', 'roundType', e.target.value)}>
              <option value="">Select round type</option>
              <option value="Pre Seed">Pre Seed</option>
              <option value="Seed">Seed</option>
              <option value="Pre A">Pre A</option>
              <option value="Series A">Series A</option>
              <option value="Pre B">Pre B</option>
              <option value="Series B">Series B</option>
              <option value="Pre C">Pre C</option>
              <option value="Series C">Series C</option>
              <option value="Series D">Series D</option>
              <option value="Series E">Series E</option>
              <option value="Series F">Series F</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="roundSize">Round Size</Label>
            <Input
              type="number"
              id="roundSize"
              value={formData.terms.roundSize}
              onChange={(e) => handleInputChange('terms', 'roundSize', e.target.value)}
              placeholder="Enter round size"
            />
          </div>

          <div>
            <Label htmlFor="allocation">Allocation</Label>
            <Input
              type="number"
              id="allocation"
              value={formData.terms.allocation}
              onChange={(e) => handleInputChange('terms', 'allocation', e.target.value)}
              placeholder="Enter allocation"
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Deal Memo</h2>
        <p className="text-gray-600 mb-6">Text for Function or description of Deal Memo</p>

        <div className="space-y-6">
          <div>
            <Label>Upload Pitch Deck</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileUpload(e.target.files[0], 'dealMemo', 'pitchDeckUrl')}
              onClick={() => document.getElementById('pitch-deck-upload').click()}
            >
              <input
                id="pitch-deck-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0], 'dealMemo', 'pitchDeckUrl')}
                accept=".pdf,.ppt,.pptx"
              />
              <div className="flex flex-col items-center">
                {formData.dealMemo.pitchDeckUrl ? (
                  <>
                    <span className="text-green-600">✓ Pitch Deck uploaded</span>
                    <span className="text-sm text-gray-500 mt-1">{formData.dealMemo.pitchDeckUrl.split('/').pop()}</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600">Drop your pitch deck here, or</span>
                    <button type="button" className="text-[#1B3B36] font-medium">browse</button>
                    <div className="mt-2 text-sm text-gray-500">Max file size 10 MB</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="memo">Memo</Label>
            <textarea
              id="memo"
              className="w-full p-2 border rounded h-32"
              value={formData.dealMemo.memo}
              onChange={(e) => handleInputChange('dealMemo', 'memo', e.target.value)}
              placeholder="Enter memo details..."
            />
          </div>

          <div>
            <Label htmlFor="otherInvestors">Other Investors</Label>
            <textarea
              id="otherInvestors"
              className="w-full p-2 border rounded h-32"
              value={formData.dealMemo.otherInvestors}
              onChange={(e) => handleInputChange('dealMemo', 'otherInvestors', e.target.value)}
              placeholder="List other investors..."
            />
          </div>

          <div>
            <Label>Past Financing</Label>
            <RadioGroup>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pastFinancing"
                  checked={formData.dealMemo.pastFinancing === true}
                  onChange={() => handleInputChange('dealMemo', 'pastFinancing', true)}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pastFinancing"
                  checked={formData.dealMemo.pastFinancing === false}
                  onChange={() => handleInputChange('dealMemo', 'pastFinancing', false)}
                />
                <span>No</span>
              </label>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="risks">Risks</Label>
            <textarea
              id="risks"
              className="w-full p-2 border rounded h-32"
              value={formData.dealMemo.risks}
              onChange={(e) => handleInputChange('dealMemo', 'risks', e.target.value)}
              placeholder="List potential risks..."
            />
          </div>

          <div>
            <Label htmlFor="disclosures">Disclosures</Label>
            <textarea
              id="disclosures"
              className="w-full p-2 border rounded h-32"
              value={formData.dealMemo.disclosures}
              onChange={(e) => handleInputChange('dealMemo', 'disclosures', e.target.value)}
              placeholder="Enter any disclosures..."
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Carry and GP Commitment</h2>
        <p className="text-gray-600 mb-6">Text for Function or description of Carry and GP Commitment</p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="carry">Carry</Label>
            <Input id="carry" value={formData.carry.carryAmount} onChange={(e) => handleInputChange('carry', 'carryAmount', e.target.value)} placeholder="e.g 100.0" />
          </div>

          <div>
            <Label htmlFor="carryRecipient">Carry Recipient</Label>
            <Select id="carryRecipient" value={formData.carry.carryRecipient} onChange={(e) => handleInputChange('carry', 'carryRecipient', e.target.value)}>
              <option value="">Recipient</option>
              <option value="Carry">Carry</option>
              <option value="Carry Recipient">Carry Recipient</option>
              <option value="GP Commitment">GP Commitment</option>
              <option value="Deal Partners">Deal Partners</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="dealPartners">Deal Partners</Label>
            <Input id="dealPartners" value={formData.carry.dealPartners} onChange={(e) => handleInputChange('carry', 'dealPartners', e.target.value)} placeholder="e.g 100.0" />
          </div>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p className="text-gray-600 mb-6">Review the information you've provided</p>

        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <h3 className="font-medium text-lg mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">SPV Name</p>
                <p className="font-medium">{formData.basicInfo.spvName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Company Name</p>
                <p className="font-medium">{formData.basicInfo.companyName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Description</p>
                <p className="font-medium">{formData.basicInfo.description || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Country of Incorporation</p>
                <p className="font-medium">{formData.basicInfo.countryOfIncorporation || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Type of Incorporation</p>
                <p className="font-medium">{formData.basicInfo.typeOfIncorporation || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Terms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Transaction Type</p>
                <p className="font-medium">{formData.terms.transactionType || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Instrument Type</p>
                <p className="font-medium">{formData.terms.instrumentType || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Valuation Type</p>
                <p className="font-medium">{formData.terms.valuationType || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Share Class</p>
                <p className="font-medium">{formData.terms.shareClass || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Round Type</p>
                <p className="font-medium">{formData.terms.roundType || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Allocation</p>
                <p className="font-medium">{formData.terms.allocation || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Deal Memo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Memo</p>
                <p className="font-medium">{formData.dealMemo.memo || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Other Investors</p>
                <p className="font-medium">{formData.dealMemo.otherInvestors || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Past Financing</p>
                <p className="font-medium">{formData.dealMemo.pastFinancing ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Risks</p>
                <p className="font-medium">{formData.dealMemo.risks || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Disclosures</p>
                <p className="font-medium">{formData.dealMemo.disclosures || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Carry and GP Commitment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Carry Amount</p>
                <p className="font-medium">{formData.carry.carryAmount || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Carry Recipient</p>
                <p className="font-medium">{formData.carry.carryRecipient || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Deal Partners</p>
                <p className="font-medium">{formData.carry.dealPartners || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">E-sign and Submit</h2>
        <p className="text-gray-600 mb-6">Text for Function or description of E-sign and Submit</p>

        <div className="space-y-6">
          <div>
            <Label>Signature</Label>
            <div className="border rounded-lg p-4">
              <SignatureCanvas
                ref={sigPad}
                canvasProps={{
                  className: 'w-full h-[200px] border rounded-lg',
                }}
                backgroundColor="white"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium"></span> • Signed at: {new Date().toLocaleString()}
                </div>
                <button
                  onClick={clear}
                  className="text-sm text-[#1B3B36] hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function SuccessDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#1B3B36] rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Success created SPVs</h2>
          <p className="text-gray-600 mb-6">Description for success message</p>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-[#1B3B36] hover:underline"
          >
            Close
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SPVSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sigPad = useRef();
  
  // Form state
  const [formData, setFormData] = useState({
    basicInfo: {
      spvName: '',
      companyName: '',
      description: '',
      countryOfIncorporation: '',
      typeOfIncorporation: ''
    },
    terms: {
      transactionType: '',
      instrumentType: '',
      documentUrl: '',
      valuationType: '',
      shareClass: '',
      roundType: '',
      roundSize: '',
      allocation: ''
    },
    dealMemo: {
      memo: '',
      pitchDeckUrl: '',
      otherInvestors: '',
      pastFinancing: false,
      risks: '',
      disclosures: ''
    },
    carry: {
      carryAmount: '',
      carryRecipient: '',
      dealPartners: ''
    },
    summary: {
      summaryText: ''
    }
  });

  const isFormComplete = () => {
    // Basic Info - only require essential fields
    if (!formData.basicInfo.spvName || !formData.basicInfo.companyName) return false;
    
    // Terms - only require essential fields
    if (!formData.terms.transactionType || !formData.terms.instrumentType) return false;
    
    // Deal Memo - only require memo
    if (!formData.dealMemo.memo) return false;
    
    // Carry - only require carry amount
    if (!formData.carry.carryAmount) return false;
    
    return true;
  };

  const validateBasicInfo = () => {
    const { spvName, companyName, description, countryOfIncorporation, typeOfIncorporation } = formData.basicInfo;
    return spvName && companyName && description && countryOfIncorporation && typeOfIncorporation;
  };

  const validateTerms = () => {
    const { transactionType, instrumentType, roundSize, allocation } = formData.terms;
    return transactionType && instrumentType && roundSize && allocation;
  };

  const validateDealMemo = () => {
    const { memo, risks, disclosures } = formData.dealMemo;
    return memo && risks && disclosures; // otherInvestors is optional
  };

  const validateCarry = () => {
    const { carryAmount, carryRecipient } = formData.carry;
    return carryAmount && carryRecipient;
  };

  const validateSummary = () => {
    // Summary is just a review step, no validation needed
    return true;
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber - 1) { // Validate previous step
      case 0:
        return true; // First step, no previous validation needed
      case 1:
        return validateBasicInfo();
      case 2:
        return validateTerms();
      case 3:
        return validateDealMemo();
      case 4:
        return validateCarry();
      case 5:
        return validateSummary();
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (!validateStep(step + 1)) {
      alert('Please complete all required fields in the current step before proceeding.');
      return;
    }
    setStep(Math.min(step + 1, 6));
  };

  const handlePreviousStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get signature data
      if (!sigPad.current || sigPad.current.isEmpty()) {
        alert('Please provide your signature before submitting');
        setIsLoading(false);
        return;
      }
      const signatureData = sigPad.current.toDataURL();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('Authentication error. Please sign in again.');
      }

      if (!user) {
        throw new Error('No user found. Please sign in.');
      }

      // Check if form is complete
      const complete = isFormComplete();
      const timestamp = new Date().toISOString();

      // 1. Create or update basic SPV info
      const { data: spvData, error: spvError } = await supabase
        .from('spv_basic_info')
        .upsert({
          id: id || undefined,
          spv_name: formData.basicInfo.spvName,
          company_name: formData.basicInfo.companyName,
          description: formData.basicInfo.description,
          status: complete ? 'approved' : 'draft',
          is_complete: complete,
          created_at: timestamp,
          updated_at: timestamp
        })
        .select()
        .single();

      if (spvError) throw spvError;

      // 2. Create or update SPV terms
      const { error: termsError } = await supabase
        .from('spv_terms')
        .upsert({
          spv_id: spvData.id,
          transaction_type: formData.terms.transactionType,
          document_url: formData.terms.documentUrl,
          round_size: formData.terms.roundSize,
          allocation: formData.terms.allocation,
          instrument_type: formData.terms.instrumentType,
          round_type: formData.terms.roundType,
          share_class: formData.terms.shareClass,
          valuation_type: formData.terms.valuationType,
          created_at: timestamp,
          updated_at: timestamp
        });

      if (termsError) throw termsError;

      // 3. Create or update SPV carry
      const { error: carryError } = await supabase
        .from('spv_carry')
        .upsert({
          spv_id: spvData.id,
          carry_amount: formData.carry.carryAmount,
          carry_recipient: formData.carry.carryRecipient,
          deal_partners: formData.carry.dealPartners,
          created_at: timestamp,
          updated_at: timestamp
        });

      if (carryError) throw carryError;

      // 4. Create or update deal memo
      const { error: memoError } = await supabase
        .from('spv_deal_memo')
        .upsert({
          spv_id: spvData.id,
          memo: formData.dealMemo.memo,
          pitch_deck_url: formData.dealMemo.pitchDeckUrl,
          other_investors: formData.dealMemo.otherInvestors,
          past_financing: formData.dealMemo.pastFinancing,
          risks: formData.dealMemo.risks,
          disclosures: formData.dealMemo.disclosures,
          created_at: timestamp,
          updated_at: timestamp
        });

      if (memoError) throw memoError;

      // 5. Create signature record
      const { error: signatureError } = await supabase
        .from('spv_signatures')
        .upsert({
          spv_id: spvData.id,
          signature_data: signatureData,
          signed_by: user.id,
          signed_at: timestamp,
          created_at: timestamp,
          updated_at: timestamp
        });

      if (signatureError) throw signatureError;

      // 6. Create activity log entry
      const { error: activityError } = await supabase
        .from('spv_activity_log')
        .insert({
          spv_id: spvData.id,
          user_id: user.id,
          action: complete ? 'SPV Submitted' : 'SPV Draft Saved',
          previous_status: 'draft',
          new_status: complete ? 'approved' : 'draft',
          created_at: timestamp
        });

      if (activityError) throw activityError;

      // Show success dialog and navigate
      if (complete) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/vehicles');
        }, 2000);
      } else {
        alert('Draft saved successfully. Please complete all required fields to submit.');
      }
    } catch (error) {
      console.error('Error saving SPV:', error);
      alert(error.message || 'Error saving SPV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (file, type) => {
    try {
      setIsLoading(true);

      // Upload file to Supabase storage
      const { data } = await supabase.storage
        .from('documents')
        .upload(`${id}/${type}/${file.name}`, file);
      
      if (data) {
        console.log('File uploaded successfully:', data);
      }
      handleInputChange(type, 'documentUrl', data.publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      // Save basic info
      const { error: basicInfoError } = await supabase
        .from('spvs')
        .upsert({
          id: id || undefined,
          spv_name: formData.basicInfo.spvName || 'Untitled SPV',
          company_name: formData.basicInfo.companyName,
          description: formData.basicInfo.description,
          status: 'draft',
          is_complete: false,  // Mark as incomplete
          created_by: formData.basicInfo.companyName,
          company_details: formData.dealMemo.memo,
          financials: formData.carry.carryAmount,
          cap_table: formData.terms.valuationType,
          investment_terms: formData.terms.instrumentType,
          documents: formData.dealMemo.pitchDeckUrl
        })
        .select()
        .single();

      if (basicInfoError) throw basicInfoError;

      alert('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchSPVData() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch basic info
        const { data: spvData } = await supabase
          .from('spvs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (spvData) {
          setFormData(prevData => ({
            ...prevData,
            basicInfo: {
              ...prevData.basicInfo,
              companyName: spvData.company_name || '',
            },
            terms: {
              ...prevData.terms,
              transactionType: spvData.transaction_type || '',
              instrumentType: spvData.instrument_list || '',
              allocation: spvData.allocation?.toString() || ''
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching SPV data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSPVData();
  }, [id]);

  const clear = () => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Additional cleanup or navigation if needed
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Terms' },
    { number: 3, title: 'Deal Page & Memo' },
    { number: 4, title: 'Carry and GP Commitment' },
    { number: 5, title: 'Summary' },
    { number: 6, title: 'E-sign and Submit' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">SPV Setup</h1>
        <Button variant="ghost">Cancel</Button>
      </div>

      <div className="flex">
        {/* Vertical Steps */}
        <div className="w-64 p-6 border-r">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center mb-4">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border 
                ${step >= s.number ? 'bg-[#1B3B36] border-[#1B3B36] text-white' : 'border-gray-300 text-gray-400'}`}>
                {s.number}
              </div>
              <span className={`ml-3 text-sm ${step >= s.number ? 'text-[#1B3B36] font-medium' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Form */}
          <div className="max-w-3xl">
            <StepContent 
              step={step} 
              setStep={setStep} 
              sigPad={sigPad} 
              clear={clear} 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleFileUpload={handleFileUpload}
            />

            <div className="flex justify-between">
              {step > 1 && (
                <Button 
                  className="border border-[#1B3B36] text-[#1B3B36]" 
                  onClick={handlePreviousStep}
                >
                  Previous
                </Button>
              )}
              <div className="flex-1" />
              {step === 6 ? (
                <div className="flex gap-4">
                  <Button 
                    className="bg-[#1B3B36] text-white hover:bg-[#2a5a52]" 
                    onClick={handleSubmit}
                    disabled={!validateStep(6)}
                  >
                    Submit
                  </Button>
                  <Button 
                    className="border border-[#1B3B36] text-[#1B3B36] hover:bg-gray-50" 
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>
                </div>
              ) : (
                <Button 
                  className="bg-[#1B3B36] text-white" 
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <SuccessDialog isOpen={showSuccess} onClose={handleCloseSuccess} />
    </div>
  );
}
