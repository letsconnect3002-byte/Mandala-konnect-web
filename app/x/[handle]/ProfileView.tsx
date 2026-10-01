'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Briefcase,
  Mail,
  Smartphone,
  Link as LinkIcon,
  X as CloseIcon,
  GraduationCap,
  Sparkles,
  QrCode
} from 'lucide-react';

export interface ProfileData {
  id: number;
  name: string;
  profession?: string | null;
  company?: string | null;
  email?: string | null;
  professional_email?: string | null;
  phone_number?: string | null;
  professional_phone_number?: string | null;
  bio?: string | null;
  professional_bio?: string | null;
  avatar_url?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  spotify?: string | null;
  handle?: string | null;
  anon_name?: string | null;
  vibe_tag?: string | null;
  custom_links?: Array<{ id?: string; name: string; url: string }> | null;
  experience?: Array<{
    title: string;
    company: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }> | null;
  education?: Array<{
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startYear?: string;
    endYear?: string;
  }> | null;
  skills?: string[] | null;
  vouchCount?: number;
}

interface ProfileViewProps {
  profile: ProfileData;
}

export default function ProfileView({ profile }: ProfileViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [socialModal, setSocialModal] = useState<{
    platform: string;
    displayName: string;
    handle: string;
    url: string;
  } | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(`Copied ${label} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      showToast(`Failed to copy ${label}`);
    }
  };

  // Helper to extract clean social handle and link
  const getSocialInfo = (platform: string, rawVal?: string | null) => {
    if (!rawVal || !rawVal.trim()) return null;
    const clean = rawVal.trim();
    let url = clean;
    let handle = clean;

    if (platform === 'twitter') {
      if (clean.startsWith('http')) {
        url = clean;
        const parts = clean.split('/');
        handle = parts[parts.length - 1] || clean;
      } else {
        handle = clean.replace('@', '');
        url = `https://x.com/${handle}`;
      }
      return { platform: 'twitter', name: 'X (Twitter)', handle: handle.replace('@', ''), url };
    }

    if (platform === 'instagram') {
      if (clean.startsWith('http')) {
        url = clean;
        const parts = clean.split('/');
        handle = parts[parts.length - 1] || clean;
      } else {
        handle = clean.replace('@', '');
        url = `https://instagram.com/${handle}`;
      }
      return { platform: 'instagram', name: 'Instagram', handle: handle.replace('@', ''), url };
    }

    if (platform === 'linkedin') {
      if (clean.startsWith('http')) {
        url = clean;
        const parts = clean.split('/');
        handle = parts[parts.length - 1] || parts[parts.length - 2] || clean;
      } else {
        handle = clean;
        url = `https://linkedin.com/in/${handle}`;
      }
      return { platform: 'linkedin', name: 'LinkedIn', handle, url };
    }

    if (platform === 'spotify') {
      if (clean.startsWith('http')) {
        url = clean;
        const parts = clean.split('/');
        handle = parts[parts.length - 1] || clean;
      } else {
        handle = clean;
        url = `https://open.spotify.com/user/${handle}`;
      }
      return { platform: 'spotify', name: 'Spotify', handle, url };
    }

    return null;
  };

  const socials = [
    getSocialInfo('linkedin', profile.linkedin),
    getSocialInfo('twitter', profile.twitter),
    getSocialInfo('instagram', profile.instagram),
    getSocialInfo('spotify', profile.spotify),
  ].filter(Boolean) as Array<{ platform: string; name: string; handle: string; url: string }>;

  const name = profile.name || 'Jana User';
  const bio = (profile.bio && profile.bio.trim()) || (profile.professional_bio && profile.professional_bio.trim()) || '';
  const profession = profile.profession || '';
  const email = profile.email || profile.professional_email || '';
  const phoneNumber = profile.phone_number || profile.professional_phone_number || '';
  const avatarUrl = profile.avatar_url;
  const initial = name.charAt(0).toUpperCase() || '?';
  const customLinks = profile.custom_links || [];
  const experience = profile.experience || [];
  const education = profile.education || [];
  const skills = profile.skills || [];
  const vouches = profile.vouchCount ?? 0;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&color=000000`;

  return (
    <div className="min-h-screen bg-[#0E0F14] text-white font-sans relative selection:bg-[#00F2FE]/20 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="bg-[#1C1D26]/95 border border-white/10 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Skeleton Header (Capsule header matching Flutter) */}
        <header className="bg-[#171822]/90 border border-white/10 rounded-[30px] py-3 px-4 flex items-center justify-between shadow-lg backdrop-blur-md mb-8">
          <Link
            href="/"
            aria-label="Back to Jana Home"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Profile Space</h1>
            <p className="text-[11px] sm:text-xs text-[#9CA3AF] font-normal">Digital Profile</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana" className="w-5 h-5 object-contain opacity-70" />
          </div>
        </header>

        {/* Identity Section (Photo, Name, Vouch) */}
        <section className="flex items-center gap-4 mb-8">
          {/* Avatar with Pink-Cyan Gradient Border */}
          <div className="w-[74px] h-[74px] rounded-full p-[3px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0 shadow-md">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#1E1F32] flex items-center justify-center">
              {avatarUrl && avatarUrl.startsWith('http') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-white tracking-wide">{initial}</span>
              )}
            </div>
          </div>

          {/* Name & Vibe / Vouch */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-wide truncate">{name}</h2>
            {profile.company && (
              <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{profile.company}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/20 text-white/80 text-[10px] font-bold">
                <Shield className="w-2.5 h-2.5 text-[#00F2FE]" />
                <span>{vouches > 0 ? `${vouches} Vouches` : 'Verified Circle'}</span>
              </div>
              {profile.vibe_tag && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-[10px]">
                  <Sparkles className="w-2.5 h-2.5 text-[#EC4899]" />
                  <span>{profile.vibe_tag}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MY STORY (Bio) */}
        {bio && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-2.5">
              MY STORY
            </h3>
            <div className="p-1">
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-light">
                {bio}
              </p>
            </div>
          </section>
        )}

        {/* CONNECTION DETAILS */}
        {(profession || email || phoneNumber) && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-3">
              CONNECTION DETAILS
            </h3>
            <div className="space-y-1">
              {profession && (
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <Briefcase className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#9CA3AF]">Profession</div>
                      <div className="text-sm font-semibold text-white truncate">{profession}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profession, 'Profession')}
                    className="p-1.5 text-white/40 hover:text-white transition"
                    title="Copy Profession"
                  >
                    {copiedField === 'Profession' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {email && (
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#9CA3AF]">Email Address</div>
                      <div className="text-sm font-semibold text-white truncate">{email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(email, 'Email')}
                    className="p-1.5 text-white/40 hover:text-white transition"
                    title="Copy Email"
                  >
                    {copiedField === 'Email' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {phoneNumber && (
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <Smartphone className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#9CA3AF]">Phone Number</div>
                      <div className="text-sm font-semibold text-white truncate">{phoneNumber}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(phoneNumber, 'Phone Number')}
                    className="p-1.5 text-white/40 hover:text-white transition"
                    title="Copy Phone Number"
                  >
                    {copiedField === 'Phone Number' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SOCIAL PROFILES */}
        {socials.length > 0 && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-3">
              SOCIAL PROFILES
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {socials.map((social) => (
                <button
                  key={social.platform}
                  onClick={() =>
                    setSocialModal({
                      platform: social.platform,
                      displayName: social.name,
                      handle: social.handle,
                      url: social.url,
                    })
                  }
                  className="bg-[#171822]/80 hover:bg-[#1E1F2C] border border-white/10 hover:border-[#00F2FE]/40 transition-all duration-200 rounded-xl p-3 flex items-center gap-3 text-left group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00F2FE]/10 flex items-center justify-center text-[#00F2FE] flex-shrink-0">
                    {social.platform === 'twitter' && <span className="font-bold text-xs">𝕏</span>}
                    {social.platform === 'linkedin' && <span className="font-bold text-xs">in</span>}
                    {social.platform === 'instagram' && <span className="font-bold text-xs">📸</span>}
                    {social.platform === 'spotify' && <span className="font-bold text-xs">♫</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{social.name}</div>
                    <div className="text-[10px] text-[#00F2FE] truncate">@{social.handle}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOM LINKS */}
        {customLinks.length > 0 && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-3">
              CUSTOM LINKS
            </h3>
            <div className="space-y-2">
              {customLinks.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="bg-[#171822]/60 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <LinkIcon className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{link.name}</div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#9CA3AF] hover:text-[#00F2FE] truncate block transition"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(link.url, link.name)}
                      className="p-1.5 text-white/40 hover:text-white transition"
                      title="Copy Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-white/40 hover:text-white transition"
                      title="Open Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE TIMELINE */}
        {experience.length > 0 && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-3">
              EXPERIENCE
            </h3>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-[#171822]/60 border border-white/10 rounded-xl p-3.5 relative overflow-hidden"
                >
                  <div className="text-sm font-bold text-white">{exp.title}</div>
                  <div className="text-xs text-[#00F2FE] font-medium mt-0.5">{exp.company}</div>
                  {(exp.startDate || exp.endDate) && (
                    <div className="text-[11px] text-[#9CA3AF] mt-1">
                      {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                    </div>
                  )}
                  {exp.description && (
                    <p className="text-xs text-white/70 mt-2 leading-relaxed font-light">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-3">
              EDUCATION
            </h3>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#171822]/60 border border-white/10 rounded-xl p-3.5 flex items-start gap-3"
                >
                  <GraduationCap className="w-5 h-5 text-[#00F2FE] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">{edu.institution}</div>
                    {(edu.degree || edu.fieldOfStudy) && (
                      <div className="text-xs text-white/80 mt-0.5">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </div>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <div className="text-[11px] text-[#9CA3AF] mt-1">
                        {edu.startYear} {edu.endYear ? `— ${edu.endYear}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="mb-7">
            <h3 className="text-[11px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase mb-3">
              SKILLS
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/80 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-[#0E0F14]/80 backdrop-blur-xl border-t border-white/10 py-3.5 px-4 z-40">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setConnectModalOpen(true)}
            className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#0064E0] to-[#00A3FF] hover:from-[#0051B8] hover:to-[#0090E0] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#0064E0]/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Connect on Jana</span>
          </button>
          <button
            onClick={() => copyToClipboard(currentUrl, 'Profile Link')}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition flex items-center justify-center text-white"
            title="Share Profile"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Social Action Sheet / Modal (Matching Flutter Bottom Sheet) */}
      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#171822] border border-white/10 rounded-t-[28px] sm:rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in slide-in-from-bottom-8">
            <button
              onClick={() => setSocialModal(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-1 rounded-full bg-white/20 mx-auto mb-6 sm:hidden" />

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-full bg-[#00F2FE]/10 flex items-center justify-center text-[#00F2FE]">
                <span className="font-bold text-lg">
                  {socialModal.platform === 'twitter' && '𝕏'}
                  {socialModal.platform === 'linkedin' && 'in'}
                  {socialModal.platform === 'instagram' && '📸'}
                  {socialModal.platform === 'spotify' && '♫'}
                </span>
              </div>
              <div>
                <div className="text-base font-bold text-white">{socialModal.displayName}</div>
                <div className="text-xs text-[#9CA3AF]">@{socialModal.handle}</div>
              </div>
            </div>

            <div className="bg-[#1E1F2C] border border-white/10 rounded-xl p-3 mb-5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#00F2FE]">
              {socialModal.url}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  copyToClipboard(socialModal.url, `${socialModal.displayName} Link`);
                  setSocialModal(null);
                }}
                className="py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
              <a
                href={socialModal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSocialModal(null)}
                className="py-3 px-4 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Account</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Connect on Jana Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#171822] border border-white/10 rounded-t-[28px] sm:rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-center animate-in slide-in-from-bottom-8">
            <button
              onClick={() => setConnectModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-1 rounded-full bg-white/20 mx-auto mb-5 sm:hidden" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana" className="w-12 h-12 object-contain mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">Connect with {name}</h3>
            <p className="text-xs text-[#9CA3AF] mt-1.5 mb-5 max-w-xs mx-auto leading-relaxed">
              Jana is a sealed, intentional space for your closest circle. Install the app to exchange cards and start a direct conversation.
            </p>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-2xl inline-block mx-auto mb-4 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeUrl} alt="Scan Profile QR" className="w-36 h-36 mx-auto" />
            </div>
            <p className="text-[11px] text-[#9CA3AF] mb-5">Scan with your phone camera</p>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00F2FE]/40 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition"
              >
                <span>Download on Apple App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.india.jana"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00F2FE]/40 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition"
              >
                <span>Get it on Google Play</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
