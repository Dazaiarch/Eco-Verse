import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Globe, ShieldCheck, Sparkles, AlertCircle, Compass, HelpCircle, ChevronRight, Info } from 'lucide-react';

interface LoginOverlayProps {
  onLoginSuccess: (user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; isAnonymous: boolean }) => void;
}

export default function LoginOverlay({ onLoginSuccess }: LoginOverlayProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showFaq, setShowFaq] = useState(false);

  // Authentication: Googlepopup sign-in
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLoginSuccess({
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        isAnonymous: false
      });
    } catch (err: any) {
      console.error("Google Auth error:", err.message);
      let readableError = "Google Pop-up was closed or blocked. Try the developer Guest Sandbox option if your browser restricts iframe popups!";
      if (err.code === 'auth/popup-blocked') {
        readableError = "Authentication popup was blocked by your browser. Please allow popups or use Sandbox Guest mode!";
      }
      setErrorMsg(readableError);
    } finally {
      setLoading(false);
    }
  };

  // Immediate Sandbox Developer Guest Bypass
  const handleSandboxGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        uid: "guest_developer_sandbox_2026",
        displayName: "Situsonisoni Developer",
        email: "situsonisoni@gmail.com",
        photoURL: null,
        isAnonymous: true
      });
      setLoading(false);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0e17] overflow-y-auto flex items-center justify-center p-4">
      {/* Bioluminescent space ambient lights */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-cyan-g/10 via-[#0a0e17]/0 to-transparent pointer-events-none" stroke-width="0" />
      <div className="absolute -top-16 left-1/4 w-96 h-96 bg-[#00e676]/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden glass-card shadow-2xl border border-white/5 grid grid-cols-1 md:grid-cols-12 relative my-10 animate-fade-in">
        
        {/* Left Pillar: Immersive introduction and rotating globe (7/12 layout) */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-slate-950/40 relative border-r border-white/5">
          <div className="absolute top-0 left-0 w-full h-[300px] bg-radial-gradient(ellipse_at_top,_var(--tw-gradient-stops)) from-cyan-950/20 to-transparent pointer-events-none" stroke-width="0" />
          
          <div>
            {/* Header tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00e676] bg-[#00e676]/10 px-3 py-1 rounded-full font-bold border border-[#00e676]/20">
                🚀 Version 2.0 Released
              </span>
              <span className="text-gray-500 text-[10px] font-mono">• Multi-User Sandbox Connected</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
              EcoVerse <br />
              <span className="bg-gradient-to-r from-[#00e676] via-[#00e5ff] to-purple-400 bg-clip-text text-transparent">
                Your Carbon Story, Reimagined
              </span>
            </h1>

            <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-lg">
              Interact with a living digital planet that heals or degrades based on your daily emissions and achievements. 
              Unlock your Paris-standard budget, and compete with daily missions to earn EcoCoins in our gamified tracking sandbox!
            </p>
          </div>

          {/* Interactive features list */}
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="text-lg mb-1">🌍</div>
              <h4 className="text-xs font-bold text-white uppercase font-display">Biosphere Mirror</h4>
              <p className="text-[10px] text-gray-400 mt-1">Glows vibrant emerald or cracks with heat feedback matching your logs.</p>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="text-lg mb-1">👑</div>
              <h4 className="text-xs font-bold text-white uppercase font-display">Quest Engine</h4>
              <p className="text-[10px] text-gray-400 mt-1">Conquer eco-quests to boost streak flame multipliers and earn tokens.</p>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="text-lg mb-1">🔮</div>
              <h4 className="text-xs font-bold text-white uppercase font-display">What-If Sandbox</h4>
              <p className="text-[10px] text-gray-400 mt-1">Project weekly or annual emissions and budget savings dynamically.</p>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="text-lg mb-1">🧠</div>
              <h4 className="text-xs font-bold text-white uppercase font-display">EcoCoach AI</h4>
              <p className="text-[10px] text-gray-400 mt-1">Get custom, fast, personalized tips powered by server-side Gemini API.</p>
            </div>
          </div>

          {/* Bottom Footnote info */}
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <Info className="w-4 h-4 text-cyan-g" />
            <span>Aligned with Paris Agreement Individual Budget caps: 192 kg CO₂/month.</span>
          </div>
        </div>

        {/* Right Pillar: Account gate and credentials board (5/12 layout) */}
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-slate-900/10">
          
          <div className="my-auto space-y-6">
            <div className="text-center md:text-left mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00e5ff] block">SECURE CREDENTIAL CONTAINER</span>
              <h2 className="text-xl font-display font-extrabold text-white mt-1">Access EcoVerse Gateway</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Connect your account to backing up progress logs, streak days, and coin awards safely to Firestore.
              </p>
            </div>

            {/* Error notifications */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-red-500/15 border border-red-500/20 text-red-300 rounded-2xl text-xs flex items-start gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verification buttons */}
            <div className="space-y-3">
              {/* Authenticate Google Account */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-white hover:bg-gray-150 active:bg-gray-250 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-white/3 transition-all duration-200 select-none cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                {/* SVG google logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.55 0 2.94.53 4.03 1.58l3-3C17.22 1.94 14.85 1 12 1 7.35 1 3.39 3.65 1.48 7.52l3.63 2.82C6.1 7.37 8.82 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.44 12.27c0-.8-.07-1.57-.2-2.31H12v4.38h6.42c-.28 1.45-1.1 2.68-2.33 3.51l3.61 2.8c2.11-1.95 3.34-4.82 3.34-8.38z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.1 14.36A8.13 8.13 0 0 1 3.6 12c0-.83.14-1.64.4-2.41L1.37 6.77C.49 8.52 0 10.49 0 12c0 1.51.49 3.48 1.37 5.23l2.73-2.87z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.96-1.07 7.95-2.92l-3.61-2.8c-1.2.81-2.73 1.3-4.34 1.3-3.18 0-5.9-2.33-6.86-5.32L1.52 16.1C3.43 19.98 7.39 23 12 23z"
                  />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                <div className="h-px bg-white/5 flex-1" />
                <span className="mx-3 uppercase tracking-wider">or enjoy as guest tester</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              {/* Developer Sandbox login bypass */}
              <button
                onClick={handleSandboxGuestLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-[#00e5ff] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-g animate-spin" style={{ animationDuration: '6s' }} />
                <span>Default Guest Developer Access situsonisoni@gmail.com</span>
              </button>
            </div>

            {/* Small FAQ button switcher */}
            <div className="pt-4 text-center">
              <button
                onClick={() => setShowFaq(!showFaq)}
                className="text-[10px] font-mono text-gray-400 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 underline"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-g" /> Learn about authorization & cookies
              </button>

              <AnimatePresence>
                {showFaq && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-slate-950/80 border border-white/5 text-left rounded-xl text-[10px] text-gray-400 mt-2 space-y-1.5 leading-relaxed"
                  >
                    <p>
                      <strong>Why Sandbox Guest Mode?</strong> Inside the sandboxed iframe environment, popup authenticators can sometimes be blocked by security headers. Guest Sandbox simulates full synced Firestore connectivity flawlessly.
                    </p>
                    <p>
                      <strong>Are my details secure?</strong> Yes! Authentic access uses direct backend Firebase API channels, and no data is shared with third party sites.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-500 font-mono mt-4 pt-4 border-t border-white/5">
            🔒 Fully encrypted SSL secure connections.
          </div>
        </div>

      </div>
    </div>
  );
}
