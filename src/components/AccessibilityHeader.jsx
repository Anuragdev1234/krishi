import React from 'react';
import { Eye, Type, Volume2, Globe } from 'lucide-react';

export default function AccessibilityHeader({ 
  lang, 
  setLang, 
  fontScale, 
  setFontScale, 
  highContrast, 
  setHighContrast,
  t 
}) {
  const handleFontChange = (type) => {
    if (type === 'increase' && fontScale < 1.3) setFontScale(prev => +(prev + 0.1).toFixed(1));
    if (type === 'decrease' && fontScale > 0.8) setFontScale(prev => +(prev - 0.1).toFixed(1));
    if (type === 'reset') setFontScale(1);
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800" role="region" aria-label="Accessibility Navigation">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        
        {/* Left: Official Gov of India line */}
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-300 tracking-wide">
            GOVERNMENT OF INDIA • भारत सरकार | MIN. OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
          </span>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:bg-amber-400 focus:text-black focus:px-2 focus:py-1 rounded font-bold">
            {t.skipToMain}
          </a>
        </div>

        {/* Right: Accessibility toolbar */}
        <div className="flex items-center space-x-3">
          {/* Text scale controls */}
          <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700" aria-label="Font Resizing">
            <span className="text-[11px] text-slate-400 mr-1.5 font-medium">{t.fontSize}:</span>
            <button 
              onClick={() => handleFontChange('decrease')}
              title="Decrease Font Size"
              className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-xs font-medium text-slate-200"
            >
              A-
            </button>
            <button 
              onClick={() => handleFontChange('reset')}
              title="Reset Font Size"
              className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-xs font-bold text-amber-400"
            >
              A
            </button>
            <button 
              onClick={() => handleFontChange('increase')}
              title="Increase Font Size"
              className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-xs font-medium text-slate-200"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border text-xs font-medium transition-colors ${
              highContrast ? 'bg-amber-400 text-black border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            aria-pressed={highContrast}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.contrast}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer"
              aria-label="Language Selector"
            >
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="pa" className="bg-slate-900 text-white">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
