import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUpRight, TrendingUp, RefreshCw, Zap } from 'lucide-react';

export default function PlanetNewsFeed() {
  const [headlines, setHeadlines] = useState<string[]>([
    "Paris Agreement standard individual threshold set to 192 kg CO₂/month.",
    "Vibrant seagrass meadow expansion project succeeds in capturing blue carbon offshore.",
    "Solar high-voltage lines installed to stream clean power to municipal suburbs.",
    "Renewable active travel routes grow by 15% across urban communities."
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        if (data.headlines && data.headlines.length > 0) {
          setHeadlines(data.headlines);
        }
      }
    } catch (err) {
      console.warn("Using offline carbon news cache.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 8500); // cycle headlines slowly

    const reloadInterval = setInterval(fetchNews, 60000 * 2); // refresh from API every 2 minutes

    return () => {
      clearInterval(interval);
      clearInterval(reloadInterval);
    };
  }, [headlines.length]);

  return (
    <div className="w-full bg-[#0d1423]/90 backdrop-blur-md border-b border-white/5 py-2 px-6 flex items-center justify-between text-[11px] font-mono font-medium tracking-wide text-gray-400 select-none overflow-hidden h-9 z-50 relative">
      <div className="flex items-center gap-2 overflow-hidden flex-1">
        <span className="flex items-center gap-1 text-[#00e5ff] font-bold uppercase tracking-widest shrink-0 text-[10px] bg-[#00e5ff]/10 px-2 py-0.5 rounded mr-3">
          <Zap className="w-3 h-3 text-[#00e5ff] animate-pulse" /> Live News Stream
        </span>

        {/* Rolling message */}
        <div className="relative flex-1 h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 truncate text-gray-300 pr-4 inline-flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00e676] shrink-0" />
              {headlines[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={fetchNews}
        disabled={loading}
        className="p-1 text-gray-500 hover:text-[#00e5ff] transition-all duration-200 cursor-pointer shrink-0 ml-4 inline-flex items-center gap-1 text-[10px] uppercase font-bold"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#00e5ff]' : ''}`} />
        <span className="hidden sm:inline">sync feed</span>
      </button>
    </div>
  );
}
