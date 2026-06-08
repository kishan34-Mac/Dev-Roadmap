import { motion } from 'framer-motion';
import { Share2, FileDown, RotateCcw, CheckCircle2 } from 'lucide-react';
import type { RoadmapData } from '../types/roadmap';

interface RoadmapHeaderProps {
  data: RoadmapData;
  completedWeeks: Set<number>;
  onShare: () => void;
  onExport: () => void;
  onStartOver: () => void;
}

export default function RoadmapHeader({ data, completedWeeks, onShare, onExport, onStartOver }: RoadmapHeaderProps) {
  const completed = completedWeeks.size;
  const total = data.totalWeeks;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="sticky top-0 z-40 glass-panel border-b border-space-500">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-mono font-bold gradient-text">
              {data.name}'s {data.goal} Roadmap
            </h1>
            <p className="text-xs font-sans text-gray-400">{data.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-4 mr-4 text-xs font-mono">
              <span className="text-gray-400">{total} <span className="text-gray-500">weeks</span></span>
              <span className="text-gray-400">{data.totalProjects} <span className="text-gray-500">projects</span></span>
              <span className="text-gray-400">{data.hoursPerWeek} <span className="text-gray-500">hrs/wk</span></span>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onShare} className="p-2 rounded-lg bg-space-700 border border-space-500 text-gray-400 hover:text-primary hover:border-primary/50 transition-all" title="Share">
              <Share2 size={16} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onExport} className="p-2 rounded-lg bg-space-700 border border-space-500 text-gray-400 hover:text-success hover:border-success/50 transition-all" title="Export PDF">
              <FileDown size={16} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onStartOver} className="p-2 rounded-lg bg-space-700 border border-space-500 text-gray-400 hover:text-danger hover:border-danger/50 transition-all" title="Start Over">
              <RotateCcw size={16} />
            </motion.button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-space-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-success rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-mono">
            <CheckCircle2 size={12} className="text-success" />
            <span className="text-success">{completed}</span>
            <span className="text-gray-500">/ {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
