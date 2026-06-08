export interface RoadmapPhase {
  id: number;
  name: string;
  emoji: string;
  weeks: string;
  summary: string;
  color: string;
}

export interface RoadmapProject {
  name: string;
  description: string;
  difficulty: number;
}

export interface RoadmapResource {
  title: string;
  platform: string;
  url: string;
  free: boolean;
}

export interface RoadmapMilestone {
  week: number;
  phase: number;
  title: string;
  topics: string[];
  project: RoadmapProject;
  resources: RoadmapResource[];
  hours: number;
  difficulty: number;
  skills: string[];
}

export interface SkillTreeNode {
  name: string;
  category: string;
  unlocksAtWeek: number;
}

export interface RoadmapData {
  name: string;
  goal: string;
  tagline: string;
  totalWeeks: number;
  totalProjects: number;
  hoursPerWeek: number;
  difficulty: number;
  phases: RoadmapPhase[];
  milestones: RoadmapMilestone[];
  skillTree: SkillTreeNode[];
  tips: string[];
}

export interface WizardData {
  skillLevel: 'beginner' | 'dabbler' | 'intermediate' | 'advanced' | '';
  knownTechs: string[];
  goal: string;
  customGoal: string;
  timeline: number;
  dailyHours: number;
  learningStyle: 'videos' | 'reading' | 'mix';
  budget: 'free' | 'paid';
  name: string;
}

export type AppPage = 'hero' | 'wizard' | 'loading' | 'roadmap';
