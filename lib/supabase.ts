import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvzblxozqftheowpazvx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2emJseG96cWZ0aGVvd3BhenZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzEwNDQsImV4cCI6MjA5NDkwNzA0NH0.nEA542Y-2vVr89D-5DAO6Hj3kLxaRqc15E3ZlirvtTE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfileSummary {
  id: number;
  owner_id: string;
  name: string;
  handle?: string | null;
  email?: string | null;
  profession?: string | null;
  company?: string | null;
  avatar_url?: string | null;
}

export function generateHandleSlug(input: string): string {
  let s = input.toLowerCase().trim();
  s = s.replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  return s || 'user';
}

// In-flight promise cache to prevent concurrent race conditions on profile creation
const inFlightProfilePromises = new Map<string, Promise<UserProfileSummary | null>>();

export async function ensureUserProfile(
  user: { id: string; email?: string; user_metadata?: Record<string, any> },
  extra?: { name?: string; profession?: string; avatarUrl?: string }
): Promise<UserProfileSummary | null> {
  if (inFlightProfilePromises.has(user.id)) {
    return inFlightProfilePromises.get(user.id)!;
  }

  const promise = (async (): Promise<UserProfileSummary | null> => {
    try {
      // 1. Check if profile already exists for this owner_id
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('id, owner_id, name, handle, email, profession, company, avatar_url')
        .eq('owner_id', user.id)
        .eq('is_my_profile', true)
        .limit(1)
        .maybeSingle();

      if (existing && !fetchErr) {
        return existing as UserProfileSummary;
      }

      // 2. Derive defaults from OAuth metadata or user parameters
      const meta = user.user_metadata || {};
      const name =
        extra?.name?.trim() ||
        meta.full_name?.toString()?.trim() ||
        meta.name?.toString()?.trim() ||
        (user.email ? user.email.split('@')[0] : 'User');
      const email = user.email || '';
      const avatarUrl =
        extra?.avatarUrl ||
        meta.avatar_url?.toString()?.trim() ||
        meta.picture?.toString()?.trim() ||
        '';
      const profession = extra?.profession?.trim() || 'Member';
      const handle = generateHandleSlug(name !== 'User' ? name : (email.split('@')[0] || 'user'));

      const defaultFieldAssignments = {
        name: { c: true, p: true, pr: false },
        avatarUrl: { c: true, p: true, pr: false },
        email: { c: true, p: true, pr: false },
        bio: { c: true, p: true, pr: false },
        profession: { c: false, p: true, pr: false },
        company: { c: false, p: true, pr: false },
        phone_number: { c: false, p: false, pr: true },
      };

      const { data: newProfile, error: insertErr } = await supabase
        .from('profiles')
        .insert({
          owner_id: user.id,
          name,
          profession,
          email,
          avatar_url: avatarUrl,
          handle,
          is_my_profile: true,
          show_profile_to_connections: true,
          field_assignments: defaultFieldAssignments,
        })
        .select('id, owner_id, name, handle, email, profession, company, avatar_url')
        .single();

      if (insertErr) {
        // If insert failed due to concurrent execution or conflict, try fetching again
        const { data: retryProfile } = await supabase
          .from('profiles')
          .select('id, owner_id, name, handle, email, profession, company, avatar_url')
          .eq('owner_id', user.id)
          .eq('is_my_profile', true)
          .limit(1)
          .maybeSingle();

        if (retryProfile) {
          return retryProfile as UserProfileSummary;
        }

        console.error('Error inserting default profile:', insertErr.message || JSON.stringify(insertErr));
        return null;
      }

      return newProfile as UserProfileSummary;
    } catch (err) {
      console.error('Exception in ensureUserProfile:', err);
      return null;
    } finally {
      inFlightProfilePromises.delete(user.id);
    }
  })();

  inFlightProfilePromises.set(user.id, promise);
  return promise;
}

export async function getCurrentUserProfile(): Promise<UserProfileSummary | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return ensureUserProfile(session.user);
}
