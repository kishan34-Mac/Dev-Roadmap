import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Rocket, Monitor, Smartphone, Brain, Gamepad2, Shield, Cloud, Palette, Link } from 'lucide-react';
import type { WizardData } from '../types/roadmap';

const SKILL_LEVELS = [
  { id: 'beginner' as const, emoji: '🌱', title: 'Complete Beginner', desc: "I've never written code before" },
  { id: 'dabbler' as const, emoji: '🔰', title: 'Dabbler', desc: 'I know some basics: HTML, a tiny bit of Python maybe' },
  { id: 'intermediate' as const, emoji: '⚡', title: 'Intermediate', desc: 'I can build small projects, know 1-2 languages' },
  { id: 'advanced' as const, emoji: '🔥', title: 'Advanced', desc: "I'm experienced, switching specializations or leveling up" },
];

const TECH_TAGS = ['HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Node', 'SQL', 'Git', 'TypeScript', 'Java', 'C++', 'Rust'];

const GOALS = [
  { id: 'fullstack', icon: Monitor, title: 'Full-Stack Web Developer', desc: 'Build complete web applications end-to-end', color: '#58A6FF' },
  { id: 'mobile', icon: Smartphone, title: 'Mobile App Developer', desc: 'React Native / Flutter apps', color: '#3FB950' },
  { id: 'aiml', icon: Brain, title: 'AI / ML Engineer', desc: 'Machine learning & intelligent systems', color: '#BC8CFF' },
  { id: 'game', icon: Gamepad2, title: 'Game Developer', desc: 'Build interactive gaming experiences', color: '#F85149' },
  { id: 'cyber', icon: Shield, title: 'Cybersecurity Engineer', desc: 'Protect systems & find vulnerabilities', color: '#D29922' },
  { id: 'cloud', icon: Cloud, title: 'Cloud / DevOps Engineer', desc: 'Infrastructure, CI/CD, scalability', color: '#79C0FF' },
  { id: 'frontend', icon: Palette, title: 'Frontend / UI Engineer', desc: 'Craft beautiful, performant interfaces', color: '#58A6FF' },
  { id: 'web3', icon: Link, title: 'Blockchain / Web3 Developer', desc: 'Decentralized apps & smart contracts', color: '#BC8CFF' },
];

interface WizardProps {
  onComplete: (data: WizardData) => void;
  onBack: () => void;
}

export default function Wizard({ onComplete, onBack }: WizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    skillLevel: '',
    knownTechs: [],
    goal: '',
    customGoal: '',
    timeline: 6,
    dailyHours: 2,
    learningStyle: 'mix',
    budget: 'free',
    name: '',
  });

  const update = <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleTech = (tech: string) => {
    setData(prev => ({
      ...prev,
      knownTechs: prev.knownTechs.includes(tech)
        ? prev.knownTechs.filter(t => t !== tech)
        : [...prev.knownTechs, tech],
    }));
  };

  const canProceed = () => {
    if (step === 1) return data.skillLevel !== '';
    if (step === 2) return data.goal !== '';
    return data.name.trim() !== '';
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-4xl mx-auto relative z-10">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 font-mono text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to home
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300 ${
                s <= step ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-space-700 text-gray-500 border border-space-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 transition-colors duration-300 ${s < step ? 'bg-primary/50' : 'bg-space-600'}`} />}
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-gray-500">Step {step} of 3</p>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold gradient-text mb-2">Where are you now?</h2>
            <p className="text-gray-400 font-sans mb-6">What's your current skill level?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {SKILL_LEVELS.map(level => (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => update('skillLevel', level.id)}
                  className={`glass-panel rounded-xl p-4 text-left transition-all duration-200 ${
                    data.skillLevel === level.id
                      ? 'glass-panel-blue shadow-lg shadow-primary/10 border-primary/50'
                      : 'hover:border-gray-500'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{level.emoji}</span>
                  <h3 className="font-mono font-semibold text-sm mb-1">{level.title}</h3>
                  <p className="text-xs text-gray-400 font-sans">{level.desc}</p>
                  {data.skillLevel === level.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            <p className="text-sm font-mono text-gray-400 mb-3">What have you touched?</p>
            <div className="flex flex-wrap gap-2">
              {TECH_TAGS.map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                    data.knownTechs.includes(tech)
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-space-700 text-gray-400 border border-space-500 hover:border-gray-400'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold gradient-text mb-2">Where do you want to go?</h2>
            <p className="text-gray-400 font-sans mb-6">What's your developer dream?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {GOALS.map(goal => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => update('goal', goal.id)}
                  className={`glass-panel rounded-xl p-4 text-left transition-all duration-200 relative ${
                    data.goal === goal.id ? 'border-opacity-100' : 'hover:border-gray-500'
                  }`}
                  style={data.goal === goal.id ? { borderTopColor: goal.color, borderColor: goal.color + '40' } : {}}
                >
                  <goal.icon size={24} style={{ color: goal.color }} className="mb-2" />
                  <h3 className="font-mono font-semibold text-xs mb-1">{goal.title}</h3>
                  <p className="text-[10px] text-gray-400 font-sans">{goal.desc}</p>
                </motion.button>
              ))}
            </div>
            <div>
              <p className="text-sm font-mono text-gray-400 mb-2">Anything specific you want to build?</p>
              <textarea
                value={data.customGoal}
                onChange={e => update('customGoal', e.target.value)}
                placeholder="e.g., 'I want to build a SaaS app for freelance designers'"
                className="w-full bg-space-700 border border-space-500 rounded-lg p-3 text-sm font-sans text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/50 resize-none h-20"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold gradient-text mb-2">Set your parameters</h2>
            <p className="text-gray-400 font-sans mb-6">Fine-tune your roadmap</p>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-mono text-gray-300 mb-2 block">
                  Timeline: <span className="text-primary">{data.timeline} month{data.timeline !== 1 ? 's' : ''}</span>
                </label>
                <input
                  type="range" min={1} max={12} step={1}
                  value={data.timeline}
                  onChange={e => update('timeline', parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                  <span>1 month</span><span>6 months</span><span>12 months</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-mono text-gray-300 mb-2 block">
                  Daily study time: <span className="text-primary">{data.dailyHours} hr{data.dailyHours !== 1 ? 's' : ''}</span>
                </label>
                <input
                  type="range" min={0.5} max={8} step={0.5}
                  value={data.dailyHours}
                  onChange={e => update('dailyHours', parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                  <span>0.5 hrs</span><span>4 hrs</span><span>8 hrs</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-mono text-gray-300 mb-2">Learning style</p>
                <div className="flex gap-2">
                  {(['videos', 'reading', 'mix'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => update('learningStyle', style)}
                      className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                        data.learningStyle === style
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'bg-space-700 text-gray-400 border border-space-500 hover:border-gray-400'
                      }`}
                    >
                      {style === 'videos' ? '🎬 Videos' : style === 'reading' ? '📖 Reading' : '🔄 Mix'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-mono text-gray-300 mb-2">Budget</p>
                <div className="flex gap-2">
                  {(['free', 'paid'] as const).map(b => (
                    <button
                      key={b}
                      onClick={() => update('budget', b)}
                      className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                        data.budget === b
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'bg-space-700 text-gray-400 border border-space-500 hover:border-gray-400'
                      }`}
                    >
                      {b === 'free' ? '🆓 Free only' : '💰 Pay OK'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono text-gray-300 mb-2 block">What should we call you, developer?</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-space-700 border border-space-500 rounded-lg px-4 py-3 text-sm font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center">
        {step > 1 ? (
          <button onClick={() => goStep(step - 1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 font-mono text-sm transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!canProceed()}
            onClick={() => goStep(step + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-primary/20 border border-primary/50 rounded-lg font-mono text-primary text-sm hover:bg-primary/30 transition-all disabled:opacity-30 disabled:hover:bg-primary/20 disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={16} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!canProceed()}
            onClick={() => onComplete(data)}
            className="btn-glow flex items-center gap-2 px-8 py-3 bg-primary/20 border border-primary/50 rounded-lg font-mono text-primary text-sm hover:bg-primary/30 transition-all disabled:opacity-30 disabled:hover:bg-primary/20 disabled:cursor-not-allowed"
          >
            <Rocket size={16} /> Generate My Roadmap
          </motion.button>
        )}
      </div>
    </div>
  );
}
