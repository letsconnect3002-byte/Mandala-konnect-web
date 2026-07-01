'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const targetEmail = 'letsconnect3002@gmail.com';
  
  const getMailBody = () => {
    return `Hello Mandala Support,

Support Ticket Details:
Name: ${name || 'Not provided'}
Registered Email: ${email}
Category: ${subject}

Message:
${message}

Thank you.`;
  };

  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    
    const body = getMailBody();
    const mailSubject = `Mandala Support - ${subject}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMailtoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    
    const body = getMailBody();
    const mailSubject = `Mandala Support - ${subject}`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const faqs = [
    {
      q: "How do I connect with my inner circle?",
      a: "Mandala is design-sealed. You connect only in-person by scanning a friend's unique QR code, or by sharing a direct, one-time invite link."
    },
    {
      q: "Is there a search bar or directory?",
      a: "No. There is no search bar, search indexing, or global discovery directory. Your profile is completely invisible to anyone outside your chosen circle."
    },
    {
      q: "What is Monk Mode?",
      a: "Monk Mode is a focus feature that temporarily hides selected connections and blocks notifications from them. You choose the duration, helping you stay distraction-free."
    },
    {
      q: "How is my personal data protected?",
      a: "Your passwords are cryptographic hashes, and all data in transit is encrypted using TLS. We use Supabase RLS (Row Level Security) to ensure nobody else accesses your logs."
    }
  ];

  return (
    <div className="min-h-screen bg-spotify-black text-white relative overflow-hidden font-sans flex flex-col justify-between pb-12">
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="grainy-support">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainy-support)" />
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 w-full flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Support Form Card */}
          <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-spotify-green/10 border border-spotify-green/20 text-spotify-green mb-2">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Contact Support</h1>
              <p className="text-sm text-spotify-light-gray leading-relaxed font-light">
                Have questions or run into technical issues? Fill in the details below to email our support team.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold tracking-wider text-spotify-light-gray uppercase">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-spotify-green/50 focus:ring-1 focus:ring-spotify-green/50 text-white placeholder-spotify-medium-gray text-sm transition outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold tracking-wider text-spotify-light-gray uppercase">
                    Your Email <span className="text-red-500">*</span>
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
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold tracking-wider text-spotify-light-gray uppercase">
                  Category
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-spotify-dark-gray border border-white/10 rounded-xl focus:border-spotify-green/50 focus:ring-1 focus:ring-spotify-green/50 text-white text-sm transition outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="App Bug Report">App Bug Report</option>
                  <option value="Feedback / Suggestions">Feedback & Suggestions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold tracking-wider text-spotify-light-gray uppercase">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Describe your issue or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-spotify-green/50 focus:ring-1 focus:ring-spotify-green/50 text-white placeholder-spotify-medium-gray text-sm transition outline-none resize-none"
                />
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  onClick={handleGmailSubmit}
                  disabled={!email || !message}
                  className="w-full px-6 py-3.5 bg-spotify-green hover:bg-spotify-green/90 disabled:opacity-40 disabled:hover:bg-spotify-green disabled:cursor-not-allowed text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-spotify-green/10"
                >
                  <Mail className="w-4 h-4" /> Send Support Request via Gmail
                </button>

                <button
                  type="button"
                  onClick={handleMailtoSubmit}
                  disabled={!email || !message}
                  className="w-full px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Open Default Mail Client
                </button>
              </div>
            </form>
          </div>

          {/* Quick FAQ Sidebar */}
          <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-spotify-green/10 border border-spotify-green/20 text-spotify-green mb-2">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Frequently Asked</h2>
              <p className="text-xs text-spotify-light-gray font-light">
                Quick answers to common questions about using Mandala.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-white/5">
              {faqs.map((faq, index) => (
                <div key={index} className={`${index > 0 ? 'pt-4' : ''} space-y-1.5`}>
                  <h3 className="text-sm font-bold text-white leading-snug">{faq.q}</h3>
                  <p className="text-xs text-spotify-light-gray font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-spotify-light-gray text-[10px] pt-12">
        <p>&copy; 2026 Mandala. All rights reserved.</p>
      </footer>
    </div>
  );
}
