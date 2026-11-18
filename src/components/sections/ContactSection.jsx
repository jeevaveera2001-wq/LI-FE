import React, { useState } from 'react';
import { Shield, CheckCircle2, MessageSquare, Send, Mail, Phone } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { submitContactInquiry } from '../../utils/portalData';

export const ContactSection = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMsg) return;
    soundFx.playVictory();
    
    // Transmit inquiry to Admin & Superadmin Portal
    submitContactInquiry({
      name: inquiryName,
      email: inquiryEmail,
      message: inquiryMsg,
      squad: 'Direct Contact Form'
    });

    setSubmittedInquiry(true);
    setTimeout(() => {
      setSubmittedInquiry(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 4000);
  };

  return (
    <section id="contact" className="w-full">
      <div className="rounded-2xl p-6 sm:p-7 bg-white border border-[#E2E8F0] shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: CONTACT US (Chat Bubbles) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase tracking-wider mb-1">
                CONTACT US
              </h3>
              <p className="font-rajdhani text-xs text-[#64748B]">
                Open Communications • All Enquiries, Feedback, Objections & Business Welcome
              </p>
            </div>

            {/* Bright Mint Green Chat Bubble Card */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-rajdhani text-emerald-900 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                  🤝
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Encouragement, Feedback & Business</span>
                  <span className="text-[10px] text-emerald-700 font-mono">Public Liaison & Growth</span>
                </div>
                <span className="text-[10px] text-emerald-800 ml-auto font-mono bg-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                  ALL WELCOME
                </span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-800 pl-8">
                "Whether you want to share words of encouragement, offer valuable feedback, pitch an exciting business idea, or collaborate on brand sponsorships — any kind of enquiry is heartily welcome!"
              </p>
            </div>

            {/* Light Slate Chat Bubble Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-rajdhani text-[#0F172A] shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center border border-amber-300">
                    ⚖️
                  </div>
                  <span className="text-[#0F172A] font-bold text-xs">Objections, Obligations & Grievances</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DIRECT REVIEW
                </span>
              </div>
              <p className="text-xs text-[#475569] pl-8 mb-2 leading-relaxed">
                Have any objections, rule obligations, match disputes, points table clarifications, or administrative concerns? Drop your message and our team will review and resolve it promptly.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-[10px] pl-8">
                <span className="text-[#64748B]">Transparent Response: Fast & Dedicated</span>
                <span className="text-amber-700 font-bold">100% Addressed</span>
              </div>
            </div>
          </div>

          {/* Right Column: ENQUIRIES Form */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase tracking-wider mb-1">
                ENQUIRIES
              </h3>
              <p className="font-rajdhani text-xs text-[#64748B] mb-4">
                Sponsorships, Clan Scrim Licensing, Creator Invites & Official Queries
              </p>

              {submittedInquiry ? (
                <div className="py-8 rounded-xl bg-emerald-50 border border-emerald-300 text-center text-xs font-rajdhani text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <span className="font-montserrat font-bold text-sm text-[#0F172A] block">Enquiry Dispatched Successfully!</span>
                  <p className="text-xs text-[#475569]">Our tournament management desk will respond to {inquiryEmail || 'your contact'} shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-rajdhani font-bold text-[#334155] uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] focus:border-amber-500 text-[#0F172A] placeholder-[#94A3B8] font-sans text-xs focus:outline-none shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-rajdhani font-bold text-[#334155] uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] focus:border-amber-500 text-[#0F172A] placeholder-[#94A3B8] font-sans text-xs focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-rajdhani font-bold text-[#334155] uppercase mb-1">
                      Message / Proposal *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Write your enquiry message or competitive query..."
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] focus:border-amber-500 text-[#0F172A] placeholder-[#94A3B8] font-sans text-xs focus:outline-none resize-none shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#E5C05B] hover:bg-[#F3CF7A] text-slate-950 font-montserrat font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-xs hover:shadow-md transition-all"
                  >
                    SUBMIT ENQUIRY
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
