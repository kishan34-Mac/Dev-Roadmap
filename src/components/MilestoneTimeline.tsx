import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Clock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RoadmapMilestone, RoadmapPhase } from '../types/roadmap';

interface MilestoneTimelineProps {
  milestones: RoadmapMilestone[];
  phases: RoadmapPhase[];
  completedWeeks: Set<number>;
  onToggleComplete: (week: number) => void;
}

const PHASE_ACCENT_MAP: Record<number, string> = {
  1: '#58A6FF',
  2: '#BC8CFF',
  3: '#79C0FF',
  4: '#3FB950',
  5: '#D29922',
};

export default function MilestoneTimeline({ milestones, phases, completedWeeks, onToggleComplete }: MilestoneTimelineProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (week: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  };

  const handleComplete = (week: number) => {
    const wasComplete = completedWeeks.has(week);
    onToggleComplete(week);
    if (!wasComplete) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#58A6FF', '#3FB950', '#BC8CFF', '#79C0FF'],
      });
    }
  };

  const getPhaseColor = (phaseId: number) => PHASE_ACCENT_MAP[phaseId] || '#58A6FF';

  const getPhaseName = (phaseId: number) => phases.find(p => p.id === phaseId)?.name ?? '';

  const difficultyDots = (n: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(d => (
        <div key={d} className={`w-1.5 h-1.5 rounded-full ${d <= n ? 'bg-warning' : 'bg-space-600'}`} />
      ))}
    </div>
  );

  return (
    <div className="relative">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line md:-translate-x-px" />

      <div className="space-y-6">
        {milestones.map((ms, idx) => {
          const isComplete = completedWeeks.has(ms.week);
          const isExpanded = expanded.has(ms.week);
          const accentColor = getPhaseColor(ms.phase);
          const isLeft = idx % 2 === 0;

          return (
            <motion.div
              key={ms.week}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex items-start gap-4 md:gap-0"
            >
              {/* Desktop layout */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 w-full items-start">
                {/* Left side */}
                <div className={`flex ${isLeft ? 'justify-end' : ''}`}>
                  {isLeft ? (
                    <MilestoneCard
                      ms={ms}
                      isComplete={isComplete}
                      isExpanded={isExpanded}
                      accentColor={accentColor}
                      phaseName={getPhaseName(ms.phase)}
                      onToggleExpand={() => toggleExpand(ms.week)}
                      onComplete={() => handleComplete(ms.week)}
                      difficultyDots={difficultyDots}
                    />
                  ) : <div />}
                </div>

                {/* Center node */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      isComplete
                        ? 'bg-success/20 border-success text-success'
                        : 'border-primary/40 text-primary bg-space-800'
                    }`}
                    style={!isComplete ? { boxShadow: `0 0 15px ${accentColor}40` } : {}}
                  >
                    {isComplete ? '✓' : ms.week}
                  </div>
                </div>

                {/* Right side */}
                <div className={`flex ${!isLeft ? 'justify-start' : ''}`}>
                  {!isLeft ? (
                    <MilestoneCard
                      ms={ms}
                      isComplete={isComplete}
                      isExpanded={isExpanded}
                      accentColor={accentColor}
                      phaseName={getPhaseName(ms.phase)}
                      onToggleExpand={() => toggleExpand(ms.week)}
                      onComplete={() => handleComplete(ms.week)}
                      difficultyDots={difficultyDots}
                    />
                  ) : <div />}
                </div>
              </div>

              {/* Mobile layout */}
              <div className="md:hidden flex items-start gap-4 w-full">
                <div className="flex flex-col items-center relative z-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      isComplete
                        ? 'bg-success/20 border-success text-success'
                        : 'border-primary/40 text-primary bg-space-800'
                    }`}
                    style={!isComplete ? { boxShadow: `0 0 15px ${accentColor}40` } : {}}
                  >
                    {isComplete ? '✓' : ms.week}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <MilestoneCard
                    ms={ms}
                    isComplete={isComplete}
                    isExpanded={isExpanded}
                    accentColor={accentColor}
                    phaseName={getPhaseName(ms.phase)}
                    onToggleExpand={() => toggleExpand(ms.week)}
                    onComplete={() => handleComplete(ms.week)}
                    difficultyDots={difficultyDots}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface MilestoneCardProps {
  ms: RoadmapMilestone;
  isComplete: boolean;
  isExpanded: boolean;
  accentColor: string;
  phaseName: string;
  onToggleExpand: () => void;
  onComplete: () => void;
  difficultyDots: (n: number) => React.ReactNode;
}

function MilestoneCard({ ms, isComplete, isExpanded, accentColor, phaseName, onToggleExpand, onComplete, difficultyDots }: MilestoneCardProps) {
  return (
    <motion.div
      layout
      className={`glass-panel rounded-xl overflow-hidden max-w-md w-full transition-shadow duration-300 hover:shadow-lg`}
      style={{ borderTopColor: accentColor, boxShadow: isComplete ? `0 0 20px rgba(63,185,80,0.1)` : undefined }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{phaseName}</span>
            <h3 className={`font-mono font-semibold text-sm ${isComplete ? 'text-success line-through opacity-70' : 'text-gray-200'}`}>
              Week {ms.week} — {ms.title}
            </h3>
          </div>
          <button onClick={onToggleExpand} className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Clock size={10} /> {ms.hours}h</span>
          <span className="flex items-center gap-1"><Star size={10} /> {difficultyDots(ms.difficulty)}</span>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-3">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Topics</p>
                <div className="flex flex-wrap gap-1">
                  {ms.topics.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-space-600 text-gray-300 font-sans">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mb-3 p-3 rounded-lg bg-space-800/50 border border-space-600">
                <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">Project</p>
                <h4 className="font-mono font-semibold text-xs text-gray-200">{ms.project.name}</h4>
                <p className="text-[10px] text-gray-400 font-sans mt-1">{ms.project.description}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-mono text-gray-500">Difficulty:</span>
                  {difficultyDots(ms.project.difficulty)}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Resources</p>
                <div className="space-y-1">
                  {ms.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-300 hover:text-primary transition-colors group">
                      <ExternalLink size={10} className="text-gray-500 group-hover:text-primary" />
                      <span className="font-sans">{r.title}</span>
                      <span className="text-[10px] font-mono text-gray-500">({r.platform})</span>
                      {r.free && <span className="text-[10px] font-mono text-success">free</span>}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Skills Unlocked</p>
                <div className="flex flex-wrap gap-1">
                  {ms.skills.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className={`w-full mt-2 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 ${
            isComplete
              ? 'bg-success/10 border border-success/30 text-success hover:bg-success/20'
              : 'bg-space-700 border border-space-500 text-gray-400 hover:text-primary hover:border-primary/30'
          }`}
        >
          {isComplete ? '✓ Completed' : 'Mark as complete'}
        </motion.button>
      </div>
    </motion.div>
  );
}
