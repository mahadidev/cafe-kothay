import { ArrowUpRight, Eye, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../../components/GlassCard';
import { storageService } from '../../../services/storage';
import { RestaurantProfile } from '../../../types';

export const TrendingList: React.FC = () => {
  const navigate = useNavigate();
  const [topProfiles, setTopProfiles] = useState<RestaurantProfile[]>([]);

  useEffect(() => {
    const fetchTop = async () => {
      const top = await storageService.getTopProfiles(6);
      setTopProfiles(top);
    };
    fetchTop();
  }, []);

  if (topProfiles.length === 0) return null;

  return (
    <div className="w-full animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 mt-24 px-1">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left sm:pl-1">
        <h2 className="text-[10px] font-bold text-[#333] uppercase tracking-[0.5em] mb-2">Trending Hubs</h2>
        <div className="w-8 h-[1px] bg-[#5E6AD2]/30 hidden sm:block" />
      </div>

      {/* Grid: 2 cards per row on sm+ screens */}
      <div className="grid grid-cols-1 gap-4">
        {topProfiles.map((profile, index) => (
          <div 
            key={profile.id}
            onClick={() => navigate(`/menu/${profile.slug}`)}
            className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GlassCard className="!p-4 !bg-[#0C0D0F] border-white/[0.04] hover:border-[#5E6AD2]/20 hover:bg-[#111215] transition-all duration-500 relative overflow-hidden h-full">
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Minimalist Logo Area */}
                <div className="w-14 h-14 rounded-xl bg-black border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#5E6AD2]/40 transition-all duration-500">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[12px] text-white font-bold opacity-20 uppercase tracking-tighter">
                      {profile.name.substring(0, 2)}
                    </span>
                  )}
                </div>

                {/* Information Hub */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-white truncate group-hover:text-[#5E6AD2] transition-colors duration-300 tracking-tight">
                      {profile.name}
                    </h3>
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-white/[0.02] border border-white/5 shrink-0">
                       <Eye size={10} className="text-[#333] group-hover:text-[#5E6AD2] transition-colors" />
                       <span className="text-[9px] font-mono font-bold text-[#333] group-hover:text-white transition-colors">
                        {profile.views}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <MapPin size={10} strokeWidth={2.5} className="text-[#222]" />
                    <span className="text-[9px] text-[#444] font-bold uppercase tracking-widest truncate">
                      {profile.location.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Indicator Icon */}
                <div className="hidden lg:flex w-8 h-8 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                   <ArrowUpRight size={14} className="text-[#5E6AD2]" />
                </div>
              </div>

              {/* Bottom Subtle Accent */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#5E6AD2]/40 to-transparent group-hover:w-full transition-all duration-1000 ease-in-out" />
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Footer Signature */}
      <div className="mt-16 text-center opacity-20">
        <p className="text-[8px] font-bold text-white uppercase tracking-[0.8em]">Curated Network</p>
      </div>
    </div>
  );
};