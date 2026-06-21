import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, Send, BrainCircuit, X, RefreshCw, HelpCircle, Leaf } from 'lucide-react';
import { SimulatorState } from '../types';

interface EcoCoachProps {
  balance: number;
  streak: number;
  simState: {
    bikeDays: number;
    veggieDays: number;
    ledBulbs: number;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

export default function EcoCoach({ balance, streak, simState }: EcoCoachProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'coach',
      text: 'Greetings, Earth Guardian! 🌿 I am EcoCoach, your personal AI Carbon Coach. Ask me how to optimize your lifestyle or offset a carbon-heavy day!',
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    if (!customText) setInput('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: { balance, streak, simState }
        })
      });

      const data = await response.json();
      if (response.ok) {
        const coachMsg: ChatMessage = {
          id: `c_${Date.now()}`,
          sender: 'coach',
          text: data.reply,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, coachMsg]);
      } else {
        throw new Error(data.error || 'Failed to generate advice');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'coach',
        text: "I encountered a solar flare connection issue, but here is a quick tip: Swapping a drive for transit saves ~4.2kg CO2! 🚌",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const loadPresetTip = (tip: string) => {
    handleSendMessage(tip);
  };

  const presetQuestions = [
    "How do I offset my last holiday flight? 🛫",
    "Give me a high-impact transport tip. 🚲",
    "What is the impact of going beefless? 🥩",
    "Suggest a simple home energy cleanup. 🔌"
  ];

  return (
    <>
      {/* Floating Active Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#00e676] to-[#00e5ff] text-slate-950 p-4 rounded-full shadow-2xl flex items-center gap-2 font-display font-extrabold text-sm border border-emerald-300/20 glow-cyan-pulse select-none"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <BrainCircuit className="w-5 h-5 animate-pulse text-slate-950" />
          <span>Ask EcoCoach AI</span>
        </motion.button>
      </div>

      {/* Floating Messenger Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-32px)] h-[500px] glass-card rounded-3xl overflow-hidden shadow-2xl border border-[#00e5ff]/25 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/90 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Leaf className="w-4.5 h-4.5 text-[#00e676] animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                    EcoCoach AI <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
                  </h3>
                  <span className="text-[10px] font-mono text-[#00e5ff] uppercase block">Personal Carbon Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/25">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#00e5ff]/15 text-white rounded-tr-none border border-[#00e5ff]/10'
                        : 'bg-slate-900/90 text-gray-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] text-gray-500 font-mono block text-right mt-1.5">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/90 border border-white/5 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-gray-400 font-mono">Consulting climate records...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Direct Suggestion Prompts */}
            <div className="p-3 bg-slate-950/60 border-t border-white/5">
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Eco Blueprint Prompts
              </span>
              <div className="flex flex-wrap gap-1">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPresetTip(q)}
                    disabled={loading}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-gray-300 px-2.5 py-1 rounded-lg border border-white/5 select-none font-medium text-left truncate max-w-[200px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-950 border-t border-white/5 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask advice (e.g., carbon-sink plants)..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00e5ff] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-[#00e5ff] hover:bg-[#00b0ff] disabled:bg-slate-800 disabled:text-gray-600 text-slate-950 p-2 rounded-xl transition-all font-bold flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
