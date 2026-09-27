import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AccessibilityHeader from './components/AccessibilityHeader';
import NavigationBar from './components/NavigationBar';
import PublicMetrics from './components/PublicMetrics';
import RegistrationModule from './components/RegistrationModule';
import SlotBookingModule from './components/SlotBookingModule';
import ProcurementTracker from './components/ProcurementTracker';
import MandiOperatorConsole from './components/MandiOperatorConsole';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BuyerPortal from './components/BuyerPortal';
import DhwaniBot from './components/DhwaniBot';
import { translations, initialMandis, initialAppointments, publicMetrics, initialFarmers, initialBuyers } from './mockData';
import { 
  UserCheck, 
  CalendarDays, 
  Search, 
  Building2, 
  BarChart3, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const navigate = useNavigate();

  // Application Data States (Pre-loaded with 35+ users & live records)
  const [farmers, setFarmers] = useState(initialFarmers);
  const [farmerUser, setFarmerUser] = useState(null);
  const [mandis, setMandis] = useState(initialMandis);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [buyers, setBuyers] = useState(initialBuyers);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  const handleAppointmentBooked = (newAppt) => {
    setAppointments(prev => [newAppt, ...prev]);
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : ''}`}>
      
      {/* 1. GIGW 3.0 Accessibility Top Bar */}
      <AccessibilityHeader
        lang={lang}
        setLang={setLang}
        fontScale={fontScale}
        setFontScale={setFontScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        t={t}
      />

      {/* 2. Official Portal Navigation with Real URL Routing */}
      <NavigationBar t={t} />

      {/* 3. Real-time Jan Sunwai-style Public Transparency Metrics */}
      <PublicMetrics metrics={publicMetrics} t={t} />

      {/* 4. Real Multi-Page Route Switcher */}
      <main id="main-content" className="grow py-6">
        <Routes>
          
          {/* PAGE 1: HOME GATEWAY */}
          <Route path="/" element={
            <div className="max-w-7xl mx-auto px-4 space-y-8">
              
              {/* Hero Action Banner */}
              <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-amber-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-amber-400 text-slate-900 text-xs font-black uppercase px-3 py-1 rounded-full">
                    Kharif MSP 2026-27 Guarantee
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black mt-3 leading-tight">
                    {t.portalName}
                  </h2>
                  <p className="text-emerald-100 text-sm sm:text-base mt-2 font-medium">
                    {t.tagline}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link
                      to="/booking"
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-md flex items-center space-x-2 no-underline"
                    >
                      <span>{t.card2Title}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/track"
                      className="px-6 py-3 bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm border border-emerald-500 transition-all no-underline"
                    >
                      {t.navTrack}
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4 Core Action Service Cards (Interactive Multi-Page Links) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Card 1 */}
                <Link
                  to="/register"
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between no-underline"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{t.card1Title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.card1Desc}</p>
                  </div>
                  <div className="mt-5 flex items-center text-xs font-bold text-emerald-700">
                    <span>Open Registration ({initialFarmers.length} Enrolled)</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>

                {/* Card 2 */}
                <Link
                  to="/booking"
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-600 hover:shadow-md transition-all flex flex-col justify-between no-underline"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{t.card2Title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.card2Desc}</p>
                  </div>
                  <div className="mt-5 flex items-center text-xs font-bold text-amber-700">
                    <span>Book Appointment Slot</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>

                {/* Card 3 */}
                <Link
                  to="/track"
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between no-underline"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{t.card3Title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.card3Desc}</p>
                  </div>
                  <div className="mt-5 flex items-center text-xs font-bold text-blue-700">
                    <span>Track Live Queue</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>

                {/* Card 4 */}
                <Link
                  to="/mandi-console"
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-600 hover:shadow-md transition-all flex flex-col justify-between no-underline"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{t.card4Title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.card4Desc}</p>
                  </div>
                  <div className="mt-5 flex items-center text-xs font-bold text-purple-700">
                    <span>Mandi Console ({appointments.length} Active Tokens)</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>

              </div>

              {/* Live Operational Quick Status Banner (35+ Users Live) */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse"></span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Live Mandi Queue & Operational Transactions Active
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    System currently serving <strong>{initialFarmers.length} enrolled farmers</strong> and <strong>{appointments.length} active live tokens</strong> across 6 procurement centers.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to="/mandi-console"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold no-underline"
                  >
                    Open Live Queue Stream →
                  </Link>
                </div>
              </div>

              {/* Fully Operational Interactive Kharif & Rabi MSP Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Notified Minimum Support Price (MSP) Rates - Season 2026-27
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fixed by Cabinet Committee on Economic Affairs (CCEA) & CACP | Click any crop to book instant mandi slot
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded">
                    Direct Bank Remittance
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Crop / Commodity</th>
                        <th className="py-2.5 px-3">Variety / Quality Spec</th>
                        <th className="py-2.5 px-3">Cost of Production (A2+FL)</th>
                        <th className="py-2.5 px-3">MSP Rate (₹/Quintal)</th>
                        <th className="py-2.5 px-3">Procurement Mechanism</th>
                        <th className="py-2.5 px-3 text-right">Instant Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">Paddy (धान)</td>
                        <td className="py-2.5 px-3">Common Grade</td>
                        <td className="py-2.5 px-3">₹ 1,547 / Qtl</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-black">₹ 2,320 / Qtl</td>
                        <td className="py-2.5 px-3">FCI / State Civil Supplies</td>
                        <td className="py-2.5 px-3 text-right">
                          <Link to="/booking" className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold no-underline inline-block">
                            Book Slot →
                          </Link>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">Paddy (धान)</td>
                        <td className="py-2.5 px-3">Grade A</td>
                        <td className="py-2.5 px-3">₹ 1,547 / Qtl</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-black">₹ 2,380 / Qtl</td>
                        <td className="py-2.5 px-3">FCI / State Civil Supplies</td>
                        <td className="py-2.5 px-3 text-right">
                          <Link to="/booking" className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold no-underline inline-block">
                            Book Slot →
                          </Link>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">Soybean (सोयाबीन)</td>
                        <td className="py-2.5 px-3">Yellow</td>
                        <td className="py-2.5 px-3">₹ 3,261 / Qtl</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-black">₹ 4,892 / Qtl</td>
                        <td className="py-2.5 px-3">NAFED / State Federations</td>
                        <td className="py-2.5 px-3 text-right">
                          <Link to="/booking" className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold no-underline inline-block">
                            Book Slot →
                          </Link>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">Wheat (गेहूं)</td>
                        <td className="py-2.5 px-3">FAQ Standard</td>
                        <td className="py-2.5 px-3">₹ 1,128 / Qtl</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-black">₹ 2,275 / Qtl</td>
                        <td className="py-2.5 px-3">FCI / Markfed</td>
                        <td className="py-2.5 px-3 text-right">
                          <Link to="/booking" className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold no-underline inline-block">
                            Book Slot →
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          } />

          {/* PAGE 2: FARMER REGISTRATION */}
          <Route path="/register" element={
            <RegistrationModule
              farmerUser={farmerUser}
              setFarmerUser={setFarmerUser}
              farmers={farmers}
              setFarmers={setFarmers}
              onProceedToBooking={() => navigate('/booking')}
              t={t}
            />
          } />

          {/* PAGE 3: SLOT BOOKING */}
          <Route path="/booking" element={
            <SlotBookingModule
              farmerUser={farmerUser}
              mandis={mandis}
              onAppointmentBooked={handleAppointmentBooked}
              t={t}
            />
          } />

          {/* PAGE 4: TRACK PROCUREMENT */}
          <Route path="/track" element={
            <ProcurementTracker
              appointments={appointments}
              t={t}
            />
          } />

          {/* PAGE 5: BUYER & PROCUREMENT AGENCY DESK */}
          <Route path="/buyer" element={
            <BuyerPortal
              appointments={appointments}
              setAppointments={setAppointments}
              buyers={buyers}
              setBuyers={setBuyers}
              mandis={mandis}
              t={t}
            />
          } />

          {/* PAGE 6: MANDI OPERATOR CONSOLE */}
          <Route path="/mandi-console" element={
            <MandiOperatorConsole
              appointments={appointments}
              setAppointments={setAppointments}
              mandis={mandis}
              setMandis={setMandis}
              t={t}
            />
          } />

          {/* PAGE 7: POLICY & LOGISTICS ANALYTICS */}
          <Route path="/analytics" element={
            <AnalyticsDashboard
              mandis={mandis}
            />
          } />

        </Routes>
      </main>

      {/* 5. Dhwani Virtual AI Assistant */}
      <DhwaniBot t={t} lang={lang} setLang={setLang} />

      {/* 6. Statutory GIGW Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider">About Platform</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Designed under Ministry of Consumer Affairs, Food & Public Distribution (Problem Statement ID 26032) to eliminate mandi supply gluts and ensure deterministic queue management.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-2">Statutory Mandate</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#" className="hover:text-white">Guidelines for Indian Gov Websites (GIGW 3.0)</a></li>
              <li><a href="#" className="hover:text-white">Digital Personal Data Protection (DPDP) Act 2023</a></li>
              <li><a href="#" className="hover:text-white">Rights of Persons with Disabilities (RPwD) Act</a></li>
              <li><a href="#" className="hover:text-white">C-DAC Mobile Seva DLT Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-2">Integrated Gateways</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#" className="hover:text-white">BhuNaksha / State Bhulekh Registry</a></li>
              <li><a href="#" className="hover:text-white">C-DAC MSDG SMS Push/Pull Gateway</a></li>
              <li><a href="#" className="hover:text-white">NIC Sandes Secure Messaging</a></li>
              <li><a href="#" className="hover:text-white">PFMS Direct Benefit Transfer (DBT)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-2">Helpdesk & Support</h4>
            <p className="text-[11px]">National Consumer Helpline: 1915</p>
            <p className="text-[11px]">Kisan Call Center: 1800-180-1551 (Toll Free)</p>
            <p className="text-[11px] mt-2 text-slate-500">
              Website designed and hosted by National Informatics Centre (NIC).
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
