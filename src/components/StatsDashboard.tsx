import { useRef } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import type { RoadmapData } from '../types/roadmap';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StatsDashboardProps {
  data: RoadmapData;
  completedWeeks: Set<number>;
}

const CHART_COLORS = {
  primary: '#58A6FF',
  success: '#3FB950',
  purple: '#BC8CFF',
  cyan: '#79C0FF',
  warning: '#D29922',
  danger: '#F85149',
};

export default function StatsDashboard({ data, completedWeeks }: StatsDashboardProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = [...new Set(data.skillTree.map(s => s.category))];
  const unlockedCount = (cat: string) =>
    data.skillTree.filter(s => s.category === cat && completedWeeks.has(s.unlocksAtWeek)).length;
  const totalCount = (cat: string) =>
    data.skillTree.filter(s => s.category === cat).length;

  const radarData = {
    labels: categories.length > 0 ? categories : ['Frontend', 'Backend', 'Tools', 'Concepts'],
    datasets: [{
      label: 'Skills Progress',
      data: categories.length > 0
        ? categories.map(cat => totalCount(cat) > 0 ? (unlockedCount(cat) / totalCount(cat)) * 100 : 0)
        : [0, 0, 0, 0],
      backgroundColor: 'rgba(88, 166, 255, 0.15)',
      borderColor: CHART_COLORS.primary,
      pointBackgroundColor: CHART_COLORS.primary,
      pointBorderColor: CHART_COLORS.primary,
      borderWidth: 2,
    }],
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false },
        grid: { color: 'rgba(48, 54, 61, 0.5)' },
        pointLabels: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const weekLabels = data.milestones.map(m => `W${m.week}`);
  const weekHours = data.milestones.map(m => m.hours);
  const weekCompleted = data.milestones.map(m => completedWeeks.has(m.week) ? m.hours : 0);

  const barData = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Planned Hours',
        data: weekHours,
        backgroundColor: 'rgba(88, 166, 255, 0.3)',
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Completed',
        data: weekCompleted,
        backgroundColor: 'rgba(63, 185, 80, 0.4)',
        borderColor: CHART_COLORS.success,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } },
        grid: { color: 'rgba(48, 54, 61, 0.3)' },
      },
      y: {
        ticks: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 9 } },
        grid: { color: 'rgba(48, 54, 61, 0.3)' },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  };

  return (
    <div ref={sectionRef} className="mt-12 mb-8">
      <h2 className="text-sm font-mono text-gray-400 mb-4 uppercase tracking-wider">Stats Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel glass-panel-blue rounded-xl p-6">
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">Skills Balance</h3>
          <div className="max-w-xs mx-auto">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="glass-panel glass-panel-green rounded-xl p-6">
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">Hours Per Week</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {data.tips.length > 0 && (
        <div className="glass-panel glass-panel-amber rounded-xl p-6 mt-6">
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">Tips for Success</h3>
          <ul className="space-y-2">
            {data.tips.map((tip, i) => (
              <li key={i} className="text-sm font-sans text-gray-300 flex gap-2">
                <span className="text-warning flex-shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
