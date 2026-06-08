import type { RoadmapData, WizardData } from '../types/roadmap';

const GOAL_NAMES: Record<string, string> = {
  fullstack: 'Full-Stack Web Developer',
  mobile: 'Mobile App Developer',
  aiml: 'AI / ML Engineer',
  game: 'Game Developer',
  cyber: 'Cybersecurity Engineer',
  cloud: 'Cloud / DevOps Engineer',
  frontend: 'Frontend / UI Engineer',
  web3: 'Blockchain / Web3 Developer',
};

const SKILL_NAMES: Record<string, string> = {
  beginner: 'Complete Beginner',
  dabbler: 'Dabbler',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function buildPrompt(data: WizardData): string {
  return `Create a dev roadmap for someone who is: ${SKILL_NAMES[data.skillLevel] || data.skillLevel}, knows: ${data.knownTechs.join(', ') || 'nothing yet'}, wants to become: ${GOAL_NAMES[data.goal] || data.goal}${data.customGoal ? ` (${data.customGoal})` : ''}, has ${data.timeline} months, can study ${data.dailyHours} hours/day, prefers ${data.learningStyle} resources, budget: ${data.budget}, name: ${data.name}.

Return a JSON object with this exact structure:
{
  "name": string,
  "goal": string,
  "tagline": string,
  "totalWeeks": number,
  "totalProjects": number,
  "hoursPerWeek": number,
  "difficulty": number,
  "phases": [
    {
      "id": number,
      "name": string,
      "emoji": string,
      "weeks": string,
      "summary": string,
      "color": string
    }
  ],
  "milestones": [
    {
      "week": number,
      "phase": number,
      "title": string,
      "topics": [string],
      "project": { "name": string, "description": string, "difficulty": number },
      "resources": [{ "title": string, "platform": string, "url": string, "free": boolean }],
      "hours": number,
      "difficulty": number,
      "skills": [string]
    }
  ],
  "skillTree": [{ "name": string, "category": string, "unlocksAtWeek": number }],
  "tips": [string]
}`;
}

const SYSTEM_PROMPT = `You are an expert developer educator and curriculum designer. Generate a detailed, personalized developer learning roadmap in strict JSON format only. No markdown, no explanation — pure JSON.`;

export async function generateRoadmap(data: WizardData): Promise<RoadmapData> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return generateFallback(data);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildPrompt(data) }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.content?.[0]?.text;

    if (!text) throw new Error('Empty response');

    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    return validateRoadmap(parsed);
  } catch (err) {
    console.warn('Claude API failed, using fallback:', err);
    return generateFallback(data);
  }
}

function validateRoadmap(data: unknown): RoadmapData {
  const d = data as RoadmapData;
  return {
    name: d.name || 'Developer',
    goal: d.goal || 'Full-Stack Developer',
    tagline: d.tagline || 'Your personalized learning path',
    totalWeeks: d.totalWeeks || 12,
    totalProjects: d.totalProjects || 6,
    hoursPerWeek: d.hoursPerWeek || 10,
    difficulty: d.difficulty || 3,
    phases: (d.phases || []).map((p: RoadmapData['phases'][0]) => ({
      id: p.id,
      name: p.name,
      emoji: p.emoji || '📚',
      weeks: p.weeks,
      summary: p.summary,
      color: p.color || '#58A6FF',
    })),
    milestones: (d.milestones || []).map((m: RoadmapData['milestones'][0]) => ({
      week: m.week,
      phase: m.phase,
      title: m.title,
      topics: m.topics || [],
      project: m.project || { name: 'Practice Project', description: 'Build something', difficulty: 2 },
      resources: m.resources || [],
      hours: m.hours || 8,
      difficulty: m.difficulty || 3,
      skills: m.skills || [],
    })),
    skillTree: d.skillTree || [],
    tips: d.tips || [],
  };
}

function generateFallback(data: WizardData): RoadmapData {
  const goalName = GOAL_NAMES[data.goal] || data.goal;
  const totalWeeks = data.timeline * 4;
  const hoursPerWeek = Math.round(data.dailyHours * 7);

  const phases = [
    { id: 1, name: 'Foundation', emoji: '🧱', weeks: `Weeks 1–${Math.floor(totalWeeks * 0.25)}`, summary: 'Core fundamentals', color: '#58A6FF' },
    { id: 2, name: 'Core Skills', emoji: '⚡', weeks: `Weeks ${Math.floor(totalWeeks * 0.25) + 1}–${Math.floor(totalWeeks * 0.5)}`, summary: 'Language & framework mastery', color: '#BC8CFF' },
    { id: 3, name: 'Advanced', emoji: '🔥', weeks: `Weeks ${Math.floor(totalWeeks * 0.5) + 1}–${Math.floor(totalWeeks * 0.75)}`, summary: 'Complex patterns & architecture', color: '#79C0FF' },
    { id: 4, name: 'Portfolio', emoji: '🏆', weeks: `Weeks ${Math.floor(totalWeeks * 0.75) + 1}–${totalWeeks}`, summary: 'Real projects & job prep', color: '#3FB950' },
  ];

  const milestones: RoadmapData['milestones'] = [];
  const skillTree: RoadmapData['skillTree'] = [];

  const topicSets: Record<string, string[][]> = {
    fullstack: [['HTML & CSS basics', 'Semantic markup', 'Responsive design'], ['JavaScript fundamentals', 'DOM manipulation', 'Events'], ['React basics', 'Components', 'State management'], ['Node.js & Express', 'REST APIs', 'Database basics'], ['Authentication', 'Testing', 'Deployment'], ['Full-stack project', 'Portfolio prep']],
    mobile: [['Programming basics', 'Mobile UX concepts', 'Environment setup'], ['React Native / Flutter basics', 'Navigation', 'Components'], ['State management', 'APIs & data', 'Native features'], ['Testing', 'Performance', 'App store prep'], ['Portfolio app', 'Job prep']],
    aiml: [['Python fundamentals', 'Math basics', 'Data types'], ['NumPy & Pandas', 'Data visualization', 'Statistics'], ['Machine learning basics', 'Scikit-learn', 'Model evaluation'], ['Deep learning', 'Neural networks', 'TensorFlow/PyTorch'], ['ML project', 'Portfolio prep']],
    game: [['Programming basics', 'Game design principles', '2D coordinate systems'], ['Game engine basics', 'Sprites & animation', 'Input handling'], ['Physics & collision', 'Game AI', 'Audio'], ['3D basics', 'Shaders', 'Optimization'], ['Game project', 'Portfolio prep']],
    cyber: [['Networking basics', 'Linux fundamentals', 'Security concepts'], ['Cryptography', 'Vulnerability types', 'OWASP Top 10'], ['Penetration testing', 'Tools & frameworks', 'Incident response'], ['Security automation', 'Cloud security', 'Compliance'], ['Security project', 'Portfolio prep']],
    cloud: [['Linux & networking', 'Shell scripting', 'Version control'], ['Cloud platforms', 'Containers & Docker', 'CI/CD basics'], ['Kubernetes', 'Infrastructure as Code', 'Monitoring'], ['Security & compliance', 'Cost optimization', 'Architecture'], ['Cloud project', 'Portfolio prep']],
    frontend: [['HTML & CSS mastery', 'Responsive design', 'Accessibility'], ['JavaScript deep dive', 'DOM & events', 'ES6+ features'], ['React/Angular/Vue', 'State management', 'Component patterns'], ['Performance', 'Testing', 'Animation'], ['Design systems', 'Portfolio prep']],
    web3: [['Blockchain basics', 'Cryptocurrency concepts', 'Web3 ecosystem'], ['Solidity fundamentals', 'Smart contracts', 'Testing'], ['DApp development', 'Web3.js/Ethers.js', 'IPFS'], ['DeFi concepts', 'Security audits', 'Layer 2'], ['Web3 project', 'Portfolio prep']],
  };

  const goalTopics = topicSets[data.goal] || topicSets.fullstack;

  for (let w = 1; w <= totalWeeks; w++) {
    const phaseIdx = Math.min(Math.floor((w - 1) / (totalWeeks / 4)), phases.length - 1);
    const topicIdx = Math.min(Math.floor((w - 1) / (totalWeeks / goalTopics.length)), goalTopics.length - 1);
    const topics = goalTopics[topicIdx] || ['Practice & review'];

    const skills = topics.slice(0, 2);
    skills.forEach(s => {
      if (!skillTree.find(st => st.name === s)) {
        skillTree.push({ name: s, category: phaseIdx < 2 ? 'Frontend' : phaseIdx === 2 ? 'Backend' : 'Tools', unlocksAtWeek: w });
      }
    });

    milestones.push({
      week: w,
      phase: phases[phaseIdx].id,
      title: topics[0] || `Week ${w} Focus`,
      topics,
      project: {
        name: `${topics[0] || 'Practice'} Project`,
        description: `Build a project that demonstrates your understanding of ${topics.join(', ')}`,
        difficulty: Math.min(phaseIdx + 1, 5),
      },
      resources: topics.slice(0, 2).map(t => ({
        title: `${t} Guide`,
        platform: data.learningStyle === 'videos' ? 'YouTube' : 'MDN/docs',
        url: `https://developer.mozilla.org/en-US/docs/`,
        free: true,
      })),
      hours: hoursPerWeek,
      difficulty: phaseIdx + 1,
      skills,
    });
  }

  return {
    name: data.name || 'Developer',
    goal: goalName,
    tagline: `From ${SKILL_NAMES[data.skillLevel]} to ${goalName} in ${data.timeline} months`,
    totalWeeks,
    totalProjects: milestones.filter(m => m.project).length,
    hoursPerWeek,
    difficulty: data.skillLevel === 'beginner' ? 1 : data.skillLevel === 'dabbler' ? 2 : data.skillLevel === 'intermediate' ? 3 : 4,
    phases,
    milestones,
    skillTree,
    tips: [
      'Consistency beats intensity — study a little every day rather than cramming.',
      'Build projects alongside learning — application cements understanding.',
      "Don't skip the fundamentals — they're the foundation everything else rests on.",
      'Join a community — learning with others keeps you motivated.',
      'Review previous weeks regularly — spaced repetition improves retention.',
    ],
  };
}
