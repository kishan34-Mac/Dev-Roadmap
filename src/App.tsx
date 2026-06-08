import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from './components/Starfield';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import Wizard from './components/Wizard';
import LoadingScreen from './components/LoadingScreen';
import RoadmapHeader from './components/RoadmapHeader';
import PhaseOverview from './components/PhaseOverview';
import MilestoneTimeline from './components/MilestoneTimeline';
import SkillTree from './components/SkillTree';
import StatsDashboard from './components/StatsDashboard';
import PhaseCompleteOverlay from './components/PhaseCompleteOverlay';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateRoadmap } from './services/api';
import type { AppPage, RoadmapData, WizardData } from './types/roadmap';

const STORAGE_KEY = 'dev-roadmap-data';
const PROGRESS_KEY = 'dev-roadmap-progress';

export default function App() {
  const [page, setPage] = useState<AppPage>('hero');
  const [roadmap, setRoadmap] = useLocalStorage<RoadmapData | null>(STORAGE_KEY, null);
  const [completedWeeks, setCompletedWeeks] = useLocalStorage<Set<number>>(PROGRESS_KEY, new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedPhase, setCompletedPhase] = useState<{ name: string; emoji: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasSavedRoadmap = roadmap !== null;

  const handleGetStarted = useCallback(() => setPage('wizard'), []);

  const handleResume = useCallback(() => {
    if (roadmap) setPage('roadmap');
  }, [roadmap]);

  const handleWizardComplete = useCallback(async (data: WizardData) => {
    setPage('loading');
    setError(null);
    try {
      const result = await generateRoadmap(data);
      setRoadmap(result);
      setCompletedWeeks(new Set());
      setPage('roadmap');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
      setPage('hero');
    }
  }, [setRoadmap, setCompletedWeeks]);

  const handleToggleComplete = useCallback((week: number) => {
    setCompletedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(week)) {
        next.delete(week);
      } else {
        next.add(week);
      }
      return next;
    });
  }, [setCompletedWeeks]);

  // Check for phase completions
  useEffect(() => {
    if (!roadmap) return;
    for (const phase of roadmap.phases) {
      const phaseWeeks = roadmap.milestones.filter(m => m.phase === phase.id).map(m => m.week);
      if (phaseWeeks.length > 0 && phaseWeeks.every(w => completedWeeks.has(w))) {
        if (!completedPhase || completedPhase.name !== phase.name) {
          setCompletedPhase({ name: phase.name, emoji: phase.emoji });
          setTimeout(() => setCompletedPhase(null), 3500);
        }
      }
    }
  }, [completedWeeks, roadmap, completedPhase]);

  const handleShare = useCallback(() => {
    if (!roadmap) return;
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify({ roadmap, completedWeeks: [...completedWeeks] })));
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      navigator.clipboard.writeText(url);
    } catch {
      // fallback — do nothing
    }
  }, [roadmap, completedWeeks]);

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  const handleStartOver = useCallback(() => {
    if (window.confirm('Are you sure you want to start over? This will clear your current roadmap and progress.')) {
      setRoadmap(null);
      setCompletedWeeks(new Set());
      setPage('hero');
    }
  }, [setRoadmap, setCompletedWeeks]);

  // Load shared data from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(atob(data)));
        if (parsed.roadmap) {
          setRoadmap(parsed.roadmap);
          if (parsed.completedWeeks) {
            setCompletedWeeks(new Set(parsed.completedWeeks));
          }
          setPage('roadmap');
        }
      } catch {
        // invalid data, ignore
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-space-900 font-sans text-gray-200 relative">
      <Starfield />
      <CustomCursor />

      <AnimatePresence mode="wait">
        {page === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Hero onGetStarted={handleGetStarted} onResume={handleResume} hasSavedRoadmap={hasSavedRoadmap} />
            {error && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 glass-panel glass-panel-amber rounded-lg px-6 py-3 text-sm font-mono text-warning z-50">
                {error} — Try again or use offline mode.
              </div>
            )}
          </motion.div>
        )}

        {page === 'wizard' && (
          <motion.div key="wizard" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
            <Wizard onComplete={handleWizardComplete} onBack={() => setPage('hero')} />
          </motion.div>
        )}

        {page === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingScreen />
          </motion.div>
        )}

        {page === 'roadmap' && roadmap && (
          <motion.div key="roadmap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <RoadmapHeader
              data={roadmap}
              completedWeeks={completedWeeks}
              onShare={handleShare}
              onExport={handleExport}
              onStartOver={handleStartOver}
            />
            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
              <PhaseOverview
                phases={roadmap.phases}
                completedWeeks={completedWeeks}
                milestones={roadmap.milestones}
              />
              <MilestoneTimeline
                milestones={roadmap.milestones}
                phases={roadmap.phases}
                completedWeeks={completedWeeks}
                onToggleComplete={handleToggleComplete}
              />
              <StatsDashboard data={roadmap} completedWeeks={completedWeeks} />
            </div>
            <SkillTree
              skills={roadmap.skillTree}
              completedWeeks={completedWeeks}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(prev => !prev)}
            />
            <PhaseCompleteOverlay
              phaseName={completedPhase?.name || ''}
              phaseEmoji={completedPhase?.emoji || ''}
              visible={completedPhase !== null}
              onDismiss={() => setCompletedPhase(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
