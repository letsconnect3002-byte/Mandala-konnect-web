'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { supabase, ensureUserProfile, UserProfileSummary } from '@/lib/supabase';
import {
  X,
  Mail,
  Lock,
  User,
  Briefcase,
  Building,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfileSummary) => void;
  initialMode?: 'signin' | 'signup';
  actionPrompt?: string;
  targetProfileName?: string;
}

const COMMON_ROLES = [
  'Software Engineer',
  'Founder',
  'Product Designer',
  'Product Manager',
  'Investor',
  'Researcher',
  'Growth Lead',
];

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
  actionPrompt = 'Sign in to vouch for this profile',
  targetProfileName,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp' | 'forgot' | 'details'>(initialMode);
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [company, setCompany] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [createdProfile, setCreatedProfile] = useState<UserProfileSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
          setErrorMsg(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.href : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign in');

      const profile = await ensureUserProfile(data.user);
      if (!profile) throw new Error('Could not initialize your user profile');

      onSuccess(profile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and choose a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg('You must agree to the Terms of Service & EULA to proceed.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            profession: 'Member',
          },
        },
      });

      if (error) throw error;

      // If user is returned and session exists, profile is ready -> move to profile details step
      if (data.session && data.user) {
        const profile = await ensureUserProfile(data.user, {
          name: name.trim(),
          profession: 'Member',
        });
        if (profile) {
          setCreatedProfile(profile);
          setName(profile.name || name.trim());
          setMode('details');
          return;
        }
      }

      // If session is null, email confirmation or OTP is required
      setMode('otp');
      setInfoMsg('Account created! Please check your email for the verification code.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim()) {
      setErrorMsg('Please enter the verification code.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpToken.trim(),
        type: 'signup',
      });

      if (error) throw error;
      if (!data.user) throw new Error('Verification failed.');

      const profile = await ensureUserProfile(data.user, {
        name: name.trim(),
        profession: 'Member',
      });

      if (!profile) throw new Error('Failed to create your profile.');

      // Move directly to fill profile details before vouching
      setCreatedProfile(profile);
      setName(profile.name || name.trim());
      setMode('details');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
      });
      if (error) throw error;
      setInfoMsg('Password reset link sent! Check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!profession.trim()) {
      setErrorMsg('Please enter your profession or current role.');
      return;
    }

    if (!createdProfile) {
      setErrorMsg('No user profile found to update.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const updatePayload: Record<string, any> = {
        name: name.trim(),
        profession: profession.trim(),
        company: company.trim() || null,
        phone_number: phoneNumber.trim() || null,
        professional_phone_number: phoneNumber.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        linkedin: linkedin.trim() || null,
        twitter: twitter.trim() || null,
        instagram: instagram.trim() || null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', createdProfile.id)
        .select('id, owner_id, name, handle, email, profession, company, phone_number, avatar_url, linkedin, twitter, instagram')
        .single();

      if (error) throw error;

      const updated = (data as UserProfileSummary) || {
        ...createdProfile,
        ...updatePayload,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(`profile_setup_done_${updated.id}`, 'true');
      }

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error('Failed to save profile details:', err);
      setErrorMsg(err.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F1013] border border-white/[0.10] rounded-t-[28px] sm:rounded-[28px] p-6 sm:p-7 w-full max-w-md shadow-2xl relative animate-in slide-in-from-bottom-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition p-1.5 rounded-full hover:bg-white/5"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mobile handle indicator */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 p-0.5 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signup' && 'Create Jana Account'}
            {mode === 'signin' && 'Welcome to Jana'}
            {mode === 'otp' && 'Verify Your Email'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'details' && 'Complete Profile Details'}
          </h2>
          <p className="text-xs text-[#A1A4B0] mt-1">
            {mode === 'details'
              ? targetProfileName
                ? `Fill in your profile details before vouching for ${targetProfileName}`
                : 'Fill in your profile details before vouching'
              : actionPrompt}
          </p>
        </div>

        {/* Tab switcher (Sign In vs Sign Up) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="flex rounded-full bg-[#17181D] p-1 border border-white/[0.08] mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                resetForm();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition ${
                mode === 'signin'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A4B0] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition ${
                mode === 'signup'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A4B0] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Google OAuth Button */}
        {(mode === 'signin' || mode === 'signup') && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-full bg-[#17181D] hover:bg-[#22242B] border border-white/[0.10] text-white text-xs font-semibold transition flex items-center justify-center gap-2.5 active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#0F1013] px-3 text-[11px] text-[#5E626E] uppercase tracking-wider absolute">
                or email
              </span>
            </div>
          </>
        )}

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}
        {infoMsg && (
          <div className="p-3 mb-4 rounded-xl bg-white/[0.08] border border-white/20 text-white text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" />
            <span className="flex-1">{infoMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-[#A1A4B0]">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    resetForm();
                  }}
                  className="text-[10px] text-white/70 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGN UP FORM (STEP 1: ACCOUNT CREATION) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-white/5 text-white focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-[#A1A4B0] leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <Link href="/legal" target="_blank" className="text-white hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/eula" target="_blank" className="text-white hover:underline font-medium">
                  EULA
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: PROFILE DETAILS (EXCLUDING EXPERIENCE, EDUCATION, AND BIO) */}
        {mode === 'details' && (
          <form onSubmit={handleSaveProfileDetails} className="space-y-4 animate-in fade-in">
            {/* Avatar Section */}
            <div className="p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.06] flex items-center gap-3.5">
              <div className="relative group">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0 shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1E1F32] flex items-center justify-center">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1 rounded-full bg-white text-black hover:bg-white/90 shadow transition"
                  title="Change Photo"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    Profile Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#A1A4B0] hover:text-white underline transition"
                  >
                    {showUrlInput ? 'Hide URL' : 'Use image URL'}
                  </button>
                </div>
                <p className="text-[10px] text-[#A1A4B0] mt-0.5">
                  Upload a photo of yourself
                </p>

                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-white text-[10px] font-semibold transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Choose Photo</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#5E626E] focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            {/* Profession / Role */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#A1A4B0]">
                  Profession / Role <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-[#5E626E]">Required for vouch credibility</span>
              </div>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer / Founder"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>

              {/* Quick role suggestions */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setProfession(role)}
                    className={`text-[9px] px-2 py-0.5 rounded-full border transition ${
                      profession === role
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-[#17181D] text-[#A1A4B0] border-white/[0.08] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Company / Organization */}
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1">
                Company / Organization <span className="text-[#5E626E] font-normal">(recommended)</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp / Self-Employed"
                  className="w-full pl-10 pr-4 py-2 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1">
                Phone Number <span className="text-[#5E626E] font-normal">(recommended)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full pl-10 pr-4 py-2 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            {/* Social Links Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSocials(!showSocials)}
                className="text-xs font-semibold text-[#A1A4B0] hover:text-white flex items-center gap-1.5 transition"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#5E626E]" />
                <span>{showSocials ? 'Hide social links' : '+ Add social links (LinkedIn, X, Instagram)'}</span>
              </button>

              {showSocials && (
                <div className="space-y-2 mt-2.5 p-3 rounded-2xl bg-[#17181D] border border-white/[0.06] animate-in fade-in">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A1A4B0] mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-2.5 py-1.5 bg-[#0F1013] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A1A4B0] mb-1">Twitter / X Profile</label>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://x.com/username or @username"
                      className="w-full px-2.5 py-1.5 bg-[#0F1013] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A1A4B0] mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full px-2.5 py-1.5 bg-[#0F1013] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Profile & Continue to Vouch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP VERIFICATION STEP */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.trim())}
                placeholder="123456"
                maxLength={8}
                required
                className="w-full text-center tracking-widest text-lg py-3 bg-[#17181D] border border-white/[0.08] rounded-xl text-white font-mono placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <span>Confirm & Set Up Profile</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className="w-full text-center text-[11px] text-[#A1A4B0] hover:text-white transition"
            >
              ← Back to Sign Up
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                resetForm();
              }}
              className="w-full text-center text-[11px] text-[#A1A4B0] hover:text-white transition"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
