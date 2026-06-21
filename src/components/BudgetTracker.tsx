import React, { useState } from 'react';
import { LogEntry, CarbonCategory } from '../types';
import { getTangibleEquivalents } from '../utils/carbonUtils';
import { Trash2, AlertCircle, TrendingUp, TrendingDown, Landmark, RefreshCw, Plus, Minus, Info } from 'lucide-react';

interface BudgetTrackerProps {
  logs: LogEntry[];
  monthlyBudget: number; // e.g. 192 kg
  onAddLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  onClearLogs: () => void;
}

export default function BudgetTracker({
  logs,
  monthlyBudget,
  onAddLog,
  onClearLogs
}: BudgetTrackerProps) {
  // New entry form local state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CarbonCategory>('transport');
  const [type, setType] = useState<'spend' | 'credit'>('spend');
  const [amount, setAmount] = useState<string>('');
  const [showHelper, setShowHelper] = useState('');

  // Calculate carbon budget metrics
  const totalSpent = logs.filter(l => l.type === 'spend').reduce((acc, curr) => acc + curr.amount, 0);
  const totalCredited = logs.filter(l => l.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
  const remainingCalculated = monthlyBudget - totalSpent + totalCredited;
  const remainingClamped = Math.max(0, remainingCalculated);

  const usagePercent = Math.min(100, (totalSpent / (monthlyBudget + totalCredited)) * 100);

  // Determine budget bar color code
  let barColor = 'bg-[#00e676]'; // Green
  let textColor = 'text-[#00e676]';
  let badgeLabel = 'On Track 🟢';

  if (remainingCalculated <= 0) {
    barColor = 'bg-[#ff5252]'; // Red
    textColor = 'text-[#ff5252]';
    badgeLabel = 'Budget Overdrawn 🔴';
  } else if (remainingCalculated < (monthlyBudget * 0.4)) {
    barColor = 'bg-[#ffab00]'; // Yellow
    textColor = 'text-amber-400';
    badgeLabel = 'High Warning 🟡';
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    onAddLog({
      description: description.trim(),
      category,
      type,
      amount: parseFloat(amount) || 0
    });

    // Reset fields
    setDescription('');
    setAmount('');
  };

  // Helper template selectors to quick-populate carbon amounts based on action selection
  const selectQuickActivityPreset = (activity: string, cat: CarbonCategory, defaultType: 'spend' | 'credit', defaultKg: number) => {
    setDescription(activity);
    setCategory(cat);
    setType(defaultType);
    setAmount(defaultKg.toString());
  };

  const actualSaves = Math.max(0, totalCredited - totalSpent);
  const transEquivalents = getTangibleEquivalents(actualSaves);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="carbon-budget-engine">
      
      {/* 1. BANK COREGRESS BOARD (8/12 COLS) */}
      <div className="xl:col-span-8 flex flex-col justify-between glass-card rounded-3xl p-6 relative min-h-[420px]">
        
        {/* Ledger Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 rounded-xl">
              <Landmark className="w-5 h-5 text-emerald-g" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-white">The Carbon Bank Account</h3>
              <p className="text-xs text-gray-400">Budgeted to the Paris 2.0°C target: 192 kg / month</p>
            </div>
          </div>

          <button
            onClick={onClearLogs}
            className="text-xs font-mono text-red-400 hover:text-red-300 transition-all flex items-center gap-1 bg-red-500/10 px-2.5 py-1.5 rounded-xl border border-red-500/15"
          >
            <Trash2 className="w-3.5 h-3.5" /> reset account
          </button>
        </div>

        {/* Major Digital Balance Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          
          {/* Box 1: Real-time budget balance */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 relative">
            <span className="text-[10px] uppercase font-mono text-gray-500 block">Remaining Balance</span>
            <span className={`text-2xl font-extrabold font-display block mt-1 ${remainingCalculated <= 0 ? 'text-red-400' : 'text-[#00e5ff]'}`}>
              {remainingCalculated.toFixed(1)} kg
            </span>
            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">unspent allocation</span>
          </div>

          {/* Box 2: Total Spent */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-[#ff5252]/10 relative">
            <span className="text-[10px] uppercase font-mono text-gray-500 block">Uninsulated Spendings</span>
            <span className="text-2xl font-extrabold font-display block mt-1 text-[#ff5252]">
              {totalSpent.toFixed(1)} kg
            </span>
            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">industrial debits</span>
          </div>

          {/* Box 3: Total Credited */}
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-[#00e676]/10 relative">
            <span className="text-[10px] uppercase font-mono text-gray-500 block">Eco-Action Gold Credits</span>
            <span className="text-2xl font-extrabold font-display block mt-1 text-[#00e676]">
              {totalCredited.toFixed(1)} kg
            </span>
            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">conservation deposits</span>
          </div>
        </div>

        {/* Real-time Dynamic Budget Bar */}
        <div className="mb-5 bg-slate-950/80 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-g" /> Balance Health Bar
            </span>
            <span className={`font-bold px-2 py-0.5 rounded uppercase font-display bg-slate-900 ${textColor}`}>
              {badgeLabel}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-1 relative border border-white/5">
            <div 
              className={`h-full transition-all duration-700 ${barColor}`}
              style={{ width: `${Math.min(100, Math.max(0, (remainingCalculated / (monthlyBudget + totalCredited)) * 100))}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>0 kg</span>
            <span>Paris target safety boundary</span>
            <span>{monthlyBudget + totalCredited} kg max capacity</span>
          </div>
        </div>

        {/* List of Recent Transactions (The Ledger) */}
        <div className="flex-1 overflow-y-auto max-h-[170px] pr-1" id="ledger-history">
          <h4 className="text-xs font-mono text-gray-400 mb-2 uppercase">Account Statement history</h4>

          {logs.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-xs">
              No carbon transactions logged yet. Start recording your footprint!
            </div>
          ) : (
            <div className="space-y-1.5">
              {[...logs].reverse().map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-xl bg-slate-900/30 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">
                      {log.category === 'transport' && '🚲'}
                      {log.category === 'food' && '🥗'}
                      {log.category === 'energy' && '🔌'}
                      {log.category === 'shopping' && '🛍️'}
                      {log.category === 'eco_credit' && '🌿'}
                    </span>
                    <div>
                      <span className="block font-semibold text-gray-200">{log.description}</span>
                      <span className="text-[10px] text-gray-500 font-mono capitalize">
                        {log.category.replace('_', ' ')} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>

                  <span className={`font-mono font-bold ${log.type === 'credit' ? 'text-emerald-g' : 'text-red-400'}`}>
                    {log.type === 'credit' ? '+' : '-'}{log.amount.toFixed(1)} kg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. TRANSACTION LOGGING & PRESETS PANEL (4/12 COLS) */}
      <div className="xl:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent pointer-events-none rounded-3xl" />
        
        <div>
          <h3 className="text-lg font-bold font-display text-white mb-1.5">Log activity</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Record a daily carbon spending or deposit an eco-action to keep the biosphere balanced.
          </p>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            {/* Description */}
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">ACTIVITY DESCRIPTION</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Vegetarian breakfast salad"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00e5ff] transition-all"
              />
            </div>

            {/* Category & Type row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CarbonCategory)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-[#00e5ff] transition-all"
                >
                  <option value="transport">Transport</option>
                  <option value="food">Food</option>
                  <option value="energy">Energy</option>
                  <option value="shopping">Shopping</option>
                  <option value="eco_credit">Credits</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">ENTRY TYPE</label>
                <div className="bg-slate-950 p-0.5 rounded-xl border border-white/10 flex">
                  <button
                    type="button"
                    onClick={() => setType('spend')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      type === 'spend' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/10' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Spend 🔻
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('credit')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      type === 'credit' 
                        ? 'bg-emerald-500/20 text-[#00e676] border border-emerald-500/10' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Credit 🟢
                  </button>
                </div>
              </div>
            </div>

            {/* CO2 amount */}
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">CO2 IMPACT (KG)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 4.2"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-[#00e5ff] transition-all font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-500">kg CO2</span>
              </div>
            </div>

            {/* Quick Presets Guide */}
            <div className="pt-1.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Quick Presets Helper</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => selectQuickActivityPreset('Flew on short holiday flight', 'transport', 'spend', 15.0)}
                  className="bg-slate-900/60 hover:bg-slate-800 text-[10px] p-1.5 rounded-lg border border-white/5 text-left text-gray-300 truncate"
                >
                  ✈️ Short Flight (+15kg)
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickActivityPreset('Rode city bus transit commute', 'transport', 'credit', 4.5)}
                  className="bg-slate-900/60 hover:bg-slate-800 text-[10px] p-1.5 rounded-lg border border-white/5 text-left text-gray-300 truncate"
                >
                  🚌 City Bus (-4.5kg)
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickActivityPreset('Avoided single-use plastic grocery packaging', 'shopping', 'credit', 2.0)}
                  className="bg-slate-900/60 hover:bg-slate-800 text-[10px] p-1.5 rounded-lg border border-white/5 text-left text-gray-300 truncate"
                >
                  🛍️ Refuse Wrap (-2kg)
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickActivityPreset('Left heavy gaming console running', 'energy', 'spend', 3.8)}
                  className="bg-slate-900/60 hover:bg-slate-800 text-[10px] p-1.5 rounded-lg border border-white/5 text-left text-gray-300 truncate"
                >
                  🎮 Console Idle (+3.8kg)
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 block text-slate-950 font-display ${
                type === 'spend' 
                  ? 'bg-red-400 hover:bg-red-300' 
                  : 'bg-emerald-g hover:bg-[#00c853]'
              }`}
            >
              Post Transaction {type === 'spend' ? '🔻' : '🟢'}
            </button>
          </form>
        </div>

        {/* Small footprint hint box */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-1.5 text-[10px] text-gray-400">
          <Info className="w-3.5 h-3.5 text-[#00e5ff] shrink-0 mt-0.5" />
          <p>
            Paris Agreement targets aim to limit global warming to 1.5°C, requiring a maximum 2.3 tons per year budget allocation for individuals.
          </p>
        </div>
      </div>
    </div>
  );
}
