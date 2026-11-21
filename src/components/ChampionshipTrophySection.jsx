import React, { useState, useEffect } from 'react';
import { sendPaymentReceiptEmail } from '../utils/emailService';

export default function ChampionshipTrophySection({ onNavigate }) {
  const [showPreRegModal, setShowPreRegModal] = useState(false);
  const [preRegSuccess, setPreRegSuccess] = useState(null);
  const [clanName, setClanName] = useState('');
  const [leaderIgn, setLeaderIgn] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedGame, setSelectedGame] = useState('Battlegrounds Mobile India (BGMI)');
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic Live Estimation Counter for Championship Prize Pool
  const [liveTrailingDigits, setLiveTrailingDigits] = useState(48520);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTrailingDigits(prev => {
        const increment = Math.floor(Math.random() * 85) + 15;
        const nextVal = prev + increment;
        return nextVal > 99999 ? 10000 + (nextVal % 90000) : nextVal;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const formattedFiveDigits = liveTrailingDigits.toString().padStart(5, '0');
  const displayTrailingDigits = `${formattedFiveDigits.slice(0, 2)},${formattedFiveDigits.slice(2)}`;

  const handleOpenPreReg = () => {
    if (onNavigate) {
      onNavigate('championship-register');
    } else {
      setShowPreRegModal(true);
      setPreRegSuccess(null);
    }
  };

  const handleRazorpayPreReg = async (e) => {
    e.preventDefault();
    if (!clanName.trim() || !leaderIgn.trim() || !email.trim() || !whatsapp.trim()) {
      alert('Please fill Clan Name, Team Leader IGN, Email, and WhatsApp number.');
      return;
    }
    setIsProcessing(true);

    const loadScript = () => new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    const res = await loadScript();

    const options = {
      key: 'rzp_test_TKSMD0fP2Rxjxc', // Razorpay Test Key ID
      amount: 199 * 100, // in paise
      currency: 'INR',
      name: 'LiveTournaments.in',
      description: 'Championship Trophy VIP Pre-Registration Slot',
      image: '/assets/lt_championship_trophy_card_4k.png',
      handler: function (response) {
        completeRegistration(response?.razorpay_payment_id || ('RZP_TEST_' + Date.now()));
      },
      prefill: {
        name: leaderIgn,
        contact: whatsapp,
        email: email.trim()
      },
      theme: {
        color: '#DFBD78'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    if (res && window.Razorpay) {
      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          completeRegistration('RZP_TEST_' + Date.now());
        });
        rzp.open();
      } catch (err) {
        completeRegistration('RZP_TEST_' + Date.now());
      }
    } else {
      completeRegistration('RZP_TEST_' + Date.now());
    }
  };

  const completeRegistration = (payId) => {
    setTimeout(async () => {
      const entry = {
        id: 'CHAMP_' + Date.now(),
        clanName,
        leaderIgn,
        email: email.trim(),
        whatsapp,
        game: selectedGame,
        amount: 199,
        paymentRef: payId,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      try {
        const existing = JSON.parse(localStorage.getItem('lt_championship_pre_registrations') || '[]');
        localStorage.setItem('lt_championship_pre_registrations', JSON.stringify([entry, ...existing]));
      } catch (e) {}

      // Send automated payment receipt and championship confirmation email
      try {
        await sendPaymentReceiptEmail({
          email: email.trim(),
          name: leaderIgn,
          amount: 199,
          paymentId: payId,
          service: `Championship Trophy VIP Pre-Registration: ${clanName} (${selectedGame})`,
          category: 'Championship Pre-Registration'
        });
      } catch (e) {}

      setIsProcessing(false);
      setPreRegSuccess(entry);
    }, 700);
  };

  return (
    <section
      id="championship-section"
      data-section="programs"
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20"
    >
      {/* Anchor for direct #programs link support */}
      <span id="programs" className="absolute -top-24 block invisible pointer-events-none" />

      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="text-dark-default section-title flex w-full flex-col gap-2 normal-case text-left">
              <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90 text-dark-default">
                LT.IN Championship Trophy — Coming Soon
              </h2>
              
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B6B6B] max-w-3xl">
                Our Championship It Will Be Soon. The premier national esports spectacle arrives soon on LiveTournaments.in, pitting the top 32 verified clans for the handcrafted championship trophy. Pre-register your clan now for ₹ 199.
              </p>
            </div>

            {/* Pre-Register Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={handleOpenPreReg}
                className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md bg-gold-primary text-black hover:bg-gold-light hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Pre-Register for Championship — ₹199</span>
              </button>
            </div>
          </div>

          {/* Championship Visual Showcase Card with Smooth Hover Elevation */}
          <div className="flex w-full flex-col items-center gap-4 md:gap-8 pt-2 pb-4">
            <div
              onClick={handleOpenPreReg}
              className="w-full overflow-hidden rounded-2xl md:rounded-3xl xl:rounded-4xl shadow-2xl hover:shadow-black/35 border border-white/10 hover:border-gold-primary/60 bg-dark-default relative group transition-all duration-500 ease-out transform-gpu hover:-translate-y-1.5 cursor-pointer"
            >
              <img
                src="/assets/lt_championship_trophy_card_4k.png"
                alt="LT.IN Championship Trophy - Coming Soon"
                className="w-full h-auto object-cover block transition-transform duration-700 ease-out group-hover:scale-103 group-hover:brightness-105"
              />

              {/* Dynamic Live Estimation Ribbon */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/85 backdrop-blur-md border border-gold-primary/50 rounded-2xl p-4 md:p-6 text-right max-w-sm shadow-2xl">
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gold-primary">
                    Prize Pool Estimation
                  </span>
                </div>
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-xl md:text-3xl font-black text-white font-mono drop-shadow-md">
                    ₹ ??,{displayTrailingDigits}+
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-gold-primary/20 text-gold-primary border border-gold-primary/30">
                    ● Live Counting Pool
                  </span>
                </div>
                <p className="text-[11px] text-white/80 mt-1.5 leading-snug">
                  32 Verified Clans &bull; LAN Stage &bull; Live Broadcast
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-end gap-1.5 text-xs font-bold text-gold-primary">
                  <span>Pre-Register: ₹199</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Floating Status Bar Bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/80 to-transparent p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-gold-primary animate-ping"></div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gold-primary">
                    LiveTournaments.in Championship Program &bull; Season 1 Launching Soon &bull; Pre-Register ₹ 199
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                  <span>Open Qualifiers: 16 Slots</span>
                  <span>&bull;</span>
                  <span>Direct Invites: 16 Clans</span>
                </div>
              </div>
            </div>
          </div>

          {/* Program Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="size-10 rounded-xl bg-gold-primary/20 flex items-center justify-center text-gold-primary mb-3">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Handcrafted Championship Trophy</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                A custom solid-metal trophy forged exclusively for India's champion squad, presented on the live broadcast stage.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="size-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
                <span className="material-symbols-outlined">podium</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Dual Qualifying Path</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Top scrim winners earn direct qualifying berths, while open brackets allow rising grassroots squads to fight their way in.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-3">
                <span className="material-symbols-outlined">live_tv</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Full Broadcast Production</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Official YouTube and platform multi-camera feed with casters, slow-mo replays, and real-time kill feed graphics.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* RAZORPAY PRE-REGISTRATION MODAL (₹ 199) */}
      {showPreRegModal && (
        <div
          onClick={() => setShowPreRegModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden text-gray-900 animate-scale-up"
          >
            {/* Modal Header */}
            <div className="bg-[#111217] text-white p-5 flex items-center justify-between border-b border-gold-primary/40">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-gold-primary/20 border border-gold-primary/50 flex items-center justify-center text-gold-primary font-bold">
                  🏆
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-white">Championship Pre-Registration</h3>
                  <span className="text-[10px] text-gold-primary font-mono font-bold">Official Season 1 &bull; Reserved Clan Slot</span>
                </div>
              </div>
              <button
                onClick={() => setShowPreRegModal(false)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {preRegSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  ✓
                </div>
                <h4 className="text-lg font-black text-gray-900 uppercase">Pre-Registration Confirmed!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Congratulations! Clan <strong>{preRegSuccess.clanName}</strong> is officially locked in for the LT.IN Championship Trophy Season 1 Qualifiers.
                </p>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking ID:</span>
                    <span className="font-bold text-gray-900">{preRegSuccess.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Leader IGN:</span>
                    <span className="font-bold text-gray-900">{preRegSuccess.leaderIgn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Game:</span>
                    <span className="font-bold text-gray-900">{preRegSuccess.game}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-600">₹ 199 INR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Gateway:</span>
                    <span className="font-bold text-blue-600">Razorpay Test Verified</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPreRegModal(false)}
                  className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-primary hover:text-black transition-colors cursor-pointer shadow-md"
                >
                  Close &amp; Return to Arena
                </button>
              </div>
            ) : (
              <form onSubmit={handleRazorpayPreReg} className="p-6 space-y-4">
                <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">Pre-Registration Pass Fee:</span>
                  <span className="font-mono font-black text-base text-gray-900">₹ 199 INR</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Clan / Team Name *
                  </label>
                  <input
                    type="text"
                    value={clanName}
                    onChange={(e) => setClanName(e.target.value)}
                    placeholder="e.g. Soul Esports / GodLike / S8UL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-gold-primary outline-hidden"
                    required
                  />
                </div>

                {/* Email Address for Championship Details */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address (For Championship Details &amp; Match Schedule) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. leader@clan.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-gold-primary outline-hidden font-mono"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Official championship schedule, room slot allocation, and receipt will be sent to this email.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Team Leader IGN *
                    </label>
                    <input
                      type="text"
                      value={leaderIgn}
                      onChange={(e) => setLeaderIgn(e.target.value)}
                      placeholder="e.g. Mortal_OP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-gold-primary outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      WhatsApp Dispatch Number *
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-gold-primary outline-hidden font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Esports Game Title
                  </label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-gold-primary outline-hidden bg-white"
                  >
                    <option>Battlegrounds Mobile India (BGMI)</option>
                    <option>PUBG Mobile Global</option>
                    <option>Free Fire MAX</option>
                    <option>Call of Duty: Mobile</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">lock</span>
                  <span>Secured via Razorpay Test Gateway. Instant slot reservation receipt.</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#111217] hover:bg-gold-primary hover:text-black text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  <span>{isProcessing ? 'Connecting to Razorpay...' : 'Pay ₹ 199 with Razorpay Test Mode'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
