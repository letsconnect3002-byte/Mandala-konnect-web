'use client';

import React, { useState } from 'react';
import { supabase, UserProfileSummary } from '@/lib/supabase';
import {
  X,
  Zap,
  GitFork,
  Coins,
  Sparkles,
  Briefcase,
  Users,
  Wallet,
  ShieldCheck,
  Check,
  Lock,
  Globe,
  Radio,
  FileText
} from 'lucide-react';

interface VouchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: {
    id: number;
    name: string;
    avatar_url?: string | null;
    profession?: string | null;
    company?: string | null;
  };
  currentUserProfile: UserProfileSummary;
  onVouched: (newVouch: any) => void;
}

interface RelationshipOption {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface IntentOption {
  label: string;
  hint: string;
  icon: React.ReactNode;
}

const RELATIONSHIP_OPTIONS: RelationshipOption[] = [
  {
    title: 'Fought in the trenches with',
    description: 'Close teammates, co-founders, or engineers who shipped code together.',
    icon: <Zap className="w-4 h-4 text-amber-400" />,
  },
  {
    title: 'Managed / Was managed by',
    description: 'Explicitly clarify reporting lines and executive leadership relations.',
    icon: <GitFork className="w-4 h-4 text-cyan-400" />,
  },
  {
    title: 'Backed / Funded',
    description: 'Reserved for investor-to-founder relationship tracking.',
    icon: <Coins className="w-4 h-4 text-emerald-400" />,
  },
  {
    title: 'Rising Star',
    description: 'Flag junior talent or high-potential individuals early in their trajectory.',
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
  },
];

const INTENT_OPTIONS: IntentOption[] = [
  {
    label: 'Would Hire',
    hint: 'Signal hiring interest confidentially',
    icon: <Briefcase className="w-3.5 h-3.5 text-blue-400" />,
  },
  {
    label: 'Would Fund',
    hint: 'Signal investment interest confidentially',
    icon: <Wallet className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    label: 'Would Work With',
    hint: 'Signal collaboration & co-founding interest',
    icon: <Users className="w-3.5 h-3.5 text-purple-400" />,
  },
];

export default function VouchModal({
  isOpen,
  onClose,
  targetProfile,
  currentUserProfile,
  onVouched,
}: VouchModalProps) {
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [optionalNote, setOptionalNote] = useState('');
  const [scope, setScope] = useState<'global' | 'network' | 'inner_circle' | 'profile_only'>('network');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleIntent = (label: string) => {
    if (selectedIntents.includes(label)) {
      setSelectedIntents(selectedIntents.filter((i) => i !== label));
    } else {
      setSelectedIntents([...selectedIntents, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelationship && selectedIntents.length === 0) {
      setErrorMsg('Please select a relationship context or at least one private intent tag.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      // Pack into formatted statement backward compatible with Flutter app
      const statementBuffer: string[] = [];
      if (selectedRelationship) {
        statementBuffer.push(`REL:[${selectedRelationship}]`);
      }
      if (selectedIntents.length > 0) {
        statementBuffer.push(`INTENTS:[${selectedIntents.join(', ')}]`);
      }
      if (optionalNote.trim()) {
        statementBuffer.push(`NOTE:[${optionalNote.trim()}]`);
      }
      const formattedStatement = statementBuffer.length > 0 ? statementBuffer.join(' ') : 'VOUCH';

      const feedScope = (selectedRelationship || optionalNote.trim()) ? scope : 'profile_only';

      const { data: inserted, error: insertError } = await supabase
        .from('user_vouches')
        .insert({
          voucher_id: currentUserProfile.id,
          vouchee_id: targetProfile.id,
          statement: formattedStatement,
          feed_scope: feedScope,
          relationship_type: selectedRelationship || null,
          private_intents: selectedIntents,
          optional_note: optionalNote.trim() || null,
        })
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
        .single();

      if (insertError) {
        // Check for duplicate constraint
        if (insertError.code === '23505' || insertError.message.includes('unique_voucher_vouchee')) {
          throw new Error('You have already vouched for this profile.');
        }
        if (insertError.message.includes('no_self_vouch')) {
          throw new Error('You cannot vouch for your own profile.');
        }
        throw insertError;
      }

      const formattedVouch = {
        ...inserted,
        voucher: Array.isArray(inserted.voucher) ? inserted.voucher[0] : inserted.voucher,
      };

      onVouched(formattedVouch);
      onClose();
    } catch (err: any) {
      console.error('Error submitting vouch:', err);
      setErrorMsg(err.message || 'Failed to submit vouch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const targetInitial = targetProfile.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#0F1013] border border-white/[0.10] rounded-t-[28px] sm:rounded-[24px] p-5 sm:p-7 w-full max-w-lg shadow-2xl relative animate-in slide-in-from-bottom-6 max-h-[90vh] overflow-y-auto overscroll-contain"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition p-1.5 rounded-full hover:bg-white/5"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mobile drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

        {/* Target Profile Card */}
        <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-white/[0.08]">
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#1E1F32] overflow-hidden flex items-center justify-center">
              {targetProfile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={targetProfile.avatar_url}
                  alt={targetProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-white">{targetInitial}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#A1A4B0] font-bold">VOUCHING FOR</span>
            </div>
            <h2 className="text-base font-bold text-white truncate">{targetProfile.name}</h2>
            {(targetProfile.profession || targetProfile.company) && (
              <p className="text-[11px] text-[#5E626E] truncate">
                {targetProfile.profession}
                {targetProfile.company ? ` • ${targetProfile.company}` : ''}
              </p>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SECTION 1: Relationship Context Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Relationship Context</span>
              </label>
              <span className="text-[10px] text-[#A1A4B0]">Public on Profile</span>
            </div>
            <p className="text-[11px] text-[#5E626E] mb-2.5">
              How do you know or work with {targetProfile.name}?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RELATIONSHIP_OPTIONS.map((rel) => {
                const isSelected = selectedRelationship === rel.title;
                return (
                  <button
                    key={rel.title}
                    type="button"
                    onClick={() => {
                      setSelectedRelationship(isSelected ? null : rel.title);
                    }}
                    className={`text-left p-3 rounded-[14px] border transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/[0.08] border-white text-white shadow-sm'
                        : 'bg-[#17181D] border-white/[0.08] hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {rel.icon}
                        <span className="text-xs font-bold text-white">{rel.title}</span>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-[#A1A4B0] line-clamp-2 leading-relaxed">
                      {rel.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Private Intent Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#A1A4B0]" />
                <span>Confidential Intent Tags</span>
              </label>
              <span className="text-[10px] text-[#A1A4B0] font-medium">100% Confidential</span>
            </div>
            <p className="text-[11px] text-[#5E626E] mb-2.5">
              Signal confidential intentions. Only revealed if {targetProfile.name} reciprocates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INTENT_OPTIONS.map((intent) => {
                const isSelected = selectedIntents.includes(intent.label);
                return (
                  <button
                    key={intent.label}
                    type="button"
                    onClick={() => toggleIntent(intent.label)}
                    className={`p-2.5 rounded-[14px] border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-[#17181D] border-white/[0.08] hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="flex-shrink-0">{intent.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">{intent.label}</div>
                    </div>
                    {isSelected && (
                      <div className="w-3.5 h-3.5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Optional Testimonial / Personal Note */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#A1A4B0]" />
                <span>Testimonial / Note <span className="text-[#5E626E] font-normal lowercase">(optional)</span></span>
              </label>
              <span className="text-[10px] text-[#5E626E]">{optionalNote.length}/280</span>
            </div>
            <textarea
              value={optionalNote}
              onChange={(e) => setOptionalNote(e.target.value.slice(0, 280))}
              placeholder="Share what makes them exceptional, their grit, domain mastery, or memorable projects..."
              rows={3}
              className="w-full p-3 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition resize-none leading-relaxed"
            />
          </div>

          {/* SECTION 4: Feed Visibility Scope */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#A1A4B0]" />
                <span>Feed Scope</span>
              </label>
              <span className="text-[10px] text-[#A1A4B0]">Audience visibility</span>
            </div>
            <p className="text-[11px] text-[#5E626E] mb-2.5">
              Choose which feed this vouch appears in.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'global', label: 'Global', icon: <Globe className="w-3.5 h-3.5" /> },
                { id: 'network', label: 'Network', icon: <Radio className="w-3.5 h-3.5" /> },
                { id: 'inner_circle', label: 'Inner Circle', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'profile_only', label: 'Profile Only', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScope(item.id as any)}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition flex items-center justify-center gap-1.5 ${
                    scope === item.id
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-[#17181D] border-white/[0.08] text-[#A1A4B0] hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voucher Attribution Footer */}
          <div className="p-2.5 rounded-xl bg-[#17181D] border border-white/[0.08] flex items-center justify-between text-[11px] text-[#A1A4B0]">
            <span>Vouching as:</span>
            <span className="font-semibold text-white">
              {currentUserProfile.name}
              {currentUserProfile.profession ? ` (${currentUserProfile.profession})` : ''}
            </span>
          </div>

          {/* Submit Button (White Stadium Button matching Flutter) */}
          <button
            type="submit"
            disabled={loading || (!selectedRelationship && selectedIntents.length === 0)}
            className="w-full py-3.5 rounded-full bg-white hover:bg-white/95 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Submit Official Vouch</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
