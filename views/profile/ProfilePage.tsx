import { AlertCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuGrid } from './components/MenuGrid';
import { ProfileHeader } from './components/ProfileHeader';
import { SearchBar } from './components/SearchBar';
import { useProfileData } from './hooks/useProfileData';

export const ProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile, menu, loading } = useProfileData(slug);
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menu.map(item => item.category)));
    return ['All', ...cats];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchQuery]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090A]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#5E6AD2]/20 border-t-[#5E6AD2] rounded-full animate-spin" />
            <p className="text-[10px] text-[#444] font-bold uppercase tracking-[0.5em]">Syncing Menu</p>
        </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#08090A] p-6 text-center">
       <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8">
          <AlertCircle className="text-red-400/20" size={24} />
       </div>
       <h2 className="text-white text-xl font-light mb-2 tracking-tight">Access Denied</h2>
       <p className="text-[11px] text-[#444] uppercase tracking-widest font-bold mb-10">This profile is currently unlisted.</p>
       <a href="/" className="text-[11px] text-[#5E6AD2] font-bold uppercase tracking-[0.3em] py-3 px-8 bg-[#5E6AD2]/10 rounded-xl hover:bg-[#5E6AD2]/20 transition-all">Go Home</a>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-[#08090A] text-[#E0E0E0] selection:bg-[#5E6AD2]/30 font-sans pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#5E6AD2]/[0.05] via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#5E6AD2]/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full max-w-4xl px-4 sm:px-6">
            <ProfileHeader profile={profile} />
            
            {/* Control Hub: Navigation + Search */}
            <div className="sticky top-6 z-50 mb-12 flex flex-col items-center gap-4 animate-in slide-in-from-top-4 duration-700">
               <div className="w-full max-w-2xl bg-white/1 backdrop-blur-2xl border border-white/5 p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 min-w-0">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  <div className="h-px sm:h-auto sm:w-px bg-white/5 mx-1" />
                  <div className="overflow-x-auto no-scrollbar">
                    <CategoryFilter 
                        categories={categories} 
                        activeCategory={activeCategory} 
                        onSelectCategory={setActiveCategory} 
                    />
                  </div>
               </div>
            </div>
            
            <MenuGrid items={filteredMenu} />

            <footer className="mt-24 text-center">
              <div className="w-8 h-[1px] bg-white/10 mx-auto mb-6" />
              <p className="text-[#1A1A1A] text-[9px] uppercase tracking-[0.6em] font-bold mb-4">
                PLATFORM POWERED BY CAFE KOTHAY
              </p>
              <p className="text-[10px] text-[#444] font-medium tracking-tight">
                Developed by <a href="https://mahadidev.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#5E6AD2] hover:text-[#7C87E8] transition-colors underline underline-offset-4 decoration-[#5E6AD2]/30">Mahadi Hasan</a>
              </p>
            </footer>
        </div>
      </div>
    </div>
  );
};