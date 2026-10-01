'use client';

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { deleteUserProfileAccount } from '@/lib/supabase';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: number;
  profileName?: string;
  profileHandle?: string;
  onSuccess?: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  profileId,
  profileName,
  profileHandle,
  onSuccess,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isDeleting) return;
    setStep(1);
    setConfirmText('');
    setErrorMsg(null);
    onClose();
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await deleteUserProfileAccount(profileId);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to delete account. Please try again.');
        setIsDeleting(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to homepage
        window.location.href = '/';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0F1013] border border-red-500/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Trash2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {step === 1 ? 'Delete Account' : 'Confirm Permanent Deletion'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 text-sm text-red-200/90 leading-relaxed">
                <p className="font-semibold text-red-400 mb-1">
                  Are you sure you want to delete your account?
                </p>
                <p className="text-xs text-red-300/80">
                  This action is permanent and irreversible. Once deleted, your account cannot be recovered.
                </p>
              </div>

              <div className="space-y-2 text-xs text-white/70">
                <p className="font-medium text-white/90">The following will be deleted immediately:</p>
                <ul className="space-y-1.5 list-disc list-inside text-white/60">
                  <li>
                    Your profile <span className="text-white font-medium">{profileName || 'data'}</span> and handle{' '}
                    <span className="text-[#00F2FE] font-mono">{profileHandle ? `@${profileHandle}` : ''}</span>
                  </li>
                  <li>All vouches you have received and vouches you gave to others</li>
                  <li>Your resume sections, experience, education, and links</li>
                  <li>Your direct connections, chats, and network memberships</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-full border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p>
                  To prevent accidental deletion, please type <span className="font-bold text-white font-mono bg-red-950 px-1 py-0.5 rounded">DELETE</span> in all caps below to confirm:
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  disabled={isDeleting}
                  className="w-full bg-[#17181D] border border-white/10 focus:border-red-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none font-mono"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-full border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition disabled:opacity-30"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={confirmText.trim() !== 'DELETE' || isDeleting}
                  className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:hover:bg-red-600 text-white font-bold text-xs transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
