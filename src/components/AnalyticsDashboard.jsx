import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  FileSpreadsheet, 
  Truck, 
  Clock, 
  DollarSign, 
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  PlusCircle,
  Play,
  RotateCcw,
  Sliders,
  Send,
  Filter,
  Package,
  Calendar
} from 'lucide-react';

export default function AnalyticsDashboard({ mandis }) {
  const [selectedSeason, setSelectedSeason] = useState('Kharif 2026-27');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [adminActionMsg, setAdminActionMsg] = useState('');

  // Interactive District Performance State with Area & Crop dimensions
  const [districts, setDistricts] = useState([
    { id: 1, district: "Ludhiana", state: "Punjab", crop: "Paddy (Grade A)", procurementMT: 142500, targetMT: 150000, avgWaitMins: 18, dbtDisbursedCr: 339.15, passRate: 99.2, status: "OPTIMAL", silosConnected: 4 },
    { id: 2, district: "Karnal", state: "Haryana", crop: "Paddy (Common)", procurementMT: 98400, targetMT: 105000, avgWaitMins: 22, dbtDisbursedCr: 234.19, passRate: 98.6, status: "OPTIMAL", silosConnected: 3 },
    { id: 3, district: "Lucknow", state: "Uttar Pradesh", crop: "Paddy (Common)", procurementMT: 78200, targetMT: 90000, avgWaitMins: 28, dbtDisbursedCr: 181.42, passRate: 97.9, status: "MODERATE", silosConnected: 3 },
    { id: 4, district: "Bhopal", state: "Madhya Pradesh", crop: "Soybean", procurementMT: 45600, targetMT: 60000, avgWaitMins: 55, dbtDisbursedCr: 223.07, passRate: 96.4, status: "BOTTLENECK", silosConnected: 2 },
    { id: 5, district: "Sambalpur", state: "Odisha", crop: "Paddy (Common)", procurementMT: 62100, targetMT: 70000, avgWaitMins: 32, dbtDisbursedCr: 144.07, passRate: 98.1, status: "MODERATE", silosConnected: 2 },
    { id: 6, district: "Raipur", state: "Chhattisgarh", crop: "Paddy (Grade A)", procurementMT: 89300, targetMT: 95000, avgWaitMins: 25, dbtDisbursedCr: 207.17, passRate: 98.8, status: "OPTIMAL", silosConnected: 5 },
  ]);

  // Interactive Freight Tender Corridors State
  const [corridors, setCorridors] = useState([
    { id: 1, corridor: "Punjab Mandis ➔ FCI Central Silos (Moga)", crop: "Paddy", dispatchedTrucks: 1450, scheduledTomorrow: 1600, capacityUtilization: 94, demurrageRisk: "LOW" },
    { id: 2, corridor: "Haryana Mandis ➔ Railheads (Kurukshetra)", crop: "Paddy", dispatchedTrucks: 820, scheduledTomorrow: 950, capacityUtilization: 89, demurrageRisk: "LOW" },
    { id: 3, corridor: "UP Mandis ➔ CWC Warehouses (Kanpur)", crop: "Paddy", dispatchedTrucks: 640, scheduledTomorrow: 780, capacityUtilization: 81, demurrageRisk: "MODERATE" },
    { id: 4, corridor: "MP Mandis ➔ State Civil Supplies Silos", crop: "Soybean", dispatchedTrucks: 390, scheduledTomorrow: 510, capacityUtilization: 72, demurrageRisk: "HIGH" },
  ]);

  // Operational Action 1: Deploy Emergency Freight Trucks
  const handleDeployEmergencyTrucks = (corridorId) => {
    setCorridors(prev => prev.map(c => {
      if (c.id === corridorId) {
        const added = 50;
        return {
          ...c,
          dispatchedTrucks: c.dispatchedTrucks + added,
          scheduledTomorrow: c.scheduledTomorrow + added,
          capacityUtilization: Math.min(100, c.capacityUtilization + 6),
          demurrageRisk: c.demurrageRisk === 'HIGH' ? 'MODERATE' : 'LOW'
        };
      }
      return c;
    }));
    setAdminActionMsg("Emergency Tender Allocated: 50 additional transport trucks dispatched to clear silo queue.");
    setTimeout(() => setAdminActionMsg(''), 4500);
  };

  // Operational Action 2: Adjust District Targets & Triage Buffer
  const handleAdjustTarget = (districtId, deltaMT) => {
    setDistricts(prev => prev.map(d => {
      if (d.id === districtId) {
        const newTarget = d.targetMT + deltaMT;
        return {
          ...d,
          targetMT: newTarget,
          status: newTarget - d.procurementMT > 30000 ? "BOTTLENECK" : "OPTIMAL"
        };
      }
      return d;
    }));
    setAdminActionMsg(`Target capacity modified for district #${districtId}. Algorithmic arrival curve recalculated.`);
    setTimeout(() => setAdminActionMsg(''), 4000);
  };

  // Operational Action 3: Reallocate Inter-district Surplus Quotas
  const handleReallocateSurplus = (fromId, toId) => {
    setDistricts(prev => prev.map(d => {
      if (d.id === fromId) return { ...d, targetMT: d.targetMT - 5000 };
      if (d.id === toId) return { ...d, targetMT: d.targetMT + 5000, status: "OPTIMAL" };
      return d;
    }));
    setAdminActionMsg("Inter-district Triage: 5,000 MT procurement quota successfully re-routed to resolve regional bottleneck.");
    setTimeout(() => setAdminActionMsg(''), 4500);
  };

  // Filtered districts according to State & Crop selection
  const filteredDistricts = districts.filter(d => {
    const matchState = selectedStateFilter === 'ALL' || d.state === selectedStateFilter;
    const matchCrop = selectedCropFilter === 'ALL' || d.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    return matchState && matchCrop;
  });

  const totalFilteredProcurement = filteredDistricts.reduce((sum, d) => sum + d.procurementMT, 0);
  const totalFilteredTarget = filteredDistricts.reduce((sum, d) => sum + d.targetMT, 0);
  const totalFilteredDbt = filteredDistricts.reduce((sum, d) => sum + d.dbtDisbursedCr, 0);

  // Export official CSV
  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "District,State,Primary_Crop,Procurement_MT,Target_MT,Avg_Wait_Mins,DBT_Disbursed_Cr,Pass_Rate,Status\n" +
      filteredDistricts.map(d => `"${d.district}","${d.state}","${d.crop}",${d.procurementMT},${d.targetMT},${d.avgWaitMins},${d.dbtDisbursedCr},${d.passRate}%,"${d.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `State_Procurement_Audit_${selectedStateFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      
      {/* Top Banner with Filter & Admin Operational Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                National Agricultural Policy & Logistics Command Suite
              </h2>
              <p className="text-xs text-slate-500">
                Department of Consumer Affairs (DoCA) & Food Corporation of India (FCI) • State & Crop Administrator Console
              </p>
            </div>
          </div>
        </div>

        {/* Operational Admin Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={selectedSeason} 
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-700 cursor-pointer"
          >
            <option>Kharif 2026-27 (Current Active)</option>
            <option>Rabi 2025-26 (Audited)</option>
            <option>Kharif 2025-26 (Audited)</option>
          </select>

          <button 
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Official CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Action Feedback Banner */}
      {adminActionMsg && (
        <div className="bg-emerald-100 border-l-4 border-emerald-600 p-3.5 rounded-xl text-xs text-emerald-950 font-bold flex items-center justify-between animate-in fade-in">
          <span>{adminActionMsg}</span>
          <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded text-emerald-900 uppercase">Live Synced</span>
        </div>
      )}

      {/* Area & Crop Administrative Filtering Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Macro Policy Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* State Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-medium">State / Region:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">All States (National)</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Odisha">Odisha</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
            </select>
          </div>

          {/* Crop Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-medium">Commodity:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">All Commodities</option>
              <option value="Paddy">Paddy (धान)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-amber-300 font-bold">
          Displaying {filteredDistricts.length} District Jurisdictions
        </span>
      </div>

      {/* Dynamic Filter-responsive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Filtered Procurement</span>
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              {totalFilteredProcurement.toLocaleString('en-IN')} MT
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              Target: {totalFilteredTarget.toLocaleString('en-IN')} MT ({Math.round((totalFilteredProcurement / (totalFilteredTarget || 1)) * 100)}%)
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total DBT Disbursal</span>
            <span className="p-1.5 bg-purple-100 text-purple-800 rounded-md">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              ₹ {totalFilteredDbt.toFixed(2)} Cr
            </span>
            <span className="text-xs text-purple-700 block font-semibold mt-0.5">
              Direct to farmer bank accounts
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Waiting Time</span>
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-md">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              {(filteredDistricts.reduce((sum, d) => sum + d.avgWaitMins, 0) / (filteredDistricts.length || 1)).toFixed(1)} Mins
            </span>
            <span className="text-xs text-emerald-600 block font-semibold mt-0.5">
              Deterministic queue smoothing
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Moisture Quality Rate</span>
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              {(filteredDistricts.reduce((sum, d) => sum + d.passRate, 0) / (filteredDistricts.length || 1)).toFixed(1)}%
            </span>
            <span className="text-xs text-emerald-600 block font-semibold mt-0.5">
              Pre-mandi assay verification active
            </span>
          </div>
        </div>

      </div>

      {/* District Mandi Velocity & Interactive Target Adjuster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              District Jurisdiction Procurement Velocity & Quota Re-balancer
            </h3>
            <p className="text-xs text-slate-500">
              Area & Crop-wise administrative controls: modify target buffers or transfer surplus capacity
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
            Live Algorithmic Allocation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">District & State</th>
                <th className="py-3 px-3">Primary Crop</th>
                <th className="py-3 px-3">Procured vs Target (MT)</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Avg Wait</th>
                <th className="py-3 px-3">Pass Rate</th>
                <th className="py-3 px-3">DBT Disbursed</th>
                <th className="py-3 px-3">Queue Health</th>
                <th className="py-3 px-3 text-right">Admin Quota Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredDistricts.map((d) => {
                const percent = Math.min(100, Math.round((d.procurementMT / d.targetMT) * 100));
                return (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <span>{d.district}</span>
                      <span className="text-[10px] text-slate-500 font-normal block">{d.state}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {d.crop}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {d.procurementMT.toLocaleString('en-IN')} / {d.targetMT.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden inline-block mr-2 align-middle">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[11px] font-bold">{percent}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${d.avgWaitMins > 40 ? 'text-red-600' : 'text-slate-800'}`}>
                        {d.avgWaitMins} Mins
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      {d.passRate}%
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹ {d.dbtDisbursedCr} Cr
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        d.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' :
                        d.status === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleAdjustTarget(d.id, 5000)}
                          title="Increase District Procurement Quota by 5,000 MT"
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-[10px] cursor-pointer"
                        >
                          +5K MT
                        </button>
                        <button
                          onClick={() => handleAdjustTarget(d.id, -5000)}
                          title="Reduce District Procurement Quota by 5,000 MT"
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[10px] cursor-pointer"
                        >
                          -5K MT
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downstream Logistics & Freight Tender Corridors with Live Dispatch Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Predictive Grain Logistics & Silo Evacuation Corridors
              </h3>
              <p className="text-xs text-slate-500">
                Pre-scheduled truck tenders synchronized with tomorrow's algorithmic slot bookings
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
            FCI E-Tender Sync: Connected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Transportation Corridor</th>
                <th className="py-3 px-3">Commodity</th>
                <th className="py-3 px-3">Dispatched Today</th>
                <th className="py-3 px-3">Scheduled Tomorrow</th>
                <th className="py-3 px-3">Silo Utilization</th>
                <th className="py-3 px-3">Demurrage Risk</th>
                <th className="py-3 px-3 text-right">Admin Freight Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {corridors.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-900">{f.corridor}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[10px]">
                      {f.crop}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{f.dispatchedTrucks} Trucks</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{f.scheduledTomorrow} Trucks</td>
                  <td className="py-3 px-3 font-mono">{f.capacityUtilization}%</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.demurrageRisk === 'LOW' ? 'bg-emerald-100 text-emerald-800' :
                      f.demurrageRisk === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {f.demurrageRisk} RISK
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeployEmergencyTrucks(f.id)}
                      className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-[11px] flex items-center space-x-1 ml-auto cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Deploy +50 Trucks</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
