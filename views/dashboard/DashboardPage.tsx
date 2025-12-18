import React, { useState, useMemo } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardSidebar } from './components/DashboardSidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { AnalyticsStats } from './components/AnalyticsStats';
import { QRCodeShare } from './components/QRCodeShare';
import { MenuList } from './components/MenuList';
import { ItemModal } from './components/ItemModal';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingSetup } from './components/OnboardingSetup';
import { storageService } from '../../services/storage';
import { MenuItem } from '../../types';
import { MenuItemFormData, ProfileFormData } from './types';

interface DashboardPageProps {
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const { profile, menu, loading, refreshData } = useDashboardData();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'menu'>('overview');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [creatingProfile, setCreatingProfile] = useState(false);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(menu.map(item => item.category))).sort();
  }, [menu]);

  // --- Handlers ---

  const handleCreateProfile = async (data: ProfileFormData) => {
    setCreatingProfile(true);
    const success = await storageService.createProfile(data);
    if (success) {
      await refreshData();
    } else {
      alert('Failed to create profile. Please try again.');
    }
    setCreatingProfile(false);
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    const result = await storageService.updateProfile(data);
    if (!result.success) {
      alert(`Update failed: ${result.message}`);
    } else {
      await refreshData();
    }
  };

  const handleSaveItem = async (data: MenuItemFormData) => {
    let result;
    if (editingItem) {
      result = await storageService.updateMenuItem(editingItem.id, data);
    } else {
      result = await storageService.addMenuItem(data);
    }

    if (result.success) {
      await refreshData();
    } else {
      alert(`Error saving item: ${result.message}`);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await storageService.deleteMenuItem(id);
      refreshData();
    }
  };

  const openAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  // --- Render ---

  if (loading && !profile) {
    return <div className="min-h-screen flex items-center justify-center bg-[#08090A] text-[#555]">Loading Dashboard...</div>;
  }

  if (!profile) {
    return (
      <OnboardingSetup 
        onLogout={onLogout} 
        onCreateProfile={handleCreateProfile} 
        isSaving={creatingProfile} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08090A] flex">
      {/* Sidebar */}
      <DashboardSidebar 
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsProfileModalOpen(true)}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <DashboardHeader 
          profile={profile} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSettings={() => setIsProfileModalOpen(true)}
          onLogout={onLogout}
        />

        <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
          {activeTab === 'overview' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
              {/* Analytics & QR Section (Top) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <AnalyticsStats views={profile.views} />
                </div>
                <div>
                  <QRCodeShare slug={profile.slug} />
                </div>
              </div>
              
              <div className="w-full h-px bg-white/[0.04]" />
              
              {/* Menu Management Section (Bottom) */}
              <div id="menu-management">
                <MenuList 
                  menu={menu} 
                  onAddItem={openAddItem} 
                  onEditItem={openEditItem} 
                  onDeleteItem={handleDeleteItem} 
                />
              </div>

              {/* Status Indicator / Helpful Tip */}
              <div className="p-8 rounded-2xl bg-white/[0.01] border border-dashed border-white/[0.04] text-center">
                <p className="text-[10px] text-[#333] font-bold uppercase tracking-[0.2em] mb-2">Workspace Insight</p>
                <p className="text-sm text-[#8A8F98] max-w-sm mx-auto leading-relaxed">
                  Your restaurant is live at <span className="text-[#5E6AD2]">menu/{profile.slug}</span>. Changes made here will reflect instantly on your public page.
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MenuList 
                menu={menu} 
                onAddItem={openAddItem} 
                onEditItem={openEditItem} 
                onDeleteItem={handleDeleteItem} 
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ItemModal 
        isOpen={isItemModalOpen} 
        onClose={() => setIsItemModalOpen(false)} 
        item={editingItem}
        existingCategories={uniqueCategories}
        onSave={handleSaveItem}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        profile={profile}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};