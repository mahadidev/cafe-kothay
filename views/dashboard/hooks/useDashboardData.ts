import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../../../services/storage';
import { MenuItem, RestaurantProfile } from '../../../types';

export const useDashboardData = () => {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const myProfile = await storageService.getMyProfile();
      setProfile(myProfile);
      if (myProfile) {
        const myMenu = await storageService.getMyMenu();
        setMenu(myMenu);
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    profile,
    menu,
    loading,
    refreshData: loadData,
    setProfile, // Exposed for optimistic updates if needed
    setMenu
  };
};