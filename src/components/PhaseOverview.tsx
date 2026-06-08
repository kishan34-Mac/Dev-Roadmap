import { motion } from 'framer-motion';
import type { RoadmapPhase } from '../types/roadmap';

interface PhaseOverviewProps {
  phases: RoadmapPhase[];
  completedWeeks: Set<number>;
  milestones: { week: number; phase: number }[];
}

const PHASE_COLORS = ['glass-panel-blue', 'glass-panel-purple', 'glass-panel-cyan', 'glass-panel-green', 'glass-panel-amber'];

export default function PhaseOverview({ phases, completedWeeks, milestones }: PhaseOverviewProps) {
  const isPhaseComplete = (phaseId: number) => {
    const phaseWeeks = milestones.filter(m => m.phase === phaseId).map(m => m.week);
    return phaseWeeks.length > 0 && phaseWeeks.every(w => completedWeeks.has(w));
  };

  const isPhaseStarted = (phaseId: number) => {
    return milestones.some(m => m.phase === phaseId && completedWeeks.has(m.week));
  };

  return (
    <div className="mb-8">
      <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">Phases</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {phases.map((phase, i) => {
          const complete = isPhaseComplete(phase.id);
          const started = isPhaseStarted(phase.id);
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel ${PHASE_COLORS[i % PHASE_COLORS.length]} rounded-xl p-4 min-w-[200px] snap-start flex-shrink-0 ${
                complete ? 'ring-1 ring-success/30' : started ? 'ring-1 ring-primary/30' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{phase.emoji}</span>
                <span className="text-xs font-mono text-gray-500">Phase {phase.id}</span>
                {complete && <span className="text-success text-xs">✓</span>}
              </div>
              <h3 className="font-mono font-semibold text-sm mb-1">{phase.name}</h3>
              <p className="text-[10px] font-mono text-gray-500 mb-2">{phase.weeks}</p>
              <p className="text-xs font-sans text-gray-400">{phase.summary}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
