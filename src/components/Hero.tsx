import { motion } from 'framer-motion';
import { ChevronDown, Zap, Calendar, BookOpen } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onResume: () => void;
  hasSavedRoadmap: boolean;
}

export default function Hero({ onGetStarted, onResume, hasSavedRoadmap }: HeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 scanline-effect">
      {hasSavedRoadmap && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-panel glass-panel-green rounded-lg px-6 py-3 flex items-center gap-3"
        >
          <span className="text-sm font-sans text-success">Resume your roadmap?</span>
          <button
            onClick={onResume}
            className="text-sm font-mono font-semibold text-success hover:text-white transition-colors"
          >
            Continue →
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 glass-panel rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-gray-400 tracking-wider">
            AI-POWERED • PERSONALIZED • FREE
          </span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-7xl font-mono font-bold text-center max-w-4xl leading-tight"
      >
        <span className="gradient-text-shimmer">Your path from zero to developer</span>
        <br />
        <span className="text-gray-400">— mapped by AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 text-lg sm:text-xl text-gray-400 font-sans text-center max-w-2xl"
      >
        Tell us where you are. Tell us where you want to go.
        <br className="hidden sm:block" />
        We'll build your exact roadmap.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onGetStarted}
        className="btn-glow mt-10 px-8 py-4 bg-primary/20 border border-primary/50 rounded-xl font-mono font-semibold text-primary text-lg hover:bg-primary/30 transition-all"
      >
        Generate My Roadmap →
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        {[
          { icon: Zap, label: 'Personalized to YOU', color: 'text-primary' },
          { icon: Calendar, label: 'Week-by-week plan', color: 'text-success' },
          { icon: BookOpen, label: 'Real resources & projects', color: 'text-purple' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 glass-panel rounded-lg px-4 py-2">
            <item.icon size={16} className={item.color} />
            <span className="text-sm font-sans text-gray-300">{item.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-gray-500" />
        </motion.div>
      </motion.div>
    </div>
  );
}
