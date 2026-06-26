'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');

  const targetEmail = 'letsconnect3002@gmail.com';
  const subject = 'Mandala - Account Deletion Request';
  
  const getMailBody = () => {
    return `Hello Mandala Support,

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
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-extrabold tracking-wider text-white">MANDALA</span>
          </Link>
          <div>
            <Link href="/" className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-medium rounded-full text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-md">
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Back to Home</span><span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-spotify-black">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-[#042f1a] rounded-full blur-[120px] opacity-35" />
        <div className="absolute top-[15%] -left-[20%] w-[65%] h-[70%] bg-spotify-green rounded-full blur-[130px] opacity-15" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[55%] h-[60%] bg-[#3f6212] rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-md mx-auto px-4 pt-32 w-full flex-grow flex flex-col justify-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Delete Account</h1>
            <p className="text-sm text-spotify-light-gray leading-relaxed font-light">
              Submit a request to permanently delete your Mandala account and clear all associated data from our servers.
            </p>
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

          <p className="text-[10px] text-center text-spotify-medium-gray leading-normal px-2">
            By clicking above, you will be redirected to compose an email. Your request will be processed by our team within 30 days of receiving the email.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-spotify-light-gray text-[10px] pt-12">
        <p>&copy; 2026 Mandala. All rights reserved.</p>
      </footer>
    </div>
  );
}
