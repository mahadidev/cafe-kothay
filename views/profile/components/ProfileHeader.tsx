import { ExternalLink, MapPin } from 'lucide-react';
import React from 'react';
import { RestaurantProfile } from '../../../types';

interface ProfileHeaderProps {
  profile: RestaurantProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const openLocationInMaps = () => {
    const encodedLocation = encodeURIComponent(profile.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  return (
    <header className="pt-12 pb-8 flex flex-col items-center text-center">
      {/* Brand Identity */}
      <div className="relative group mb-6">
        <div className="absolute inset-0 bg-[#5E6AD2]/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="w-20 h-20 bg-black border border-white/10 rounded-[2rem] flex items-center justify-center overflow-hidden relative z-10 shadow-2xl transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
           {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-cover" />
           ) : (
              <span className="text-xl font-bold text-[#5E6AD2]">
                {profile.name.substring(0, 1)}
              </span>
           )}
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
        {profile.name}
      </h1>
      
      <div className="flex items-center gap-2 text-[#666] text-[11px] font-medium uppercase tracking-widest">
        <MapPin size={12} strokeWidth={2.5} className="text-[#5E6AD2]/60" />
        <button 
          onClick={openLocationInMaps}
          className=""
          title="View location on Google Maps"
        >
          {profile.location}
        </button>
      </div>
    </header>
  );
};