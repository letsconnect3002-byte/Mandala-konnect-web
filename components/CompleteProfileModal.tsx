'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Briefcase,
  Building,
  Phone,
  Camera,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { supabase, UserProfileSummary } from '@/lib/supabase';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfileSummary;
  targetProfileName?: string;
  onCompleted: (updatedProfile: UserProfileSummary) => void;
}

const COMMON_ROLES = [
  'Software Engineer',
  'Founder',
  'Product Designer',
  'Product Manager',
  'Investor',
  'Researcher',
  'Growth Lead',
];

export default function CompleteProfileModal({
  isOpen,
  onClose,
  currentUserProfile,
  targetProfileName,
  onCompleted,
}: CompleteProfileModalProps) {
  const [name, setName] = useState(currentUserProfile.name || '');
  const [profession, setProfession] = useState(
    currentUserProfile.profession && currentUserProfile.profession.toLowerCase() !== 'member'
      ? currentUserProfile.profession
      : ''
  );
  const [company, setCompany] = useState(currentUserProfile.company || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUserProfile.phone_number || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUserProfile.avatar_url || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [linkedin, setLinkedin] = useState(currentUserProfile.linkedin || '');
  const [twitter, setTwitter] = useState(currentUserProfile.twitter || '');
  const [instagram, setInstagram] = useState(currentUserProfile.instagram || '');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle client-side image file selection and compression
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 300x300 for optimal performance and avatar storage
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
          setErrorMsg(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!profession.trim()) {
      setErrorMsg('Please enter your profession or current role.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      const updatePayload: Record<string, any> = {
        name: name.trim(),
        profession: profession.trim(),
        company: company.trim() || null,
        phone_number: phoneNumber.trim() || null,
        professional_phone_number: phoneNumber.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        linkedin: linkedin.trim() || null,
        twitter: twitter.trim() || null,
        instagram: instagram.trim() || null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', currentUserProfile.id)
        .select('id, owner_id, name, handle, email, profession, company, phone_number, avatar_url, linkedin, twitter, instagram')
        .single();

      if (error) throw error;

      const updated = (data as UserProfileSummary) || {
        ...currentUserProfile,
        ...updatePayload,
      };

      onCompleted(updated);
    } catch (err: any) {
      console.error('Failed to update profile details:', err);
      setErrorMsg(err.message || 'Failed to save profile details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F1013] border border-white/[0.10] rounded-t-[28px] sm:rounded-[28px] p-6 sm:p-7 w-full max-w-lg shadow-2xl relative animate-in slide-in-from-bottom-6 max-h-[92vh] overflow-y-auto">
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

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 p-0.5 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Complete Your Profile</h2>
          <p className="text-xs text-[#A1A4B0] mt-1.5 max-w-sm mx-auto leading-relaxed">
            {targetProfileName
              ? `Fill in your profile details before vouching for ${targetProfileName} so your endorsement carries authentic credibility.`
              : 'Fill in your profile details to establish your authentic identity on Mandala before vouching.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="p-4 rounded-2xl bg-[#17181D] border border-white/[0.06] flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1E1F32] flex items-center justify-center">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {name ? name.charAt(0).toUpperCase() : '?'}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white text-black hover:bg-white/90 shadow transition"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
                  Profile Photo
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] text-[#A1A4B0] hover:text-white underline transition"
                >
                  {showUrlInput ? 'Hide URL' : 'Use image URL'}
                </button>
              </div>
              <p className="text-[11px] text-[#A1A4B0] mt-0.5">
                Upload a clear picture of yourself
              </p>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-white text-[11px] font-semibold transition flex items-center gap-1.5"
                >
                  <Upload className="w-3 h-3" />
                  <span>Choose Photo</span>
                </button>
              </div>

              {showUrlInput && (
                <div className="mt-2.5">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#5E626E] focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
              />
            </div>
          </div>

          {/* Profession / Role */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#A1A4B0]">
                Profession / Current Role <span className="text-red-400">*</span>
              </label>
              <span className="text-[10px] text-[#5E626E]">Required for vouch credibility</span>
            </div>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
              />
            </div>

            {/* Quick role suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setProfession(role)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition ${
                    profession === role
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-[#17181D] text-[#A1A4B0] border-white/[0.08] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Company / Organization */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
              Company / Organization <span className="text-[#5E626E] font-normal">(recommended)</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp / Self-Employed"
                className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A1A4B0] mb-1.5">
              Phone Number <span className="text-[#5E626E] font-normal">(recommended)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#5E626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full pl-10 pr-4 py-2.5 bg-[#17181D] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30 transition"
              />
            </div>
          </div>

          {/* Social Links Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowSocials(!showSocials)}
              className="text-xs font-semibold text-[#A1A4B0] hover:text-white flex items-center gap-1.5 transition"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#5E626E]" />
              <span>{showSocials ? 'Hide social links' : '+ Add social links (LinkedIn, X, Instagram)'}</span>
            </button>

            {showSocials && (
              <div className="space-y-3 mt-3 p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.06] animate-in fade-in">
                <div>
                  <label className="block text-[10px] font-semibold text-[#A1A4B0] mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 bg-[#0F1013] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A1A4B0] mb-1">Twitter / X Profile</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/username or @username"
                    className="w-full px-3 py-2 bg-[#0F1013] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A1A4B0] mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@username"
                    className="w-full px-3 py-2 bg-[#0F1013] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-[#5E626E] focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-5"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Save Profile & Continue to Vouch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
