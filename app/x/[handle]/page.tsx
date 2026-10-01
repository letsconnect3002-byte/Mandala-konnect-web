import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProfileView, { ProfileData } from './ProfileView';
import { ArrowLeft, UserX } from 'lucide-react';

interface PageProps {
  params: Promise<{ handle: string }>;
}

async function getProfile(rawHandle: string): Promise<ProfileData | null> {
  const handle = decodeURIComponent(rawHandle).trim();
  const isNumeric = !isNaN(Number(handle));

  // Build query matching handle, anon_name, or numeric id
  let orQuery = `handle.ilike.${handle},anon_name.ilike.${handle}`;
  if (isNumeric) {
    orQuery += `,id.eq.${handle}`;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(orQuery)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  // Count vouches for this profile
  let vouchCount = 0;
  if (data.id) {
    const { count } = await supabase
      .from('user_vouches')
      .select('*', { count: 'exact', head: true })
      .eq('vouchee_id', data.id);
    vouchCount = count || 0;
  }

  return {
    ...data,
    vouchCount,
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
