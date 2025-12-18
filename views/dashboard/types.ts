import { MenuItem, RestaurantProfile } from '../../types';

export interface DashboardState {
  profile: RestaurantProfile | null;
  menu: MenuItem[];
  loading: boolean;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  availableFrom?: string | null;
  availableTo?: string | null;
  availableDate?: string | null;
}

export interface ProfileFormData {
  name: string;
  location: string;
  logoUrl?: string;
}