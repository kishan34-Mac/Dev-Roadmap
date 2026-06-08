import { motion, AnimatePresence } from 'framer-motion';
import type { SkillTreeNode } from '../types/roadmap';

interface SkillTreeProps {
  skills: SkillTreeNode[];
  completedWeeks: Set<number>;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: '#58A6FF',
  Backend: '#3FB950',
  Tools: '#D29922',
  Concepts: '#BC8CFF',
  DevOps: '#79C0FF',
  Mobile: '#3FB950',
  AI: '#BC8CFF',
  Security: '#F85149',
};

export default function SkillTree({ skills, completedWeeks, isOpen, onToggle }: SkillTreeProps) {
  const isUnlocked = (skill: SkillTreeNode) => completedWeeks.has(skill.unlocksAtWeek);

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-30 glass-panel glass-panel-purple rounded-lg p-2 text-purple hover:bg-purple/10 transition-all no-print"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="4" r="2" fill="currentColor" />
          <circle cx="4" cy="12" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
          <circle cx="10" cy="17" r="2" fill="currentColor" />
          <line x1="10" y1="6" x2="4" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="6" x2="16" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="4" y1="14" x2="10" y2="15" stroke="currentColor" strokeWidth="1" />
          <line x1="16" y1="14" x2="10" y2="15" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-80 glass-panel border-l border-space-500 z-40 overflow-y-auto p-4 no-print"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-mono font-bold gradient-text">Skill Tree</h2>
              <button onClick={onToggle} className="text-gray-500 hover:text-gray-300 text-xs font-mono">✕</button>
            </div>

            <div className="space-y-4">
              {categories.map(cat => {
                const catSkills = skills.filter(s => s.category === cat);
                const color = CATEGORY_COLORS[cat] || '#58A6FF';
                return (
                  <div key={cat}>
                    <h3 className="text-xs font-mono font-semibold mb-2" style={{ color }}>{cat}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {catSkills.map(skill => {
                        const unlocked = isUnlocked(skill);
                        return (
                          <motion.div
                            key={skill.name}
                            whileHover={{ scale: 1.05 }}
                            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                              unlocked
                                ? 'bg-success/10 border-success/30 text-success'
                                : 'bg-space-700 border-space-500 text-gray-500'
                            }`}
                            title={unlocked ? `Unlocked at Week ${skill.unlocksAtWeek}` : `Unlocks at Week ${skill.unlocksAtWeek}`}
                          >
                            {skill.name}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
