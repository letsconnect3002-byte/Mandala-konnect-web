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

  return {
    ...matchedProfile,
    vouchCount: vouches.length,
    vouches,
  };
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

  const title = `${profile.name} on Jana`;
  const description =
    profile.bio ||
    profile.professional_bio ||
    (profile.profession ? `${profile.profession}${profile.company ? ` at ${profile.company}` : ''}` : 'View digital card and connect on Jana.');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
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
