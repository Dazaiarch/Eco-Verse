import { useState } from 'react';
import { motion } from 'motion/react';
import { getTangibleEquivalents } from '../utils/carbonUtils';
import { Sparkles, Trees, Eye, ShieldAlert, ArrowRight, Compass } from 'lucide-react';

export default function TangibleTranslator() {
  const [customWeight, setCustomWeight] = useState<number>(45);

  const equivalents = getTangibleEquivalents(customWeight);

  // Delhi-Mumbai commutes conversion specifically highlighted in prompt:
  // "Same as driving from Delhi to Mumbai 6 times"
  // Approx 1400 km length, standard vehicle emits ~1400 * 0.25 = 350 kg CO2.
  // Delhi-Mumbai commutes equivalent = customWeight / 350
  const delToMumCommutes = parseFloat((customWeight / 350).toFixed(1));

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden" id="tangible-translator">
      {/* Visual lighting */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/15 blur-2xl rounded-full" />
      
      {/* Title */}
      <div className="border-b border-white/5 pb-4 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-[#ffab00]/10 rounded-xl">
            <Compass className="w-5 h-5 text-amber-400" />
          </span>
          <div>
            <h3 className="text-lg font-bold font-display text-white">Atmospheric Scale Translator</h3>
            <p className="text-xs text-gray-400">Demystify abstract measurements of atmospheric particulate density.</p>
          </div>
        </div>
      </div>

      {/* Input slider Area */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-200 block font-display">
            Select Carbon Volume to Translate:
          </span>
          <span className="text-md font-extrabold text-[#00e5ff] font-mono">
            {customWeight} kg CO₂
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="1000"
          value={customWeight}
          onChange={(e) => setCustomWeight(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00e5ff] mb-4"
        />

        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-[10px] font-mono text-gray-500">
          <button onClick={() => setCustomWeight(6)} className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded border border-white/5">6 kg (Bus commute)</button>
          <button onClick={() => setCustomWeight(25)} className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded border border-white/5 font-bold">25 kg (Meat dinner)</button>
          <button onClick={() => setCustomWeight(100)} className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded border border-white/5">100 kg (Power run)</button>
          <button onClick={() => setCustomWeight(192)} className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded border border-white/5 font-bold">192 kg (Monthly cap)</button>
          <button onClick={() => setCustomWeight(500)} className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded border border-white/5">500 kg (Industrial)</button>
          <button onClick={() => setCustomWeight(1000)} className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded border border-white/5 font-bold">1 Ton (Yearly half)</button>
        </div>
      </div>

      {/* Core translation outputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {equivalents.map((eq, idx) => (
          <div 
            key={idx}
            className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl">{eq.emoji}</span>
              <span className={`text-2xl font-extrabold font-mono ${eq.colorClass}`}>
                {eq.value}
              </span>
            </div>
            
            <div className="mt-4">
              <span className="block text-xs font-semibold text-gray-200 leading-tight">
                {eq.label}
              </span>
              <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                {eq.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Highlight Delhi to Mumbai travel highlight card */}
      <div className="p-4 bg-[#ff5252]/5 rounded-2xl border border-[#ff5252]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🚗</span>
          <div>
            <h4 className="text-sm font-bold font-display text-white">The India Highway Commute Proxy</h4>
            <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
              The highway route between Delhi and Mumbai maps a total travel distance of ~1,400 km.
            </p>
          </div>
        </div>

        <div className="bg-[#ff5252]/10 px-4 py-2 rounded-xl text-center border border-[#ff5252]/15">
          <span className="block text-xs text-red-400 font-mono">DELHI TO MUMBAI ROUTE BY ROAD</span>
          <span className="text-lg font-bold font-display text-red-300">
            {delToMumCommutes > 0 ? `${delToMumCommutes} times` : '0.0 times'}
          </span>
        </div>
      </div>
    </div>
  );
}
