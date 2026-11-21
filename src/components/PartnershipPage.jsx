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
      window.dispatchEvent(new Event('lt_contact_updated'));
    } catch (err) {
      console.error('Failed to save partner request:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEntry(partnerRequest);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white-dirty text-dark-default flex flex-col font-['Inter',sans-serif]">
      {/* Top Banner Navigation Header */}
      <div className="bg-white border-b border-[#EBEBEB] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="size-9 rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#DFBD78] flex items-center justify-center text-black font-black text-sm shadow-md">
            LT
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-dark-default">LiveTournaments.in</h1>
            <p className="text-[10px] text-gray-500 font-mono">PARTNERSHIP &amp; SPONSORSHIP PORTAL</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-gray-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Home Arena</span>
        </button>
      </div>

      {/* Main Full-Page Form Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {submittedEntry ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center space-y-6 shadow-sm animate-fade-in my-8">
            <div className="size-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Submitted Successfully
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-3 uppercase tracking-tight">
                Partnership Request Received!
              </h2>
              <p className="text-xs text-gray-600 max-w-lg mx-auto mt-2">
                Thank you, <strong className="text-gray-900">{submittedEntry.contactPerson}</strong>. Your sponsorship proposal for <strong className="text-[#C5A059]">{submittedEntry.brand}</strong> has been received and our team will review it shortly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-left max-w-md mx-auto space-y-2 font-mono">
              <div className="flex justify-between text-gray-600">
                <span>Reference ID:</span>
                <span className="text-gray-900 font-bold">{submittedEntry.id}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Partnership Scope:</span>
                <span className="text-gray-900 font-bold text-right truncate max-w-[220px]">{submittedEntry.type}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Investment Tier:</span>
                <span className="text-emerald-700 font-bold">{submittedEntry.budget}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Contact Email:</span>
                <span className="text-gray-900 font-bold">{submittedEntry.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setSubmittedEntry(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-gray-200"
              >
                Submit Another Proposal
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-gold-primary hover:text-black transition-all cursor-pointer"
              >
                Return to Arena
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Title Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-dark-default text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm text-[#C5A059]">handshake</span>
                <span>PARTNER WITH LIVETOURNAMENTS.IN</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900">
                Official Partnership Portal
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
                Connect your brand, streaming channel, or esports organization with India's premier competitive gaming ecosystem.
              </p>
            </div>

            {/* Partnership Application Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 shadow-sm space-y-5 text-xs">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059] text-base">domain</span>
                  <span>1. Organization &amp; Contact Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Company / Brand / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company or Organization"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Username / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="WhatsApp / Phone"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website URL"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="border-b border-gray-100 pt-2 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059] text-base">tune</span>
                  <span>2. Partnership Scope &amp; Budget Pacing</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Partnership Category *
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs cursor-pointer transition-colors"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Estimated Budget Allocation *
                  </label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs font-mono cursor-pointer transition-colors"
                  >
                    <option>₹ 25,000 – ₹ 50,000 (Community Tournaments)</option>
                    <option>₹ 50,000 – ₹ 2,00,000 (Pro League Tier)</option>
                    <option>₹ 2,00,000 – ₹ 10,00,000 (National Championship)</option>
                    <option>Custom Enterprise / Multi-Season Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Partnership Requirements &amp; Deliverables *
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Enter your proposal details here..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <span className="material-symbols-outlined text-[#C5A059] text-base">verified_user</span>
                  <span>Confidential &bull; Direct Communication</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-gold-primary hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
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