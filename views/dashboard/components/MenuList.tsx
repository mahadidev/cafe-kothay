import React, { useMemo } from 'react';
import { Plus, Edit2, Trash2, EyeOff, Clock, Calendar } from 'lucide-react';
import { MenuItem } from '../../../types';
import { GlassCard } from '../../../components/GlassCard';
import { Button } from '../../../components/Button';

interface MenuListProps {
  menu: MenuItem[];
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export const MenuList: React.FC<MenuListProps> = ({ menu, onAddItem, onEditItem, onDeleteItem }) => {
  // Group menu items by category
  const groupedMenu = useMemo(() => {
    return menu.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menu]);

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

  return (
    <div className="mb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Menu Management</h2>
          <p className="text-[11px] text-[#555] font-medium uppercase tracking-wider mt-0.5">Organize your offerings</p>
        </div>
        <Button onClick={onAddItem} variant="primary" className="!px-4 !h-10 rounded-xl flex items-center gap-2 group">
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-semibold">New Item</span>
        </Button>
      </div>

      <div className="space-y-12">
        {sortedCategories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/[0.05] rounded-2xl">
            <p className="text-sm text-[#444]">Your menu is empty. Add your first item to get started.</p>
          </div>
        ) : (
          sortedCategories.map(category => (
            <section key={category} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[10px] font-bold text-[#5E6AD2] uppercase tracking-[0.25em] whitespace-nowrap">
                  {category}
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-white/[0.08] to-transparent" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {groupedMenu[category].map(item => (
                  <div 
                    key={item.id} 
                    className={`relative group transition-all duration-300 ${!item.isAvailable ? 'opacity-60' : ''}`}
                  >
                    <GlassCard className="!p-0 overflow-hidden !bg-[#0C0D0F] border-white/[0.04] hover:border-white/[0.1] hover:shadow-2xl hover:shadow-[#5E6AD2]/5 group-hover:-translate-y-0.5 transition-all h-full">
                      <div className="flex items-stretch min-h-[110px] h-full">
                        {/* Left Status Bar */}
                        <div className={`w-1 shrink-0 ${item.isAvailable ? 'bg-[#5E6AD2]' : 'bg-[#333]'}`} />
                        
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          {/* Item Details */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {item.availableDate && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#A8B1FF]/10 border border-[#A8B1FF]/20">
                                    <Calendar size={10} className="text-[#A8B1FF]" />
                                    <span className="text-[9px] font-bold text-[#A8B1FF] uppercase tracking-wider">
                                        {formatDate(item.availableDate)}
                                    </span>
                                </div>
                              )}

                              {(item.availableFrom || item.availableTo) && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#5E6AD2]/10 border border-[#5E6AD2]/20">
                                    <Clock size={10} className="text-[#5E6AD2]" />
                                    <span className="text-[9px] font-bold text-[#A8B1FF] uppercase tracking-wider">
                                        {item.availableFrom || '00:00'} - {item.availableTo || '23:59'}
                                    </span>
                                </div>
                              )}

                              {!item.isAvailable && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20">
                                  <EyeOff size={10} className="text-red-400" />
                                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Hidden</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-start gap-4">
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-[#5E6AD2] transition-colors truncate">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-[#8A8F98] line-clamp-2 mt-1 font-light leading-relaxed">
                                  {item.description || 'No description provided.'}
                                </p>
                              </div>
                              <div className="text-sm font-mono font-medium text-white bg-white/[0.03] px-2 py-1 rounded-lg border border-white/[0.05] shrink-0">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.03]">
                            <button 
                              onClick={() => onEditItem(item)}
                              className="p-2 text-[#8A8F98] hover:text-[#5E6AD2] hover:bg-[#5E6AD2]/10 rounded-lg transition-all"
                              title="Edit Item"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => onDeleteItem(item.id)}
                              className="p-2 text-[#8A8F98] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};