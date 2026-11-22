import React, { useState } from 'react';
import { submitCloudContactTicket } from '../services/cloudSync';

export default function ContactUsSection({ onNavigate, currentUser }) {
  const [name, setName] = useState(currentUser?.name || currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in your username, email, and message.');
      return;
    }

    setIsSubmitting(true);

    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        alert('⚠️ Contact phone / WhatsApp number must be exactly 10 digits (e.g. 9876543210).');
        setIsSubmitting(false);
        return;
      }
    }

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
      // 1. Submit ticket directly to MongoDB Atlas Cloud Database
      submitCloudContactTicket(ticket);

      const existing = JSON.parse(localStorage.getItem('lt_admin_contact_messages') || '[]');
      localStorage.setItem('lt_admin_contact_messages', JSON.stringify([ticket, ...existing]));

      if (category.toLowerCase().includes('partner') || category.toLowerCase().includes('sponsor')) {
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
      window.dispatchEvent(new Event('lt_contact_updated'));
    } catch (err) {
      console.error('Error saving contact ticket:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setMessage('');
    }, 500);
  };

  return (
    <section id="contact-us" className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20 border-t border-black/5">
      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="text-dark-default section-title flex w-full flex-col gap-2 normal-case text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-dark-default text-xs font-bold uppercase tracking-wider w-fit">
              <span className="material-symbols-outlined text-sm text-[#C5A059]">mail</span>
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90">
              Contact Us
            </h2>
            <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B6B6B] max-w-3xl">
              Have questions, tournament queries, or partnership proposals? Reach out to our team.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 shadow-sm">
            {submittedSuccess ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Message Sent Successfully!</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Thank you for contacting us. Your message has been received and our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Username"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs transition-colors"
                    />
                  </div>

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      WhatsApp / Phone (10 Digits)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 9840192831"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs font-mono transition-colors"
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">{phone.length}/10 digits</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs cursor-pointer transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Partnership & Sponsorship">Partnership &amp; Sponsorship</option>
                      <option value="Tournament Queries">Tournament Queries</option>
                      <option value="Prize Pool & Payouts">Prize Pool &amp; Payouts</option>
                      <option value="Account & Verification">Account &amp; Clan Verification</option>
                      <option value="Technical Support">Technical Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#C5A059] focus:bg-white outline-hidden text-xs transition-colors"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#C5A059]">lock</span>
                    <span>Secure Communication</span>
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-gold-primary hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">send</span>
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
