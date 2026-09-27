import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserCheck, CalendarDays, Search, Building2, BarChart3, ShoppingBag, PhoneCall } from 'lucide-react';

export default function NavigationBar({ t }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.navHome, icon: Home },
    { path: '/register', label: t.navRegister, icon: UserCheck },
    { path: '/booking', label: t.navSlotBooking, icon: CalendarDays },
    { path: '/track', label: t.navTrack, icon: Search },
    { path: '/buyer', label: t.navBuyer || "Buyer & Agency Desk", icon: ShoppingBag },
    { path: '/mandi-console', label: t.navMandiOps, icon: Building2 },
    { path: '/analytics', label: t.navAnalytics, icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Brand & Emblem Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="flex items-center space-x-3.5 no-underline">
          {/* Ashoka Pillar Emblem Replica */}
          <div className="w-11 h-11 rounded-full bg-linear-to-b from-amber-600 to-amber-800 flex items-center justify-center text-white font-serif font-black shadow-md border-2 border-amber-300">
            <span className="text-xl">🏛️</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">{t.nationalMotto}</span>
              <span className="text-xs px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">GIGW 3.0</span>
              <span className="text-xs px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold">UX4G</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight">
              {t.portalName}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {t.subTitle}
            </p>
          </div>
        </Link>

        {/* Toll-free helpline banner */}
        <div className="hidden lg:flex items-center space-x-3 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs">
          <div className="p-1.5 bg-amber-500 text-white rounded-full">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-semibold uppercase">Farmer Kisan Helpline (Toll Free)</span>
            <span className="font-extrabold text-slate-800 text-sm">1800-180-1551 / 1967</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Menu with Real Multi-page URL Links */}
      <nav className="bg-emerald-800 text-white" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto space-x-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-4 no-underline ${
                  isActive
                    ? 'border-amber-400 bg-emerald-900 text-white'
                    : 'border-transparent text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
