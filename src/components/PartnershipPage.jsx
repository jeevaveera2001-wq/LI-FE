import React, { useState } from 'react';

export default function PartnershipPage({ onNavigate, currentUser }) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState(currentUser?.name || currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [partnerType, setPartnerType] = useState('Title Sponsorship & Main Trophy Partner');
  const [budgetTier, setBudgetTier] = useState('₹ 50,000 – ₹ 2,00,000 (Pro League Tier)');
  const [proposal, setProposal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim() || !proposal.trim()) {
      alert('Please fill all mandatory fields: Company, Contact Person, Email, WhatsApp, and Proposal details.');
      return;
    }

    setIsSubmitting(true);

    const partnerRequest = {
      id: 'partner_' + Date.now(),
      title: `${companyName} - ${partnerType}`,
      brand: companyName.trim(),
      contactPerson: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim() || 'N/A',
      type: partnerType,
      budget: budgetTier,
      proposal: proposal.trim(),
      status: 'PENDING',
      date: new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save directly to Super Admin Partner Hostings Queue
      const existing = JSON.parse(localStorage.getItem('lt_admin_partner_hostings') || '[]');
      localStorage.setItem('lt_admin_partner_hostings', JSON.stringify([partnerRequest, ...existing]));

      // 2. Also log in Super Admin Contact Messages
      const contactLogs = JSON.parse(localStorage.getItem('lt_admin_contact_messages') || '[]');
      contactLogs.unshift({
        id: 'ticket_' + Date.now(),
        name: `${contactName} (${companyName})`,
        email,
        phone,
        category: 'Partnership & Sponsorship Proposal',
        message: `Budget: ${budgetTier} | Type: ${partnerType}\n\nProposal: ${proposal}`,
        status: 'NEW',
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('lt_admin_contact_messages', JSON.stringify(contactLogs));
    } catch (err) {
      console.error('Failed to save partner request:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEntry(partnerRequest);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0E1118] text-white flex flex-col font-['Inter',sans-serif] selection:bg-[#DFBD78]/30">
      {/* Top Banner Navigation Header */}
      <div className="bg-[#141822] border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="size-9 rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#DFBD78] flex items-center justify-center text-black font-black text-sm shadow-md">
            LT
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white">LiveTournaments.in</h1>
            <p className="text-[10px] text-gray-400 font-mono">GLOBAL PARTNERSHIP &amp; SPONSORSHIP HUB</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Home Arena</span>
        </button>
      </div>

      {/* Main Full-Page Form Container */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {submittedEntry ? (
          <div className="bg-[#141822] rounded-2xl border border-[#DFBD78]/40 p-8 text-center space-y-6 shadow-2xl animate-fade-in my-8">
            <div className="size-20 rounded-full bg-[#DFBD78]/10 border border-[#DFBD78]/40 text-[#DFBD78] flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-4xl">verified</span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Directly Routed to Super Admin
              </span>
              <h2 className="text-2xl font-black text-white mt-3 uppercase tracking-tight">
                Partnership Request Dispatched Successfully!
              </h2>
              <p className="text-sm text-gray-300 max-w-lg mx-auto mt-2">
                Thank you, <strong className="text-white">{submittedEntry.contactPerson}</strong>. Your sponsorship proposal for <strong className="text-[#DFBD78]">{submittedEntry.brand}</strong> has been placed in the Super Admin priority queue.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0E14] border border-white/10 text-xs text-left max-w-md mx-auto space-y-2 font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Reference ID:</span>
                <span className="text-white font-bold">{submittedEntry.id}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Partnership Scope:</span>
                <span className="text-[#DFBD78] font-bold text-right truncate max-w-[220px]">{submittedEntry.type}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Investment Tier:</span>
                <span className="text-emerald-400 font-bold">{submittedEntry.budget}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Contact Email:</span>
                <span className="text-white font-bold">{submittedEntry.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setSubmittedEntry(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Submit Another Proposal
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD78] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#C5A059]/20 hover:opacity-95 transition-all"
              >
                Return to Arena
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Title Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#DFBD78] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">handshake</span>
                <span>PARTNER WITH LIVETOURNAMENTS.IN</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                Official Partnership Portal
              </h1>
              <p className="text-sm text-gray-400 max-w-xl mx-auto">
                Connect your brand, streaming channel, or esports organization with India's premier competitive gaming ecosystem. All applications are reviewed directly by the Super Admin team.
              </p>
            </div>

            {/* Partnership Application Form */}
            <form onSubmit={handleSubmit} className="bg-[#141822] rounded-2xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#DFBD78] text-base">domain</span>
                  <span>1. Organization &amp; Contact Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Company / Brand / Clan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Red Bull India / Monster Energy / S8UL"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Contact Person Name &amp; Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rohit Sharma (Head of Marketing)"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Official Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. partner@brand.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Website / Channel URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.yourcompany.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs font-mono"
                  />
                </div>
              </div>

              <div className="border-b border-white/10 pt-4 pb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#DFBD78] text-base">tune</span>
                  <span>2. Partnership Scope &amp; Budget Pacing</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Partnership Category *
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white focus:border-[#DFBD78] outline-hidden text-xs"
                  >
                    <option>Title Sponsorship &amp; Main Trophy Partner</option>
                    <option>Clan &amp; Esports Team Sponsor</option>
                    <option>Tournament Co-hosting &amp; Official Organizer</option>
                    <option>Live Stream Broadcast &amp; Production Partner</option>
                    <option>Media, PR &amp; Influencer Partner</option>
                    <option>Gaming Hardware &amp; Peripheral Sponsor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Estimated Budget Allocation *
                  </label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white focus:border-[#DFBD78] outline-hidden text-xs font-mono"
                  >
                    <option>₹ 25,000 – ₹ 50,000 (Community Tournaments)</option>
                    <option>₹ 50,000 – ₹ 2,00,000 (Pro League Tier)</option>
                    <option>₹ 2,00,000 – ₹ 10,00,000 (National Championship)</option>
                    <option>Custom Enterprise / Multi-Season Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Partnership Requirements &amp; Deliverables Proposal *
                </label>
                <textarea
                  required
                  rows={5}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Detail your brand objectives, campaign dates, expected broadcast logo placements, trophy naming rights, prize pool contribution, or special tournament format..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                  <span className="material-symbols-outlined text-[#DFBD78] text-base">verified_user</span>
                  <span>Direct clearance to Super Admin &bull; No middlemen &bull; Strict confidentiality</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD78] hover:from-[#DFBD78] hover:to-[#C5A059] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Routing to Super Admin...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Submit Partnership Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
