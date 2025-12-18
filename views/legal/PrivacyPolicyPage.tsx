import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/Button';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#08090A] text-[#E0E0E0] py-12 px-6 relative">
      <div className="aurora-blob w-96 h-96 bg-violet-800/5 top-[-50px] left-[-50px]" />
      
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
              <ShieldCheck size={24} className="text-[#5E6AD2]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
              <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mt-1">Last Updated: October 2023</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)} className="!px-4 !h-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </header>

        <article className="prose prose-invert prose-sm max-w-none space-y-8 text-[#8A8F98] leading-relaxed font-light">
          <section>
            <h2 className="text-white text-lg font-medium mb-4">1. Data Collection</h2>
            <p>
              Cafe Kothay collects information necessary to provide a high-quality digital menu service. This includes:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Account Information:</strong> Email addresses and passwords (encrypted via Supabase Auth).</li>
              <li><strong>Restaurant Data:</strong> Restaurant names, location data, logos, and menu item details.</li>
              <li><strong>Usage Metrics:</strong> Anonymous view counts to help owners track menu popularity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">2. How We Use Your Data</h2>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Authenticate your access to the dashboard.</li>
              <li>Render your public menu for your customers.</li>
              <li>Improve platform performance and security.</li>
            </ul>
            <p className="mt-4">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">3. Third-Party Services</h2>
            <p>
              We utilize <strong>Supabase</strong> for authentication and database management. If you choose to sign in with Google, 
              we receive certain profile information as permitted by Google's privacy settings. Please refer to their respective 
              privacy policies for more details.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">4. Cookies & Local Storage</h2>
            <p>
              We use local storage and essential cookies to maintain your login session. These are strictly necessary for 
              the application to function and do not track you across other websites.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your account data at any time through your dashboard. 
              Deleting your account will result in the immediate removal of your profile and all associated menu items 
              from our active database.
            </p>
          </section>

          <section className="pt-8 border-t border-white/[0.05]">
            <p className="text-[10px] text-[#333] font-bold uppercase tracking-[0.4em]">Contact</p>
            <p className="text-xs mt-2">Questions regarding this policy can be directed to the developer via mahadidev.vercel.app.</p>
          </section>
        </article>
      </div>
    </div>
  );
};