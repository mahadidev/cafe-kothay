import { useState, useEffect } from 'react';
import { storageService } from '../../../services/storage';
import { MenuItem, RestaurantProfile } from '../../../types';

export const useProfileData = (slug: string | undefined) => {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        if (slug) {
          const foundProfile = await storageService.getProfileBySlug(slug);
          
          if (foundProfile) {
            setProfile(foundProfile);
            const storeMenu = await storageService.getMenuByOwnerId(foundProfile.ownerId);
            setMenu(storeMenu);
            // Fire and forget view increment
            storageService.incrementViews(slug);
          }
        }
        setLoading(false);
    };
    
    fetchData();
  }, [slug]);

  return { profile, menu, loading };
};