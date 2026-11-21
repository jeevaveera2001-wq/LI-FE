import React, { useState } from 'react';

export default function ContactUsSection({ onNavigate, currentUser }) {
  const [name, setName] = useState(currentUser?.name || currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Partnership & Sponsorship Proposal');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    const ticket = {
      id: 'ticket_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || 'Not Provided',
      category,
      message: message.trim(),
      status: 'NEW',
      submittedAt: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      // 1. Save to Super Admin Contact & Support Messages
      const existing = JSON.parse(localStorage.getItem('lt_admin_contact_messages') || '[]');
      localStorage.setItem('lt_admin_contact_messages', JSON.stringify([ticket, ...existing]));

      // 2. If Partnership request, also sync to Partner Hostings queue for Super Admin review
      if (category.includes('Partnership') || category.includes('Sponsorship')) {
        const partnerReqs = JSON.parse(localStorage.getItem('lt_admin_partner_hostings') || '[]');
        const partnerEntry = {
          id: 'partner_' + Date.now(),
          title: `Brand & Creator Partnership: ${name}`,
          brand: name,
          contact: email,
          phone: phone || 'Provided in Ticket',
          proposal: message,
          status: 'PENDING',
          date: ticket.dateStr,
          budget: 'Direct Negotiation'
        };
        localStorage.setItem('lt_admin_partner_hostings', JSON.stringify([partnerEntry, ...partnerReqs]));
      }
    } catch (err) {
      console.error('Error saving contact ticket:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setMessage('');
    }, 600);
  };

  return (
    <section id="contact-us" className="relative w-full bg-[#0E1118] text-white py-16 px-4 sm:px-6 lg:px-12 border-t border-[#1F2937]">
      {/* Background radial accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DFBD78]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFBD78]/10 border border-[#DFBD78]/30 text-[#DFBD78] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            <span>DIRECT SUPER ADMIN SUPPORT &amp; PARTNERSHIP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
            Contact Official Command
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Submit partnership proposals, hosting queries, payment resolution, or clan verification directly to the Super Admin team.
          </p>
        </div>

        <div className="bg-[#141822] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched Directly to Super Admin!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Your partnership inquiry has been routed to the Super Admin Command portal. Our team will contact you via email/WhatsApp shortly.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Your Full Name / Clan Leader *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Naman Mathur / GodLike Gaming"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@clan.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    WhatsApp Contact Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Inquiry / Request Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-white/10 text-white focus:border-[#DFBD78] outline-hidden text-xs"
                  >
                    <option>Partnership &amp; Sponsorship Proposal</option>
                    <option>Tournament Hosting Support</option>
                    <option>Daily Scrims &amp; Match Room Inquiries</option>
                    <option>Broadcast Pass &amp; Stream Production</option>
                    <option>Payment Verification / Refund Status</option>
                    <option>Clan Verification &amp; Other Issues</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Describe Your Issue or Partnership Proposal *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your requirements, tournament dates, brand proposal, or the specific issue you are experiencing..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-white/10 text-white placeholder-gray-500 focus:border-[#DFBD78] outline-hidden text-xs"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#DFBD78]">security</span>
                  <span>Direct encryption to Super Admin ticket queue</span>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD78] hover:from-[#DFBD78] hover:to-[#C5A059] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Routing to Super Admin...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Dispatch to Super Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
