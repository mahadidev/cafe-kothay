import { Download, Edit2, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import { LocationPicker } from '../../../components/LocationPicker';
import { supabase } from '../../../services/storage';
import { RestaurantProfile } from '../../../types';
import { ProfileFormData } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RestaurantProfile;
  onSave: (data: ProfileFormData) => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.name);
      setLocation(profile.location);
      setLogoUrl(profile.logoUrl);
      
      // Get user email
      const getUserEmail = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user?.email) {
          setEmail(data.user.email);
        }
      };
      getUserEmail();
    }
  }, [isOpen, profile]);

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

  const handleDownloadLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (logoUrl) {
        const link = document.createElement('a');
        link.href = logoUrl;
        link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleSave = async () => {
    if (!name || !location) return;
    setLoading(true);
    await onSave({ name, location, logoUrl });
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
			<div className="w-full max-w-md bg-[#0F1012] border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-5 fade-in duration-200">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
				>
					<X size={20} />
				</button>
				<h2 className="text-lg font-light text-white mb-6">Edit Profile</h2>
				<div className="space-y-5">
					<div className="flex flex-col items-center mb-4">
						<div
							onClick={() => fileInputRef.current?.click()}
							className="w-24 h-24 rounded-full bg-[#15171B] border border-white/[0.1] border-dashed flex items-center justify-center cursor-pointer hover:border-[#5E6AD2] transition-colors relative overflow-hidden group"
						>
							{logoUrl ? (
								<>
									<img
										src={logoUrl}
										alt="Logo"
										className="w-full h-full object-cover"
									/>
									<button
										onClick={handleDownloadLogo}
										className="absolute top-0 right-0 p-1.5 bg-black/50 text-white hover:bg-[#5E6AD2] transition-colors rounded-bl-lg z-20"
										title="Download Logo"
									>
										<Download size={12} />
									</button>
								</>
							) : (
								<Upload size={20} className="text-[#555]" />
							)}
							<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
								<Edit2 size={16} className="text-white" />
							</div>
						</div>
						<span className="text-[10px] text-[#555] mt-2">
							Click to change (Max 100KB)
						</span>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept="image/*"
							className="hidden"
						/>
					</div>

					<div>
						<label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">
							Email
						</label>
						<input
							type="email"
							value={email}
							readOnly
							className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white/70 cursor-not-allowed focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">
							Restaurant Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
						/>
					</div>

					<div>
						<label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">
							Location
						</label>
						<LocationPicker
							value={location}
							onChange={setLocation}
							placeholder="Select on Map..."
						/>
					</div>

					<Button
						onClick={handleSave}
						className="w-full mt-2"
						isLoading={loading}
					>
						Save Profile
					</Button>
				</div>
			</div>
		</div>
	);
};