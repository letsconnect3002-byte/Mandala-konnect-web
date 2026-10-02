import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProfileView, { ProfileData } from './ProfileView';
import { ArrowLeft, UserX } from 'lucide-react';

interface PageProps {
  params: Promise<{ handle: string }>;
}

async function fetchVouches(profileId: number) {
  try {
    const { data: vouches, error } = await supabase
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
      .eq('vouchee_id', profileId)
      .order('created_at', { ascending: false });

    if (error || !vouches) {
      return [];
    }

    return vouches.map((v: any) => ({
      ...v,
      voucher: Array.isArray(v.voucher) ? v.voucher[0] : v.voucher,
    }));
  } catch {
    return [];
  }
}

async function getProfile(rawHandle: string): Promise<ProfileData | null> {
  const handle = decodeURIComponent(rawHandle).trim();
  const nameWithSpaces = handle.replace(/[-_]+/g, ' ');
  const isNumeric = !isNaN(Number(handle));

  // Build query matching handle, exact name, or name with spaces
  const conditions = [
    `handle.ilike.${handle}`,
    `name.ilike.${handle}`,
    `name.ilike.${nameWithSpaces}`
  ];

  if (isNumeric) {
    conditions.push(`id.eq.${handle}`);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(conditions.join(','))
    .limit(1)
    .maybeSingle();

  let matchedProfile = data;

  if (error || !matchedProfile) {
    // Secondary fallback: check if removing non-alphanumerics matches
    const alphanumericInput = handle.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (alphanumericInput.length >= 2) {
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .limit(200);

      const match = allProfiles?.find((p) => {
        const pNameClean = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const pHandleClean = (p.handle || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return pNameClean === alphanumericInput || pHandleClean === alphanumericInput;
      });

      if (match) {
        matchedProfile = match;
      }
    }
  }

  if (!matchedProfile) {
    return null;
  }

  // Fetch full vouches for this profile
  let vouches: any[] = [];
  if (matchedProfile.id) {
    vouches = await fetchVouches(matchedProfile.id);
  }

  // Server-side privacy filter: completely strip fields where "pr" (private) is true
  const fa = matchedProfile.field_assignments;
  const isAllowed = (key: string): boolean => {
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

  const sanitizedProfile: ProfileData = {
    ...matchedProfile,
    bio: isAllowed('bio') ? matchedProfile.bio : null,
    professional_bio: isAllowed('professional_bio') ? matchedProfile.professional_bio : null,
    email: isAllowed('email') ? matchedProfile.email : null,
    professional_email: isAllowed('professional_email') ? matchedProfile.professional_email : null,
    phone_number: isAllowed('phone_number') ? matchedProfile.phone_number : null,
    professional_phone_number: isAllowed('professional_phone_number') ? matchedProfile.professional_phone_number : null,
    profession: isAllowed('profession') ? matchedProfile.profession : null,
    company: isAllowed('company') ? matchedProfile.company : null,
    avatar_url: isAllowed('avatar_url') ? matchedProfile.avatar_url : null,
    instagram: isAllowed('instagram') ? matchedProfile.instagram : null,
    linkedin: isAllowed('linkedin') ? matchedProfile.linkedin : null,
    twitter: isAllowed('twitter') ? matchedProfile.twitter : null,
    spotify: isAllowed('spotify') ? matchedProfile.spotify : null,
    custom_links: Array.isArray(matchedProfile.custom_links)
      ? matchedProfile.custom_links.filter((l: any) => isAllowed(l.id || l.name))
      : [],
    experience: isAllowed('experience') ? matchedProfile.experience : [],
    education: isAllowed('education') ? matchedProfile.education : [],
    skills: isAllowed('skills') ? matchedProfile.skills : [],
    vouchCount: vouches.length,
    vouches,
  };

  return sanitizedProfile;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);

  if (!profile) {
    return {
      title: 'Profile Not Found | Jana',
      description: 'The requested Jana profile could not be found.',
    };
  }

  const fa = profile.field_assignments;
  const isAllowed = (key: string): boolean => {
    if (!fa || typeof fa !== 'object') return true;
    const config = fa[key] || fa[key.toLowerCase()];
    if (config && typeof config === 'object') {
      if (config.pr === true || (config as unknown) === 'true') {
        return false;
      }
    }
    return true;
  };

  const bio = (isAllowed('bio') && profile.bio) || (isAllowed('professional_bio') && profile.professional_bio) || '';
  const profession = isAllowed('profession') ? profile.profession : '';
  const company = isAllowed('company') ? profile.company : '';
  const avatarUrl = isAllowed('avatar_url') ? profile.avatar_url : null;

  const title = `${profile.name} on Jana`;
  const description =
    bio ||
    (profession ? `${profession}${company ? ` at ${company}` : ''}` : 'View digital card and connect on Jana.');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: avatarUrl ? [{ url: avatarUrl }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: avatarUrl ? [avatarUrl] : [],
    },
    itunes: {
      appId: '6785388442',
      appArgument: `jana://x/${profile.handle || profile.id}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { handle } = await params;
  const profile = await getProfile(handle);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0E0F14] text-white flex flex-col items-center justify-center px-4 font-sans text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 mb-6">
          <UserX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
        <p className="text-sm text-[#9CA3AF] max-w-sm mb-8 leading-relaxed font-light">
          We couldn&apos;t find a Jana profile for <span className="text-white font-medium">@{handle}</span>. The profile may be private, moved, or the link may be mistyped.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <a
            href="/redirect"
            className="px-6 py-3 rounded-full bg-[#0064E0] hover:bg-[#0051B8] text-white text-xs font-bold transition"
          >
            Get Jana App
          </a>
        </div>
      </div>
    );
  }

  return <ProfileView profile={profile} />;
}
