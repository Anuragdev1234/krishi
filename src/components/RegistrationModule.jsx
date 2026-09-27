import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Smartphone, 
  RefreshCw, 
  Users, 
  Search, 
  UserPlus, 
  Calculator, 
  Sparkles,
  MapPin,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { initialFarmers } from '../mockData';

export default function RegistrationModule({ 
  farmerUser, 
  setFarmerUser, 
  farmers = initialFarmers, 
  setFarmers, 
  onProceedToBooking, 
  t 
}) {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [farmerFilter, setFarmerFilter] = useState('');

  // New Farmer Registration Form state (when mobile is not in database)
  const [isNewFarmerForm, setIsNewFarmerForm] = useState(false);
  const [newFarmerData, setNewFarmerData] = useState({
    name: '',
    surveyNo: '', // Khasra / Survey Number
    hectares: '2.5', // Land Area in Hectares
    crop: 'Paddy (Common Grade)',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Dubagga Dehat',
    aadhaar: '543210987654',
    bankName: 'State Bank of India (SBI)',
    bankAccount: '33445566778'
  });

  // Crop Yield Standards (Metric Tonnes per Hectare & 2026-27 MSP Rates)
  const cropYields = {
    'Paddy (Common Grade)': { yieldHa: 4.0, mspRate: 2320, nameHi: 'धान (सामान्य ग्रेड)' },
    'Paddy (Grade A)': { yieldHa: 4.2, mspRate: 2380, nameHi: 'धान (ग्रेड "ए")' },
    'Soybean (Yellow)': { yieldHa: 2.5, mspRate: 4892, nameHi: 'सोयाबीन (पीला)' },
    'Wheat (FAQ)': { yieldHa: 4.0, mspRate: 2275, nameHi: 'गेहूं (मानक FAQ)' },
    'Maize': { yieldHa: 3.8, mspRate: 2090, nameHi: 'मक्का' }
  };

  const currentYieldData = cropYields[newFarmerData.crop] || cropYields['Paddy (Common Grade)'];
  const parsedHectares = parseFloat(newFarmerData.hectares) || 0;
  const calculatedTonnes = (parsedHectares * currentYieldData.yieldHa).toFixed(1);
  const estimatedPayout = Math.round(parseFloat(calculatedTonnes) * 10 * currentYieldData.mspRate);

  const handleSelectFarmer = (f) => {
    setIsNewFarmerForm(false);
    setMobile(f.mobile);
    setOtpSent(true);
    setEnteredOtp('123456');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleStartNewFarmer = () => {
    setIsNewFarmerForm(true);
    setOtpSent(true);
    setEnteredOtp('123456');
    setErrorMsg('');
    setSuccessMsg('');
    if (!mobile) setMobile('98' + Math.floor(10000000 + Math.random() * 90000000));
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 400);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== '123456') {
      setErrorMsg('Invalid OTP. Please enter 123456 for this demo.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    // Look up from our current farmers database pool
    const matched = farmers.find(f => f.mobile === mobile);

    setTimeout(() => {
      setLoading(false);
      if (matched) {
        // Known farmer in database -> Log in directly
        setIsNewFarmerForm(false);
        setFarmerUser({
          name: matched.name,
          mobile: matched.mobile,
          aadhaarMasked: matched.aadhaarMasked,
          state: matched.state,
          district: matched.district,
          village: matched.village,
          bankMasked: matched.bankMasked,
          landRecords: [
            {
              khasra: matched.khasra,
              areaHa: matched.areaHa,
              crop: matched.crop,
              maxPermittedTonnes: matched.maxTonnes,
              procuredSoFar: 0.0
            }
          ]
        });
      } else {
        // UNREGISTERED / NEW USER -> Open New Farmer Enrollment Form
        setIsNewFarmerForm(true);
        setSuccessMsg('Mobile verified successfully via C-DAC OTP! Please enter your land and crop details to complete your enrollment.');
      }
    }, 400);
  };

  // Submit handler for NEW FARMER ENROLLMENT
  const handleSaveNewFarmer = (e) => {
    e.preventDefault();
    if (!newFarmerData.name.trim()) {
      setErrorMsg('Please enter farmer full name.');
      return;
    }
    if (!newFarmerData.surveyNo.trim()) {
      setErrorMsg('Please enter your Khasra / Survey number.');
      return;
    }
    if (parsedHectares <= 0) {
      setErrorMsg('Cultivated field area in hectares must be greater than 0.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const newFarmerObj = {
        id: Date.now(),
        name: newFarmerData.name.trim(),
        mobile: mobile,
        aadhaarMasked: newFarmerData.aadhaar ? `XXXX-XXXX-${newFarmerData.aadhaar.slice(-4)}` : 'XXXX-XXXX-8921',
        state: newFarmerData.state,
        district: newFarmerData.district,
        village: newFarmerData.village.trim() || 'Panchayat Area',
        bankMasked: newFarmerData.bankAccount ? `${newFarmerData.bankName} A/C XXXX-${newFarmerData.bankAccount.slice(-4)}` : 'SBI A/C XXXX-9124',
        khasra: newFarmerData.surveyNo.trim(),
        areaHa: parsedHectares,
        crop: newFarmerData.crop,
        maxTonnes: parseFloat(calculatedTonnes),
        isNewlyEnrolled: true
      };

      // Add to farmers database list so they appear in searchable directory
      if (setFarmers) {
        setFarmers(prev => [newFarmerObj, ...prev]);
      }

      // Set logged-in active farmer session
      setFarmerUser({
        name: newFarmerObj.name,
        mobile: newFarmerObj.mobile,
        aadhaarMasked: newFarmerObj.aadhaarMasked,
        state: newFarmerObj.state,
        district: newFarmerObj.district,
        village: newFarmerObj.village,
        bankMasked: newFarmerObj.bankMasked,
        landRecords: [
          {
            khasra: newFarmerObj.khasra,
            areaHa: newFarmerObj.areaHa,
            crop: newFarmerObj.crop,
            maxPermittedTonnes: newFarmerObj.maxTonnes,
            procuredSoFar: 0.0
          }
        ]
      });

      setLoading(false);
      setIsNewFarmerForm(false);
    }, 500);
  };

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(farmerFilter.toLowerCase()) ||
    f.mobile.includes(farmerFilter) ||
    f.state.toLowerCase().includes(farmerFilter.toLowerCase()) ||
    f.crop.toLowerCase().includes(farmerFilter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-emerald-950 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-700/80 rounded-xl">
                <UserCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t.card1Title}</h2>
                <p className="text-xs text-emerald-200 mt-0.5">{t.card1Desc}</p>
              </div>
            </div>

            {/* Quick Action to Register New Farmer */}
            {!farmerUser && !isNewFarmerForm && (
              <button
                type="button"
                onClick={handleStartNewFarmer}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register New Farmer (नया किसान)</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {!farmerUser ? (
            isNewFarmerForm ? (
              /* NEW FARMER ENROLLMENT FORM */
              <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-6 md:p-8 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase rounded-full">
                        New Farmer Registration
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Mobile: <strong>+91 {mobile}</strong> (OTP Verified)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Enter Field Land Records & Declared Crops (भूलेख प्रविष्टि)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Please enter your name, Khasra/survey number, field hectares, and crop to calculate your official MSP procurement quota.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNewFarmerForm(false);
                      setOtpSent(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                  >
                    Cancel & Back to Login
                  </button>
                </div>

                <form onSubmit={handleSaveNewFarmer} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* 1. Farmer Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Farmer Full Name (किसान का पूरा नाम) *
                      </label>
                      <input
                        type="text"
                        value={newFarmerData.name}
                        onChange={(e) => setNewFarmerData({...newFarmerData, name: e.target.value})}
                        placeholder="e.g. Rameshwar Singh / रामेश्वर सिंह"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                        required
                      />
                    </div>

                    {/* 2. Survey / Khasra No */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Khasra / Survey Number (खसरा / सर्वे नंबर) *
                      </label>
                      <input
                        type="text"
                        value={newFarmerData.surveyNo}
                        onChange={(e) => setNewFarmerData({...newFarmerData, surveyNo: e.target.value})}
                        placeholder="e.g. 142/2A or 218/5"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-mono font-bold"
                        required
                      />
                    </div>

                    {/* 3. Field Area in Hectares */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Cultivated Field Area in Hectares (खेती का रकबा - हेक्टेयर में) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="50"
                          value={newFarmerData.hectares}
                          onChange={(e) => setNewFarmerData({...newFarmerData, hectares: e.target.value})}
                          placeholder="e.g. 2.5"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-mono font-bold"
                          required
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-semibold">
                          Hectares (≈ {(parsedHectares * 2.471).toFixed(1)} Acres)
                        </span>
                      </div>
                    </div>

                    {/* 4. Crop Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Commodity / Crop to Procure (फसल का चयन) *
                      </label>
                      <select
                        value={newFarmerData.crop}
                        onChange={(e) => setNewFarmerData({...newFarmerData, crop: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                      >
                        <option value="Paddy (Common Grade)">Paddy (Common Grade) - धान सामान्य (MSP: ₹2,320/Qtl)</option>
                        <option value="Paddy (Grade A)">Paddy (Grade A) - धान ग्रेड 'ए' (MSP: ₹2,380/Qtl)</option>
                        <option value="Soybean (Yellow)">Soybean (Yellow) - सोयाबीन पीला (MSP: ₹4,892/Qtl)</option>
                        <option value="Wheat (FAQ)">Wheat (FAQ) - गेहूं मानक (MSP: ₹2,275/Qtl)</option>
                        <option value="Maize">Maize - मक्का (MSP: ₹2,090/Qtl)</option>
                      </select>
                    </div>

                    {/* 5. State */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        State (राज्य) *
                      </label>
                      <select
                        value={newFarmerData.state}
                        onChange={(e) => setNewFarmerData({...newFarmerData, state: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                      >
                        <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                        <option value="Punjab">Punjab (ਪੰਜਾਬ)</option>
                        <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                        <option value="Haryana">Haryana (हरियाणा)</option>
                        <option value="Odisha">Odisha (ଓଡ଼ିଶା)</option>
                        <option value="Chhattisgarh">Chhattisgarh (छत्तीसगढ़)</option>
                      </select>
                    </div>

                    {/* 6. District & Village */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          District (जिला)
                        </label>
                        <input
                          type="text"
                          value={newFarmerData.district}
                          onChange={(e) => setNewFarmerData({...newFarmerData, district: e.target.value})}
                          placeholder="e.g. Lucknow"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Village / Tehsil (गांव)
                        </label>
                        <input
                          type="text"
                          value={newFarmerData.village}
                          onChange={(e) => setNewFarmerData({...newFarmerData, village: e.target.value})}
                          placeholder="e.g. Dubagga"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* 7. Aadhaar */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Aadhaar Number (12-digit e-KYC)
                      </label>
                      <input
                        type="text"
                        maxLength="12"
                        value={newFarmerData.aadhaar}
                        onChange={(e) => setNewFarmerData({...newFarmerData, aadhaar: e.target.value.replace(/\D/g, '')})}
                        placeholder="543210987654"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 8. Bank Account for DBT */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Bank Account Number (DBT भुगतान हेतु खाता)
                      </label>
                      <input
                        type="text"
                        value={newFarmerData.bankAccount}
                        onChange={(e) => setNewFarmerData({...newFarmerData, bankAccount: e.target.value.replace(/\D/g, '')})}
                        placeholder="e.g. 33445566778"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-mono"
                      />
                    </div>

                  </div>

                  {/* Real-time Dynamic Yield & MSP Value Box */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 uppercase">
                          Automated Bhulekh Yield & MSP Entitlement
                        </div>
                        <div className="text-xs text-emerald-800">
                          Formula: {parsedHectares} Ha × {currentYieldData.yieldHa} MT/Ha = <strong className="text-sm font-extrabold text-emerald-900">{calculatedTonnes} Metric Tonnes</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-emerald-700 block">Govt MSP Guarantee (2026-27):</span>
                      <span className="text-base font-black text-emerald-900 font-mono">
                        ₹ {estimatedPayout.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsNewFarmerForm(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                      <span>Save Profile & Verify with Bhulekh (सत्यापित करें)</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* LOGIN SCREEN & DIRECTORY */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Mobile / OTP Verification (5 Cols) */}
                <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mb-2">
                      <Smartphone className="w-6 h-6" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{t.farmerLogin}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter mobile number. If you are a new farmer, you will be prompted for your land & crop details.
                    </p>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          {t.enterMobile}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">+91</span>
                          <input
                            type="tel"
                            maxLength="10"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="w-full pl-12 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono bg-white"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                        <span>{t.sendOtp}</span>
                      </button>

                      <div className="pt-2 border-t border-slate-200 text-center">
                        <button
                          type="button"
                          onClick={handleStartNewFarmer}
                          className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center justify-center space-x-1 w-full"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Are you a new farmer? Click here to enroll</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-center text-slate-400">
                        Compliant with Digital Personal Data Protection (DPDP) Act 2023.
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                        <span>OTP dispatched to <strong>+91 {mobile}</strong> via C-DAC Mobile Seva.</span>
                        <div className="mt-1 font-mono text-[11px] text-amber-800 font-bold">{t.demoOtpNote}</div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Enter 6-digit OTP
                        </label>
                        <input
                          type="text"
                          maxLength="6"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.trim())}
                          placeholder="123456"
                          className="w-full px-4 py-2 text-center text-lg tracking-widest font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                        <span>{t.verifyOtp}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setEnteredOtp('');
                        }}
                        className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline"
                      >
                        Change Mobile Number
                      </button>
                    </form>
                  )}
                </div>

                {/* Right Column: 35+ Enrolled Farmers Directory (7 Cols) */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>Enrolled Farmers Database ({farmers.length} Verified Users)</span>
                    </div>
                    
                    {/* Search filter */}
                    <div className="relative">
                      <input
                        type="text"
                        value={farmerFilter}
                        onChange={(e) => setFarmerFilter(e.target.value)}
                        placeholder="Search farmer or state..."
                        className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 w-44 bg-white"
                      />
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                    {filteredFarmers.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => handleSelectFarmer(f)}
                        className={`p-3 hover:bg-emerald-50/60 cursor-pointer transition-colors flex justify-between items-center group ${f.isNewlyEnrolled ? 'bg-amber-50/70 border-l-4 border-amber-400' : ''}`}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <strong className="text-slate-900 group-hover:text-emerald-800">{f.name}</strong>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-semibold">
                              {f.state}
                            </span>
                            {f.isNewlyEnrolled && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-bold">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Mob: +91 {f.mobile} • {f.village}, {f.district}
                          </p>
                          <p className="text-[11px] text-emerald-700 font-medium">
                            Crop: {f.crop} ({f.maxTonnes} MT eligible) • Survey/Khasra: {f.khasra} • Land: {f.areaHa} Ha
                          </p>
                        </div>

                        <button
                          type="button"
                          className="px-2.5 py-1 bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white rounded text-[11px] font-bold text-slate-700 transition-colors"
                        >
                          Auto-fill & Login →
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Tip: Click any registered farmer above to immediately auto-fill mobile and authenticate into their Bhulekh land survey record. Or click "+ Register New Farmer" to enter custom land details.
                  </p>
                </div>

              </div>
            )
          ) : (
            /* VERIFIED FARMER PROFILE & LAND RECORDS */
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {farmerUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-base">{farmerUser.name}</h4>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Aadhaar e-KYC Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Mobile: +91 {farmerUser.mobile} • Aadhaar: {farmerUser.aadhaarMasked} • {farmerUser.village}, {farmerUser.district}, {farmerUser.state}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-500 block">Bank Account for DBT:</span>
                  <span className="font-bold text-emerald-800 font-mono">{farmerUser.bankMasked}</span>
                </div>
              </div>

              {/* State Land Registry Validation Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Cross-Referenced Bhulekh / BhuNaksha Land Records</span>
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                    Verified with Revenue Dept
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Khasra / Survey No.</th>
                        <th className="py-2.5 px-3">Cultivated Land (Ha)</th>
                        <th className="py-2.5 px-3">Declared Crop</th>
                        <th className="py-2.5 px-3">Max Permissible Yield</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {farmerUser.landRecords.map((rec, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{rec.khasra}</td>
                          <td className="py-2.5 px-3">{rec.areaHa} Hectares</td>
                          <td className="py-2.5 px-3">{rec.crop}</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">{rec.maxPermittedTonnes} Metric Tonnes</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              VALIDATED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFarmerUser(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                >
                  Log out / Choose or Register another farmer
                </button>

                <button
                  type="button"
                  onClick={onProceedToBooking}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Book Mandi Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
