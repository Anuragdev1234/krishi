import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  IndianRupee, 
  Scale, 
  FileCheck, 
  ArrowRight,
  UserCheck,
  Camera,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ProcurementTracker({ appointments, t }) {
  const [searchTerm, setSearchTerm] = useState('TK-UP-2026-0001');
  const [activeRecord, setActiveRecord] = useState(appointments[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim().toUpperCase();
    const found = appointments.find(
      (a) => a.token.toUpperCase() === query || a.mobile.includes(query)
    );

    if (found) {
      setActiveRecord(found);
      setErrorMsg('');
    } else {
      setErrorMsg('No procurement record found for the provided Token ID or Mobile Number.');
    }
  };

  const handleQuickSelect = (appt) => {
    setActiveRecord(appt);
    setSearchTerm(appt.token);
    setErrorMsg('');
  };

  // 5-Stage Life Cycle definition
  const stages = [
    { key: 'SCHEDULED', label: 'Slot Scheduled', sub: 'Token Generated & Mandi Quota Reserved' },
    { key: 'CHECKED_IN', label: 'Mandi Arrival', sub: 'QR Scanned at Entry Gate & In Queue' },
    { key: 'TESTING_IN_PROGRESS', label: 'Quality & Moisture', sub: 'Assaying (Moisture ≤ 17.0% acceptable)' },
    { key: 'WEIGHMENT_COMPLETED', label: 'Weighbridge Weighed', sub: 'Gross - Tare = Net Weight Recorded' },
    { key: 'PAYOUT_INITIATED', label: 'DBT Payment Disbursed', sub: 'PFMS Transfer directly to Bank A/C' },
  ];

  const getStageIndex = (status) => {
    const map = {
      SCHEDULED: 0,
      CHECKED_IN: 1,
      TESTING_IN_PROGRESS: 2,
      WEIGHMENT_COMPLETED: 3,
      PAYOUT_INITIATED: 4,
      COMPLETED: 4
    };
    return map[status] ?? 0;
  };

  const currentStageIdx = activeRecord ? getStageIndex(activeRecord.status) : 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      
      {/* Module Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-blue-800 to-indigo-900 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-700/80 rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.card3Title}</h2>
              <p className="text-xs text-blue-200 mt-0.5">{t.card3Desc}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Track by Virtual Token ID or Registered Mobile
            </label>
            <div className="flex gap-2">
              <div className="relative grow">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchTokenPlaceholder}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {t.trackBtn}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-600 mt-2 font-medium">{errorMsg}</p>
            )}
          </form>

          {/* Quick Click from Active 35+ Tokens Stream */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Select from Live Mandi Tokens ({appointments.length} active in queue):
              </span>
              <span className="text-[10px] text-blue-700 font-semibold">Click any token to inspect live timeline</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {appointments.slice(0, 10).map((a) => (
                <button
                  type="button"
                  key={a.token}
                  onClick={() => handleQuickSelect(a)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeRecord?.token === a.token
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {a.token} ({a.crop.slice(0, 5)})
                </button>
              ))}
            </div>
          </div>

          {activeRecord && (
            <div className="space-y-8">
              
              {/* Token Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Token Identifier</span>
                    <h3 className="text-lg font-black font-mono text-slate-900">{activeRecord.token}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
                    <span className="block text-xs font-extrabold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                      {activeRecord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                  <div>
                    <span className="text-slate-500">Farmer:</span>
                    <p className="font-bold text-slate-800">{activeRecord.farmerName}</p>
                    <span className="text-[10px] text-slate-400">+91 {activeRecord.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Procurement Mandi:</span>
                    <p className="font-bold text-slate-800">{activeRecord.mandiName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Commodity & Tonnage:</span>
                    <p className="font-bold text-slate-800">{activeRecord.crop} ({activeRecord.tonnage} MT)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Queue Position / EWT:</span>
                    <p className="font-bold text-amber-700">
                      {activeRecord.queuePosition > 0 ? `#${activeRecord.queuePosition} (~${activeRecord.estimatedWaitMins}m)` : 'Completed'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pre-Inspection & Quality Assayer Guarantee Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-600 text-white rounded-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Agronomy Pre-Mandi Inspection Status: <span className="text-emerald-800 font-extrabold">VERIFIED & APPROVED</span>
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Assigned Inspector: <strong>Er. Anil Swarup (Quality Assayer #842)</strong> • Price Guarantee: Full MSP of ₹{activeRecord.mspRatePerQuintal}/Qtl locked.
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Offline Pull-SMS Check</span>
                  <span className="font-mono text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                    KHARIF STATUS {activeRecord.token} to 166
                  </span>
                </div>
              </div>

              {/* Visual 5-Stage Life Cycle Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                  Procurement Lifecycle Milestone Timeline
                </h4>

                <div className="relative pl-6 md:pl-0 space-y-6 md:space-y-0 md:grid md:grid-cols-5 gap-2">
                  {stages.map((stage, idx) => {
                    const isPassed = idx < currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div key={stage.key} className="relative flex md:flex-col items-start md:items-center text-left md:text-center group">
                        
                        {/* Status Icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold transition-all shadow-xs ${
                            isPassed
                              ? 'bg-emerald-600'
                              : isCurrent
                              ? 'bg-blue-600 ring-4 ring-blue-100 animate-pulse'
                              : 'bg-slate-300 text-slate-600'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="ml-3 md:ml-0 md:mt-2.5">
                          <h5 className={`text-xs font-bold leading-tight ${
                            isCurrent ? 'text-blue-800' : isPassed ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {stage.label}
                          </h5>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight hidden md:block">
                            {stage.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lab Evaluation & Financial Details */}
              {activeRecord.qualityGrade && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center">
                    <FileCheck className="w-4 h-4 text-emerald-700 mr-1.5" />
                    Electronic Weighbridge & Moisture Analysis Record
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Moisture Content:</span>
                      <strong className="text-slate-900 text-sm">{activeRecord.moisturePercent}%</strong>
                      <span className="text-[10px] text-emerald-700 block font-semibold">Standard: ≤ 17.0%</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Quality Grade:</span>
                      <strong className="text-emerald-700 text-sm font-bold">{activeRecord.qualityGrade}</strong>
                      <span className="text-[10px] text-slate-500 block">Foreign Matter: {activeRecord.foreignMatter}%</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">Net Grain Weight:</span>
                      <strong className="text-slate-900 text-sm font-mono">{activeRecord.netWeightKg} KG</strong>
                      <span className="text-[10px] text-slate-500 block">Tare: {activeRecord.tareWeightKg} KG</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block">DBT Remittance:</span>
                      <strong className="text-emerald-800 text-base font-extrabold font-mono">
                        ₹ {activeRecord.totalPayable?.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-slate-500 block font-mono">UTR: {activeRecord.utrNo || 'In Queue'}</span>
                    </div>
                  </div>

                  {/* Purchasing Buyer Agency & Legal J-Form Strip */}
                  <div className="mt-4 pt-4 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-bold text-[10px] uppercase">
                        Purchasing Agency
                      </span>
                      <strong className="text-indigo-950 font-bold">
                        {activeRecord.buyerName || "Food Corporation of India (FCI)"}
                      </strong>
                      <span className="text-slate-500 font-mono text-[11px]">
                        ({activeRecord.buyerLicense || "GOI-FCI-2026-HQ401"})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Legal Procurement Bill:</span>
                      <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {activeRecord.jFormNo || "JF-UP-2026-00441"}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ Form-J Issued</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
