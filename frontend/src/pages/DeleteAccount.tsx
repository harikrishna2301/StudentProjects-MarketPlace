import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Trash2,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Lock,
  UserX,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DELETION_REASONS = [
  'Completed my academic semester / graduation',
  'Created a duplicate student account',
  'Privacy or data minimization preference (DPDPA 2023)',
  'No longer need capstone project kits',
  'Other reason',
];

export const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user, myOrders, claimedProjectIds, deleteAccount } = useAuth();

  const [selectedReason, setSelectedReason] = useState(DELETION_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [acknowledgeIrreversible, setAcknowledgeIrreversible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPhraseValid = confirmPhrase.trim() === 'DELETE';
  const canSubmit = isPhraseValid && acknowledgeIrreversible && !loading;

  const handlePermanentDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPhraseValid) {
      setError('Please type DELETE in uppercase to confirm permanent account deletion.');
      return;
    }
    if (!acknowledgeIrreversible) {
      setError('Please acknowledge that account deletion is permanent and irreversible.');
      return;
    }

    const fullReason = additionalNotes.trim()
      ? `${selectedReason} — ${additionalNotes.trim()}`
      : selectedReason;

    setLoading(true);
    try {
      await deleteAccount(fullReason);
      navigate('/login?deleted=1', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Unable to delete your account right now. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1A2846] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Account Security & Erasure (DPDPA 2023)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
            Delete Student Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
            Permanently delete your ProjectKit profile, credentials, and student workspace data.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#16224A] transition-colors self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Active Account Summary Card */}
      <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {user?.fullName || 'Student Account'}
            </div>
            <div className="text-xs text-slate-500 dark:text-[#94A3B8]">{user?.email}</div>
            {user?.collegeName && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {user.collegeName}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] text-center">
            <div className="font-mono font-bold text-slate-900 dark:text-white">
              {claimedProjectIds.length}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Free Claims</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] text-center">
            <div className="font-mono font-bold text-slate-900 dark:text-white">
              {myOrders.length}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#94A3B8]">Orders</div>
          </div>
        </div>
      </div>

      {/* Warning & Impact Disclosure */}
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/70 dark:bg-rose-950/30 p-5 sm:p-6 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              What happens when you permanently delete your account
            </h2>
            <ul className="space-y-1.5 text-xs text-rose-800 dark:text-rose-200/90 list-disc pl-4 leading-relaxed">
              <li>
                Your student profile, login credentials, and active session tokens will be{' '}
                <span className="font-semibold">immediately and permanently erased</span>.
              </li>
              <li>
                Your saved wishlist items, free project kit claims, and download links will be revoked.
              </li>
              <li>
                You will no longer be able to sign in with <span className="font-mono">{user?.email}</span> unless you create a brand-new account.
              </li>
              <li>
                Under the Digital Personal Data Protection Act (DPDPA) 2023, statutory tax invoice records are retained in archived compliance logs where legally mandated.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deletion Confirmation Form */}
      <form
        onSubmit={handlePermanentDelete}
        className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] p-6 sm:p-8 space-y-5 shadow-xs"
      >
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-200 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="deletion-reason-select" className="block text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
            Primary Reason for Leaving
          </label>
          <select
            id="deletion-reason-select"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-800 dark:text-[#F8FAFC] outline-none focus:border-rose-500"
          >
            {DELETION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="deletion-notes" className="block text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
            Additional Feedback (Optional)
          </label>
          <textarea
            id="deletion-notes"
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Share any feedback to help us improve student project kits..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-800 dark:text-[#F8FAFC] outline-none focus:border-rose-500 resize-none"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1A2846]">
          <label htmlFor="confirm-delete-input" className="block text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
            Type <span className="font-mono text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">DELETE</span> to confirm permanent removal
          </label>
          <div className="relative">
            <input
              id="confirm-delete-input"
              type="text"
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="Type DELETE"
              autoComplete="off"
              className="w-full pl-9 pr-9 py-2.5 text-xs font-mono bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-white outline-none focus:border-rose-500"
              required
            />
            <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            {isPhraseValid && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-2.5" />
            )}
          </div>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-[#CBD5E1]">
          <input
            type="checkbox"
            checked={acknowledgeIrreversible}
            onChange={(e) => setAcknowledgeIrreversible(e.target.checked)}
            className="mt-0.5 accent-rose-600 rounded cursor-pointer"
          />
          <span>
            I understand that deleting my student account (<span className="font-semibold text-slate-900 dark:text-white">{user?.email}</span>) is permanent, immediately terminates my session, and cannot be undone.
          </span>
        </label>

        <div className="pt-3 border-t border-slate-100 dark:border-[#1A2846] flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/dashboard/profile"
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#16224A] rounded-xl transition-colors"
          >
            Cancel & Keep Account
          </Link>

          <button
            type="submit"
            disabled={!canSubmit}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'Deleting Account...' : 'Permanently Delete My Account'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccount;
