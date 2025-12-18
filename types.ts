// Core Domain Entities shared between Service and View layers

export interface MenuItem {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  availableFrom?: string | null; // HH:mm format
  availableTo?: string | null;   // HH:mm format
  availableDate?: string | null; // YYYY-MM-DD format
}

export interface RestaurantProfile {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  location: string;
  logoUrl?: string; 
  views: number;
}