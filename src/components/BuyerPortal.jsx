import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingBag, 
  CheckCircle2, 
  FileText, 
  IndianRupee, 
  Scale, 
  Droplet, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Filter, 
  Printer, 
  Sparkles, 
  Landmark, 
  QrCode, 
  UserCheck, 
  TrendingUp, 
  AlertCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialBuyers } from '../mockData';

export default function BuyerPortal({ 
  appointments, 
  setAppointments, 
  buyers = initialBuyers, 
  setBuyers, 
  mandis, 
  t 
}) {
  const [activeBuyerId, setActiveBuyerId] = useState(1);
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalLot, setActiveModalLot] = useState(null);
  const [viewingJForm, setViewingJForm] = useState(null);
  const [buyerMsg, setBuyerMsg] = useState('');

  const activeBuyer = buyers.find(b => b.id === Number(activeBuyerId)) || buyers[0];

  // Filter incoming appointments / lots for this trading floor
  const filteredLots = appointments.filter(appt => {
    const matchCrop = selectedCropFilter === 'ALL' || appt.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchStatus = selectedStatusFilter === 'ALL' || 
      (selectedStatusFilter === 'READY' && appt.status === 'WEIGHMENT_COMPLETED') ||
      (selectedStatusFilter === 'PURCHASED' && appt.status === 'PAYOUT_INITIATED') ||
      (selectedStatusFilter === 'TRANSIT' && ['SCHEDULED', 'CHECKED_IN', 'TESTING_IN_PROGRESS'].includes(appt.status));
    
    const matchSearch = !searchQuery || 
      appt.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.khasraNo?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCrop && matchStatus && matchSearch;
  });

  // Calculate live procurement stats for this buyer
  const purchasedByThisBuyer = appointments.filter(a => a.buyerName === activeBuyer.name && a.status === 'PAYOUT_INITIATED');
  const totalTonnageBought = purchasedByThisBuyer.reduce((sum, a) => sum + (a.tonnage || 0), 0);
  const totalPayoutDone = purchasedByThisBuyer.reduce((sum, a) => sum + (a.totalPayable || 0), 0);

  // Confirm Purchase & Issue J-Form with Direct DBT
  const handleConfirmPurchase = (lot) => {
    const netWeight = lot.netWeightKg || (lot.tonnage * 1000);
    const msp = lot.mspRatePerQuintal || (lot.crop.includes('Soybean') ? 4892 : lot.crop.includes('Grade A') ? 2380 : 2320);
    const totalAmount = Math.round((netWeight / 100) * msp);
    const generatedJForm = `JF-${activeBuyer.code.slice(0, 3)}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedUtr = `DBT${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    // 1. Update Appointment in shared state
    setAppointments(prev => prev.map(a => {
      if (a.token === lot.token) {
        return {
          ...a,
          status: 'PAYOUT_INITIATED',
          buyerId: activeBuyer.id,
          buyerName: activeBuyer.name,
          buyerLicense: activeBuyer.licenseNo,
          jFormNo: generatedJForm,
          utrNo: generatedUtr,
          netWeightKg: netWeight,
          totalPayable: totalAmount,
          queuePosition: 0,
          estimatedWaitMins: 0
        };
      }
      return a;
    }));

    // 2. Update Buyer Treasury Escrow Balance and Inventory
    if (setBuyers) {
      setBuyers(prev => prev.map(b => {
        if (b.id === activeBuyer.id) {
          const costInCr = totalAmount / 10000000;
          return {
            ...b,
            treasuryBalanceCr: Math.max(0, parseFloat((b.treasuryBalanceCr - costInCr).toFixed(3))),
            currentStockMT: b.currentStockMT + lot.tonnage
          };
        }
        return b;
      }));
    }

    setActiveModalLot(null);
    setBuyerMsg(`Procurement Success: ${lot.tonnage} MT of ${lot.crop} purchased from ${lot.farmerName}. Legal J-Form #${generatedJForm} issued with DBT UTR: ${generatedUtr}.`);
    setTimeout(() => setBuyerMsg(''), 6000);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-indigo-900/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Official Buyer & Procurement Portal
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                Kharif Season 2026-27 | Real-Time Value Exchange
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{t.navBuyer || "Buyer & Procurement Agency Desk"}</span>
              <ShoppingBag className="w-7 h-7 text-amber-300" />
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Licensed Institutional Agencies (FCI, NAFED, State Food Corps & Millers) inspect arriving farmer crop lots, issue legal <strong>Form-J (J-Forms)</strong>, and authorize synchronized escrow DBT payments directly into farmers' Aadhaar bank accounts.
            </p>
          </div>

          {/* Agency Switcher Dropdown */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 w-full lg:w-80">
            <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Active Buyer Agency</span>
              <Building2 className="w-3.5 h-3.5" />
            </label>
            <select
              value={activeBuyerId}
              onChange={(e) => setActiveBuyerId(e.target.value)}
              className="w-full bg-slate-900/90 text-white font-bold text-xs p-2.5 rounded-xl border border-indigo-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {buyers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-300 block mt-1.5 font-mono">
              License: {activeBuyer.licenseNo}
            </span>
          </div>
        </div>

        {/* Buyer Treasury & Warehouse KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Procurement Escrow Treasury</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-black text-amber-300 font-mono">₹ {activeBuyer.treasuryBalanceCr}</span>
              <span className="text-xs text-slate-300 font-semibold">Crores</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium block mt-1">
              ✓ Sovereign Escrow Account Active
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Warehouse Silo Allocation</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-black text-white font-mono">{activeBuyer.currentStockMT.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ {activeBuyer.warehouseCapacityMT.toLocaleString()} MT</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, (activeBuyer.currentStockMT / activeBuyer.warehouseCapacityMT) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Bought by {activeBuyer.code}</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-400 font-mono">{totalTonnageBought.toFixed(1)} MT</span>
              <span className="text-xs text-slate-400">({purchasedByThisBuyer.length} Lots)</span>
            </div>
            <span className="text-[10px] text-slate-300 block mt-1">
              Total DBT Paid: ₹ {(totalPayoutDone / 100000).toFixed(2)} Lakh
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Authorized Officer In-Charge</span>
            <strong className="text-slate-100 text-xs block mt-0.5 line-clamp-1">{activeBuyer.authorizedOfficer}</strong>
            <span className="text-[10px] text-indigo-300 font-mono block mt-1">
              Escrow: {activeBuyer.escrowAccount}
            </span>
          </div>

        </div>
      </div>

      {/* Operator Status Feedback Message */}
      {buyerMsg && (
        <div className="bg-emerald-100 border-l-4 border-emerald-600 p-4 rounded-2xl text-xs text-emerald-950 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{buyerMsg}</span>
          </div>
          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2.5 py-1 rounded-full uppercase">
            J-Form Synchronized
          </span>
        </div>
      )}

      {/* 2. Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative grow sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Token, Farmer, or Khasra..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-bold">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="ALL">All Farmer Lots</option>
              <option value="READY">Ready for Buyer Purchase (Weighed)</option>
              <option value="PURCHASED">Purchased & J-Form Issued</option>
              <option value="TRANSIT">In Mandi Transit</option>
            </select>
          </div>

          {/* Crop Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-bold">Crop:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="ALL">All Crops</option>
              <option value="Paddy">Paddy (धान)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Maize">Maize (मक्का)</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-bold ml-1">
            ({filteredLots.length} Lots Available)
          </span>
        </div>

      </div>

      {/* 3. Live Grain Exchange Floor Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-indigo-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Mandi Grain Exchange Floor (Farmer Lots Awaiting Institutional Purchase)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Real-time APMC Mandi Linkage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Token & Center</th>
                <th className="py-3 px-3">Farmer & Khasra #</th>
                <th className="py-3 px-3">Commodity & Grade</th>
                <th className="py-3 px-3">Weighed Net Tonnage</th>
                <th className="py-3 px-3">Moisture Assay</th>
                <th className="py-3 px-3">Statutory MSP Valuation</th>
                <th className="py-3 px-3">Exchange Status</th>
                <th className="py-3 px-3 text-right">Buyer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredLots.map((lot) => {
                const netWeight = lot.netWeightKg || (lot.tonnage * 1000);
                const msp = lot.mspRatePerQuintal || (lot.crop.includes('Soybean') ? 4892 : lot.crop.includes('Grade A') ? 2380 : 2320);
                const lotValue = Math.round((netWeight / 100) * msp);
                const isReadyToBuy = lot.status === 'WEIGHMENT_COMPLETED';
                const isAlreadyBought = lot.status === 'PAYOUT_INITIATED';

                return (
                  <tr key={lot.token} className={`hover:bg-slate-50 transition-colors ${isReadyToBuy ? 'bg-amber-50/40' : ''}`}>
                    
                    {/* Token */}
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 block">{lot.token}</span>
                      <span className="text-[10px] text-slate-500 block">{lot.mandiName.split('(')[0]}</span>
                    </td>

                    {/* Farmer */}
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block">{lot.farmerName}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Khasra: {lot.khasraNo || '142/2'} • +91 {lot.mobile}
                      </span>
                    </td>

                    {/* Commodity */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-indigo-950 block">{lot.crop}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Rate: ₹ {msp} / Qtl
                      </span>
                    </td>

                    {/* Net Weight */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      <div>{(netWeight / 1000).toFixed(1)} MT</div>
                      <span className="text-[10px] text-slate-500 block font-normal">
                        ({(netWeight / 100).toFixed(1)} Quintals)
                      </span>
                    </td>

                    {/* Moisture */}
                    <td className="py-3 px-3">
                      {lot.moisturePercent ? (
                        <div className="space-y-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                            lot.moisturePercent <= 17.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {lot.moisturePercent}% Moisture
                          </span>
                          <span className="text-[10px] text-slate-600 block">{lot.qualityGrade || 'Standard FAQ'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">In Gate Transit</span>
                      )}
                    </td>

                    {/* MSP Valuation */}
                    <td className="py-3 px-3">
                      <span className="font-mono font-black text-emerald-700 text-sm block">
                        ₹ {lotValue.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-slate-400 block">Govt Direct Entitlement</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {isAlreadyBought ? (
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 block text-center">
                            ✓ Purchased
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-0.5 text-center">
                            {lot.buyerName ? lot.buyerName.split(' ')[0] : activeBuyer.code}
                          </span>
                        </div>
                      ) : isReadyToBuy ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 block text-center animate-pulse">
                          ● Ready for Purchase
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 block text-center">
                          {lot.status.replace(/_/g, ' ')}
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      {isReadyToBuy ? (
                        <button
                          onClick={() => setActiveModalLot(lot)}
                          className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center space-x-1 ml-auto cursor-pointer"
                        >
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span>Buy at MSP</span>
                        </button>
                      ) : isAlreadyBought ? (
                        <button
                          onClick={() => setViewingJForm(lot)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-300 flex items-center space-x-1 ml-auto cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-emerald-600" />
                          <span>View J-Form</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveModalLot(lot)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] ml-auto cursor-pointer"
                        >
                          Inspect Lot
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: Purchase Confirmation & J-Form Contract Execution */}
      {activeModalLot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="bg-linear-to-r from-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase">
                    Formal Crop Procurement Contract
                  </span>
                  <span className="text-xs text-indigo-300 font-mono">{activeModalLot.token}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Exchange Crops for Value ({activeBuyer.name})
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalLot(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              
              {/* Farmer & Lot Details Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Farmer / Seller:</span>
                  <strong className="text-slate-900 text-sm block">{activeModalLot.farmerName}</strong>
                  <span className="text-slate-500 font-mono">Mobile: +91 {activeModalLot.mobile}</span>
                  <span className="text-slate-500 block">Aadhaar: {activeModalLot.aadhaarMasked || 'XXXX-XXXX-4589'}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Land & Mandi:</span>
                  <strong className="text-slate-900 block">Khasra #{activeModalLot.khasraNo || '142/2'}</strong>
                  <span className="text-slate-500 block">{activeModalLot.mandiName}</span>
                  <span className="text-slate-500 font-mono block">Vehicle: {activeModalLot.vehicleNo}</span>
                </div>
              </div>

              {/* Weight & Quality Parameters */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-[10px] text-indigo-700 font-bold uppercase block">Net Crop Weight</span>
                  <strong className="text-indigo-950 text-base font-mono font-black block">
                    {activeModalLot.netWeightKg ? (activeModalLot.netWeightKg / 1000).toFixed(1) : activeModalLot.tonnage} MT
                  </strong>
                  <span className="text-[10px] text-indigo-600 font-mono">
                    ({activeModalLot.netWeightKg ? (activeModalLot.netWeightKg / 100).toFixed(1) : (activeModalLot.tonnage * 10)} Qtl)
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Moisture Assay</span>
                  <strong className="text-emerald-950 text-base font-mono font-black block">
                    {activeModalLot.moisturePercent || 14.5}%
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    ✓ Below 17.0% Standard
                  </span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <span className="text-[10px] text-amber-700 font-bold uppercase block">Notified MSP Rate</span>
                  <strong className="text-amber-950 text-base font-mono font-black block">
                    ₹ {activeModalLot.mspRatePerQuintal || 2320}
                  </strong>
                  <span className="text-[10px] text-amber-700 font-semibold">Per Quintal</span>
                </div>
              </div>

              {/* Financial Breakdown & Escrow Disbursement */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Crop Purchase Value:</span>
                  <strong className="font-mono text-white">
                    ₹ {((activeModalLot.netWeightKg ? activeModalLot.netWeightKg : activeModalLot.tonnage * 1000) / 100 * (activeModalLot.mspRatePerQuintal || 2320)).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>APMC Mandi Market Cess (1.5% Paid by Buyer):</span>
                  <span className="font-mono">
                    + ₹ {Math.round(((activeModalLot.netWeightKg ? activeModalLot.netWeightKg : activeModalLot.tonnage * 1000) / 100 * (activeModalLot.mspRatePerQuintal || 2320)) * 0.015).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-amber-300 text-xs block">Farmer Net Direct Payout (DBT):</span>
                    <span className="text-[10px] text-slate-400">100% credited to Farmer's Aadhaar Bank Account</span>
                  </div>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    ₹ {((activeModalLot.netWeightKg ? activeModalLot.netWeightKg : activeModalLot.tonnage * 1000) / 100 * (activeModalLot.mspRatePerQuintal || 2320)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Legal Confirmation Box */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Statutory APMC Form-J Guarantee & Escrow Agreement</span>
                </div>
                <p>
                  By approving, <strong>{activeBuyer.name}</strong> confirms acceptance of this grain lot into government buffer reserves, debits its treasury escrow, and triggers an immediate PFMS DBT remittance to the farmer.
                </p>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveModalLot(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleConfirmPurchase(activeModalLot)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign J-Form & Execute Purchase (खरीद पूर्ण करें)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Modal: Official Printable Government J-Form (J-Form Receipt) */}
      {viewingJForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-8 animate-in fade-in">
            
            {/* Top Toolbar */}
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-700">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Legal Procurement Certificate (Form-J / जे-फॉर्म)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button 
                  onClick={() => setViewingJForm(null)}
                  className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Authentic J-Form Document */}
            <div className="p-8 space-y-6 text-slate-900 bg-white" id="printable-jform">
              
              {/* Emblem & Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-linear-to-b from-amber-600 to-amber-800 flex items-center justify-center text-white text-xl font-black mb-1">
                  🏛️
                </div>
                <h2 className="text-base font-black uppercase tracking-wider">
                  Agricultural Produce Market Committee (APMC)
                </h2>
                <h3 className="text-sm font-extrabold text-emerald-800">
                  FORM 'J' - SALE AND PURCHASE CERTIFICATE (जे-फॉर्म)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Issued under the State Agricultural Produce Markets Act & Rules | Ministry of Consumer Affairs, Food & Public Distribution
                </p>
              </div>

              {/* J-Form Header Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">J-Form Reference Number:</span>
                  <strong className="text-sm font-mono text-emerald-900 font-black">
                    {viewingJForm.jFormNo || `JF-UP-2026-00441`}
                  </strong>
                  <span className="text-slate-500 block text-[11px] mt-0.5">Date of Issue: 26-Sep-2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mandi Procurement Yard:</span>
                  <strong className="text-slate-900 block">{viewingJForm.mandiName}</strong>
                  <span className="text-slate-500 font-mono text-[11px]">Token ID: {viewingJForm.token}</span>
                </div>
              </div>

              {/* Contracting Parties Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-600 w-1/3">Selling Farmer:</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        {viewingJForm.farmerName} (Mob: +91 {viewingJForm.mobile})
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-600">Land & Revenue Record:</td>
                      <td className="p-2.5 font-mono text-slate-800">
                        Khasra #{viewingJForm.khasraNo || '142/2'} (Verified Land: {viewingJForm.verifiedLandHa || 3.2} Hectares)
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-600">Purchasing Agency (Buyer):</td>
                      <td className="p-2.5 font-bold text-indigo-950">
                        {viewingJForm.buyerName || activeBuyer.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-600">Buyer APMC License #:</td>
                      <td className="p-2.5 font-mono text-slate-800">
                        {viewingJForm.buyerLicense || activeBuyer.licenseNo}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Commodity & Weighbridge Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Commodity / Variety</th>
                      <th className="p-2.5">Net Weighed Qty</th>
                      <th className="p-2.5">Moisture (%)</th>
                      <th className="p-2.5">Notified MSP</th>
                      <th className="p-2.5 text-right">Total Net Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">{viewingJForm.crop}</td>
                      <td className="p-2.5 font-mono">
                        {(viewingJForm.netWeightKg ? viewingJForm.netWeightKg / 100 : viewingJForm.tonnage * 10).toFixed(1)} Qtl
                      </td>
                      <td className="p-2.5 font-mono text-emerald-700 font-bold">{viewingJForm.moisturePercent || 14.2}%</td>
                      <td className="p-2.5 font-mono">₹ {viewingJForm.mspRatePerQuintal || 2320} / Qtl</td>
                      <td className="p-2.5 font-mono font-black text-emerald-800 text-right text-sm">
                        ₹ {(viewingJForm.totalPayable || 197200).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Settlement & Bank UTR */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-bold uppercase text-emerald-800">PFMS Direct Benefit Transfer (DBT) Status</div>
                  <strong className="text-emerald-950 text-sm block">100% Direct Remittance Settled</strong>
                  <span className="font-mono text-slate-600 block mt-0.5">
                    Bank UTR Reference: <strong>{viewingJForm.utrNo || 'DBT482910492810'}</strong>
                  </span>
                </div>
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-emerald-300 flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
                <div>
                  <div className="font-serif italic font-bold text-slate-700 mb-1">Digitally Signed & Validated</div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    Authorized Procurement Officer<br />
                    <span className="text-[10px] text-slate-500 font-normal">{viewingJForm.buyerName || activeBuyer.name}</span>
                  </div>
                </div>

                <div>
                  <div className="font-serif italic font-bold text-slate-700 mb-1">Official Electronic Seal</div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    Mandi Secretary & Assayer In-Charge<br />
                    <span className="text-[10px] text-slate-500 font-normal">APMC Market Committee</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
              This document is a legally valid proof of sale under Section 14 of the APMC Act 2003 and DPDP Act 2023.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
