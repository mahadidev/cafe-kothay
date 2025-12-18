import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { Button } from '../../components/Button';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#08090A] text-[#E0E0E0] py-12 px-6 relative">
      <div className="aurora-blob w-96 h-96 bg-[#5E6AD2]/5 bottom-[-150px] right-[-150px]" />
      
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
              <Scale size={24} className="text-[#5E6AD2]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Terms of Service</h1>
              <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mt-1">Effective Date: October 2023</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)} className="!px-4 !h-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </header>

        <article className="prose prose-invert prose-sm max-w-none space-y-8 text-[#8A8F98] leading-relaxed font-light">
          <section>
            <h2 className="text-white text-lg font-medium mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Cafe Kothay, you agree to be bound by these Terms of Service. If you do not agree 
              to these terms, please refrain from using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">2. Description of Service</h2>
            <p>
              Cafe Kothay is a digital menu platform. We provide tools for restaurant owners to create, 
              host, and share digital menus via unique URLs and QR codes.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">3. User Responsibilities</h2>
            <p>As a restaurant owner, you are responsible for:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>The accuracy of the menu information and pricing provided.</li>
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>Ensuring that uploaded content (logos, text) does not infringe on third-party intellectual property.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">4. Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Upload illegal, harmful, or offensive content.</li>
              <li>Attempt to disrupt the integrity or security of our systems.</li>
              <li>Scrape or collect data from other users without authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">5. Intellectual Property</h2>
            <p>
              You retain all ownership rights to the content you upload. By using the service, you grant 
              Cafe Kothay a non-exclusive license to host and display your content to your customers.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-medium mb-4">6. Limitation of Liability</h2>
            <p>
              Cafe Kothay is provided "as is" without warranties of any kind. We are not liable for any 
              direct or indirect damages resulting from your use of the platform, including service 
              interruptions or data loss.
            </p>
          </section>

          <section className="pt-8 border-t border-white/[0.05]">
            <p className="text-[10px] text-[#333] font-bold uppercase tracking-[0.4em]">Modifications</p>
            <p className="text-xs mt-2">We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
          </section>
        </article>
      </div>
    </div>
  );
};