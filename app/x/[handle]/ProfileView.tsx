'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
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
  Plus,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { supabase, ensureUserProfile, UserProfileSummary } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import VouchModal from '@/components/VouchModal';

export interface VouchItem {
  id: string;
  statement?: string | null;
  relationship_type?: string | null;
  optional_note?: string | null;
  created_at?: string | null;
  voucher?: {
    id: number;
    name: string;
    handle?: string | null;
    avatar_url?: string | null;
    profession?: string | null;
    company?: string | null;
  } | null;
}

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
  vouches?: VouchItem[] | null;
  field_assignments?: Record<string, { c?: boolean; p?: boolean; pr?: boolean }> | null;
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

  // Auth & Vouch state
  const [currentUser, setCurrentUser] = useState<UserProfileSummary | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState('Sign in to vouch for this profile');
  const [vouchModalOpen, setVouchModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasVouched, setHasVouched] = useState(false);
  const [, setMyVouch] = useState<VouchItem | null>(null);
  const [vouchesList, setVouchesList] = useState<VouchItem[]>(profile.vouches || []);
  const [vouchCount, setVouchCount] = useState<number>(profile.vouchCount ?? (profile.vouches?.length ?? 0));

  const checkVouchStatus = async (voucherId: number, voucheeId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_vouches')
        .select(`
          id,
          statement,
          relationship_type,
          optional_note,
          created_at,
          voucher:profiles!user_vouches_voucher_id_fkey (
            id,
            name,
            handle,
            avatar_url,
            profession,
            company
          )
        `)
        .eq('voucher_id', voucherId)
        .eq('vouchee_id', voucheeId)
        .maybeSingle();

      if (data && !error) {
        setHasVouched(true);
        setMyVouch({
          ...data,
          voucher: Array.isArray(data.voucher) ? data.voucher[0] : data.voucher,
        });
      } else {
        setHasVouched(false);
        setMyVouch(null);
      }
    } catch (err) {
      console.error('Error checking vouch status:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted) {
        const myProfile = await ensureUserProfile(session.user);
        if (isMounted) {
          setCurrentUser(myProfile);
          if (myProfile && profile.id) {
            checkVouchStatus(myProfile.id, profile.id);
          }
        }
      } else if (isMounted) {
        setCurrentUser(null);
        setHasVouched(false);
        setMyVouch(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [profile.id]);

  const handleVouchClick = () => {
    if (!currentUser) {
      setAuthPrompt(`Sign in or create an account to vouch for ${profile.name}`);
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.id === profile.id) {
      showToast('You cannot vouch for your own profile.');
      return;
    }

    if (hasVouched) {
      showToast(`You have already vouched for ${profile.name}!`);
      return;
    }

    setVouchModalOpen(true);
  };

  const handleAuthSuccess = (newProfile: UserProfileSummary) => {
    setCurrentUser(newProfile);
    showToast(`Signed in as ${newProfile.name}`);
    if (newProfile.id !== profile.id && !hasVouched) {
      setTimeout(() => {
        setVouchModalOpen(true);
      }, 350);
    }
  };

  const handleVouchSubmitted = (newVouch: any) => {
    setVouchesList((prev) => [newVouch, ...prev]);
    setVouchCount((prev) => prev + 1);
    setHasVouched(true);
    setMyVouch(newVouch);
    showToast(`🎉 You have officially vouched for ${profile.name}!`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setHasVouched(false);
    setMyVouch(null);
    setUserMenuOpen(false);
    showToast('Signed out successfully');
  };

  const isOwnProfile = currentUser?.id === profile.id;
  const fa = profile.field_assignments;

  // Helper to check if a field is permitted to display.
  // "pr" (private) === true means DO NOT DISPLAY.
  const isFieldAllowed = (key: string): boolean => {
    if (!fa || typeof fa !== 'object') return true;

    let config = fa[key];

    if (!config) {
      const aliasMap: Record<string, string[]> = {
        bio: ['bio'],
        professional_bio: ['professionalBio', 'professional_bio'],
        profession: ['profession'],
        company: ['company'],
        email: ['email'],
        professional_email: ['professionalEmail', 'professional_email'],
        phone_number: ['phoneNumber', 'phone_number'],
        professional_phone_number: ['professionalPhoneNumber', 'professional_phone_number'],
        avatar_url: ['avatarUrl', 'avatar_url'],
        instagram: ['instagram'],
        linkedin: ['linkedin'],
        twitter: ['twitter'],
        spotify: ['spotify'],
        experience: ['experience'],
        education: ['education'],
        skills: ['skills'],
      };

      const aliases = aliasMap[key] || [];
      for (const alias of aliases) {
        if (fa[alias]) {
          config = fa[alias];
          break;
        }
      }
    }

    if (config && typeof config === 'object') {
      if (config.pr === true || (config as unknown) === 'true') {
        return false;
      }
    }

    return true;
  };

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
    if (!rawVal || !rawVal.trim() || !isFieldAllowed(platform)) return null;
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

  // Respect private flags for bio, profession, company, email, phone, avatar
  const casualBio = isFieldAllowed('bio') && profile.bio ? profile.bio.trim() : '';
  const profBio = isFieldAllowed('professional_bio') && profile.professional_bio ? profile.professional_bio.trim() : '';
  const bio = casualBio || profBio || '';

  const profession = isFieldAllowed('profession') ? profile.profession || '' : '';
  const company = isFieldAllowed('company') ? profile.company || '' : '';

  const casualEmail = isFieldAllowed('email') ? profile.email : '';
  const profEmail = isFieldAllowed('professional_email') ? profile.professional_email : '';
  const email = casualEmail || profEmail || '';

  const casualPhone = isFieldAllowed('phone_number') ? profile.phone_number : '';
  const profPhone = isFieldAllowed('professional_phone_number') ? profile.professional_phone_number : '';
  const phoneNumber = casualPhone || profPhone || '';

  const avatarUrl = isFieldAllowed('avatar_url') ? profile.avatar_url : null;
  const initial = name.charAt(0).toUpperCase() || '?';

  // Filter custom links: only include links where pr !== true
  const customLinks = (profile.custom_links || []).filter((link) => {
    const linkKey = link.id || link.name;
    return isFieldAllowed(linkKey);
  });

  const experience = isFieldAllowed('experience') ? profile.experience || [] : [];
  const education = isFieldAllowed('education') ? profile.education || [] : [];
  const skills = isFieldAllowed('skills') ? profile.skills || [] : [];

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&color=000000`;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-[#00F2FE]/20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="bg-[#17181D]/95 border border-white/10 text-white px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Centered Mobile Screen Container */}
      <div className="max-w-[430px] w-full mx-auto min-h-screen px-4 pt-5 pb-28 sm:border-x sm:border-white/[0.06] bg-[#000000] relative">
        {/* Header Capsule matching _buildSkeletonHeader() */}
        <header className="bg-[#0F1013] border border-white/10 rounded-[30px] py-2 px-3.5 flex items-center justify-between shadow-lg mb-6">
          <Link
            href="/"
            aria-label="Back to Home"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 ml-[-1px]" />
          </Link>
          
          <div className="text-center flex-1 mx-2 min-w-0">
            <h1 className="text-[17px] font-bold text-white tracking-tight leading-snug truncate">Profile Space</h1>
            <p className="text-[11px] text-[#A1A4B0] font-normal leading-snug">Digital Profile</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs transition"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0064E0] to-[#00F2FE] flex items-center justify-center text-[10px] font-bold text-white">
                    {currentUser.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-white/50" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#17181D] border border-white/15 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in">
                    {currentUser.handle && (
                      <Link
                        href={`/x/${currentUser.handle}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#00F2FE]" />
                        <span>My Profile</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthPrompt('Sign in or create an account on Jana');
                  setAuthModalOpen(true);
                }}
                className="py-1 px-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Identity Section (Avatar, Name, Vouch pill) */}
        <section className="flex items-center gap-4 mb-6">
          {/* Avatar with Pink-Cyan Gradient Border */}
          <div className="w-[72px] h-[72px] rounded-full p-[3px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0 shadow-md">
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

          {/* Name & Vouch */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-black text-white tracking-[0.5px] truncate leading-snug">{name}</h2>
            {company && (
              <p className="text-xs text-[#A1A4B0] truncate mt-0.5">{company}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              {isOwnProfile ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold">
                  Your Profile
                </span>
              ) : hasVouched ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/20 text-white/80 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-white/80" />
                  <span>Vouched</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVouchClick}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 text-white text-[10px] font-bold active:scale-95 transition"
                >
                  <Shield className="w-3 h-3 text-white" />
                  <span>Vouch</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* VOUCHES SECTION */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase">
              VOUCHES ({vouchCount})
            </h3>

            {!isOwnProfile && !hasVouched && (
              <button
                type="button"
                onClick={handleVouchClick}
                className="text-[10px] font-bold text-[#00F2FE] hover:underline flex items-center gap-1 active:scale-95 transition"
              >
                <span>+ Vouch</span>
              </button>
            )}
          </div>

          {vouchesList.length > 0 ? (
            <div className="space-y-2.5">
              {vouchesList.map((vouch) => {
                const voucherName = vouch.voucher?.name || 'Jana Member';
                const voucherAvatar = vouch.voucher?.avatar_url;
                const voucherInitial = voucherName.charAt(0).toUpperCase();
                const voucherHandle = vouch.voucher?.handle;
                const voucherRole = vouch.voucher?.profession || vouch.voucher?.company;

                return (
                  <div
                    key={vouch.id}
                    className="bg-[#0F1013] border border-white/[0.08] rounded-[16px] p-3.5 space-y-2 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1E1F32] flex items-center justify-center flex-shrink-0 border border-white/10">
                          {voucherAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={voucherAvatar}
                              alt={voucherName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[11px] font-bold text-white">{voucherInitial}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          {voucherHandle ? (
                            <Link
                              href={`/x/${voucherHandle}`}
                              className="text-xs font-bold text-white hover:text-[#00F2FE] transition block truncate"
                            >
                              {voucherName}
                            </Link>
                          ) : (
                            <div className="text-xs font-bold text-white truncate">{voucherName}</div>
                          )}
                          {voucherRole && (
                            <div className="text-[10px] text-[#A1A4B0] truncate">
                              {voucherRole}
                            </div>
                          )}
                        </div>
                      </div>

                      {vouch.relationship_type && (
                        <span className="px-2 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
                          {vouch.relationship_type}
                        </span>
                      )}
                    </div>

                    {vouch.statement && (
                      <p className="text-xs text-white/90 leading-relaxed italic border-l-2 border-[#00F2FE] pl-2.5 my-1.5 font-medium">
                        &ldquo;{vouch.statement}&rdquo;
                      </p>
                    )}

                    {vouch.optional_note && (
                      <p className="text-[11px] text-white/60 leading-relaxed pl-2.5">
                        {vouch.optional_note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#0F1013] border border-white/[0.08] rounded-[18px] p-6 text-center">
              <div className="w-9 h-9 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center mx-auto mb-2 text-[#00F2FE]">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white">No vouches yet</p>
              <p className="text-[11px] text-[#A1A4B0] mt-1 mb-4 leading-relaxed">
                Be the first to endorse {name.split(' ')[0]}&apos;s work, skills, and character on Jana.
              </p>
              {!isOwnProfile && (
                <button
                  type="button"
                  onClick={handleVouchClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-bold transition shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Vouch for {name.split(' ')[0]}</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* MY STORY (Bio) */}
        {bio && (
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-2">
              MY STORY
            </h3>
            <div className="px-0.5 py-1">
              <p className="text-white/70 text-sm leading-[1.6] whitespace-pre-line font-normal">
                {bio}
              </p>
            </div>
          </section>
        )}

        {/* CONNECTION DETAILS */}
        {(profession || email || phoneNumber) && (
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-1">
              CONNECTION DETAILS
            </h3>
            <div>
              {profession && (
                <div className="py-2.5 flex items-center justify-between border-b border-white/[0.04] last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <Briefcase className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#A1A4B0]">Profession</div>
                      <div className="text-sm font-semibold text-white truncate mt-0.5">{profession}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profession, 'Profession')}
                    className="p-1.5 text-[#5E626E] hover:text-white transition"
                    title="Copy Profession"
                  >
                    {copiedField === 'Profession' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {email && (
                <div className="py-2.5 flex items-center justify-between border-b border-white/[0.04] last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#A1A4B0]">Email Address</div>
                      <div className="text-sm font-semibold text-white truncate mt-0.5">{email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(email, 'Email')}
                    className="p-1.5 text-[#5E626E] hover:text-white transition"
                    title="Copy Email"
                  >
                    {copiedField === 'Email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {phoneNumber && (
                <div className="py-2.5 flex items-center justify-between border-b border-white/[0.04] last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <Smartphone className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#A1A4B0]">Phone Number</div>
                      <div className="text-sm font-semibold text-white truncate mt-0.5">{phoneNumber}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(phoneNumber, 'Phone Number')}
                    className="p-1.5 text-[#5E626E] hover:text-white transition"
                    title="Copy Phone Number"
                  >
                    {copiedField === 'Phone Number' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SOCIAL PROFILES */}
        {socials.length > 0 && (
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-2.5">
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
                  className="bg-transparent hover:bg-white/[0.03] p-1.5 rounded-xl transition flex items-center gap-2.5 text-left group"
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
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-1">
              CUSTOM LINKS
            </h3>
            <div>
              {customLinks.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="py-2.5 flex items-center justify-between border-b border-white/[0.04] last:border-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <LinkIcon className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#A1A4B0]">{link.name}</div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-[#00F2FE] truncate block mt-0.5 transition"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(link.url, link.name)}
                      className="p-1.5 text-[#5E626E] hover:text-white transition"
                      title="Copy Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#5E626E] hover:text-white transition"
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
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-2.5">
              EXPERIENCE
            </h3>
            <div className="space-y-2.5">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-[#0F1013] border border-white/[0.08] rounded-[14px] p-3.5"
                >
                  <div className="text-sm font-bold text-white">{exp.title}</div>
                  <div className="text-xs text-[#00F2FE] font-medium mt-0.5">{exp.company}</div>
                  {(exp.startDate || exp.endDate) && (
                    <div className="text-[11px] text-[#A1A4B0] mt-1">
                      {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                    </div>
                  )}
                  {exp.description && (
                    <p className="text-xs text-white/70 mt-2 leading-relaxed font-normal">
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
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-2.5">
              EDUCATION
            </h3>
            <div className="space-y-2.5">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#0F1013] border border-white/[0.08] rounded-[14px] p-3.5 flex items-start gap-3"
                >
                  <GraduationCap className="w-4 h-4 text-[#00F2FE] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">{edu.institution}</div>
                    {(edu.degree || edu.fieldOfStudy) && (
                      <div className="text-xs text-white/80 mt-0.5">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </div>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <div className="text-[11px] text-[#A1A4B0] mt-1">
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
          <section className="mb-6">
            <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase mb-2.5">
              SKILLS
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-[#17181D] border border-white/[0.08] text-white/90 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Navigation Bar (Centered within mobile frame) */}
      <footer className="fixed bottom-0 inset-x-0 bg-[#000000]/95 backdrop-blur-xl border-t border-[#17181D] py-3 px-4 z-40">
        <div className="max-w-[430px] mx-auto flex items-center gap-2.5">
          {/* Primary CTA: Stadium White button */}
          <button
            onClick={() => setConnectModalOpen(true)}
            className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-sm tracking-tight shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-black" />
            <span>Connect on Jana</span>
          </button>

          {!isOwnProfile && !hasVouched && (
            <button
              onClick={handleVouchClick}
              className="px-3.5 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 flex-shrink-0"
              title="Vouch for this user"
            >
              <Shield className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Vouch</span>
            </button>
          )}

          <button
            onClick={() => copyToClipboard(currentUrl, 'Profile Link')}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 active:scale-95 transition flex items-center justify-center text-white flex-shrink-0"
            title="Share Profile"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Social Action Sheet / Modal (Matching Flutter _showSocialActionSheet) */}
      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1013] border border-white/10 rounded-t-[24px] sm:rounded-2xl p-6 w-full max-w-[420px] shadow-2xl relative animate-in slide-in-from-bottom-8">
            <button
              onClick={() => setSocialModal(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-1 rounded-full bg-white/20 mx-auto mb-5 sm:hidden" />

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
                <div className="text-xs text-[#A1A4B0]">@{socialModal.handle}</div>
              </div>
            </div>

            <div className="bg-[#17181D] border border-white/10 rounded-xl p-3 mb-5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#00F2FE]">
              {socialModal.url}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  copyToClipboard(socialModal.url, `${socialModal.displayName} Link`);
                  setSocialModal(null);
                }}
                className="py-3 px-4 rounded-xl border border-white/15 bg-transparent hover:bg-white/5 text-[#A1A4B0] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
              <a
                href={socialModal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSocialModal(null)}
                className="py-3 px-4 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1013] border border-white/10 rounded-t-[24px] sm:rounded-2xl p-6 w-full max-w-[420px] shadow-2xl relative text-center animate-in slide-in-from-bottom-8">
            <button
              onClick={() => setConnectModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-1 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana" className="w-12 h-12 object-contain mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Connect with {name}</h3>
            <p className="text-xs text-[#A1A4B0] mt-1.5 mb-5 max-w-xs mx-auto leading-relaxed">
              Jana is a sealed, intentional space for your closest circle. Install the app to exchange cards and start a direct conversation.
            </p>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-2xl inline-block mx-auto mb-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeUrl} alt="Scan Profile QR" className="w-32 h-32 mx-auto" />
            </div>
            <p className="text-[11px] text-[#A1A4B0] mb-5">Scan with your phone camera</p>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition"
              >
                <span>Download on Apple App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.india.jana"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition"
              >
                <span>Get it on Google Play</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        actionPrompt={authPrompt}
      />

      {/* Vouch Modal */}
      {currentUser && (
        <VouchModal
          isOpen={vouchModalOpen}
          onClose={() => setVouchModalOpen(false)}
          targetProfile={{
            id: profile.id,
            name: profile.name,
            avatar_url: profile.avatar_url,
            profession: profile.profession,
            company: profile.company,
          }}
          currentUserProfile={currentUser}
          onVouched={handleVouchSubmitted}
        />
      )}
    </div>
  );
}
