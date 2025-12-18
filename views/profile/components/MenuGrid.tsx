import { Calendar, Clock } from 'lucide-react';
import React, { useMemo } from 'react';
import { MenuItem } from '../../../types';

interface MenuGridProps {
  items: MenuItem[];
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  const groupedMenu = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [items]);

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedMenu).sort();
  }, [groupedMenu]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-32 animate-in fade-in duration-1000">
        <p className="text-[10px] text-[#222] font-bold uppercase tracking-[0.5em]">Inventory Currently Empty</p>
      </div>
    );
  }

  return (
		<div className="w-full max-w-2xl mx-auto space-y-18 pb-20">
			{sortedCategories.map((category) => (
				<section
					key={category}
					className="animate-in fade-in slide-in-from-bottom-6 duration-700"
				>
					{/* Subtle Category Header */}
					<div className="flex items-center gap-4 mb-8">
						<h2 className="text-[12px] font-bold text-[#5E6AD2] uppercase tracking-[0.3em] whitespace-nowrap">
							{category}
						</h2>
						<div className="w-full h-[1px] flex-1 bg-[#5E6AD2]" />
					</div>

					{/* List-style Menu Items */}
					<div className="space-y-6">
						{groupedMenu[category].map((item, idx) => (
							<div
								key={item.id}
								className={`group relative transition-all duration-500 ${
									!item.isAvailable
										? 'opacity-20 grayscale pointer-events-none'
										: 'opacity-100'
								}`}
							>
								{/* Main Row: Name and Price */}
								<div className="flex justify-between items-baseline gap-4 mb-2">
									<h3 className="text-base font-medium text-white group-hover:text-[#5E6AD2] transition-colors duration-300 tracking-tight">
										{item.name}
									</h3>

									{/* Subtle Spacer Dot Line */}
									<div className="flex-1 border-b border-white/[0.03] border-dotted h-[1px] mb-1.5 opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

									<span className="text-sm font-mono font-medium text-[#8A8F98] tabular-nums group-hover:text-white transition-colors">
										৳{item.price.toFixed(2)}
									</span>
								</div>

								{/* Sub Row: Description */}
								{item.description && (
									<p className="text-[13px] text-[#888] leading-relaxed font-light italic mb-3 max-w-[95%] group-hover:text-[#999] transition-colors duration-500">
										{item.description}
									</p>
								)}

								{/* Micro Metadata: Indicators */}
								<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
									{item.availableDate && (
										<div className="flex items-center gap-1.5 text-[8px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] group-hover:text-[#5E6AD2]/30 transition-colors">
											<Calendar size={10} strokeWidth={3} />
											<span>{formatDate(item.availableDate)}</span>
										</div>
									)}

									{(item.availableFrom || item.availableTo) && (
										<div className="flex items-center gap-1.5 text-[8px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] group-hover:text-[#5E6AD2]/30 transition-colors">
											<Clock size={10} strokeWidth={3} />
											<span>
												{item.availableFrom || '00:00'} —{' '}
												{item.availableTo || '23:59'}
											</span>
										</div>
									)}

									{!item.isAvailable && (
										<span className="text-[8px] font-bold text-red-500/10 uppercase tracking-[0.2em]">
											Private Selection
										</span>
									)}
								</div>

								{/* Active Dash Indicator (Appears on Hover) */}
								<div className="absolute -left-6 top-2 w-1.5 h-1.5 bg-[#5E6AD2] rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-[0_0_10px_#5E6AD2]" />
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
};