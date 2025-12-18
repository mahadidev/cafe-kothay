
import { ArrowRight, ChevronLeft, KeyRound, Lock, Mail, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import { GlassCard } from '../../../components/GlassCard';
import { LocationPicker } from '../../../components/LocationPicker';
import { storageService } from '../../../services/storage';

interface AuthFormProps {
  onLogin: () => void;
  isResettingPasswordExternal?: boolean;
  setIsResettingPasswordExternal: (val: boolean) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  onLogin, 
  isResettingPasswordExternal, 
  setIsResettingPasswordExternal 
}) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Forgot Password / Reset Flow
  const [isResetting, setIsResetting] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState('');

  // Signup Flow
  const [signupStep, setSignupStep] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize internal reset state with external flag
  useEffect(() => {
    if (isResettingPasswordExternal && !isResetting) {
      setIsResetting(true);
      setResetStep(3); // If we arrived here via a recovery link, jump to step 3
    }
  }, [isResettingPasswordExternal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) { // 100KB
        setError('Logo file size must be less than 100KB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoUrl(ev.target?.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await storageService.loginWithGoogle();
  };

  const resetState = () => {
    setError('');
    setLoading(false);
    setIsResetting(false);
    setIsResettingPasswordExternal(false);
    setResetStep(1);
    setOtpDigits(['', '', '', '', '', '']);
    setNewPassword('');
  };

  const handleForgotPasswordClick = () => {
    resetState();
    setIsResetting(true);
  };

  // --- OTP Handlers ---
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newDigits[index + i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(index + pastedData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // --- Reset / OTP Handlers ---

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await storageService.sendLoginOtp(email);
    setLoading(false);

    if (result.success) {
      setResetStep(2);
    } else {
      setError(result.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');
    
    const result = await storageService.verifyLoginOtp(email, otpCode);
    setLoading(false);

    if (result.success) {
      // Force the parent to keep isResettingPassword as true
      setIsResettingPasswordExternal(true);
      setResetStep(3);
      
      // Double-check after a short delay to ensure state is maintained
      setTimeout(() => {
        setIsResettingPasswordExternal(true);
        setResetStep(3);
      }, 200);
    } else {
      setError(result.message || 'Invalid code.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await storageService.updatePassword(newPassword);
    setLoading(false);

    if (result.success) {
      setIsResettingPasswordExternal(false);
      onLogin();
    } else {
      setError(result.message || 'Failed to update password.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      setLoading(true);
      const result = await storageService.login(email, password);
      setLoading(false);
      
      if (!result.success) {
        setError(result.message || 'Invalid credentials.');
      } else {
        onLogin();
      }
    } else {
      if (signupStep === 1) {
        if (!email || !password) {
          setError('Please fill in all fields.');
          return;
        }
        setSignupStep(2);
      } else {
        if (!restaurantName || !location) {
          setError('Restaurant name and location are required.');
          return;
        }
        setLoading(true);
        const result = await storageService.signup(email, password, { 
            name: restaurantName, 
            location, 
            logoUrl 
        });
        setLoading(false);

        if (!result.success) {
          setError(result.message || 'Failed to create account.');
        } else {
          onLogin();
        }
      }
    }
  };

    
  if (isResetting) {
    return (
      <GlassCard className="mb-8 !bg-[#0C0D0F] !border-white/[0.06] overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/[0.08] pb-4">
          <button 
            onClick={() => {
               if (resetStep === 1) resetState();
               else if (resetStep === 2) {
                 setResetStep(1);
                 setIsResettingPasswordExternal(false);
               }
            }} 
            className="text-[#8A8F98] hover:text-white transition-colors"
          >
            {resetStep < 3 && <ChevronLeft size={16} />}
          </button>
          <span className="text-xs uppercase tracking-widest font-medium text-white">
            {resetStep === 1 ? 'Forgot Password' : (resetStep === 2 ? 'Verification' : 'New Password')}
          </span>
        </div>

        {resetStep === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5 animate-in slide-in-from-left-4 fade-in duration-300">
             <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#8A8F98] mb-1.5 pl-1 font-medium">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-[#15171B] border border-white/[0.08] rounded-lg p-3 text-[#E0E0E0] focus:outline-none focus:border-[#5E6AD2]/50 transition-all placeholder:text-[#333] font-light text-sm"
              />
            </div>
            {error && <p className="text-red-400 text-xs text-center pt-2">{error}</p>}
            <Button type="submit" className="w-full mt-2" isLoading={loading}>Send Code</Button>
          </form>
        )}

        {resetStep === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-3">
                    <KeyRound size={20} className="text-[#5E6AD2]" />
                </div>
                <p className="text-[11px] text-[#8A8F98] leading-relaxed px-4">
                  Check your email for the code and enter it below.
                </p>
             </div>
             
             <div className="flex justify-between gap-2 px-2">
               {otpDigits.map((digit, idx) => (
                 <input
                   key={idx}
                   ref={el => { otpInputRefs.current[idx] = el; }}
                   type="text"
                   maxLength={1}
                   value={digit}
                   onChange={(e) => handleOtpChange(idx, e.target.value)}
                   onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                   className="w-full h-12 bg-[#15171B] border border-white/[0.08] rounded-lg text-white text-center text-xl font-medium focus:outline-none focus:border-[#5E6AD2] focus:ring-1 focus:ring-[#5E6AD2]/20 transition-all"
                 />
               ))}
             </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <Button type="submit" className="w-full" isLoading={loading}>Verify Code</Button>
          </form>
        )}

        {resetStep === 3 && (
          <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
             <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#8A8F98] mb-1.5 pl-1 font-medium">New Password</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#15171B] border border-white/[0.08] rounded-lg p-3 text-[#E0E0E0] focus:outline-none focus:border-[#5E6AD2]/50 transition-all placeholder:text-[#333] font-light text-sm"
              />
            </div>
            {error && <p className="text-red-400 text-xs text-center pt-2">{error}</p>}
            <Button type="submit" className="w-full mt-2" isLoading={loading}>Update Password & Login</Button>
          </form>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard className="mb-8 !bg-[#0C0D0F] !border-white/[0.06] overflow-hidden">
      {(signupStep === 1) && (
        <div className="flex border-b border-white/[0.08] mb-6">
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-colors ${isLogin ? 'text-[#5E6AD2] border-b-2 border-[#5E6AD2]' : 'text-[#555] hover:text-[#888]'}`}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-colors ${!isLogin ? 'text-[#5E6AD2] border-b-2 border-[#5E6AD2]' : 'text-[#555] hover:text-[#888]'}`}
          >
            Create Account
          </button>
        </div>
      )}

      {signupStep === 2 && !isLogin && (
        <div className="flex items-center gap-2 mb-6 border-b border-white/[0.08] pb-4">
          <button onClick={() => setSignupStep(1)} className="text-[#8A8F98] hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs uppercase tracking-widest font-medium text-white">Setup Profile</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {(isLogin || signupStep === 1) && (
          <>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#8A8F98] mb-1.5 pl-1 font-medium">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-[#15171B] border border-white/[0.08] rounded-lg p-3 text-[#E0E0E0] focus:outline-none focus:border-[#5E6AD2]/50 transition-all placeholder:text-[#333] font-light text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#8A8F98] mb-1.5 pl-1 font-medium">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#15171B] border border-white/[0.08] rounded-lg p-3 text-[#E0E0E0] focus:outline-none focus:border-[#5E6AD2]/50 transition-all placeholder:text-[#333] font-light text-sm"
              />
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button 
                    type="button" 
                    onClick={handleForgotPasswordClick}
                    className="text-[10px] text-[#555] hover:text-[#5E6AD2] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {(!isLogin && signupStep === 2) && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 space-y-4">
            <div className="flex flex-col items-center mb-4">
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-20 h-20 rounded-full bg-[#15171B] border border-white/[0.1] border-dashed flex items-center justify-center cursor-pointer hover:border-[#5E6AD2] transition-colors relative overflow-hidden"
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
              <label className="block text-[10px] uppercase tracking-widest text-[#8A8F98] mb-1.5 pl-1 font-medium">Restaurant Name</label>
              <input 
                type="text" 
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. The Coffee House" 
                className="w-full bg-[#15171B] border border-white/[0.08] rounded-lg p-3 text-[#E0E0E0] focus:outline-none focus:border-[#5E6AD2]/50 transition-all placeholder:text-[#333] font-light text-sm"
              />
            </div>

            <div>
               <label className="block text-[10px] uppercase tracking-widest text-[#8A8F98] mb-1.5 pl-1 font-medium">Location</label>
               <LocationPicker 
                  value={location} 
                  onChange={setLocation} 
                  placeholder="Select on Map..."
               />
            </div>
          </div>
        )}
        
        {error && (
          <p className="text-red-400 text-xs text-center pt-2">{error}</p>
        )}

        <Button type="submit" className="w-full justify-between group mt-2" isLoading={loading}>
          {isLogin ? 'Sign In' : (signupStep === 1 ? 'Next' : 'Complete Setup')} 
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </form>

      {(isLogin || signupStep === 1) && (
        <div className="mt-8">
           <div className="relative mb-6">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-white/[0.08]"></div>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
               <span className="bg-[#0C0D0F] px-2 text-[#555]">Or continue with</span>
             </div>
           </div>

           <Button 
             type="button" 
             variant="secondary" 
             className="w-full justify-center gap-3 !bg-white hover:!bg-gray-100 !text-black !border-transparent font-medium"
             onClick={handleGoogleLogin}
             disabled={loading}
           >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
           </Button>
        </div>
      )}
    </GlassCard>
  );
};