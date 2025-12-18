import React from 'react';
import { QrCode, Sparkles } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-10">
      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
        <QrCode className="text-[#5E6AD2] mb-3" size={20} />
        <h3 className="text-sm font-medium text-[#E0E0E0]">Instant QR</h3>
        <p className="text-[11px] text-[#8A8F98] mt-1 leading-relaxed">Unique code for your store.</p>
      </div>
      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
        <Sparkles className="text-violet-300 mb-3" size={20} />
        <h3 className="text-sm font-medium text-[#E0E0E0]">Modern Design</h3>
        <p className="text-[11px] text-[#8A8F98] mt-1 leading-relaxed">Clean glassmorphism UI.</p>
      </div>
    </div>
  );
};