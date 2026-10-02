'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Check,
  User,
  Mail,
  Smartphone,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ExperienceItem, EducationItem, ProfileData } from '@/app/x/[handle]/ProfileView';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSaveSuccess: (updated: Partial<ProfileData>) => void;
  onDeleteAccount?: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveSuccess,
  onDeleteAccount,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'skills' | 'socials'>('basic');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State (handle is immutable and cannot be edited)
  const [name, setName] = useState(profile.name || '');
  const [profession, setProfession] = useState(profile.profession || '');
  const [company, setCompany] = useState(profile.company || '');
  const [email, setEmail] = useState(profile.email || profile.professional_email || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || profile.professional_phone_number || '');
  const [bio, setBio] = useState(profile.bio || profile.professional_bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');

  // Socials
  const [linkedin, setLinkedin] = useState(profile.linkedin || '');
  const [twitter, setTwitter] = useState(profile.twitter || '');
  const [instagram, setInstagram] = useState(profile.instagram || '');
  const [spotify, setSpotify] = useState(profile.spotify || '');

  // Experience
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(() => {
    const raw = profile.experience;
    if (!raw) return [];
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((item: any, idx: number) => ({
      id: item.id?.toString() || `exp-${idx}-${Date.now()}`,
      title: item.title || item.position || '',
      company: item.company || '',
      companyUrl: item.company_url || item.companyUrl || '',
      location: item.location || '',
      startDate: item.start_date || item.startDate || '',
      endDate: item.end_date || item.endDate || '',
      isCurrent: Boolean(item.is_current || item.isCurrent),
      description: item.description || '',
    }));
  });

  // Education
  const [educationList, setEducationList] = useState<EducationItem[]>(() => {
    const raw = profile.education;
    if (!raw) return [];
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((item: any, idx: number) => ({
      id: item.id?.toString() || `edu-${idx}-${Date.now()}`,
      school: item.school || item.institution || '',
      degree: item.degree || '',
      fieldOfStudy: item.field_of_study || item.fieldOfStudy || '',
      startYear: item.start_year || item.startYear || '',
      endYear: item.end_year || item.endYear || '',
      description: item.description || '',
    }));
  });

  // Skills
  const [skillsList, setSkillsList] = useState<string[]>(() => {
    const raw = profile.skills;
    if (!raw) return [];
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((s: any) => String(s)).filter((s) => s.trim().length > 0);
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  if (!isOpen) return null;

  // Handlers for Experience
  const handleAddExperience = () => {
    setExperienceList((prev) => [
      {
        id: `exp-${Date.now()}`,
        title: '',
        company: '',
        companyUrl: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: true,
        description: '',
      },
      ...prev,
    ]);
  };

  const handleUpdateExperience = (idx: number, field: keyof ExperienceItem, val: any) => {
    setExperienceList((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      if (field === 'isCurrent' && val === true) {
        copy[idx].endDate = 'Present';
      }
      return copy;
    });
  };

  const handleRemoveExperience = (idx: number) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handlers for Education
  const handleAddEducation = () => {
    setEducationList((prev) => [
      {
        id: `edu-${Date.now()}`,
        school: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        description: '',
      },
      ...prev,
    ]);
  };

  const handleUpdateEducation = (idx: number, field: keyof EducationItem, val: any) => {
    setEducationList((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveEducation = (idx: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handlers for Skills
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!skillsList.includes(trimmed)) {
      setSkillsList((prev) => [...prev, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList((prev) => prev.filter((s) => s !== skill));
  };

  // Save to Supabase
  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      // Prepare DB payloads in snake_case format matching mobile app
      const experienceDb = experienceList
        .filter((e) => e.title.trim() || e.company.trim())
        .map((e) => ({
          id: e.id,
          title: e.title.trim(),
          company: e.company.trim(),
          company_url: e.companyUrl?.trim() || '',
          location: e.location?.trim() || '',
          start_date: e.startDate?.trim() || '',
          end_date: e.isCurrent ? 'Present' : e.endDate?.trim() || '',
          is_current: Boolean(e.isCurrent),
          description: e.description?.trim() || '',
        }));

      const educationDb = educationList
        .filter((ed) => (ed.school || '').trim())
        .map((ed) => ({
          id: ed.id,
          school: (ed.school || '').trim(),
          degree: ed.degree?.trim() || '',
          field_of_study: ed.fieldOfStudy?.trim() || '',
          start_year: ed.startYear?.trim() || '',
          end_year: ed.endYear?.trim() || '',
          description: ed.description?.trim() || '',
        }));

      const skillsDb = skillsList.filter((s) => s.trim().length > 0);

      // Auto-set current company if an experience item is current
      const currentExp = experienceDb.find((e) => e.is_current || e.end_date.toLowerCase() === 'present');
      const finalCompany = currentExp ? currentExp.company : company.trim();

      const updatePayload: Record<string, any> = {
        name: name.trim(),
        profession: profession.trim(),
        company: finalCompany,
        email: email.trim(),
        professional_email: email.trim(),
        phone_number: phoneNumber.trim(),
        professional_phone_number: phoneNumber.trim(),
        bio: bio.trim(),
        professional_bio: bio.trim(),
        avatar_url: avatarUrl.trim() || null,
        linkedin: linkedin.trim() || null,
        twitter: twitter.trim() || null,
        instagram: instagram.trim() || null,
        spotify: spotify.trim() || null,
        experience: experienceDb,
        education: educationDb,
        skills: skillsDb,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      onSaveSuccess({
        ...updatePayload,
        experience: experienceDb,
        education: educationDb,
        skills: skillsDb,
      });

      onClose();
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMsg(err.message || 'Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="bg-[#0F1013] border border-white/10 rounded-t-[28px] sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-8 overflow-hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
      >
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-2.5 mb-0.5 sm:hidden flex-shrink-0" />

        {/* Top Header */}
        <div className="p-3.5 sm:p-5 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Edit Profile</h2>
              <p className="text-[11px] text-[#A1A4B0]">Update your digital card and resume</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="py-1.5 px-5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm active:scale-95 transition disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-white/[0.06] overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'experience', label: `Experience (${experienceList.length})` },
            { id: 'education', label: `Education (${educationList.length})` },
            { id: 'skills', label: `Skills (${skillsList.length})` },
            { id: 'socials', label: 'Socials' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-white/5 hover:bg-white/10 text-[#A1A4B0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Avatar Preview & URL */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#17181D] border border-white/[0.06]">
                <div className="w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0 shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1E1F32] flex items-center justify-center">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[11px] font-bold text-[#A1A4B0] block mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunny"
                  className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              {/* Handle (Immutable) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-white/40" />
                    <span>Handle</span>
                  </label>
                  <span className="text-[10px] text-white/40 font-medium">Handle cannot be changed</span>
                </div>
                <div className="flex items-center bg-[#17181D]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm cursor-not-allowed select-none">
                  <span className="text-white/30 mr-1 font-mono">@</span>
                  <span className="text-white/70 font-mono text-sm">{profile.handle || 'user'}</span>
                </div>
              </div>

              {/* Profession & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Jana"
                    className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Bio / Story */}
              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  My Story (Bio)
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio, your journey, passions, or current focus..."
                  className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE] resize-none leading-relaxed"
                />
              </div>

              {/* Danger Zone: Delete Account */}
              {onDeleteAccount && (
                <div className="pt-4 border-t border-white/[0.08] mt-6">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div>
                      <p className="text-xs font-semibold text-red-400">Delete Account</p>
                      <p className="text-[11px] text-white/50">Permanently delete your profile and all associated data</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDeleteAccount();
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#A1A4B0]">Add your professional roles and experience</p>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {experienceList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#17181D] border border-white/[0.06] text-center">
                  <Briefcase className="w-8 h-8 text-[#5E626E] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">No experience listed</p>
                  <p className="text-[11px] text-[#A1A4B0] mt-1 mb-3">Add your past or current positions.</p>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="py-1.5 px-4 rounded-full bg-white text-black font-bold text-xs"
                  >
                    + Add Position
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {experienceList.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-4 rounded-2xl bg-[#17181D] border border-white/[0.08] relative space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-8">
                        <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleUpdateExperience(idx, 'title', e.target.value)}
                          placeholder="e.g. Product Manager"
                          className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            Company *
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                            placeholder="e.g. Jana"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            Company Website / URL
                          </label>
                          <input
                            type="url"
                            value={exp.companyUrl || ''}
                            onChange={(e) => handleUpdateExperience(idx, 'companyUrl', e.target.value)}
                            placeholder="https://company.com"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => handleUpdateExperience(idx, 'startDate', e.target.value)}
                            placeholder="e.g. June 2024"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            disabled={exp.isCurrent}
                            value={exp.isCurrent ? 'Present' : exp.endDate || ''}
                            onChange={(e) => handleUpdateExperience(idx, 'endDate', e.target.value)}
                            placeholder="e.g. Present"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F2FE] disabled:opacity-50"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-end pb-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                            <input
                              type="checkbox"
                              checked={Boolean(exp.isCurrent)}
                              onChange={(e) => handleUpdateExperience(idx, 'isCurrent', e.target.checked)}
                              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00F2FE] focus:ring-0"
                            />
                            <span>Current Role</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                          Role Description (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={exp.description || ''}
                          onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                          placeholder="Briefly describe what you built or led..."
                          className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F2FE] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#A1A4B0]">Add your academic background</p>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add School</span>
                </button>
              </div>

              {educationList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#17181D] border border-white/[0.06] text-center">
                  <GraduationCap className="w-8 h-8 text-[#5E626E] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">No education listed</p>
                  <p className="text-[11px] text-[#A1A4B0] mt-1 mb-3">Add colleges, universities or degrees.</p>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="py-1.5 px-4 rounded-full bg-white text-black font-bold text-xs"
                  >
                    + Add School
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {educationList.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="p-4 rounded-2xl bg-[#17181D] border border-white/[0.08] relative space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        title="Delete School"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-8">
                        <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                          School / College / University *
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)}
                          placeholder="e.g. UVCE, Stanford University"
                          className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                            placeholder="e.g. B-Tech, B.S., M.S."
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy || ''}
                            onChange={(e) => handleUpdateEducation(idx, 'fieldOfStudy', e.target.value)}
                            placeholder="e.g. Computer Science, AI/ML"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            Start Year
                          </label>
                          <input
                            type="text"
                            value={edu.startYear || ''}
                            onChange={(e) => handleUpdateEducation(idx, 'startYear', e.target.value)}
                            placeholder="e.g. 2021"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#A1A4B0] uppercase block mb-1">
                            End Year (or Expected)
                          </label>
                          <input
                            type="text"
                            value={edu.endYear || ''}
                            onChange={(e) => handleUpdateEducation(idx, 'endYear', e.target.value)}
                            placeholder="e.g. 2025"
                            className="w-full bg-[#0F1013] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  Add Skills & Superpowers
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill (e.g. Flutter, React, AI/ML) & hit Enter"
                    className="flex-1 bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider mb-2.5">
                  Current Skills ({skillsList.length})
                </p>
                {skillsList.length === 0 ? (
                  <p className="text-xs text-[#5E626E] italic">No skills added yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17181D] border border-white/15 text-white text-xs font-semibold"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SOCIALS */}
          {activeTab === 'socials' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  LinkedIn (Handle or URL)
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="e.g. santosh-patil or full URL"
                  className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  X (Twitter) Handle or URL
                </label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="e.g. santosh or full URL"
                  className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  Instagram Handle or URL
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="e.g. santosh_insta or full URL"
                  className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A1A4B0] uppercase tracking-wider block mb-1.5">
                  Spotify Username or URL
                </label>
                <input
                  type="text"
                  value={spotify}
                  onChange={(e) => setSpotify(e.target.value)}
                  placeholder="e.g. spotify_username"
                  className="w-full bg-[#17181D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00F2FE]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-3 flex-shrink-0 bg-[#0F1013]/95">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="py-2.5 px-4 rounded-full border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="py-2.5 px-6 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs transition active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
