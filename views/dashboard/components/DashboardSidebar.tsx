import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Settings, LogOut, ExternalLink, X, Globe, HelpCircle } from 'lucide-react';
import { RestaurantProfile } from '../../../types';

interface DashboardSidebarProps {
  profile: RestaurantProfile;
  activeTab: 'overview' | 'menu';
  onTabChange: (tab: 'overview' | 'menu') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  profile, 
  activeTab, 
  onTabChange, 
  onOpenSettings, 
  onLogout,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
  ] as const;

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[60] w-64 bg-[#0C0D0F] border-r border-white/[0.04] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300" 
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand Section */}
        <div className="p-6 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5E6AD2] flex items-center justify-center text-white shadow-[0_0_15px_-5px_rgba(94,106,210,0.5)]">
              <span className="text-[10px] font-bold">CK</span>
            </div>
            <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Kothay</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-[#444] hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          <div className="px-3 mb-2 mt-2">
             <p className="text-[9px] font-bold text-[#333] uppercase tracking-[0.2em]">Management</p>
          </div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                activeTab === item.id 
                  ? 'bg-white/[0.04] text-white shadow-sm' 
                  : 'text-[#8A8F98] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-[#5E6AD2]' : 'group-hover:text-[#5E6AD2] transition-colors'} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <div className="pt-6 px-3 mb-2">
             <p className="text-[9px] font-bold text-[#333] uppercase tracking-[0.2em]">Public View</p>
          </div>

          <a
            href={`#/menu/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8A8F98] hover:text-white hover:bg-white/[0.02] transition-all text-sm group"
          >
            <Globe size={18} className="group-hover:text-[#5E6AD2] transition-colors" />
            <span className="font-medium">Visit Public View</span>
            <ExternalLink size={12} className="ml-auto opacity-30" />
          </a>

          <div className="pt-6 px-3 mb-2">
             <p className="text-[9px] font-bold text-[#333] uppercase tracking-[0.2em]">Support</p>
          </div>

          <button 
            onClick={() => {
              navigate('/documentation');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8A8F98] hover:text-white hover:bg-white/[0.02] transition-all text-sm group"
          >
            <HelpCircle size={18} className="group-hover:text-[#5E6AD2] transition-colors" />
            <span className="font-medium">Documentation</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.04] space-y-1">
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8A8F98] hover:text-white hover:bg-white/[0.04] transition-all text-sm group"
          >
            <Settings size={18} className="group-hover:text-[#5E6AD2] transition-colors" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8A8F98] hover:text-red-400 hover:bg-red-500/[0.04] transition-all text-sm group"
          >
            <LogOut size={18} className="group-hover:text-red-400" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};