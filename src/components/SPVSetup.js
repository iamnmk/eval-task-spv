import React, { useState, useRef } from 'react';
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

function StepContent({ step, setStep, sigPad, clear, formData, handleInputChange }) {
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
              {[3, 6, 9, 12, 18, 24].map((months) => (
                <option key={months} value={months.toString()}>
                  {months} months
                </option>
              ))}
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
            </Select>
          </div>

          <div>
            <Label htmlFor="instrument">Instrument</Label>
            <Select id="instrument" value={formData.terms.instrumentType} onChange={(e) => handleInputChange('terms', 'instrumentType', e.target.value)}>
              <option value="">Select instrument</option>
            </Select>
          </div>

          <div>
            <Label>Upload Document</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-gray-600">Drop your file here, or</span>
                <button className="text-[#1B3B36] font-medium">browse</button>
              </div>
              <div className="mt-2 text-sm text-gray-500">Max file size 10 MB</div>
            </div>
          </div>

          <div>
            <Label htmlFor="valuation">Valuation</Label>
            <Select id="valuation" value={formData.terms.valuationType} onChange={(e) => handleInputChange('terms', 'valuationType', e.target.value)}>
              <option value="">Select valuation</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="shareClass">Share Class</Label>
            <Select id="shareClass" value={formData.terms.shareClass} onChange={(e) => handleInputChange('terms', 'shareClass', e.target.value)}>
              <option value="">Select class</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="roundSize">Round and Round Size</Label>
            <Select id="roundSize" value={formData.terms.roundType} onChange={(e) => handleInputChange('terms', 'roundType', e.target.value)}>
              <option value="">Select round and round size</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="allocation">Allocation</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input id="allocation" className="pl-6" value={formData.terms.allocation} onChange={(e) => handleInputChange('terms', 'allocation', e.target.value)} placeholder="e.g 100.0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Deal Page & Memo</h2>
        <p className="text-gray-600 mb-6">Text for Function or description of Deal Page & Memo</p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="memo">Memo</Label>
            <textarea
              id="memo"
              className="w-full p-2 border rounded min-h-[100px]"
              value={formData.dealMemo.memo}
              onChange={(e) => handleInputChange('dealMemo', 'memo', e.target.value)}
              placeholder="What's your investment thesis? Why are you excited about this deal?"
            />
          </div>

          <div>
            <Label>Pitch Deck</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-gray-600">Drop your file here, or</span>
                <button className="text-[#1B3B36] font-medium">browse</button>
              </div>
              <div className="mt-2 text-sm text-gray-500">Support file: PDF only</div>
            </div>
          </div>

          <div>
            <Label htmlFor="otherInvestors">Others Investors</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input id="otherInvestors" className="pl-6" value={formData.dealMemo.otherInvestors} onChange={(e) => handleInputChange('dealMemo', 'otherInvestors', e.target.value)} placeholder="e.g 100.0" />
            </div>
          </div>

          <div>
            <Label>Past Financing</Label>
            <RadioGroup>
              <label className="flex items-center space-x-2">
                <input type="radio" name="pastFinancing" value="yes" defaultChecked />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="pastFinancing" value="no" />
                <span>No</span>
              </label>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="risks">Risks</Label>
            <div className="border rounded">
              <div className="border-b p-2 flex items-center space-x-2">
                <select className="text-sm" defaultValue="Sans Serif">
                  <option>Sans Serif</option>
                </select>
                <div className="h-4 w-px bg-gray-300" />
                <button className="font-bold">B</button>
                <button className="italic">I</button>
                <button className="underline">U</button>
                <button>T</button>
              </div>
              <textarea
                id="risks"
                className="w-full p-2 min-h-[100px] focus:outline-none"
                value={formData.dealMemo.risks}
                onChange={(e) => handleInputChange('dealMemo', 'risks', e.target.value)}
                placeholder="Lorem Ipsum..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="disclosures">Disclosures</Label>
            <Input id="disclosures" value={formData.dealMemo.disclosures} onChange={(e) => handleInputChange('dealMemo', 'disclosures', e.target.value)} placeholder="e.g 100.0" />
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
        <p className="text-gray-600 mb-6">Text for Function or description of Summary</p>

        <div className="space-y-6">
          <div>
            <textarea
              className="w-full p-4 border rounded-lg min-h-[200px] resize-none"
              value={formData.summary.summaryText}
              onChange={(e) => handleInputChange('summary', 'summaryText', e.target.value)}
              placeholder="Enter your summary here..."
            />
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
          <h2 className="text-xl font-semibold mb-2">Success created SPVs</h2>
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
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const sigPad = useRef();
  
  // Form state
  const [formData, setFormData] = useState({
    basicInfo: {
      spvName: '',
      companyName: '',
      description: ''
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

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      // Get signature data as base64
      const signatureData = sigPad.current.toDataURL();

      // Insert basic info and get the SPV ID
      const { data: basicInfoData, error: basicInfoError } = await supabase
        .from('spv_basic_info')
        .insert([{
          spv_name: formData.basicInfo.spvName,
          company_name: formData.basicInfo.companyName,
          description: formData.basicInfo.description
        }])
        .select();

      if (basicInfoError) throw basicInfoError;
      const spvId = basicInfoData[0].id;

      // Insert terms
      const { error: termsError } = await supabase
        .from('spv_terms')
        .insert([{
          spv_id: spvId,
          transaction_type: formData.terms.transactionType,
          instrument_type: formData.terms.instrumentType,
          document_url: formData.terms.documentUrl,
          valuation_type: formData.terms.valuationType,
          share_class: formData.terms.shareClass,
          round_type: formData.terms.roundType,
          round_size: formData.terms.roundSize,
          allocation: formData.terms.allocation
        }]);

      if (termsError) throw termsError;

      // Insert deal memo
      const { error: dealMemoError } = await supabase
        .from('spv_deal_memo')
        .insert([{
          spv_id: spvId,
          memo: formData.dealMemo.memo,
          pitch_deck_url: formData.dealMemo.pitchDeckUrl,
          other_investors: formData.dealMemo.otherInvestors,
          past_financing: formData.dealMemo.pastFinancing,
          risks: formData.dealMemo.risks,
          disclosures: formData.dealMemo.disclosures
        }]);

      if (dealMemoError) throw dealMemoError;

      // Insert carry
      const { error: carryError } = await supabase
        .from('spv_carry')
        .insert([{
          spv_id: spvId,
          carry_amount: formData.carry.carryAmount,
          carry_recipient: formData.carry.carryRecipient,
          deal_partners: formData.carry.dealPartners
        }]);

      if (carryError) throw carryError;

      // Insert summary
      const { error: summaryError } = await supabase
        .from('spv_summary')
        .insert([{
          spv_id: spvId,
          summary_text: formData.summary.summaryText
        }]);

      if (summaryError) throw summaryError;

      // Insert signature
      const { error: signatureError } = await supabase
        .from('spv_signatures')
        .insert([{
          spv_id: spvId,
          signature_data: signatureData,
          signed_by: '' // Add user info here if available
        }]);

      if (signatureError) throw signatureError;

      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show error message to user)
    }
  };

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
            <StepContent step={step} setStep={setStep} sigPad={sigPad} clear={clear} formData={formData} handleInputChange={handleInputChange} />

            <div className="flex justify-between">
              {step > 1 && (
                <Button 
                  className="border border-[#1B3B36] text-[#1B3B36]" 
                  onClick={() => setStep(Math.max(step - 1, 1))}
                >
                  Previous
                </Button>
              )}
              <div className="flex-1" />
              <Button 
                className="bg-[#1B3B36] text-white" 
                onClick={step === 6 ? handleSubmit : () => setStep(Math.min(step + 1, 6))}
              >
                {step === 6 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SuccessDialog isOpen={showSuccess} onClose={handleCloseSuccess} />
    </div>
  );
}
