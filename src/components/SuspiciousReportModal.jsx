import React, { useState } from 'react';
import { submitCloudSuspiciousReport } from '../services/cloudSync';

export default function SuspiciousReportModal({ isOpen, onClose, target, currentUser }) {
  const [category, setCategory] = useState('CHEATING');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState(() => currentUser?.name || currentUser?.username || '');
  const [reporterEmail, setReporterEmail] = useState(() => currentUser?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Please provide details regarding the suspicious activity.');
      return;
    }

    setIsSubmitting(true);
    const reportPayload = {
      targetType: target.type || 'TOURNAMENT', // 'TOURNAMENT' | 'SCRIM' | 'STREAM' | 'CHAMPIONSHIP'
      targetId: target.id || 'target_' + Date.now(),
      targetTitle: target.title || 'Untitled Listing',
      category,
      details,
      reporterName: reporterName || 'Anonymous Competitor',
      reporterEmail: reporterEmail || 'anonymous@livetournaments.in',
      reporterClan: currentUser?.clan || 'Unassigned'
    };

    const res = await submitCloudSuspiciousReport(reportPayload);
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Save copy in localStorage for client-side feedback
    try {
      const existing = JSON.parse(localStorage.getItem('lt_my_reports') || '[]');
      localStorage.setItem('lt_my_reports', JSON.stringify([reportPayload, ...existing]));
      window.dispatchEvent(new Event('lt_report_submitted'));
    } catch (err) {}
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121319] border border-red-500/40 p-6 sm:p-7 text-white shadow-2xl shadow-red-950/40 space-y-5 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                <span>Report Suspicious Activity</span>
              </h3>
              <p className="text-[10.5px] text-red-300/80 font-medium">
                Sent directly &amp; exclusively to Admin and Super Admin
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="size-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="size-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h4 className="text-base font-bold text-white">Incident Report Delivered</h4>
            <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
              Thank you for keeping LiveTournaments fair. Your report regarding <strong className="text-white">"{target.title}"</strong> has been encrypted and delivered directly to the Administrator review queue.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Done &amp; Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Target Card Preview */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9.5px] text-gray-400 uppercase font-bold block">Reporting Listing</span>
                <span className="font-bold text-white text-[12px] truncate max-w-[260px] block">
                  {target.title}
                </span>
                <span className="text-[10px] text-gold-primary font-mono">
                  Type: {target.type || 'TOURNAMENT'} &bull; ID: {target.id || 'N/A'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold uppercase border border-red-500/30">
                Flagged
              </span>
            </div>

            {/* Violation Category */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Violation Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0E] border border-white/15 text-xs text-white focus:border-red-400 outline-hidden cursor-pointer"
              >
                <option value="CHEATING">Unfair Play, Hacks, or Cheating</option>
                <option value="FAKE_CREDENTIALS">Fake Match, Invalid Room ID/Pass or Scam</option>
                <option value="PAYMENT_FRAUD">Prize Pool / Payment Non-Fulfillment</option>
                <option value="TOXICITY">Hate Speech, Abuse, or Stream Toxicity</option>
                <option value="IMPERSONATION">Clan or Organizer Impersonation</option>
                <option value="SUSPICIOUS_ACTIVITY">Suspicious Bot / Roster Behavior</option>
                <option value="OTHER">Other Terms of Service Violation</option>
              </select>
            </div>

            {/* Incident Details */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center justify-between">
                <span>Incident Details &amp; Evidence *</span>
                <span className="text-[10px] text-gray-400">Max 1,000 chars</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe what occurred, player IGNs, timestamps, or suspicious behavior observed..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0E] border border-white/15 text-xs text-white focus:border-red-400 outline-hidden placeholder:text-gray-500 resize-none"
                required
              />
            </div>

            {/* Reporter Info (Optional / prefilled) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Anonymous if empty"
                  className="w-full px-3 py-2 rounded-xl bg-[#090A0E] border border-white/15 text-xs text-white outline-hidden focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="For follow-up"
                  className="w-full px-3 py-2 rounded-xl bg-[#090A0E] border border-white/15 text-xs text-white outline-hidden focus:border-red-400"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-[10.5px] text-red-200/90 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">security</span>
              <span>This report is private. Opponents or organizers will never see your identity.</span>
            </div>

            {/* Action buttons */}
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-900/40 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>{isSubmitting ? 'Delivering...' : 'Submit to Admin'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
