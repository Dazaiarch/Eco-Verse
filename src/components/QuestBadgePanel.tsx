import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quest, Badge } from '../types';
import { Trophy, Coins, Flame, CheckCircle, Lock, Star, Sparkles, Calendar, Target } from 'lucide-react';

interface QuestBadgePanelProps {
  quests: Quest[];
  badges: Badge[];
  ecoCoins: number;
  streakDays: number;
  onCompleteQuest: (id: string) => void;
  onClaimBadge: (id: string) => void;
}

export default function QuestBadgePanel({
  quests,
  badges,
  ecoCoins,
  streakDays,
  onCompleteQuest,
  onClaimBadge
}: QuestBadgePanelProps) {
  const [activeTab, setActiveTab] = useState<'quests' | 'badges'>('quests');
  const [justEarnedCoins, setJustEarnedCoins] = useState<number | null>(null);

  const handleQuestCompletion = (quest: Quest) => {
    if (quest.completed) return;
    onCompleteQuest(quest.id);
    setJustEarnedCoins(quest.rewardCoins);
    setTimeout(() => {
      setJustEarnedCoins(null);
    }, 2000);
  };

  const completedQuestsCount = quests.filter(q => q.completed).length;
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="glass-card rounded-3xl p-6 glow-emerald-pulse relative flex flex-col h-full" id="quests-panel">
      {/* Floating coin reward notification banner */}
      <AnimatePresence>
        {justEarnedCoins !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-1.5 font-display text-sm"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            Claimed +{justEarnedCoins} EcoCoins!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Stats Board */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {/* EcoCoins balance */}
          <div className="bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
            <div>
              <span className="block text-xs text-gray-400 font-mono">ECOCOINS</span>
              <span className="text-md font-bold text-amber-300 font-display">{ecoCoins}</span>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-[#ff5252]/10 border border-[#ff5252]/20 px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#ff5252] animate-pulse" />
            <div>
              <span className="block text-xs text-gray-400 font-mono">STREAK</span>
              <span className="text-md font-bold text-red-400 font-display">{streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Tab button switcher */}
        <div className="bg-slate-900/80 p-0.5 rounded-xl border border-white/5 flex">
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'quests'
                ? 'bg-emerald-g text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quests ({completedQuestsCount}/{quests.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'badges'
                ? 'bg-emerald-g text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Badges ({unlockedBadgesCount}/{badges.length})
          </button>
        </div>
      </div>

      {/* Interactive dynamic content lists */}
      <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-3">
        {activeTab === 'quests' ? (
          <div>
            <div className="text-xs font-mono text-gray-400 mb-2.5 flex items-center justify-between">
              <span>AVAILABLE MISSIONS</span>
              <span>COMPLETION CREDITS ACTIVE</span>
            </div>

            <div className="space-y-2">
              {quests.map((quest) => (
                <motion.div
                  key={quest.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    quest.completed
                      ? 'bg-emerald-950/15 border-emerald-900/30'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-10 h-10 rounded-xl bg-slate-950/60 flex items-center justify-center">
                      {quest.icon}
                    </span>
                    <div>
                      <h4 className={`text-sm font-semibold font-display ${quest.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
                        {quest.title}
                      </h4>
                      <p className="text-xs text-gray-400 max-w-[280px] line-clamp-1">
                        {quest.description}
                      </p>

                      {/* Quest mini-progress indicator */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          quest.type === 'daily' ? 'bg-[#00e5ff]/10 text-[#00e5ff]' : 'bg-amber-400/10 text-amber-400'
                        }`}>
                          {quest.type.toUpperCase()}
                        </span>
                        <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-g h-full transition-all duration-500" 
                            style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completion Action Button */}
                  <div>
                    {quest.completed ? (
                      <span className="text-[#00e676] bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQuestCompletion(quest)}
                        className="bg-emerald-g hover:bg-[#00c853] text-[#0a0e17] font-semibold text-xs px-3 py-1.5 rounded-xl block shadow transition-all duration-200 active:scale-95 inline-flex items-center gap-1"
                      >
                        <Coins className="w-3.5 h-3.5" /> +{quest.rewardCoins}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-mono text-gray-400 mb-2.5 flex items-center justify-between">
              <span>UNLOCKED MILESTONES</span>
              <span>SPHERE TROPHY CASE</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {badges.map((badge) => {
                const progressPercent = Math.min(100, (badge.currentValue / badge.targetValue) * 100);
                const canUnlock = progressPercent >= 100 && !badge.unlocked;

                return (
                  <motion.div
                    key={badge.id}
                    className={`p-3 rounded-2xl border flex flex-col justify-between text-left h-36 relative ${
                      badge.unlocked
                        ? 'bg-[#00e5ff]/5 border-[#00e5ff]/20 shadow-[0_0_12px_rgba(0,229,255,0.04)]'
                        : canUnlock
                        ? 'bg-amber-400/5 border-amber-400/30 animate-pulse'
                        : 'bg-slate-900/30 border-white/5 opacity-65'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{badge.emoji}</span>
                        {badge.unlocked ? (
                          <span className="text-[#00e5ff] text-[10px] font-mono font-bold bg-[#00e5ff]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" /> Active
                          </span>
                        ) : canUnlock ? (
                          <button
                            onClick={() => onClaimBadge(badge.id)}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow"
                          >
                            CLAIM!
                          </button>
                        ) : (
                          <span className="text-gray-500 text-[10px] font-mono flex items-center gap-0.5">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold font-display text-gray-100 mt-2 block line-clamp-1">
                        {badge.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mt-0.5">
                        {badge.description}
                      </p>
                    </div>

                    {/* Progress tracking bar */}
                    <div className="mt-2 text-left">
                      <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono mb-1">
                        <span className="truncate max-w-[80px]">{badge.requirementText}</span>
                        <span>{badge.currentValue.toFixed(0)}/{badge.targetValue}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            badge.unlocked ? 'bg-[#00e5ff]' : 'bg-gray-600'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Gamified footnote story */}
      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[11px] text-gray-500 leading-normal flex items-center justify-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> Complete daily actions & simulator scenarios to progress milestones.
        </p>
      </div>
    </div>
  );
}
