import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, LogOut, ChevronDown } from 'lucide-react';
import { RestaurantProfile } from '../../../types';

interface DashboardHeaderProps {
  profile: RestaurantProfile;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  profile, 
  onToggleSidebar, 
  onOpenSettings, 
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090A]/80 backdrop-blur-xl border-b border-white/[0.04] px-4 sm:px-8 py-4 flex items-center justify-between">
      {/* Left side: Toggle Icon */}
      <button 
        onClick={onToggleSidebar}
        className="p-2 -ml-2 text-[#8A8F98] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        aria-label="Toggle Navigation"
      >
        <Menu size={20} />
      </button>

      {/* Right side: Restaurant Identity with Dropdown */}
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="flex flex-col items-end hidden sm:flex">
            <h1 className="text-sm font-semibold text-white tracking-tight group-hover:text-[#5E6AD2] transition-colors">
              {profile.name}
            </h1>
            <span className="text-[10px] text-[#555] font-bold uppercase tracking-widest">Store Owner</span>
          </div>
          
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:border-[#5E6AD2]/50 transition-all">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#5E6AD2] text-[10px] font-bold uppercase tracking-tighter">
                  {profile.name.substring(0, 2)}
                </span>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0C0D0F] border border-white/10 flex items-center justify-center text-[#555] group-hover:text-white transition-colors ${isMenuOpen ? 'rotate-180 text-white' : ''}`}>
              <ChevronDown size={10} />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-[#0C0D0F] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right backdrop-blur-xl">
            <button
              onClick={() => {
                onOpenSettings();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#8A8F98] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Settings size={16} className="text-[#5E6AD2]" />
              <span className="font-medium">Edit Profile</span>
            </button>
            
            <div className="h-px bg-white/[0.04] my-1 mx-2" />
            
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#8A8F98] hover:text-red-400 hover:bg-red-500/[0.04] transition-colors"
            >
              <LogOut size={16} className="text-red-500/50" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};