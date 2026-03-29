import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: 'teal' | 'green' | 'mint' | 'dark';
  delay?: number;
}

const gradients = {
  teal: 'from-teal-500 to-teal-600',
  green: 'from-green-400 to-green-600',
  mint: 'from-mint-400 to-teal-500',
  dark: 'from-teal-700 to-teal-800',
};

const iconBg = {
  teal: 'bg-white/20',
  green: 'bg-white/20',
  mint: 'bg-white/20',
  dark: 'bg-white/15',
};

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  delay = 0,
}: Props) {
  return (
    <div
      className="animate-fade-in-up opacity-0 card-hover"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div
        className={`bg-gradient-to-br ${gradients[gradient]} rounded-2xl p-6 text-white
        relative overflow-hidden shadow-lg`}
      >
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${iconBg[gradient]} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mb-1">{value}</div>
          <div className="text-sm font-semibold text-white/80">{title}</div>
          {subtitle && (
            <div className="text-xs text-white/60 mt-1 font-medium">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}
