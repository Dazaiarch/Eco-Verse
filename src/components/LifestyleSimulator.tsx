import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SimulatorState, TangibleEquivalent } from '../types';
import { calculateSimulatorSavings, getTangibleEquivalents } from '../utils/carbonUtils';
import { RefreshCw, Leaf, Sliders, DollarSign, CloudRain, ShieldAlert, Sparkles, Plus, Check } from 'lucide-react';

interface LifestyleSimulatorProps {
  onUpdateSimulation: (state: SimulatorState, simulatedSavings: number) => void;
  onCommitCredits: (amountKg: number, reason: string) => void;
}

export default function LifestyleSimulator({ onUpdateSimulation, onCommitCredits }: LifestyleSimulatorProps) {
  // Simulator state variables
  const [state, setState] = useState<SimulatorState>({
    bikeDays: 3,
    veggieDays: 4,
    ledBulbs: 8,
    localFood: true,
    compostWaste: false,
    solarPanels: false
  });

  const [committed, setCommitted] = useState<boolean>(false);

  // Perform calculations
  const { weeklySavings, annualSavings, annualMoneySaved } = calculateSimulatorSavings(state);
  const equivalents: TangibleEquivalent[] = getTangibleEquivalents(annualSavings);

  // Push calculations upward to update the earth or the master state whenever sliders shift
  useEffect(() => {
    onUpdateSimulation(state, annualSavings);
  }, [state]);

  const handleSliderChange = (key: keyof SimulatorState, val: number | boolean) => {
    setState((prev) => ({
      ...prev,
      [key]: val
    }));
    setCommitted(false);
  };

  const resetSimulator = () => {
    setState({
      bikeDays: 0,
      veggieDays: 0,
      ledBulbs: 0,
      localFood: false,
      compostWaste: false,
      solarPanels: false
    });
    setCommitted(false);
  };

  const handleCommitSavings = () => {
    // Commit 1 month's worth of the simulated savings to their actual budget
    const monthlyCredit = parseFloat((annualSavings / 12).toFixed(1));
    onCommitCredits(monthlyCredit, `Simulated Lifestyle Commitment: ${state.bikeDays}d Bike, ${state.veggieDays}d Veggie, ${state.ledBulbs} LEDs`);
    setCommitted(true);
    setTimeout(() => {
      setCommitted(false);
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative flex flex-col h-full overflow-hidden" id="lifestyle-simulator">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-g/5 blur-3xl rounded-full" />

      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-[#00e5ff] uppercase block">Interactive Sandbox</span>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Sliders className="w-5 h-5 text-[#00e5ff]" /> Lifestyle "What-If" Simulator
          </h2>
        </div>
        <button
          onClick={resetSimulator}
          className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-xs text-gray-400 hover:text-white rounded-lg border border-white/5 font-mono flex items-center gap-1 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> reset
        </button>
      </div>

      {/* Main interactive section splits into settings and tangible equivalents output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Area (7/12 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Commute Slider */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-200 block font-display">
                🚲 Active Commutes (Bike / Walk / Run)
              </label>
              <span className="text-xs text-[#00e676] font-mono font-bold">
                {state.bikeDays} {state.bikeDays === 1 ? 'day' : 'days'} / wk
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">
              Replaces standard 15km vehicle transit times with fossil-free power.
            </p>
            <input
              type="range"
              min="0"
              max="7"
              value={state.bikeDays}
              onChange={(e) => handleSliderChange('bikeDays', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00e676]"
            />
          </div>

          {/* Vegetarian diet Slider */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-200 block font-display">
                🥗 Vegetarian Diet Adaptation
              </label>
              <span className="text-xs text-[#00e5ff] font-mono font-bold">
                {state.veggieDays} {state.veggieDays === 1 ? 'day' : 'days'} / wk
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">
              Bypasses industrial beef/pork products for low greenhouse gas vegetables.
            </p>
            <input
              type="range"
              min="0"
              max="7"
              value={state.veggieDays}
              onChange={(e) => handleSliderChange('veggieDays', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00e5ff]"
            />
          </div>

          {/* LED light bulbs Slider */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-200 block font-display">
                💡 Smart LED Bulb Replacements
              </label>
              <span className="text-xs text-amber-400 font-mono font-bold">
                {state.ledBulbs} bulbs installed
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">
              Replaces old high-watt incandescent fixtures with energy-saving hardware.
            </p>
            <input
              type="range"
              min="0"
              max="20"
              value={state.ledBulbs}
              onChange={(e) => handleSliderChange('ledBulbs', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Grid of micro-toggles */}
          <div className="grid grid-cols-3 gap-2">
            {/* Local Food */}
            <button
              onClick={() => handleSliderChange('localFood', !state.localFood)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                state.localFood
                  ? 'bg-emerald-950/15 border-emerald-500/20 text-[#00e676]'
                  : 'bg-slate-900/30 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <span className="block text-lg mb-1">🍎</span>
              <span className="text-[10px] font-semibold block uppercase tracking-wider font-display">Local Sourced</span>
            </button>

            {/* Composting */}
            <button
              onClick={() => handleSliderChange('compostWaste', !state.compostWaste)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                state.compostWaste
                  ? 'bg-cyan-950/20 border-cyan-500/20 text-[#00e5ff]'
                  : 'bg-slate-900/30 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <span className="block text-lg mb-1">🍂</span>
              <span className="text-[10px] font-semibold block uppercase tracking-wider font-display">Compost Log</span>
            </button>

            {/* Solar Panel */}
            <button
              onClick={() => handleSliderChange('solarPanels', !state.solarPanels)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                state.solarPanels
                  ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                  : 'bg-slate-900/30 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <span className="block text-lg mb-1">☀️</span>
              <span className="text-[10px] font-semibold block uppercase tracking-wider font-display">Solar Array</span>
            </button>
          </div>
        </div>

        {/* Real-time Impact Outputs Area (5/12 cols) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between space-y-4">
          {/* Quick Metrics summary card */}
          <div className="p-4 bg-slate-950/65 rounded-2xl border border-white/5 relative">
            <span className="text-[9px] font-mono text-gray-500 block uppercase">Projected Annual Offset</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-display text-white">
                {annualSavings.toFixed(0)}
              </span>
              <span className="text-xs text-gray-400 uppercase font-mono">kg CO2 / year</span>
            </div>

            {/* Financial conversion */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-g" /> Annual Cost Savings:
              </span>
              <span className="font-bold text-[#00e676] font-mono">${annualMoneySaved.toFixed(2)}</span>
            </div>
          </div>

          {/* Equivalent Translators list */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Tangible Impact Translation</span>

            <div className="grid grid-cols-2 gap-2">
              {equivalents.map((eq, i) => (
                <div key={i} className="p-2.5 bg-slate-900/40 rounded-xl border border-white/5 flex items-center gap-2">
                  <span className="text-xl">{eq.emoji}</span>
                  <div>
                    <span className="block text-xs text-white font-bold font-mono">
                      {eq.value}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-tight block">
                      {eq.label.split(" ")[0]} {eq.unit.split(" ")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger committed button */}
          <button
            onClick={handleCommitSavings}
            disabled={annualSavings <= 0}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
              annualSavings <= 0
                ? 'bg-slate-800 text-gray-600 cursor-not-allowed'
                : committed
                ? 'bg-[#00e676] text-[#0a0e17] font-bold'
                : 'bg-[#00e5ff] hover:bg-[#00b0ff] text-[#0a0e17] shadow-lg active:scale-95'
            }`}
          >
            {committed ? (
              <>
                <Check className="w-4 h-4" /> Committed 1-Month Offset!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Claim Carbon Credit Token (+{(annualSavings / 12).toFixed(1)} kg)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
