import React from 'react';
import QRCode from 'react-qr-code';
import { Share2, Download } from 'lucide-react';
import { GlassCard } from '../../../components/GlassCard';
import { Button } from '../../../components/Button';

interface QRCodeShareProps {
  slug: string;
}

export const QRCodeShare: React.FC<QRCodeShareProps> = ({ slug }) => {
  const publicUrl = `${window.location.origin}/#/menu/${slug}`;

  const handleDownloadQR = () => {
    const svg = document.getElementById("menu-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Add margin and white background for printing
    const size = 200;
    const padding = 20;
    canvas.width = size + (padding * 2);
    canvas.height = size + (padding * 2);

    img.onload = () => {
      if (!ctx) return;
      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw QR
      ctx.drawImage(img, padding, padding, size, size);
      
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `menu-qr-${slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="">
      <h2 className="text-sm font-medium mb-4 text-[#E0E0E0]">Your QR Code</h2>
      <GlassCard className="flex flex-col sm:flex-row items-center sm:items-center gap-6 !p-6 !bg-[#0C0D0F]">
        <div className="p-3 bg-white rounded-xl shadow-2xl shrink-0">
          <QRCode 
            id="menu-qr-code"
            value={publicUrl} 
            size={120} 
            level="M" 
          />
        </div>
        
        <div className="flex-1 w-full min-w-0 flex flex-col gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider opacity-50">Public Menu Link</h3>
            <p className="text-[11px] text-[#8A8F98] font-mono truncate bg-[#15171B] p-2.5 rounded-lg border border-white/5 select-all">
              {publicUrl.replace(/^https?:\/\//, '')}
            </p>
          </div>
          
          <div className="flex gap-2 w-full">
            <Button variant="secondary" onClick={handleDownloadQR} className="flex-1 text-xs h-10 px-2">
              <Download size={14} /> PNG
            </Button>
            <Button variant="secondary" onClick={() => window.open(publicUrl, '_blank')} className="flex-1 text-xs h-10 px-2">
              <Share2 size={14} /> View
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};