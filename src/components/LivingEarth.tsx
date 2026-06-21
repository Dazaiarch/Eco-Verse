import { motion } from 'motion/react';
import { ShieldCheck, Flame, Leaf, CloudSun, AlertTriangle, HelpCircle } from 'lucide-react';

interface LivingEarthProps {
  healthPercentage: number; // 0 (Worst, hazy/warm/cracked) to 100 (Best, vibrant greens/cyan)
  carbonSavedKg: number;
}

export default function LivingEarth({ healthPercentage, carbonSavedKg }: LivingEarthProps) {
  // Determine state profiles based on health percentage
  // Best: 75+, Warning: 40-74, Overspent: <40
  const isHealthy = healthPercentage >= 75;
  const isModerate = healthPercentage >= 40 && healthPercentage < 75;
  const isCritical = healthPercentage < 40;

  // Visual style variables mapped dynamic to state
  let atmosphereColor = "rgba(0, 229, 255, 0.3)"; // Aurora cyan
  let landColorPrimary = "#00e676"; // Vibrant electric emerald
  let landColorSecondary = "#00b0ff"; // Clear blue
  let glowColor = "rgba(0, 229, 255, 0.45)";
  let message = "Vibrant & Thriving";
  let descriptionText = "Your carbon footprint is low. The biosphere is regenerating with high-quality carbon balance!";
  let textColor = "text-[#00e676]";

  if (isModerate) {
    atmosphereColor = "rgba(255, 171, 0, 0.25)"; // Warm Amber
    landColorPrimary = "#c6ff00"; // Lime green / dry green
    landColorSecondary = "#ff9100"; // Hazy orange-brown
    glowColor = "rgba(255, 171, 0, 0.3)";
    message = "Showing Stress Symptoms";
    descriptionText = "Moderate emission logs are putting pressure on global cooling. Consider adjusting your commutes.";
    textColor = "text-amber-400";
  } else if (isCritical) {
    atmosphereColor = "rgba(255, 82, 82, 0.35)"; // Coral Alert Warmth
    landColorPrimary = "#8d6e63"; // Cracked mud brown
    landColorSecondary = "#ff3d00"; // Blazing fire / magma red
    glowColor = "rgba(255, 82, 82, 0.5)";
    message = "Severely Overspent!";
    descriptionText = "The ecosystem is in a critical heat feedback loop. Use Carbon Credits or daily eco-quests now to restore balance.";
    textColor = "text-red-400";
  }

  // Animation values based on health percentage
  const rotationDuration = 30 + (100 - healthPercentage) * 0.3; // Rotates slower when healthy/balanced
  const atmosphereScale = 1 + (healthPercentage / 200); // Expanded atmosphere when wealthy

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-3xl relative overflow-hidden h-full min-h-[460px] glow-cyan-pulse" id="living-earth-container">
      {/* Background radial space gradients */}
      <div className="absolute inset-0 bg-radial-at-t from-[#152e4f]/30 to-[#0a0e17] pointer-events-none" />

      {/* Title & Status Pillar */}
      <div className="w-full text-center z-10 mb-4">
        <span className="text-xs tracking-widest font-mono text-cyan-g uppercase px-3 py-1 bg-cyan-g/10 rounded-full border border-cyan-g/20 inline-flex items-center gap-1.5 animate-pulse">
          <Leaf className="w-3.5 h-3.5" /> Living Earth Status
        </span>
        <h2 className="text-2xl font-display font-bold mt-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          The Biosphere Mirror
        </h2>
      </div>

      {/* Giant Interactive Graphic Container */}
      <div className="relative flex items-center justify-center w-64 h-64 my-4" id="earth-visualizer">
        {/* Ambient Atmosphere Radial Ring */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '260px',
            height: '260px',
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(10, 14, 23, 0) 70%)`
          }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dynamic Atmosphere outer shield SVG boundary */}
        <div className="absolute w-[240px] h-[240px] rounded-full border border-white/5 pointer-events-none z-0" />

        {/* Interactive Earth Globe Canvas/SVG */}
        <motion.div
          className="relative w-52 h-52 rounded-full cursor-pointer overflow-hidden shadow-[inset_0_4px_24px_rgba(255,255,255,0.15)] bg-slate-950 flex items-center justify-center border border-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Internal gradient representation mapping earth state */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#122a44] to-[#040811] z-0" stroke-width="0"/>

          {/* SVG Landmasses with rotation */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute w-full h-full z-10 opacity-90"
            animate={{ rotate: 360 }}
            transition={{
              duration: rotationDuration,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Map landmass vector layers */}
            {/* Continent 1 */}
            <motion.path
              d="M15,35 Q20,10 40,20 Q60,30 45,50 Q30,70 20,55 Q10,40 15,35 Z"
              fill={landColorPrimary}
              animate={{ fill: landColorPrimary }}
              transition={{ duration: 1.5 }}
            />
            {/* Continent 2 */}
            <motion.path
              d="M55,20 Q70,5 85,25 Q100,45 80,60 Q60,75 55,50 Q50,25 55,20 Z"
              fill={landColorSecondary}
              animate={{ fill: landColorSecondary }}
              transition={{ duration: 1.5 }}
            />
            {/* Continent 3 */}
            <motion.path
              d="M25,65 Q35,55 50,70 Q65,85 45,95 Q25,100 20,85 Q15,70 25,65 Z"
              fill={landColorPrimary}
              animate={{ fill: landColorPrimary }}
              transition={{ duration: 1.5 }}
            />
            {/* Continent 4 (Small Arctic/Antarctic ice cap) */}
            {isHealthy && (
              <motion.path
                d="M40,5 Q50,0 60,5 Q55,12 45,12 Z"
                fill="#ffffff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              />
            )}
            {/* Mud/burnt cracks mapping overspent level */}
            {isCritical && (
              <>
                {/* Crack lines across continents */}
                <line x1="25" y1="20" x2="45" y2="40" stroke="#ff3d00" strokeWidth="1.2" opacity="0.8" />
                <line x1="75" y1="35" x2="65" y2="55" stroke="#ff5252" strokeWidth="1" opacity="0.9" />
                <line x1="30" y1="75" x2="45" y2="85" stroke="#ff3d00" strokeWidth="1.5" opacity="0.8" />
              </>
            )}
          </motion.svg>

          {/* Atmosphere clouds filter mask Layer */}
          <motion.div
            className="absolute inset-0 bg-radial-at-tl from-white/10 to-transparent pointer-events-none z-20 mix-blend-screen"
            animate={{ opacity: isHealthy ? 0.3 : 0.1 }}
          />

          {/* Hazy overlay / Smog clouds depending on footprint load */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: isCritical 
                ? 'linear-gradient(220deg, rgba(239, 68, 68, 0.4) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : isModerate
                ? 'linear-gradient(220deg, rgba(245, 158, 11, 0.25) 0%, rgba(10, 14, 23, 0) 100%)'
                : 'linear-gradient(220deg, rgba(6, 182, 212, 0) 0%, rgba(10, 14, 23, 0) 100%)'
            }}
            animate={{
              opacity: [0.7, 0.85, 0.7]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Small floating items rotating around the earth */}
        {isHealthy && (
          <motion.div 
            className="absolute w-full h-full pointer-events-none z-30"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute top-1 left-12 text-md">🍃</span>
            <span className="absolute bottom-4 right-14 text-sm animate-bounce">🎈</span>
            <span className="absolute top-1/2 right-1 text-md">🦋</span>
          </motion.div>
        )}
        {isCritical && (
          <motion.div 
            className="absolute w-full h-full pointer-events-none z-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute top-3 right-10 text-sm">⚠️</span>
            <span className="absolute bottom-2 left-16 text-lg animate-pulse">🔥</span>
            <span className="absolute top-1/2 left-1 text-xs">💨</span>
          </motion.div>
        )}
      </div>

      {/* Score and Interactive Status Detail */}
      <div className="text-center z-10 w-full mt-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className={`text-xl font-display font-extrabold ${textColor}`}>
            {healthPercentage.toFixed(0)}%
          </span>
          <span className="text-gray-400 text-sm">Carbon Health Score</span>
        </div>

        {/* Status Bio-text feedback */}
        <p className={`text-sm font-semibold mb-1 ${textColor} inline-flex items-center gap-1`}>
          {isCritical && <AlertTriangle className="w-4 h-4" />}
          {isHealthy && <Leaf className="w-4 h-4" />}
          {isModerate && <CloudSun className="w-4 h-4" />}
          {message}
        </p>
        
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed px-2">
          {descriptionText}
        </p>

        {/* Realtime streak counter badge in line */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-around text-xs font-mono text-gray-400">
          <div>
            <span className="block text-cyan-g font-bold text-sm">
              {carbonSavedKg > 0 ? `-${carbonSavedKg.toFixed(1)} kg` : '0.0 kg'}
            </span>
            <span>Net Saved This Turn</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="block text-[#ff5252] font-bold text-sm inline-flex items-center gap-0.5">
              <Flame className="w-4 h-4 fill-warm-amber-500 stroke-[#ff5252] animate-bounce" /> Hot Streak
            </span>
            <span>Uninterrupted Logs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
