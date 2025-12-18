import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { AuthForm } from './components/AuthForm';
import { FeatureGrid } from './components/FeatureGrid';
import { TrendingList } from './components/TrendingList';

// Added missing LOGO_SVG_STRING for logo export functionality
const LOGO_SVG_STRING = `<svg width="350" height="80" viewBox="0 0 350 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="350" height="80" fill="transparent"/>
  <text x="175" y="45" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="300" font-size="32" letter-spacing="4" fill="white">CAFE KOTHAY</text>
</svg>`;

interface LandingPageProps {
  onLogin: () => void;
  isResettingPassword?: boolean;
  setIsResettingPassword: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isResettingPassword, setIsResettingPassword }) => {
  const [logoError, setLogoError] = useState(false);

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Wide aspect ratio for the new logo (350x80 -> 1750x400)
    canvas.width = 1750;
    canvas.height = 400;

    const svgBlob = new Blob([LOGO_SVG_STRING], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'cafe-kothay-logo.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6 relative bg-[#08090A]">
      {/* Background Blobs */}
      <div className="aurora-blob w-96 h-96 bg-violet-800/20 top-[-50px] left-[-50px]" />
      <div className="aurora-blob w-[600px] h-[600px] bg-[#5E6AD2]/10 bottom-[-150px] right-[-150px]" />

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-5 flex flex-col items-center group">
          
          {/* Brand Logo Area - Adjusted for Wide Aspect Ratio */}
          <div className="w-64 h-24 relative flex items-center justify-center">
               <img 
                 src="/logo.svg" 
                 alt="Cafe Kothay" 
                 className="w-full h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-500"
               />
          </div>
        </div>

        <AuthForm 
          onLogin={onLogin} 
          isResettingPasswordExternal={isResettingPassword}
          setIsResettingPasswordExternal={setIsResettingPassword}
        />

        <FeatureGrid />

        <TrendingList />

        <footer className="mt-20 pb-12 text-center border-t border-white/[0.03] pt-8">
          <p className="text-[10px] text-[#333] font-bold uppercase tracking-[0.4em] mb-4">Platform Powered by Cafe Kothay</p>
          
          <div className="flex justify-center gap-6 mb-6">
            <Link to="/privacy" className="text-[9px] text-[#555] hover:text-[#5E6AD2] transition-colors uppercase tracking-[0.2em] font-bold">Privacy Policy</Link>
            <Link to="/terms" className="text-[9px] text-[#555] hover:text-[#5E6AD2] transition-colors uppercase tracking-[0.2em] font-bold">Terms of Service</Link>
          </div>

          <p className="text-[10px] text-[#666] font-medium tracking-tight">
            Developed by <a href="https://mahadidev.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#5E6AD2] hover:text-[#7C87E8] transition-colors underline underline-offset-4 decoration-[#5E6AD2]/30">Mahadi Hasan</a>
          </p>
        </footer>
      </div>
    </div>
  );
};