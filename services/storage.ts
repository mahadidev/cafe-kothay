import { createClient } from '@supabase/supabase-js';
import { MenuItem, RestaurantProfile } from '../types';

/**
 * NOTE: If adding menu items with dates/times fails, run this SQL in your Supabase SQL Editor:
 * 
 * ALTER TABLE menu_items 
 * ADD COLUMN IF NOT EXISTS available_date DATE,
 * ADD COLUMN IF NOT EXISTS available_from TIME,
 * ADD COLUMN IF NOT EXISTS available_to TIME;
 */

// Supabase Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Type Transformers ---

const transformProfile = (dbProfile: any): RestaurantProfile => ({
  id: dbProfile.id,
  ownerId: dbProfile.user_id,
  name: dbProfile.name,
  slug: dbProfile.slug,
  location: dbProfile.location,
  logoUrl: dbProfile.logo_url || undefined,
  views: dbProfile.views || 0,
});

const transformMenuItem = (dbItem: any): MenuItem => ({
  id: dbItem.id,
  ownerId: dbItem.user_id,
  name: dbItem.name,
  description: dbItem.description || '',
  price: Number(dbItem.price),
  category: dbItem.category,
  isAvailable: dbItem.is_available,
  availableFrom: dbItem.available_from,
  availableTo: dbItem.available_to,
  availableDate: dbItem.available_date,
});

export const storageService = {
  // --- Auth & User Management ---

  getCurrentSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  getCurrentUserId: async (): Promise<string | null> => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id || null;
  },

  login: async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  },

  loginWithGoogle: async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error('Google login error:', error.message);
    }
  },

  sendLoginOtp: async (email: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
        return { success: false, message: error.message };
    }
    return { success: true };
  },

  verifyLoginOtp: async (email: string, token: string): Promise<{ success: boolean; message?: string }> => {
      const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email'
      });
      if (error) {
          return { success: false, message: error.message };
      }
      return { success: true };
  },

  updatePassword: async (password: string): Promise<{ success: boolean; message?: string }> => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
          return { success: false, message: error.message };
      }
      return { success: true };
  },

  createProfile: async (profileData: { name: string, location: string, logoUrl?: string }): Promise<boolean> => {
      const userId = await storageService.getCurrentUserId();
      if (!userId) return false;

      const slug = profileData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const { error } = await supabase.from('profiles').insert({
        user_id: userId,
        name: profileData.name,
        slug: slug,
        location: profileData.location,
        logo_url: profileData.logoUrl,
        views: 0
      });

      if (error) {
        console.error('Create profile error:', error.message);
        return false;
      }
      return true;
  },

  signup: async (email: string, password: string, profileData: { name: string, location: string, logoUrl?: string }): Promise<{ success: boolean; message?: string }> => {
    let { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    
    if (authError && authError.message.toLowerCase().includes('already registered')) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError || !loginData.session) {
            return { success: false, message: 'Account already exists. Please log in or check your password.' };
        }
        authData = { user: loginData.user, session: loginData.session } as any;
        authError = null;
    } else if (authError) {
        return { success: false, message: authError.message };
    }

    if (authData.user && !authData.session) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !signInData.session) {
        return { success: false, message: 'Account created, but email verification is required.' };
      }
      authData = signInData as any;
    }

    if (!authData.user || !authData.session) {
        return { success: false, message: 'Authentication failed. Please try again.' };
    }

    const slug = profileData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const { data: existingProfile } = await supabase.from('profiles').select('id').eq('user_id', authData.user.id).single();

    if (!existingProfile) {
        await supabase.from('profiles').insert({
          user_id: authData.user.id,
          name: profileData.name,
          slug: slug, 
          location: profileData.location,
          logo_url: profileData.logoUrl,
          views: 0
        });
    }

    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getMyProfile: async (): Promise<RestaurantProfile | null> => {
    const userId = await storageService.getCurrentUserId();
    if (!userId) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (error || !data) return null;
    return transformProfile(data);
  },

  getProfileBySlug: async (slug: string): Promise<RestaurantProfile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return transformProfile(data);
  },

  getTopProfiles: async (limit: number = 6): Promise<RestaurantProfile[]> => {
    const { data, error } = await supabase.from('profiles').select('*').order('views', { ascending: false }).limit(limit);
    if (error || !data) return [];
    return data.map(transformProfile);
  },

  updateProfile: async (updates: Partial<RestaurantProfile>): Promise<{ success: boolean; message?: string }> => {
    const userId = await storageService.getCurrentUserId();
    if (!userId) return { success: false, message: 'No active session' };
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
    const { error } = await supabase.from('profiles').update(dbUpdates).eq('user_id', userId);
    if (error) return { success: false, message: error.message };
    return { success: true };
  },

  incrementViews: async (slug: string): Promise<void> => {
    await supabase.rpc('increment_page_view', { page_slug: slug });
  },

  getMyMenu: async (): Promise<MenuItem[]> => {
    const userId = await storageService.getCurrentUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('menu_items').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(transformMenuItem);
  },

  getMenuByOwnerId: async (ownerId: string): Promise<MenuItem[]> => {
    const { data, error } = await supabase.from('menu_items').select('*').eq('user_id', ownerId).order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(transformMenuItem);
  },

  addMenuItem: async (item: Omit<MenuItem, 'id' | 'ownerId'>): Promise<{ success: boolean; message?: string }> => {
    const userId = await storageService.getCurrentUserId();
    if (!userId) return { success: false, message: 'No active session' };
    
    const payload = {
      user_id: userId,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      is_available: item.isAvailable,
      available_from: item.availableFrom || null,
      available_to: item.availableTo || null,
      available_date: item.availableDate || null
    };

    const { error } = await supabase.from('menu_items').insert(payload);
    
    if (error) {
      console.error('Supabase Add Item Error:', error);
      return { success: false, message: error.message };
    }
    return { success: true };
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem>): Promise<{ success: boolean; message?: string }> => {
    const userId = await storageService.getCurrentUserId();
    if (!userId) return { success: false, message: 'No active session' };
    
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;
    if (updates.availableFrom !== undefined) dbUpdates.available_from = updates.availableFrom;
    if (updates.availableTo !== undefined) dbUpdates.available_to = updates.availableTo;
    if (updates.availableDate !== undefined) dbUpdates.available_date = updates.availableDate;
    
    const { error } = await supabase.from('menu_items').update(dbUpdates).eq('id', id).eq('user_id', userId);
    
    if (error) {
      console.error('Supabase Update Item Error:', error);
      return { success: false, message: error.message };
    }
    return { success: true };
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    const userId = await storageService.getCurrentUserId();
    if (!userId) return;
    await supabase.from('menu_items').delete().eq('id', id).eq('user_id', userId);
  }
};