'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase, ensureUserProfile, UserProfileSummary } from '@/lib/supabase';
import { X, Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfileSummary) => void;
  initialMode?: 'signin' | 'signup';
  actionPrompt?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
  actionPrompt = 'Sign in to vouch for this profile',
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setInfoMsg(null);
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
            profession: profession.trim() || 'Member',
          },
        },
      });

      if (error) throw error;

      // If user is returned and session exists, profile is ready
      if (data.session && data.user) {
        const profile = await ensureUserProfile(data.user, {
          name: name.trim(),
          profession: profession.trim() || 'Member',
        });
        if (profile) {
          onSuccess(profile);
          onClose();
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
        profession: profession.trim() || 'Member',
      });

      if (!profile) throw new Error('Failed to create your profile.');
      onSuccess(profile);
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#13141F] border border-white/10 rounded-t-[28px] sm:rounded-2xl p-6 sm:p-7 w-full max-w-md shadow-2xl relative animate-in slide-in-from-bottom-6 max-h-[90vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0064E0] to-[#00F2FE] p-0.5 mx-auto mb-3 shadow-lg shadow-[#0064E0]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#13141F] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#00F2FE]" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signup' && 'Create Jana Account'}
            {mode === 'signin' && 'Welcome to Jana'}
            {mode === 'otp' && 'Verify Your Email'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-1">{actionPrompt}</p>
        </div>

        {/* Tab switcher (Sign In vs Sign Up) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                resetForm();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'signin'
                  ? 'bg-[#0064E0] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
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
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'signup'
                  ? 'bg-[#0064E0] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
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
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition flex items-center justify-center gap-2.5 active:scale-[0.99]"
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
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#13141F] px-3 text-[11px] text-white/40 uppercase tracking-wider absolute">
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
          <div className="p-3 mb-4 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{infoMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-white/70">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    resetForm();
                  }}
                  className="text-[10px] text-[#00F2FE] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#00A3FF] hover:from-[#0051B8] hover:to-[#0090E0] text-white text-xs font-bold transition shadow-lg shadow-[#0064E0]/25 active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/70 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/70 mb-1">
                Profession <span className="text-white/40 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Software Engineer / Founder"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/70 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/70 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
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
                className="mt-0.5 rounded border-white/20 bg-white/5 text-[#0064E0] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-white/70 leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <Link href="/legal" target="_blank" className="text-[#00F2FE] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/eula" target="_blank" className="text-[#00F2FE] hover:underline">
                  EULA
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#00A3FF] hover:from-[#0051B8] hover:to-[#0090E0] text-white text-xs font-bold transition shadow-lg shadow-[#0064E0]/25 active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
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
              <label className="block text-[11px] font-semibold text-white/70 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.trim())}
                placeholder="123456"
                maxLength={8}
                required
                className="w-full text-center tracking-widest text-lg py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00F2FE] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#00A3FF] hover:from-[#0051B8] hover:to-[#0090E0] text-white text-xs font-bold transition shadow-lg shadow-[#0064E0]/25 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Confirm & Enter</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className="w-full text-center text-[11px] text-white/50 hover:text-white transition"
            >
              ← Back to Sign Up
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/70 mb-1.5">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00F2FE] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#00A3FF] hover:from-[#0051B8] hover:to-[#0090E0] text-white text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              className="w-full text-center text-[11px] text-white/50 hover:text-white transition"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
