import { type LucideIcon, Inbox } from 'lucide-react';

interface Props {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up">
      <div className="w-20 h-20 rounded-3xl gradient-teal flex items-center justify-center mb-6 animate-float">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-bold text-teal-800 mb-2">{title}</h3>
      <p className="text-teal-500 text-sm text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
