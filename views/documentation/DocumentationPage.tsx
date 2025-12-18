import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Utensils, QrCode, Clock, BarChart3, Globe, Download, Share2 } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';

// SVG constant for the OG Image to allow canvas export
const OG_IMAGE_SVG = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#08090A"/>
  <g opacity="0.15">
    <circle cx="1000" cy="150" r="250" fill="#5E6AD2"/>
    <circle cx="200" cy="500" r="300" fill="#5E6AD2"/>
  </g>
  <rect x="40" y="40" width="1120" height="550" rx="32" stroke="white" stroke-opacity="0.05" stroke-width="2"/>
  <g transform="translate(600, 315)">
    <text y="40" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="72" fill="white">Cafe Kothay</text>
    <text y="100" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="24" fill="#8A8F98" letter-spacing="0.4em">MODERN DIGITAL MENUS</text>
  </g>
</svg>`;

export const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDownloadOG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 1200;
    canvas.height = 630;

    const svgBlob = new Blob([OG_IMAGE_SVG], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "#08090A";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'cafe-kothay-og-thumbnail.png';
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const sections = [
    {
      title: "Getting Started",
      icon: <Globe className="text-[#5E6AD2]" size={20} />,
      content: "Once you create an account, you'll be prompted to set up your restaurant profile. Provide a clear name, select your location on the map, and upload a high-quality logo (max 100KB) to represent your brand."
    },
    {
      title: "Menu Management",
      icon: <Utensils className="text-[#5E6AD2]" size={20} />,
      content: "Navigate to the 'Menu Items' tab to add your offerings. You can organize items by categories (e.g., Starters, Mains, Drinks). Use descriptive names and high-quality descriptions to entice customers."
    },
    {
      title: "Smart Scheduling",
      icon: <Clock className="text-[#5E6AD2]" size={20} />,
      content: "Cafe Kothay supports advanced availability. You can toggle visibility, set specific serving hours (e.g., Breakfast only), or even set a specific date for limited-time seasonal specials."
    },
    {
      title: "Sharing & QR Codes",
      icon: <QrCode className="text-[#5E6AD2]" size={20} />,
      content: "Every restaurant gets a unique public URL. In your dashboard, you can download a high-resolution PNG of your QR code to print on table tents or marketing materials."
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="text-[#5E6AD2]" size={20} />,
      content: "Track your reach with our real-time view counter. Every time a customer visits your public menu, the count increases, helping you understand peak traffic times."
    }
  ];

  return (
    <div className="min-h-screen bg-[#08090A] text-[#E0E0E0] py-12 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="aurora-blob w-96 h-96 bg-violet-800/10 top-[-50px] left-[-50px]" />
      <div className="aurora-blob w-[600px] h-[600px] bg-[#5E6AD2]/5 bottom-[-150px] right-[-150px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
              <BookOpen size={24} className="text-[#5E6AD2]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
              <p className="text-xs text-[#555] uppercase tracking-widest font-bold mt-1">Mastering Cafe Kothay</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="!px-4 !h-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </div>

        {/* Brand Assets / Marketing Kit Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <h2 className="text-[10px] font-bold text-[#333] uppercase tracking-[0.4em] mb-6">Marketing & Brand Assets</h2>
           <GlassCard className="!bg-[#0C0D0F] border-white/[0.04] p-0 overflow-hidden">
             <div className="aspect-[1200/630] bg-[#08090A] relative group">
                <img 
                  src="/og-image.png" 
                  alt="OG Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                   <p className="text-xs font-semibold text-white mb-4 uppercase tracking-widest">Social Media Thumbnail</p>
                   <Button onClick={handleDownloadOG} variant="primary" className="!h-10 !px-6">
                      <Download size={16} /> Export for Social Media
                   </Button>
                </div>
             </div>
             <div className="p-6">
                <h3 className="text-sm font-medium text-white mb-2">Open Graph Image (1200x630)</h3>
                <p className="text-[11px] text-[#8A8F98] leading-relaxed">
                  Use this thumbnail when sharing your platform on X, Facebook, or LinkedIn. It is pre-configured with our signature 
                  glassmorphism style to ensure your links look professional.
                </p>
             </div>
           </GlassCard>
        </div>

        {/* Introduction */}
        <GlassCard className="mb-12 !bg-[#0C0D0F] border-white/[0.04]">
          <h2 className="text-lg font-medium text-white mb-4">Welcome to the Platform</h2>
          <p className="text-sm text-[#8A8F98] leading-relaxed font-light">
            Cafe Kothay is designed to bridge the gap between physical dining and digital convenience. Our mission is to provide 
            minimalist, high-performance digital menus that look stunning on any device. This guide covers everything you need 
            to know to manage your digital presence effectively.
          </p>
        </GlassCard>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <GlassCard className="!bg-transparent border-white/[0.02] hover:border-white/[0.06] transition-all">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{section.icon}</div>
                  <div>
                    <h3 className="text-base font-medium text-white mb-2">{section.title}</h3>
                    <p className="text-sm text-[#8A8F98] leading-relaxed font-light">
                      {section.content}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-white/[0.03] text-center">
          <p className="text-[10px] text-[#333] font-bold uppercase tracking-[0.4em] mb-4">Support & Resources</p>
          <p className="text-xs text-[#666]">
            Need more help? Contact our developer at <a href="https://mahadidev.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#5E6AD2] hover:underline">Mahadi Hasan</a>
          </p>
        </footer>
      </div>
    </div>
  );
};