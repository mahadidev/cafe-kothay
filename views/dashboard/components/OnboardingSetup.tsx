import React, { useState, useRef } from 'react';
import { LogOut, TrendingUp, Upload, ArrowRight } from 'lucide-react';
import { GlassCard } from '../../../components/GlassCard';
import { Button } from '../../../components/Button';
import { ProfileFormData } from '../types';
import { LocationPicker } from '../../../components/LocationPicker';

interface OnboardingSetupProps {
  onLogout: () => void;
  onCreateProfile: (data: ProfileFormData) => Promise<void>;
  isSaving: boolean;
}

export const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onLogout, onCreateProfile, isSaving }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) { 
        alert('Max file size is 100KB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (name && location) {
      onCreateProfile({ name, location, logoUrl });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090A] p-6">
      <div className="absolute top-6 right-6">
        <button onClick={onLogout} className="text-[#8A8F98] hover:text-white transition-colors text-sm flex items-center gap-2">
          <LogOut size={16} /> Logout
        </button>
      </div>
      <GlassCard className="max-w-md w-full animate-in fade-in duration-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/[0.03] rounded-xl backdrop-blur-md border border-white/[0.08] mb-4">
            <TrendingUp size={24} className="text-[#5E6AD2]" />
          </div>
          <h2 className="text-xl font-light text-white mb-2">Complete Setup</h2>
          <p className="text-xs text-[#8A8F98]">Tell us a bit about your restaurant.</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col items-center mb-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full bg-[#15171B] border border-white/[0.1] border-dashed flex items-center justify-center cursor-pointer hover:border-[#5E6AD2] transition-colors relative overflow-hidden group"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Upload size={20} className="text-[#555]" />
              )}
            </div>
            <span className="text-[10px] text-[#555] mt-2">Upload Logo (Max 100KB)</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">Restaurant Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Coffee House"
              className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">Location</label>
            <LocationPicker 
                value={location} 
                onChange={setLocation} 
                placeholder="Select on Map..."
            />
          </div>

          <Button onClick={handleSubmit} className="w-full mt-2" isLoading={isSaving} disabled={!name || !location}>
            Create Profile <ArrowRight size={16} />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};