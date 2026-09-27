import React, { useState } from 'react';
import { 
  Building2, 
  QrCode, 
  PlayCircle, 
  FastForward, 
  CheckCircle, 
  Scale, 
  AlertOctagon, 
  RefreshCw, 
  Search, 
  Filter, 
  Sliders, 
  PlusCircle, 
  Printer, 
  IndianRupee,
  FileCheck,
  Truck,
  Droplet,
  UserCheck
} from 'lucide-react';

export default function MandiOperatorConsole({ appointments, setAppointments, mandis, setMandis, t }) {
  const [selectedMandiId, setSelectedMandiId] = useState(1);
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [searchTokenOrFarmer, setSearchTokenOrFarmer] = useState('');
  const [operatorMsg, setOperatorMsg] = useState('');

  // Active Direct Action Modal/Drawer for Weighbridge & Quality Assay entry
  const [editingToken, setEditingToken] = useState(null);
  const [customMoisture, setCustomMoisture] = useState(14.5);
  const [customGrossWeight, setCustomGrossWeight] = useState(12500);
  const [customTareWeight, setCustomTareWeight] = useState(3800);
  const [customGrade, setCustomGrade] = useState('Grade-A');

  // Mandi Admin Capacity Configuration
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [newDailyCapacity, setNewDailyCapacity] = useState(350);
  const [newAvgServiceMins, setNewAvgServiceMins] = useState(12);

  const currentMandi = mandis.find(m => m.id === Number(selectedMandiId)) || mandis[0];

  // Area & Crop-wise filtered appointments
  const mandiAppointments = appointments.filter(a => {
    const matchMandi = a.mandiId === currentMandi.id;
    const matchCrop = selectedCropFilter === 'ALL' || a.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchStatus = selectedStatusFilter === 'ALL' || a.status === selectedStatusFilter;
    const matchSearch = !searchTokenOrFarmer || 
      a.token.toLowerCase().includes(searchTokenOrFarmer.toLowerCase()) || 
      a.farmerName.toLowerCase().includes(searchTokenOrFarmer.toLowerCase()) ||
      a.vehicleNo.toLowerCase().includes(searchTokenOrFarmer.toLowerCase());
    return matchMandi && matchCrop && matchStatus && matchSearch;
  });

  // Calculate live statistics for this specific Mandi & Crop
  const totalProcuredTodayTonnes = mandiAppointments
    .filter(a => ['WEIGHMENT_COMPLETED', 'PAYOUT_INITIATED', 'COMPLETED'].includes(a.status))
    .reduce((sum, a) => sum + (a.tonnage || 0), 0);

  const totalDbtDisbursed = mandiAppointments
    .filter(a => a.status === 'PAYOUT_INITIATED')
    .reduce((sum, a) => sum + (a.totalPayable || 0), 0);

  const handleStatusTransition = (token, nextStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.token === token) {
        let updated = { ...a, status: nextStatus };
        if (nextStatus === 'CHECKED_IN') {
          updated.queuePosition = Math.max(1, a.queuePosition - 1);
        } else if (nextStatus === 'TESTING_IN_PROGRESS') {
          updated.moisturePercent = 14.2;
          updated.foreignMatter = 0.8;
          updated.qualityGrade = 'Grade-A';
        } else if (nextStatus === 'WEIGHMENT_COMPLETED') {
          const net = a.tonnage * 1000;
          updated.grossWeightKg = net + 3600;
          updated.tareWeightKg = 3600;
          updated.netWeightKg = net;
          updated.totalPayable = Math.round((net / 100) * a.mspRatePerQuintal);
        } else if (nextStatus === 'PAYOUT_INITIATED') {
          updated.utrNo = `DBT${Math.floor(100000000000 + Math.random() * 900000000000)}`;
          updated.queuePosition = 0;
          updated.estimatedWaitMins = 0;
        }
        return updated;
      }
      return a;
    }));

    setOperatorMsg(`Action Successful: Token ${token} updated to ${nextStatus.replace(/_/g, ' ')}.`);
    setTimeout(() => setOperatorMsg(''), 4000);
  };

  const handleSaveWeighmentModal = (e) => {
    e.preventDefault();
    if (!editingToken) return;

    const netWeight = Math.max(100, customGrossWeight - customTareWeight);
    const msp = editingToken.mspRatePerQuintal || (editingToken.crop.includes('Soybean') ? 4892 : 2320);
    const totalAmount = Math.round((netWeight / 100) * msp);

    setAppointments(prev => prev.map(a => {
      if (a.token === editingToken.token) {
        return {
          ...a,
          status: 'WEIGHMENT_COMPLETED',
          moisturePercent: parseFloat(customMoisture),
          foreignMatter: 0.8,
          qualityGrade: customGrade,
          grossWeightKg: parseFloat(customGrossWeight),
          tareWeightKg: parseFloat(customTareWeight),
          netWeightKg: netWeight,
          totalPayable: totalAmount
        };
      }
      return a;
    }));

    setOperatorMsg(`Official Weighment Slip generated for ${editingToken.token}: Net ${netWeight} KG, Total ₹${totalAmount.toLocaleString('en-IN')}`);
    setEditingToken(null);
    setTimeout(() => setOperatorMsg(''), 4500);
  };

  const handleUpdateMandiConfig = (e) => {
    e.preventDefault();
    setMandis(prev => prev.map(m => {
      if (m.id === currentMandi.id) {
        return {
          ...m,
          dailyCapacityTonnes: parseFloat(newDailyCapacity),
          avgServiceMins: parseInt(newAvgServiceMins)
        };
      }
      return m;
    }));
    setShowConfigPanel(false);
    setOperatorMsg(`Mandi configuration updated: Daily Capacity set to ${newDailyCapacity} MT, Avg Service Time set to ${newAvgServiceMins} mins.`);
    setTimeout(() => setOperatorMsg(''), 4000);
  };

  const handleWeighbridgeAdjustment = (delta) => {
    setMandis(prev => prev.map(m => {
      if (m.id === currentMandi.id) {
        const nextBridges = Math.max(1, m.activeBridges + delta);
        return {
          ...m,
          activeBridges: nextBridges,
          liveWaitMins: Math.round(m.liveWaitMins * (m.activeBridges / nextBridges))
        };
      }
      return m;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      
      {/* Top Header & Operational Selector */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-800 border border-amber-400/50 rounded-2xl">
            <Building2 className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded uppercase tracking-wider">
                Mandi Administrator Console
              </span>
              <span className="text-xs text-slate-400">• Area & Crop Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-0.5">
              {currentMandi.name}
            </h2>
            <p className="text-xs text-slate-400">
              Center Code: <code className="text-amber-300 font-mono">{currentMandi.code}</code> • District: {currentMandi.district}, {currentMandi.state}
            </p>
          </div>
        </div>

        {/* Mandi Selection & Admin Configuration Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Switch Mandi Area</label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
            >
              {mandis.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.district})</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="mt-4 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Mandi Settings</span>
          </button>
        </div>
      </div>

      {/* Admin Setting Drawer for selected Mandi */}
      {showConfigPanel && (
        <form onSubmit={handleUpdateMandiConfig} className="bg-amber-50 border border-amber-300 p-5 rounded-2xl animate-in fade-in space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950 flex items-center">
              <Sliders className="w-4 h-4 mr-1.5" />
              Configure Procurement Quotas for {currentMandi.name}
            </h4>
            <span className="text-[11px] text-amber-800 font-semibold">Real-time capacity recalculation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Daily Max Tonnage Capacity (MT)</label>
              <input
                type="number"
                value={newDailyCapacity}
                onChange={(e) => setNewDailyCapacity(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-bold font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Average Service Time per Vehicle (Mins)</label>
              <input
                type="number"
                value={newAvgServiceMins}
                onChange={(e) => setNewAvgServiceMins(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-bold font-mono"
                required
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Save Capacity Quota
              </button>
              <button
                type="button"
                onClick={() => setShowConfigPanel(false)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Live Operational Metrics & Dynamic Controls for this Mandi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Weighbridge Control Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Electronic Weighbridges</span>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">{currentMandi.activeBridges} Active</h4>
            <span className="text-xs text-slate-500">Service: ~{currentMandi.avgServiceMins} mins/trolley</span>
          </div>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleWeighbridgeAdjustment(1)}
              title="Add operational weighbridge lane"
              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-xs cursor-pointer"
            >
              +1 Lane
            </button>
            <button
              onClick={() => handleWeighbridgeAdjustment(-1)}
              title="Halt lane for maintenance"
              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-bold text-xs cursor-pointer"
            >
              -1 Halt
            </button>
          </div>
        </div>

        {/* Tonnage Procured Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Tonnage Procured Today</span>
          <h4 className="text-xl font-black text-emerald-700 mt-0.5">
            {totalProcuredTodayTonnes.toFixed(1)} MT
          </h4>
          <span className="text-xs text-slate-500">
            Capacity: {currentMandi.currentBookedTonnes} / {currentMandi.dailyCapacityTonnes} MT
          </span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (currentMandi.currentBookedTonnes / currentMandi.dailyCapacityTonnes) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* DBT Payout Generated Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">DBT Payments Remitted</span>
          <h4 className="text-xl font-black text-purple-700 mt-0.5">
            ₹ {(totalDbtDisbursed / 100000).toFixed(2)} Lakh
          </h4>
          <span className="text-xs text-slate-500">
            Direct Aadhaar bank transfer via PFMS
          </span>
        </div>

        {/* Dynamic Queue EWT Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Live Queue Wait Time</span>
          <h4 className="text-xl font-black text-amber-700 mt-0.5">~{currentMandi.liveWaitMins} Minutes</h4>
          <span className="text-xs text-emerald-600 font-semibold">Triage Algorithm: Active</span>
        </div>

      </div>

      {/* Operator Status Feedback Message */}
      {operatorMsg && (
        <div className="bg-emerald-100 border-l-4 border-emerald-600 p-3.5 rounded-xl text-xs text-emerald-950 font-bold flex items-center justify-between animate-in fade-in">
          <span>{operatorMsg}</span>
          <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded text-emerald-900 uppercase">Audit Logged</span>
        </div>
      )}

      {/* Area & Crop Filtering Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative grow sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTokenOrFarmer}
            onChange={(e) => setSearchTokenOrFarmer(e.target.value)}
            placeholder="Search Token, Farmer, or Vehicle..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Crop */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-bold">Crop:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="ALL">All Commodities</option>
              <option value="Paddy">Paddy (धान)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Maize">Maize (मक्का)</option>
            </select>
          </div>

          {/* Filter by Queue Status */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-bold">Stage:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="ALL">All Stages</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CHECKED_IN">Gate Checked-In</option>
              <option value="TESTING_IN_PROGRESS">Lab Testing</option>
              <option value="WEIGHMENT_COMPLETED">Weighment Done</option>
              <option value="PAYOUT_INITIATED">DBT Disbursed</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-bold ml-1">
            ({mandiAppointments.length} matching tokens)
          </span>
        </div>

      </div>

      {/* Main Operational Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Token # & Time</th>
                <th className="py-3 px-3">Farmer & Village</th>
                <th className="py-3 px-3">Crop Commodity</th>
                <th className="py-3 px-3">Vehicle / Device</th>
                <th className="py-3 px-3">Declared Qty</th>
                <th className="py-3 px-3">Moisture / Assay</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {mandiAppointments.map((appt) => (
                <tr key={appt.token} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-900 block">{appt.token}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{appt.slotTime}</span>
                  </td>

                  <td className="py-3 px-3">
                    <strong className="text-slate-900 block">{appt.farmerName}</strong>
                    <span className="text-[11px] text-slate-500">+91 {appt.mobile}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{appt.crop}</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">
                      MSP: ₹{appt.mspRatePerQuintal}/Qtl
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className="block text-slate-800 font-bold">{appt.vehicleNo}</span>
                    <span className="text-[10px] text-slate-500">{appt.vehicleType}</span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {appt.tonnage} MT
                  </td>

                  <td className="py-3 px-3 text-[11px]">
                    {appt.qualityGrade ? (
                      <div className="space-y-0.5">
                        <span className="block">Moisture: <strong className="text-slate-900">{appt.moisturePercent}%</strong></span>
                        <span className="text-emerald-700 font-bold block">{appt.qualityGrade}</span>
                        {appt.netWeightKg && (
                          <span className="text-[10px] text-slate-500 font-mono block">Net: {appt.netWeightKg} KG</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Pending Gate Entry</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      appt.status === 'PAYOUT_INITIATED' ? 'bg-emerald-100 text-emerald-800' :
                      appt.status === 'WEIGHMENT_COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      appt.status === 'TESTING_IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                      appt.status === 'CHECKED_IN' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {appt.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      
                      {appt.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleStatusTransition(appt.token, 'CHECKED_IN')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] cursor-pointer"
                        >
                          Check In (Gate QR)
                        </button>
                      )}

                      {appt.status === 'CHECKED_IN' && (
                        <button
                          onClick={() => handleStatusTransition(appt.token, 'TESTING_IN_PROGRESS')}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-[11px] cursor-pointer"
                        >
                          Perform Assay
                        </button>
                      )}

                      {appt.status === 'TESTING_IN_PROGRESS' && (
                        <button
                          onClick={() => {
                            setEditingToken(appt);
                            setCustomGrossWeight(Math.round((appt.tonnage * 1000) + 3600));
                            setCustomTareWeight(3600);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                        >
                          <Scale className="w-3 h-3" />
                          <span>Weighbridge Input</span>
                        </button>
                      )}

                      {appt.status === 'WEIGHMENT_COMPLETED' && (
                        <button
                          onClick={() => handleStatusTransition(appt.token, 'PAYOUT_INITIATED')}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <IndianRupee className="w-3 h-3" />
                          <span>Trigger DBT (₹{appt.totalPayable?.toLocaleString('en-IN')})</span>
                        </button>
                      )}

                      {appt.status === 'PAYOUT_INITIATED' && (
                        <span className="text-emerald-700 font-bold flex items-center space-x-1 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>DBT Disbursed</span>
                        </span>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Modal: Official Electronic Weighbridge & Moisture Assay Input */}
      {editingToken && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Electronic Weighbridge Terminal</span>
                <h3 className="text-lg font-black text-slate-900">Enter Weighment for {editingToken.token}</h3>
                <p className="text-xs text-slate-500">{editingToken.farmerName} • {editingToken.crop} • Reg: {editingToken.vehicleNo}</p>
              </div>
              <button onClick={() => setEditingToken(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveWeighmentModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gross Weight (KG)</label>
                  <input
                    type="number"
                    value={customGrossWeight}
                    onChange={(e) => setCustomGrossWeight(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tare (Empty Vehicle) (KG)</label>
                  <input
                    type="number"
                    value={customTareWeight}
                    onChange={(e) => setCustomTareWeight(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                <span>Calculated Net Grain Weight:</span>
                <strong className="text-base text-emerald-800 font-mono">{Math.max(0, customGrossWeight - customTareWeight)} KG</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Moisture Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMoisture}
                    onChange={(e) => setCustomMoisture(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Acceptable standard: ≤ 17.0%</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assayed Grade</label>
                  <select
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold bg-white"
                  >
                    <option value="Grade-A">Grade-A (Full MSP)</option>
                    <option value="Grade-Common">Grade-Common</option>
                    <option value="Grade-A Super">Grade-A Super</option>
                    <option value="Rejected">Rejected (&gt;17% Moisture)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Record Weighment & Issue Slip
                </button>
                <button
                  type="button"
                  onClick={() => setEditingToken(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
