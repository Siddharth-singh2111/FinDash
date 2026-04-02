import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export default function SummaryCard({ title, amount, icon: Icon, trend = 'neutral' }: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={cn(
        "p-4 rounded-full",
        trend === 'up' ? "bg-green-100 text-green-600" : 
        trend === 'down' ? "bg-red-100 text-red-600" : 
        "bg-blue-100 text-blue-600"
      )}>
        <Icon size={24} />
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{amount}</h3>
      </div>
    </div>
  );
}