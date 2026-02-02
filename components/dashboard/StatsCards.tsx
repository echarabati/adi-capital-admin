/**
 * Stats Cards Component
 *
 * Displays key metrics in a row of cards.
 * Uses mock data for demonstration.
 */

import { Users, DollarSign, BarChart3, TrendingUp } from 'lucide-react';

interface StatCard {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Mock stats data
const stats: StatCard[] = [
  {
    name: 'Usuarios',
    value: '127',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Ingresos',
    value: '$4,580',
    change: '+8.2%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Activos',
    value: '89%',
    change: '-2%',
    changeType: 'negative',
    icon: BarChart3,
  },
  {
    name: 'Crecimiento',
    value: '+23%',
    change: 'vs mes anterior',
    changeType: 'neutral',
    icon: TrendingUp,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-card rounded-xl border border-white/10 p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="bg-primary/10 rounded-lg p-2">
              <stat.icon className="text-primary h-5 w-5" />
            </div>
            <span
              className={`text-xs font-medium ${
                stat.changeType === 'positive'
                  ? 'text-green-500'
                  : stat.changeType === 'negative'
                    ? 'text-red-500'
                    : 'text-muted-foreground'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-muted-foreground text-sm">{stat.name}</p>
            <p className="text-foreground text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
