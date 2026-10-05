'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getFriendlyErrorMessage } from '@/lib/errorHandler';
import {
  KeyRound,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function ResetPasswordPage() {
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check if recovery session or token exists in URL or active session
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          if (session?.user) {
            setHasRecoverySession(true);
          } else {
            // Also check hash fragment for recovery tokens
            const hash = typeof window !== 'undefined' ? window.location.hash : '';
            if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
              setHasRecoverySession(true);
            } else {
              setHasRecoverySession(false);
            }
          }
        }
      } catch (err) {
        console.error('Error checking recovery session:', err);
        if (isMounted) setHasRecoverySession(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session?.user)) {
          setHasRecoverySession(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      await supabase.auth.signOut();
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetLink = async (e: React.FormEvent) => {
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
      setInfoMsg(`Password reset instructions have been sent to ${email.trim()}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMsg(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Navbar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-[#A1A4B0] hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center font-bold text-white text-xs">
            J
          </div>
          <span className="font-bold tracking-tight text-sm">Jana</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-[#0F1013] border border-white/[0.10] rounded-[28px] p-6 sm:p-8 shadow-2xl relative">
          {/* Header icon */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 p-1 mx-auto mb-3 shadow-lg flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isSuccess
                ? 'Password Reset Complete'
                : hasRecoverySession
                ? 'Set New Password'
                : 'Reset Your Password'}
            </h1>
            <p className="text-xs text-[#A1A4B0] mt-1.5 leading-relaxed">
              {isSuccess
                ? 'Your password has been securely updated. You can now sign in with your new credentials.'
                : hasRecoverySession
                ? 'Enter and confirm your new password below to regain full access to your account.'
                : 'Enter your email address and we will send you a link to reset your password.'}
            </p>
          </div>

          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}
          {infoMsg && (
            <div className="p-3 mb-5 rounded-xl bg-white/[0.08] border border-white/20 text-white text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" />
              <span className="flex-1">{infoMsg}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess ? (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Success!</p>
                  <p className="text-[#A1A4B0] text-[11px] mt-0.5">
                    Your password has been changed. Use it next time you sign in.
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Return to Jana & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : hasRecoverySession ? (
            /* New Password Form */
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setHasRecoverySession(false)}
                  className="text-[11px] text-[#A1A4B0] hover:text-white underline transition"
                >
                  Need to request a new reset link instead?
                </button>
              </div>
            </form>
          ) : (
            /* Email Request Form (Fallback) */
            <form onSubmit={handleRequestResetLink} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
                  Your Account Email
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
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-[11px] text-[#A1A4B0] hover:text-white transition"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-[#5E626E]">
        <p>&copy; {new Date().getFullYear()} Jana (Mandala). All rights reserved.</p>
      </footer>
    </div>
  );
}
