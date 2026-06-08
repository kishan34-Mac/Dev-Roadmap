import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const MESSAGES = [
  'Analyzing your skill profile...',
  'Calculating optimal learning sequence...',
  'Sourcing best resources for your goal...',
  'Building your week-by-week milestones...',
  'Calibrating difficulty curve...',
  'Finalizing your personalized roadmap...',
];

export default function LoadingScreen() {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const typeTimer = setInterval(() => {
      if (currentMsg >= MESSAGES.length) return;
      const msg = MESSAGES[currentMsg];
      if (charIndex < msg.length) {
        setCharIndex(prev => prev + 1);
      } else {
        setVisibleMessages(prev => [...prev, msg]);
        setCurrentMsg(prev => prev + 1);
        setCharIndex(0);
      }
    }, 40);

    return () => clearInterval(typeTimer);
  }, [currentMsg, charIndex]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, []);

  const displayMsg = currentMsg < MESSAGES.length ? MESSAGES[currentMsg].slice(0, charIndex) : '';

  return (
    <div className="fixed inset-0 bg-space-900/95 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg px-4"
      >
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-space-500">
            <div className="w-3 h-3 rounded-full bg-danger/80" />
            <div className="w-3 h-3 rounded-full bg-warning/80" />
            <div className="w-3 h-3 rounded-full bg-success/80" />
            <span className="ml-2 text-xs font-mono text-gray-500">ai-roadmap-generator</span>
          </div>

          <div className="p-6 min-h-[280px]">
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu size={40} className="text-primary" />
              </motion.div>
            </div>

            <div className="font-mono text-sm space-y-1.5">
              <span className="text-gray-500">$ </span>
              <span className="text-success">generate-roadmap</span>
              <span className="text-gray-500"> --ai-mode</span>
              <br /><br />
              {visibleMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-300">
                  <span className="text-success">✓</span> {msg}
                </motion.div>
              ))}
              {displayMsg && (
                <div className="text-gray-300">
                  <span className="text-primary">⟳</span> {displayMsg}
                  <span className="animate-typewriter">▌</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="w-full bg-space-600 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-cyan to-purple rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-xs font-mono text-gray-500 mt-2">
              Usually takes 10–15 seconds
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
