import React from 'react';
import { TrendingUp } from 'lucide-react';
import { GlassCard } from '../../../components/GlassCard';

interface AnalyticsStatsProps {
  views: number;
}

export const AnalyticsStats: React.FC<AnalyticsStatsProps> = ({ views }) => {
  return (
    <GlassCard className="mb-8 relative overflow-hidden group !bg-gradient-to-br !from-[#15171B] !to-[#0C0D0F]">
      <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 transition-opacity">
        <TrendingUp size={100} />
      </div>
      <h3 className="text-[10px] font-semibold text-[#8A8F98] uppercase tracking-widest mb-3">Total Profile Views</h3>
      <div className="text-5xl font-light text-white tracking-tight">{views}</div>
      <div className="mt-5 text-xs text-[#5E6AD2] font-medium flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] shadow-[0_0_8px_rgba(94,106,210,0.8)]"></span>
        Live Analytics
      </div>
    </GlassCard>
  );
};