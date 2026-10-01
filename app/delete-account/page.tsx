'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Trash2, LogIn, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { supabase, ensureUserProfile, UserProfileSummary } from '@/lib/supabase';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import AuthModal from '@/components/AuthModal';

export default function DeleteAccountPage() {
  const [currentUser, setCurrentUser] = useState<UserProfileSummary | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  // Email fallback form state
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');

  const targetEmail = 'letsconnect3002@gmail.com';
  const subject = 'Jana - Account Deletion Request';

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const profile = await ensureUserProfile(session.user);
          if (isMounted) setCurrentUser(profile);
        }
      } catch (err) {
        console.error('Error fetching session on delete page:', err);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await ensureUserProfile(session.user);
        if (isMounted) setCurrentUser(profile);
      } else {
        if (isMounted) setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getMailBody = () => {
    return `Hello Jana Support,

Please delete my account and all associated data from your systems.

Registered Email: ${email}
Reason for Deletion: ${reason || 'Not specified'}

Thank you.`;
  };

  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const body = getMailBody();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMailtoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const body = getMailBody();
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);
    setCurrentUser(null);
    setDeletedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-spotify-black text-white relative overflow-hidden font-sans flex flex-col justify-between pb-12">
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="grainy-delete">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainy-delete)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-spotify-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-extrabold tracking-wider text-white">JANA</span>
          </Link>
          <div>
            <Link
              href="/"
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-medium rounded-full text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-spotify-black">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-[#051b40] rounded-full blur-[120px] opacity-35" />
        <div className="absolute top-[15%] -left-[20%] w-[65%] h-[70%] bg-spotify-green rounded-full blur-[130px] opacity-15" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[55%] h-[60%] bg-[#1e1b4b] rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-32 w-full flex-grow flex flex-col justify-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Delete Account</h1>
            <p className="text-sm text-spotify-light-gray leading-relaxed font-light">
              Permanently delete your Jana account, handle, vouches, and all associated data from our servers.
            </p>
          </div>

          {deletedSuccess ? (
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Account Successfully Deleted</h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Your profile, handle, connections, and vouches have been permanently removed. Thank you for being a part of Jana.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-neutral-200 transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Logged in state: Instant one-click delete option */}
              {!loadingUser && currentUser && (
                <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#1E1F32] border border-white/20 flex-shrink-0 flex items-center justify-center">
                      {currentUser.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentUser.avatar_url}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base font-bold text-white">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-red-300 font-medium">Logged in account:</p>
                      <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
                      <p className="text-xs text-white/60 font-mono truncate">
                        {currentUser.handle ? `@${currentUser.handle}` : currentUser.email || 'Jana Member'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-red-200/80 leading-relaxed">
                    You can delete this account immediately with all your data cleared instantly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete My Account Now</span>
                  </button>
                </div>
              )}

              {/* Not logged in: option to sign in for instant deletion */}
              {!loadingUser && !currentUser && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white">Have account credentials?</p>
                    <p className="text-[11px] text-white/50">Sign in to instantly delete your account in 1 step</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#00F2FE]" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* Email Request Form (Fallback) */}
              <div className="pt-2 border-t border-white/[0.08]">
                <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Or submit a manual deletion request via email:</span>
                </div>

                <form className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold tracking-wider text-spotify-light-gray uppercase">
                      Registered Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-spotify-green/50 focus:ring-1 focus:ring-spotify-green/50 text-white placeholder-spotify-medium-gray text-sm transition outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reason" className="text-xs font-semibold tracking-wider text-spotify-light-gray uppercase">
                      Reason for Deletion (Optional)
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      placeholder="Let us know why you want to delete your account..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-spotify-green/50 focus:ring-1 focus:ring-spotify-green/50 text-white placeholder-spotify-medium-gray text-sm transition outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      onClick={handleGmailSubmit}
                      disabled={!email}
                      className="w-full px-6 py-3.5 bg-spotify-green hover:bg-spotify-green/90 disabled:opacity-40 disabled:hover:bg-spotify-green disabled:cursor-not-allowed text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-spotify-green/10"
                    >
                      <Mail className="w-4 h-4" /> Send Request via Gmail (Web)
                    </button>

                    <button
                      type="button"
                      onClick={handleMailtoSubmit}
                      disabled={!email}
                      className="w-full px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Open Default Mail Client
                    </button>
                  </div>
                </form>

                <p className="text-[10px] text-center text-spotify-medium-gray leading-normal px-2 mt-4">
                  Manual email requests will be processed by our team within 30 days of receiving the email.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-spotify-light-gray text-[10px] pt-12">
        <p>&copy; 2026 Jana. All rights reserved.</p>
      </footer>

      {/* Modals */}
      {currentUser && (
        <DeleteAccountModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          profileId={currentUser.id}
          profileName={currentUser.name}
          profileHandle={currentUser.handle || undefined}
          onSuccess={handleDeleteSuccess}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionPrompt="Sign in to your Jana account to delete it"
        onSuccess={(profile) => {
          setAuthModalOpen(false);
          setCurrentUser(profile);
        }}
      />
    </div>
  );
}
