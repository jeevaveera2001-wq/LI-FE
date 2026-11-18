import React, { useState } from 'react';
import { X, HeartHandshake, Building2, User, Mail, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { saveSponsorRequest } from '../utils/portalData';
import confetti from 'canvas-confetti';

export const SponsorRequestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    city: '',
    email: '',
    phone: '',
    tierInterest: 'TITLE',
    notes: ''
  });
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundFx.playVictory();

    const cleanData = {
      name: formData.name.trim(),
      business: formData.business.trim(),
      city: formData.city.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      tierInterest: formData.tierInterest,
      notes: formData.notes.trim()
    };

    const res = saveSponsorRequest(cleanData);
    setIsSubmitting(false);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#E5C05B', '#2DD4BF', '#FFD700', '#10B981']
    });

    setSubmittedRequest(res.request);
  };

  const handleClose = () => {
    setSubmittedRequest(null);
    setFormData({
      name: '',
      business: '',
      city: '',
      email: '',
      phone: '',
      tierInterest: 'TITLE',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-lg bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A]">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submittedRequest ? (
          /* Submission Success View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 mx-auto flex items-center justify-center text-slate-950 shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-montserrat font-black text-xl text-[#0F172A] uppercase tracking-wide">
                PARTNERSHIP REQUEST SUBMITTED!
              </h3>
              <p className="text-xs text-[#64748B] font-rajdhani max-w-sm mx-auto">
                Thank you, <strong className="text-[#0F172A]">{submittedRequest.name}</strong>! Your brand sponsorship proposal for <strong className="text-amber-700">{submittedRequest.business}</strong> has been routed directly to the Match Ops Admin Desk.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] max-w-xs mx-auto space-y-2 text-left font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Ticket ID:</span>
                <span className="text-amber-700 font-bold">{submittedRequest.ticketId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Brand:</span>
                <span className="text-[#0F172A] font-bold">{submittedRequest.business}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">City:</span>
                <span className="text-[#0F172A]">{submittedRequest.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Status:</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                  PENDING REVIEW
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#64748B] font-rajdhani">
              Our Match Ops team will contact you at <strong className="text-[#0F172A]">{submittedRequest.phone}</strong> shortly.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-montserrat font-black text-xs uppercase tracking-wider shadow-sm cursor-pointer transition-all"
            >
              Done & Return to Portal
            </button>
          </div>
        ) : (
          /* Partnership Request Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-montserrat font-bold uppercase tracking-wider mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFICIAL ARENA SPONSORSHIP</span>
              </div>
              <h3 className="font-montserrat font-black text-lg sm:text-xl text-[#0F172A] uppercase tracking-wide">
                PARTNER WITH LIVE TOURNAMENTS.IN
              </h3>
              <p className="text-xs text-[#64748B] font-rajdhani mt-0.5">
                Fill your brand details below to feature across our arena tournaments and competitive leaderboards.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Row 1: Name & Business */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-600" />
                    <span>Contact Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:bg-white focus:outline-none placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-600" />
                    <span>Business / Brand Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Esports Gear / Gaming Brand"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:bg-white focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Row 2: City & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span>City *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai / Bangalore"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:bg-white focus:outline-none placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-amber-600" />
                    <span>Contact Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:bg-white focus:outline-none placeholder-slate-400 font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Email Address */}
              <div>
                <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-amber-600" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sponsor@brand.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:bg-white focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Row 4: Sponsorship Tier & Brand Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1">
                    Partnership Tier
                  </label>
                  <select
                    value={formData.tierInterest}
                    onChange={(e) => setFormData({ ...formData, tierInterest: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:outline-none text-xs"
                  >
                    <option value="TITLE">Title Energy Partner (Exclusive)</option>
                    <option value="PLATINUM">Official Device / Hardware Partner</option>
                    <option value="GOLD">Streaming / Tournament Sponsor</option>
                    <option value="COMMUNITY">Community & Gear Supporter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#334155] uppercase font-bold mb-1">
                    Website / Brand URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://yourbrand.com"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-amber-500 focus:bg-white focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-montserrat font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT PARTNERSHIP REQUEST'}</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-[#64748B] font-rajdhani">
              🛡️ Verified business inquiries only. Direct line to Live tournaments.in Match Operations management.
            </p>

          </form>
        )}

      </div>
    </div>
  );
};

export default SponsorRequestModal;
