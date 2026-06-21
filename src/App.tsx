import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LogEntry, Quest, Badge, SimulatorState } from './types';
import { DEFAULT_QUESTS, DEFAULT_BADGES, INITIAL_LOG_ENTRIES } from './utils/carbonUtils';
import LivingEarth from './components/LivingEarth';
import QuestBadgePanel from './components/QuestBadgePanel';
import LifestyleSimulator from './components/LifestyleSimulator';
import BudgetTracker from './components/BudgetTracker';
import TangibleTranslator from './components/TangibleTranslator';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchUserProfile, saveUserProfile } from './utils/firebaseSync';
import LoginOverlay from './components/LoginOverlay';
import PlanetNewsFeed from './components/PlanetNewsFeed';
import EcoCoach from './components/EcoCoach';
import { 
  Globe, 
  Coins, 
  Flame, 
  Compass, 
  HelpCircle, 
  User, 
  Sliders, 
  BookOpen, 
  Menu, 
  X,
  Target, 
  Landmark, 
  ShieldCheck, 
  Sparkles,
  Info 
} from 'lucide-react';

export default function App() {
  // 1.5. Firebase Auth / Sync states
  const [currentUser, setCurrentUser] = useState<{
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    isAnonymous: boolean;
  } | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [lastSimulatorState, setLastSimulatorState] = useState<SimulatorState>({
    bikeDays: 2,
    veggieDays: 3,
    ledBulbs: 5,
    localFood: false,
    compostWaste: false,
    solarPanels: false
  });

  // 1. Core State Handlers (with LocalStorage for offline-first resilience)
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('ecoverse_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOG_ENTRIES;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('ecoverse_quests');
    return saved ? JSON.parse(saved) : DEFAULT_QUESTS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('ecoverse_badges');
    return saved ? JSON.parse(saved) : DEFAULT_BADGES;
  });

  const [ecoCoins, setEcoCoins] = useState<number>(() => {
    const saved = localStorage.getItem('ecoverse_coins');
    return saved ? parseInt(saved) : 180;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('ecoverse_streak');
    return saved ? parseInt(saved) : 5;
  });

  // Simulator link state
  const [simulatorSavings, setSimulatorSavings] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<'live' | 'simulation'>('live');

  // Ref scroll targets for smooth navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const questsRef = useRef<HTMLDivElement>(null);
  const translatorRef = useRef<HTMLDivElement>(null);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('ecoverse_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ecoverse_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('ecoverse_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('ecoverse_coins', ecoCoins.toString());
  }, [ecoCoins]);

  useEffect(() => {
    localStorage.setItem('ecoverse_streak', streakDays.toString());
  }, [streakDays]);

  // Firebase continuous Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isAnonymous: false
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync profile when state changes under authenticated session
  useEffect(() => {
    if (!currentUser || loadingProfile) return;
    const syncToFirebase = async () => {
      await saveUserProfile(currentUser.uid, {
        ecoCoins,
        streakDays,
        logs,
        quests,
        badges
      });
    };
    const timer = setTimeout(syncToFirebase, 600); // lightweight debounce
    return () => clearTimeout(timer);
  }, [currentUser, logs, quests, badges, ecoCoins, streakDays, loadingProfile]);

  // Restore profile data from Firestore upon positive Login gate
  useEffect(() => {
    if (!currentUser) return;
    const loadProfile = async () => {
      setLoadingProfile(true);
      const profile = await fetchUserProfile(currentUser.uid);
      if (profile) {
        if (profile.logs && profile.logs.length > 0) setLogs(profile.logs);
        if (profile.quests && profile.quests.length > 0) setQuests(profile.quests);
        if (profile.badges && profile.badges.length > 0) setBadges(profile.badges);
        setEcoCoins(profile.ecoCoins ?? 180);
        setStreakDays(profile.streakDays ?? 5);
      }
      setLoadingProfile(false);
    };
    loadProfile();
  }, [currentUser]);

  // Calculations for Carbon Account
  const monthlyBudget = 192; // 192 kg CO2 / month
  const totalSpent = logs.filter(l => l.type === 'spend').reduce((acc, curr) => acc + curr.amount, 0);
  const totalCredited = logs.filter(l => l.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
  const actualBalance = monthlyBudget - totalSpent + totalCredited;

  // Real-time atmospheric metrics & saving computations for Earth
  const netSavedKg = Math.max(0, totalCredited - totalSpent);

  // Simulated Score computing: if user acts on the simulation sliders, we overlay the projected monthly reductions (yearlySavings / 12)
  const simulatedMonthlyCredit = simulatorSavings / 12;
  const simulatedBalance = actualBalance + simulatedMonthlyCredit;

  // Compute final visualization metric depending on active mode (Live vs Sandbox preview)
  const currentBudgetForEarth = previewMode === 'live' ? actualBalance : simulatedBalance;
  // Express budget health as percentage
  const earthHealthPercentage = Math.max(0, Math.min(100, (currentBudgetForEarth / monthlyBudget) * 100));

  // Handler: Add a carbon log manually
  const handleAddLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [...logs, newLog];
    setLogs(updated);

    // Increase Quest progress where applicable
    const categoryName = entry.category;
    const isCredit = entry.type === 'credit';

    setQuests(prev => prev.map(q => {
      if (!q.completed && q.category === categoryName) {
        const nextProg = q.progress + 1;
        const reached = nextProg >= q.target;
        if (reached) {
          setEcoCoins(c => c + q.rewardCoins);
        }
        return {
          ...q,
          progress: Math.min(q.target, nextProg),
          completed: reached
        };
      }
      return q;
    }));

    // Trigger streak modifier if today is a fresh active record
    setStreakDays(s => s + 1);

    // Recheck badges totals
    updateBadgeMetrics(updated);
  };

  // Handler: Claim a quest reward manually
  const handleCompleteQuest = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        setEcoCoins(curr => curr + q.rewardCoins);
        return { ...q, completed: true, progress: q.target };
      }
      return q;
    }));
  };

  // Handler: Claim milestone trophies
  const handleClaimBadge = (id: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === id && !b.unlocked) {
        setEcoCoins(curr => curr + 50); // Trophy claim bonus!
        return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return b;
    }));
  };

  // Helper to re-evaluate Badge conditions of target values using custom logs
  const updateBadgeMetrics = (currentLogs: LogEntry[]) => {
    const totalSaves = currentLogs.filter(l => l.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
    const transportCommutes = currentLogs.filter(l => l.category === 'transport' && l.type === 'credit').length;
    const foodLogs = currentLogs.filter(l => l.category === 'food' && l.type === 'credit').length;
    const energyLogs = currentLogs.filter(l => l.category === 'energy' && l.type === 'credit').length;

    setBadges(prev => prev.map(badge => {
      let currentVal = badge.currentValue;

      if (badge.id === 'b2') {
        currentVal = totalSaves; // Forest Guardian tracks total saves
      } else if (badge.id === 'b5') {
        currentVal = transportCommutes; // Asphalt Nomad tracks transport credits
      } else if (badge.id === 'b6') {
        currentVal = foodLogs; // Conscious Eater tracks food credits
      } else if (badge.id === 'b4') {
        currentVal = energyLogs; // Solar Pioneer tracks energy saving credits
      }

      const unlockedState = currentVal >= badge.targetValue ? true : badge.unlocked;

      return {
        ...badge,
        currentValue: currentVal,
        unlocked: unlockedState
      };
    }));
  };

  // Cleaner resets
  const handleClearLogs = () => {
    setLogs([]);
    setQuests(DEFAULT_QUESTS);
    setBadges(DEFAULT_BADGES);
    setStreakDays(1);
    setEcoCoins(100);
  };

  // Commit credits from lifestyle simulator directly to real carbon log
  const handleCommitCredits = (amountKg: number, reason: string) => {
    handleAddLog({
      description: reason,
      category: 'eco_credit',
      type: 'credit',
      amount: amountKg
    });
  };

  // Handler: update simulation calculations
  const handleUpdateSimulation = (simState: SimulatorState, simulatedSavings: number) => {
    setSimulatorSavings(simulatedSavings);
    setLastSimulatorState(simState);
  };

  // Smooth-scroll navigation helper
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!currentUser) {
    return <LoginOverlay onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-100 font-sans relative pb-16 selection:bg-[#00e5ff] selection:text-[#0a0e17]">
      {/* Real-time Environmental News Feed Ticker */}
      <PlanetNewsFeed />

      {/* Background space elements */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#090d16] to-[#04060b] z-0" stroke-width="0"/>
      <div className="fixed top-12 left-1/4 w-96 h-96 bg-[#00e676]/3 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-12 right-1/4 w-96 h-96 bg-[#00e5ff]/3 blur-3xl rounded-full pointer-events-none" />

      {/* Modern top header navigation */}
      <header className="sticky top-0 z-40 glass-card border-b border-white/5 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#00e676] to-[#00e5ff] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10 cursor-pointer" onClick={() => scrollToRef(heroRef)}>
            <Globe className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#00e676] font-bold block">EcoVerse</span>
            <span className="text-gray-400 text-[10px] block leading-none font-medium">Your Carbon Story, Reimagined</span>
          </div>
        </div>

        {/* Dynamic Navigation rails */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-semibold tracking-wider">
          <button onClick={() => scrollToRef(heroRef)} className="text-gray-400 hover:text-white transition-all cursor-pointer">🌍 Biosphere</button>
          <button onClick={() => scrollToRef(budgetRef)} className="text-gray-400 hover:text-white transition-all cursor-pointer">💰 Carbon Bank</button>
          <button onClick={() => scrollToRef(simulatorRef)} className="text-gray-400 hover:text-white transition-all cursor-pointer">🔮 Sandbox</button>
          <button onClick={() => scrollToRef(questsRef)} className="text-gray-400 hover:text-white transition-all cursor-pointer">🎮 Missions</button>
          <button onClick={() => scrollToRef(translatorRef)} className="text-gray-400 hover:text-white transition-all cursor-pointer">🌱 Translator</button>
        </nav>

        {/* Live account indicator info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-mono text-gray-500 block uppercase">
              {currentUser.isAnonymous ? "GUEST BACKUP ACTIVE" : "GOOGLE COMPATIBLE"}
            </span>
            <span className="text-xs text-[#00e5ff] font-semibold block leading-none mt-0.5">
              {currentUser.email || "developer@sandbox.local"}
            </span>
          </div>
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-white/10" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/30 flex items-center justify-center font-bold text-xs text-[#00e5ff]">
              {(currentUser.displayName || currentUser.email || "G").charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={async () => {
              await auth.signOut();
              setCurrentUser(null);
            }}
            className="text-[9px] font-mono bg-slate-900 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-400 px-2 py-1 rounded transition-all cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Single Page content wrapper */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-12 relative z-10">

        {/* 1. HERO & LIVING EARTH BIOSPHERE SEGMENT */}
        <section ref={heroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch scroll-mt-24 pt-4" id="biosphere-section">
          {/* Text/Intro container (7/12 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#00e676]/4 blur-3xl pointer-events-none rounded-full" />
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e676] bg-[#00e676]/10 px-2.5 py-1 rounded-full border border-[#00e676]/15 uppercase">
                  Pillar 1: Interactive Earth Mirror
                </span>
                <span className="text-[9px] font-mono text-gray-500">• 2.0°C target alignment</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
                Sustainability is <br />
                <span className="bg-gradient-to-r from-[#00e676] via-[#00e5ff] to-[#a855f7] bg-clip-text text-transparent">
                  Personal, Tangible, & Gamified.
                </span>
              </h1>

              <p className="text-gray-300 text-sm mt-5 leading-relaxed max-w-xl">
                EcoVerse is an experience where the consequences of your footprint are mapped in real-time. 
                Instead of confusing metrics and charts, your life carbon decisions are mirrored directly upon the 
                <strong> Living Earth Spherical Model</strong>. Watch it bloom as you commit solar cleanups, 
                or witness crack scars as emissions mount.
              </p>
            </div>

            {/* Quick Walkthrough Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="flex gap-2.5 items-start">
                <span className="bg-emerald-500/10 text-emerald-g p-2 rounded-lg font-bold text-center text-xs shrink-0 font-mono">01</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-display">Living Earth visualizer</h4>
                  <p className="text-[11px] text-gray-400">Sphere degrades or heals organically matching your carbon health levels.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="bg-[#00e5ff]/10 text-cyan-g p-2 rounded-lg font-bold text-center text-xs shrink-0 font-mono">02</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-display">What-if simulation</h4>
                  <p className="text-[11px] text-gray-400">Set sandbox lifestyle commute parameters & visualize projected results.</p>
                </div>
              </div>
            </div>

            {/* Earth visualizer controllers */}
            <div className="mt-8 bg-slate-950/70 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gray-200 block">Earth Visualization Filter:</span>
                <p className="text-[10px] text-gray-400">Switch filter mode to see your live metrics or simulation predictions.</p>
              </div>

              <div className="flex bg-slate-900 p-0.5 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={() => setPreviewMode('live')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
                    previewMode === 'live'
                      ? 'bg-[#00e5ff] text-slate-950 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Live Earth Account
                </button>
                <button
                  onClick={() => setPreviewMode('simulation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
                    previewMode === 'simulation'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  "What-If" Predictions
                </button>
              </div>
            </div>
          </div>

          {/* Earth panel (5/12 cols) */}
          <div className="lg:col-span-5 h-full">
            <LivingEarth 
              healthPercentage={earthHealthPercentage} 
              carbonSavedKg={netSavedKg} 
            />
          </div>
        </section>

        {/* 2. THE CARBON BUDGET LEDGER SYSTEM (Paris Target: 192 kg) */}
        <section ref={budgetRef} className="scroll-mt-24" id="carbon-bank-section">
          <BudgetTracker 
            logs={logs} 
            monthlyBudget={monthlyBudget} 
            onAddLog={handleAddLog} 
            onClearLogs={handleClearLogs} 
          />
        </section>

        {/* 3. LIFESTYLE WHAT-IF SANDBOX SIMULATOR */}
        <section ref={simulatorRef} className="scroll-mt-24" id="interactive-sandbox-section">
          <LifestyleSimulator 
            onUpdateSimulation={handleUpdateSimulation} 
            onCommitCredits={handleCommitCredits} 
          />
        </section>

        {/* 4. GAME MISSIONS, QUESTS, & UNLOCKED BADGES */}
        <section ref={questsRef} className="scroll-mt-24" id="achievements-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Quest badges component (8/12 cols) */}
            <div className="lg:col-span-8">
              <QuestBadgePanel 
                quests={quests} 
                badges={badges} 
                ecoCoins={ecoCoins} 
                streakDays={streakDays} 
                onCompleteQuest={handleCompleteQuest} 
                onClaimBadge={handleClaimBadge} 
              />
            </div>

            {/* Quick narrative sidebar panel (4/12 cols) */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-6 relative flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-g/5 to-transparent pointer-events-none rounded-3xl" />
              
              <div>
                <span className="text-[10px] font-mono text-[#00e676] uppercase block">Narrative Story progression</span>
                <h3 className="text-xl font-display font-extrabold text-white mt-1">EcoVerse Legends</h3>
                
                <p className="text-xs text-gray-400 leading-relaxed mt-4">
                  The year is 2026. Micro-climatic fluctuations are visible across multiple hemispheres. 
                  By completing Daily Missions (Quests) and making regular deposits to your Carbon Balance, 
                  you are actively preserving the delicate visual health of our web-based biosphere.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 flex gap-2.5">
                    <span className="text-xl">🏆</span>
                    <div>
                      <span className="block text-xs font-bold text-white">Earn EcoCoins</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Use earned coins to unlock high-tier badges or customized planet layouts!</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 flex gap-2.5">
                    <span className="text-xl">🔥</span>
                    <div>
                      <span className="block text-xs font-bold text-white">Daily Streak Multipliers</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Logging transactions consecutively expands the bio-network and boosts coin rates.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-3 bg-[#00e5ff]/5 rounded-xl border border-[#00e5ff]/10 text-[10px] text-gray-400 leading-relaxed">
                <span className="block font-bold text-cyan-g uppercase mb-1">PRO-TIP FOR GUARDIANS:</span>
                Toggle the <strong>"What-If" Predictions</strong> switch on your earth model to witness high-performance offsets derived from the simulator model live.
              </div>
            </div>
          </div>
        </section>

        {/* 5. TANGIBLE IMPACT ATMOSPHERIC TRANSLATOR */}
        <section ref={translatorRef} className="scroll-mt-24" id="atmospheric-scale-section">
          <TangibleTranslator />
        </section>

      </main>

      {/* Floating back-to-top navigational shortcut */}
      <footer className="mt-16 border-t border-white/5 py-8 text-center text-xs text-gray-500 font-mono">
        <p>© 2026 EcoVerse Space Ecosystem. Operating under individual Paris Agreement caps.</p>
        <p className="mt-1.5 text-gray-600">Built using React 19, Tailwind CSS, and Framer Motion.</p>
      </footer>

      {/* Persistent AI Carbon Coach Interface */}
      <EcoCoach 
        balance={actualBalance} 
        streak={streakDays} 
        simState={{
          bikeDays: lastSimulatorState.bikeDays,
          veggieDays: lastSimulatorState.veggieDays,
          ledBulbs: lastSimulatorState.ledBulbs
        }} 
      />
    </div>
  );
}
