import React from 'react';
import { Users, Building, Scale, IndianRupee, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function PublicMetrics({ metrics, t }) {
  return (
    <section className="bg-white border-b border-slate-200 py-6" aria-label="Real-time Mandi Procurement Statistics">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Banner with procurement notice */}
        <div className="mb-4 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg text-xs text-emerald-900">
          <div className="flex items-center space-x-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>{t.activeSeason}</span>
          </div>
          <span className="font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs">
            Live Mandi Feed: Active
          </span>
        </div>

        {/* 4-Card Jan Sunwai-style transparency grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Registered Farmers */}
          <div className="bg-slate-50 border border-slate-200 hover:border-emerald-500 rounded-xl p-4 transition-all duration-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">{t.metric1Label}</span>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">
                {metrics.registeredFarmers.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {t.metric1Sub}
            </p>
          </div>

          {/* Card 2: Active Mandis */}
          <div className="bg-slate-50 border border-slate-200 hover:border-amber-500 rounded-xl p-4 transition-all duration-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">{t.metric2Label}</span>
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">
                {metrics.activeMandis.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              {t.metric2Sub}
            </p>
          </div>

          {/* Card 3: Tonnage Procured */}
          <div className="bg-slate-50 border border-slate-200 hover:border-emerald-500 rounded-xl p-4 transition-all duration-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">{t.metric3Label}</span>
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">
                {metrics.tonnageProcured.toLocaleString('en-IN')} MT
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {t.metric3Sub}
            </p>
          </div>

          {/* Card 4: DBT Remittance */}
          <div className="bg-slate-50 border border-slate-200 hover:border-purple-500 rounded-xl p-4 transition-all duration-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">{t.metric4Label}</span>
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">
                ₹ {metrics.dbtDisbursed} Cr
              </span>
            </div>
            <p className="text-xs text-purple-700 font-semibold mt-1">
              {t.metric4Sub}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
