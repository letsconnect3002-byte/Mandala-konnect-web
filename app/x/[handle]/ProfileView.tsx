'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { supabase, ensureUserProfile, UserProfileSummary } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import VouchModal from '@/components/VouchModal';
import EditProfileModal from '@/components/EditProfileModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';

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

export interface ExperienceItem {
  id?: string;
  title: string;
  company: string;
  companyUrl?: string;
  company_url?: string;
  location?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  isCurrent?: boolean;
  is_current?: boolean;
  description?: string;
}

export interface EducationItem {
  id?: string;
  school?: string;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  field_of_study?: string;
  startYear?: string;
  start_year?: string;
  endYear?: string;
  end_year?: string;
  description?: string;
}

export interface ProfileData {
  id: number;
  owner_id?: string | null;
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
  experience?: ExperienceItem[] | any;
  education?: EducationItem[] | any;
  skills?: string[] | any;
  vouchCount?: number;
  vouches?: VouchItem[] | null;
  field_assignments?: Record<string, { c?: boolean; p?: boolean; pr?: boolean }> | null;
}

interface ProfileViewProps {
  profile: ProfileData;
}

export function normalizeExperience(raw: any): ExperienceItem[] {
  if (!raw) return [];
  let list = raw;
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list.map((item: any, idx: number) => {
    const isCurrent =
      item.is_current === true ||
      item.is_current === 'true' ||
      item.isCurrent === true ||
      item.isCurrent === 'true' ||
      (typeof item.end_date === 'string' && item.end_date.toLowerCase().includes('present')) ||
      (typeof item.endDate === 'string' && item.endDate.toLowerCase().includes('present'));

    const rawEndDate = item.end_date || item.endDate || '';
    const endDate = isCurrent ? 'Present' : rawEndDate;

    return {
      id: item.id?.toString() || `exp-${idx}`,
      title: item.title || item.position || item.role || 'Role',
      company: item.company || item.company_name || '',
      companyUrl: item.company_url || item.companyUrl || '',
      location: item.location || '',
      startDate: item.start_date || item.startDate || '',
      endDate,
      isCurrent,
      description: item.description || '',
    };
  });
}

export function normalizeEducation(raw: any): EducationItem[] {
  if (!raw) return [];
  let list = raw;
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list.map((item: any, idx: number) => ({
    id: item.id?.toString() || `edu-${idx}`,
    school: item.school || item.institution || item.university || item.college || 'Institution',
    degree: item.degree || '',
    fieldOfStudy: item.field_of_study || item.fieldOfStudy || item.major || '',
    startYear: item.start_year || item.startYear || '',
    endYear: item.end_year || item.endYear || '',
    description: item.description || '',
  }));
}

export function normalizeSkills(raw: any): string[] {
  if (!raw) return [];
  let list = raw;
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list
    .map((s: any) => (typeof s === 'string' ? s : String(s)))
    .filter((s: string) => s.trim().length > 0);
}

export function getCompanyLogoUrl(url?: string): string {
  if (!url) return '';
  const clean = url.trim();
  if (!clean) return '';
  try {
    const formatted = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
    const parsed = new URL(formatted);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host && host.includes('.')) {
      return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    }
  } catch {}
  return '';
}

export default function ProfileView({ profile }: ProfileViewProps) {
  const router = useRouter();
  const [profileState, setProfileState] = useState<ProfileData>(profile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [socialModal, setSocialModal] = useState<{
    platform: string;
    displayName: string;
    handle: string;
    url: string;
  } | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  useEffect(() => {
    setProfileState(profile);
    setVouchesList(profile.vouches || []);
    setVouchCount(profile.vouchCount ?? (profile.vouches?.length ?? 0));
  }, [profile]);

  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (deleteModalOpen) {
      setDeleteModalOpen(false);
      return;
    }
    if (editModalOpen) {
      setEditModalOpen(false);
      return;
    }
    if (socialModal) {
      setSocialModal(null);
      return;
    }
    if (connectModalOpen) {
      setConnectModalOpen(false);
      return;
    }
    if (vouchModalOpen) {
      setVouchModalOpen(false);
      return;
    }
    if (authModalOpen) {
      setAuthModalOpen(false);
      return;
    }
    if (userMenuOpen) {
      setUserMenuOpen(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const hasNextHistory =
        window.history.state &&
        typeof window.history.state.idx === 'number' &&
        window.history.state.idx > 0;
      const isInternalReferrer =
        !!document.referrer && document.referrer.startsWith(window.location.origin);
      const hasHistory = window.history.length > 1;

      if (hasNextHistory || isInternalReferrer || hasHistory) {
        router.back();
        return;
      }
    }

    router.push('/');
  };

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
          if (myProfile && profileState.id) {
            checkVouchStatus(myProfile.id, profileState.id);
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
  }, [profileState.id]);

  // Handle ESC key to dismiss any open modals or menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteModalOpen) setDeleteModalOpen(false);
        if (editModalOpen) setEditModalOpen(false);
        if (socialModal) setSocialModal(null);
        if (connectModalOpen) setConnectModalOpen(false);
        if (vouchModalOpen) setVouchModalOpen(false);
        if (authModalOpen) setAuthModalOpen(false);
        if (userMenuOpen) setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteModalOpen, editModalOpen, socialModal, connectModalOpen, vouchModalOpen, authModalOpen, userMenuOpen]);

  const handleVouchClick = () => {
    if (!currentUser) {
      setAuthPrompt(`Sign in or create an account to vouch for ${profileState.name}`);
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.id === profileState.id) {
      showToast('You cannot vouch for your own profile.');
      return;
    }

    if (hasVouched) {
      showToast(`You have already vouched for ${profileState.name}!`);
      return;
    }

    setVouchModalOpen(true);
  };

  const handleAuthSuccess = (newProfile: UserProfileSummary) => {
    setCurrentUser(newProfile);
    showToast(`Signed in as ${newProfile.name}`);
    if (newProfile.id !== profileState.id && !hasVouched) {
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
    showToast(`🎉 You have officially vouched for ${profileState.name}!`);
  };

  const handleProfileUpdated = (updated: Partial<ProfileData>) => {
    setProfileState((prev) => ({
      ...prev,
      ...updated,
    }));
    showToast('Profile updated successfully!');
    if (updated.handle && updated.handle !== profileState.handle) {
      router.replace(`/x/${updated.handle}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setHasVouched(false);
    setMyVouch(null);
    setUserMenuOpen(false);
    showToast('Signed out successfully');
  };

  const isOwnProfile = Boolean(
    currentUser && (currentUser.id === profileState.id || (profileState.owner_id && currentUser.owner_id === profileState.owner_id))
  );

  const fa = profileState.field_assignments;

  // Helper to check if a field is permitted to display.
  // "pr" (private) === true means DO NOT DISPLAY.
  const isFieldAllowed = (key: string): boolean => {
    if (isOwnProfile) return true; // Owner can see all fields
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
    getSocialInfo('linkedin', profileState.linkedin),
    getSocialInfo('twitter', profileState.twitter),
    getSocialInfo('instagram', profileState.instagram),
    getSocialInfo('spotify', profileState.spotify),
  ].filter(Boolean) as Array<{ platform: string; name: string; handle: string; url: string }>;

  const name = profileState.name || 'Jana User';

  // Respect private flags
  const casualBio = isFieldAllowed('bio') && profileState.bio ? profileState.bio.trim() : '';
  const profBio = isFieldAllowed('professional_bio') && profileState.professional_bio ? profileState.professional_bio.trim() : '';
  const bio = casualBio || profBio || '';

  const profession = isFieldAllowed('profession') ? profileState.profession || '' : '';
  const company = isFieldAllowed('company') ? profileState.company || '' : '';

  const casualEmail = isFieldAllowed('email') ? profileState.email : '';
  const profEmail = isFieldAllowed('professional_email') ? profileState.professional_email : '';
  const email = casualEmail || profEmail || '';

  const casualPhone = isFieldAllowed('phone_number') ? profileState.phone_number : '';
  const profPhone = isFieldAllowed('professional_phone_number') ? profileState.professional_phone_number : '';
  const phoneNumber = casualPhone || profPhone || '';

  const avatarUrl = isFieldAllowed('avatar_url') ? profileState.avatar_url : null;
  const initial = name.charAt(0).toUpperCase() || '?';

  // Custom links
  const customLinks = (profileState.custom_links || []).filter((link) => {
    const linkKey = link.id || link.name;
    return isFieldAllowed(linkKey);
  });

  // Normalized Experience, Education, Skills
  const rawExperience = isFieldAllowed('experience') ? profileState.experience : [];
  const experience = normalizeExperience(rawExperience);

  const rawEducation = isFieldAllowed('education') ? profileState.education : [];
  const education = normalizeEducation(rawEducation);

  const rawSkills = isFieldAllowed('skills') ? profileState.skills : [];
  const skills = normalizeSkills(rawSkills);

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
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go Back"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white flex-shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 ml-[-1px]" />
          </button>
          
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
                    {isOwnProfile ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setEditModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition text-left"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#00F2FE]" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      currentUser.handle && (
                        <Link
                          href={`/x/${currentUser.handle}`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-[#00F2FE]" />
                          <span>My Profile</span>
                        </Link>
                      )
                    )}
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setDeleteModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition text-left"
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

        {/* Identity Section (Avatar, Name, Vouch / Edit Profile) */}
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

          {/* Name & Actions */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-black text-white tracking-[0.5px] truncate leading-snug">{name}</h2>
            {company && (
              <p className="text-xs text-[#A1A4B0] truncate mt-0.5">{company}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 text-white text-[11px] font-bold active:scale-95 transition"
                >
                  <Pencil className="w-3 h-3 text-[#00F2FE]" />
                  <span>Edit Profile</span>
                </button>
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase">
                MY STORY
              </h3>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-[10px] font-bold text-[#00F2FE] hover:underline"
                >
                  Edit Story
                </button>
              )}
            </div>
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
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase">
                CONNECTION DETAILS
              </h3>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-[10px] font-bold text-[#00F2FE] hover:underline"
                >
                  Edit Details
                </button>
              )}
            </div>
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

        {/* WORK EXPERIENCE (Replicated from resume_sections_widget.dart) */}
        {(experience.length > 0 || isOwnProfile) && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase">
                EXPERIENCE
              </h3>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-[10px] font-bold text-[#00F2FE] hover:underline flex items-center gap-1 active:scale-95 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Role</span>
                </button>
              )}
            </div>

            {experience.length === 0 ? (
              <div className="bg-[#0F1013] border border-white/[0.08] rounded-[16px] p-5 text-center">
                <Briefcase className="w-6 h-6 text-[#5E626E] mx-auto mb-1.5" />
                <p className="text-xs text-[#A1A4B0]">No work experience added yet.</p>
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="mt-2.5 py-1 px-3.5 rounded-full bg-white text-black font-bold text-xs"
                  >
                    + Add Experience
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#0F1013] border border-white/[0.08] rounded-[18px] p-4 divide-y divide-white/[0.06]">
                {experience.map((exp, idx) => {
                  const logoUrl = getCompanyLogoUrl(exp.companyUrl);
                  const initialChar = exp.company ? exp.company.charAt(0).toUpperCase() : '💼';

                  return (
                    <div key={exp.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
                      {/* Company Avatar / Logo */}
                      <div className="w-11 h-11 rounded-xl bg-[#17181D] border border-white/[0.08] flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                        {logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logoUrl}
                            alt={exp.company}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#00F2FE]">{initialChar}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[15px] font-bold text-[#F4F4F6] leading-snug">
                            {exp.title}
                          </h4>
                          {isOwnProfile && (
                            <button
                              type="button"
                              onClick={() => setEditModalOpen(true)}
                              className="text-[#A1A4B0] hover:text-white p-1"
                              title="Edit Experience"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Company Name & Link */}
                        <div className="mt-0.5">
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl.startsWith('http') ? exp.companyUrl : `https://${exp.companyUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[13.5px] font-semibold text-[#A1A4B0] hover:text-[#00F2FE] inline-flex items-center gap-1 transition"
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-3 h-3 text-[#00F2FE]" />
                            </a>
                          ) : (
                            <span className="text-[13.5px] font-semibold text-[#A1A4B0]">
                              {exp.company}
                            </span>
                          )}
                        </div>

                        {/* Dates & Location */}
                        {(exp.startDate || exp.endDate || exp.location) && (
                          <div className="text-xs text-[#5E626E] mt-1 font-medium">
                            {exp.startDate && `${exp.startDate}`}
                            {exp.endDate && ` – ${exp.endDate}`}
                            {exp.location && ` · ${exp.location}`}
                          </div>
                        )}

                        {/* Description */}
                        {exp.description && (
                          <p className="text-[12.5px] text-white/70 mt-1.5 leading-relaxed font-normal whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* EDUCATION (Replicated from resume_sections_widget.dart) */}
        {(education.length > 0 || isOwnProfile) && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase">
                EDUCATION
              </h3>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-[10px] font-bold text-[#00F2FE] hover:underline flex items-center gap-1 active:scale-95 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add School</span>
                </button>
              )}
            </div>

            {education.length === 0 ? (
              <div className="bg-[#0F1013] border border-white/[0.08] rounded-[16px] p-5 text-center">
                <GraduationCap className="w-6 h-6 text-[#5E626E] mx-auto mb-1.5" />
                <p className="text-xs text-[#A1A4B0]">No education listed yet.</p>
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="mt-2.5 py-1 px-3.5 rounded-full bg-white text-black font-bold text-xs"
                  >
                    + Add School
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#0F1013] border border-white/[0.08] rounded-[18px] p-4 divide-y divide-white/[0.06]">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#17181D] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <GraduationCap className="w-5 h-5 text-[#00F2FE]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[15px] font-bold text-[#F4F4F6] leading-snug">
                          {edu.school}
                        </h4>
                        {isOwnProfile && (
                          <button
                            type="button"
                            onClick={() => setEditModalOpen(true)}
                            className="text-[#A1A4B0] hover:text-white p-1"
                            title="Edit Education"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {(edu.degree || edu.fieldOfStudy) && (
                        <div className="text-[13px] text-[#A1A4B0] mt-0.5">
                          {edu.degree}
                          {edu.degree && edu.fieldOfStudy ? ' in ' : ''}
                          {edu.fieldOfStudy}
                        </div>
                      )}

                      {(edu.startYear || edu.endYear) && (
                        <div className="text-xs text-[#5E626E] mt-1 font-medium">
                          {edu.startYear}
                          {edu.endYear ? ` – ${edu.endYear}` : ''}
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-[12.5px] text-white/70 mt-1.5 leading-relaxed font-normal whitespace-pre-line">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SKILLS & SUPERPOWERS (Replicated from resume_sections_widget.dart) */}
        {(skills.length > 0 || isOwnProfile) && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-[#A1A4B0] tracking-[1.5px] uppercase">
                SKILLS & SUPERPOWERS
              </h3>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-[10px] font-bold text-[#00F2FE] hover:underline flex items-center gap-1 active:scale-95 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Skill</span>
                </button>
              )}
            </div>

            {skills.length === 0 ? (
              <div className="bg-[#0F1013] border border-white/[0.08] rounded-[16px] p-5 text-center">
                <Sparkles className="w-6 h-6 text-[#5E626E] mx-auto mb-1.5" />
                <p className="text-xs text-[#A1A4B0]">No skills added yet.</p>
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="mt-2.5 py-1 px-3.5 rounded-full bg-white text-black font-bold text-xs"
                  >
                    + Add Skills
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-[#17181D] border border-white/[0.12] hover:border-white/25 text-white/90 text-[13px] font-semibold transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Floating Bottom Navigation Bar (Centered within mobile frame) */}
      <footer className="fixed bottom-0 inset-x-0 bg-[#000000]/95 backdrop-blur-xl border-t border-[#17181D] py-3 px-4 z-40">
        <div className="max-w-[430px] mx-auto flex items-center gap-2.5">
          {isOwnProfile ? (
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-sm tracking-tight shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Pencil className="w-4 h-4 text-black" />
              <span>Edit Profile Details</span>
            </button>
          ) : (
            <>
              {/* Primary CTA: Stadium White button */}
              <button
                onClick={() => setConnectModalOpen(true)}
                className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-sm tracking-tight shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-black" />
                <span>Connect on Jana</span>
              </button>

              {!hasVouched && (
                <button
                  onClick={handleVouchClick}
                  className="px-3.5 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                  title="Vouch for this user"
                >
                  <Shield className="w-3.5 h-3.5 text-[#00F2FE]" />
                  <span>Vouch</span>
                </button>
              )}
            </>
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
            id: profileState.id,
            name: profileState.name,
            avatar_url: profileState.avatar_url,
            profession: profileState.profession,
            company: profileState.company,
          }}
          currentUserProfile={currentUser}
          onVouched={handleVouchSubmitted}
        />
      )}

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          profile={profileState}
          onSaveSuccess={handleProfileUpdated}
          onDeleteAccount={() => setDeleteModalOpen(true)}
        />
      )}

      {/* Delete Account Modal */}
      {currentUser && (
        <DeleteAccountModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          profileId={currentUser.id}
          profileName={currentUser.name}
          profileHandle={currentUser.handle || undefined}
          onSuccess={() => {
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
}
