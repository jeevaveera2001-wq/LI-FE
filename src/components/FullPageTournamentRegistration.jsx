import React, { useState, useRef, useEffect } from 'react';
import { Swords, Shield, CheckCircle2, Copy, Check, Download, AlertCircle, Sparkles, User, Users, Clock, Send, Upload, Trash2, Loader2, CloudUpload, ArrowLeft, Printer } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { submitTournamentRegistration } from '../utils/portalData';
import { uploadToCloudinary } from '../utils/cloudinary';

export const FullPageTournamentRegistration = ({
  selectedTournament,
  currentUser,
  onBackToPortal,
  onOpenOverview
}) => {
  const [step, setStep] = useState(1);
  const [matchType, setMatchType] = useState('SQUAD'); // 'SOLO' | 'DUO' | 'SQUAD'
  const fileInputRef = useRef(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Form Data pre-filled with logged in user if available
  const [formData, setFormData] = useState({
    teamName: '',
    clanLogo: '',
    clanLogoName: '',
    iglName: currentUser?.name || '',
    iglPhone: currentUser?.phone || '',
    iglDiscord: '',
    captainName: currentUser?.name || '',
    captainPhone: currentUser?.phone || '',
    captainDiscord: '',
    player1Name: currentUser?.name || '',
    player1Id: '',
    player2Name: '',
    player2Id: '',
    player3Name: '',
    player3Id: '',
    player4Name: '',
    player4Id: '',
    subName: '',
    subId: '',
  });

  const [slotCode, setSlotCode] = useState('');
  const [ticketId, setTicketId] = useState('');

  // Auto-detect match format when opening for specific tournament
  useEffect(() => {
    if (selectedTournament) {
      const text = `${selectedTournament.title || ''} ${selectedTournament.category || ''} ${selectedTournament.format || ''}`.toUpperCase();
      if (text.includes('SOLO')) {
        setMatchType('SOLO');
      } else if (text.includes('DUO')) {
        setMatchType('DUO');
      } else {
        setMatchType('SQUAD');
      }
    }
  }, [selectedTournament]);

  const tournamentTitle = selectedTournament?.title || "LIVE TOURNAMENTS.IN GRAND ESPORTS FINALE";
  const prizePool = selectedTournament?.prizePool || selectedTournament?.prize || "₹2,50,000 INR";
  const format = selectedTournament?.format || (matchType === 'SOLO' ? "Solo TPP Sanhok" : matchType === 'DUO' ? "Duo TPP Miramar" : "Squad TPP Erangel");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Strict numeric-only enforcement for all player IGIDs
    if (['player1Id', 'player2Id', 'player3Id', 'player4Id', 'subId'].includes(name)) {
      const numericOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericOnly }));
      return;
    }
    // Phone formatting
    if (name === 'iglPhone' || name === 'captainPhone') {
      const phoneClean = value.replace(/[^0-9+\s-]/g, '');
      setFormData(prev => ({ ...prev, iglPhone: phoneClean, captainPhone: phoneClean }));
      return;
    }
    // Synchronize IGL and Captain names
    if (name === 'iglName' || name === 'captainName') {
      setFormData(prev => ({ ...prev, iglName: value, captainName: value }));
      return;
    }
    // Synchronize IGL and Captain discord
    if (name === 'iglDiscord' || name === 'captainDiscord') {
      setFormData(prev => ({ ...prev, iglDiscord: value, captainDiscord: value }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Logo file size exceeds 10MB. Please upload a smaller image.');
      return;
    }

    setIsUploadingLogo(true);
    soundFx.playClick();

    // 1. Immediate local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        clanLogo: event.target.result,
        clanLogoName: file.name
      }));
    };
    reader.readAsDataURL(file);

    // 2. Direct upload to Cloudinary
    try {
      const uploadRes = await uploadToCloudinary(file, { folder: 'livetournaments_clan_logos' });
      if (uploadRes.success && uploadRes.secure_url) {
        setFormData(prev => ({
          ...prev,
          clanLogo: uploadRes.secure_url,
          clanLogoName: file.name
        }));
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback to local preview:', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = (e) => {
    e?.stopPropagation();
    setFormData(prev => ({
      ...prev,
      clanLogo: '',
      clanLogoName: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    soundFx.playClick();
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      const effectiveIglName = formData.iglName || formData.captainName || formData.player1Name;
      const effectiveIglPhone = formData.iglPhone || formData.captainPhone;

      if (!formData.teamName && matchType !== 'SOLO') {
        alert('Please complete the required Team Name.');
        return;
      }
      if (!effectiveIglName || !effectiveIglPhone) {
        alert(matchType === 'SOLO' ? "Please complete your In-Game Name and Contact Mobile." : "Please complete the required Team Name and Leader/IGL contact details.");
        return;
      }
      soundFx.playClick();
      setStep(2);
    } else if (step === 2) {
      if (matchType === 'SOLO') {
        if (!formData.player1Id) {
          alert("Please provide your In-Game Character ID (numbers only).");
          return;
        }
        if (!/^\d+$/.test(formData.player1Id)) {
          alert("In-Game Character ID (IGID) must contain digits (numbers) only.");
          return;
        }
      } else if (matchType === 'DUO') {
        if (!formData.player1Id || !formData.player2Id) {
          alert("Please provide In-Game Character IDs (numbers only) for both 2 Duo players.");
          return;
        }
        if (!/^\d+$/.test(formData.player1Id) || !/^\d+$/.test(formData.player2Id)) {
          alert("In-Game Character IDs (IGID) must contain digits (numbers) only.");
          return;
        }
      } else {
        // SQUAD
        if (!formData.player1Id || !formData.player2Id || !formData.player3Id || !formData.player4Id) {
          alert("Please provide In-Game Character IDs (numbers only) for all 4 starting roster players.");
          return;
        }
        if (
          !/^\d+$/.test(formData.player1Id) ||
          !/^\d+$/.test(formData.player2Id) ||
          !/^\d+$/.test(formData.player3Id) ||
          !/^\d+$/.test(formData.player4Id)
        ) {
          alert("In-Game Character IDs (IGID) must contain digits (numbers) only.");
          return;
        }
        if (formData.subId && !/^\d+$/.test(formData.subId)) {
          alert("Substitute Player IGID must contain digits (numbers) only.");
          return;
        }
      }

      soundFx.playVictory();

      // Submit registration directly
      const effectiveIglName = formData.iglName || formData.captainName || formData.player1Name;
      const effectiveIglPhone = formData.iglPhone || formData.captainPhone;
      const effectiveIglDiscord = formData.iglDiscord || formData.captainDiscord;

      const result = submitTournamentRegistration({
        ...formData,
        matchType,
        teamName: formData.teamName || (matchType === 'SOLO' ? `${effectiveIglName} (Solo)` : 'Custom Lineup'),
        iglName: effectiveIglName,
        iglPhone: effectiveIglPhone,
        iglDiscord: effectiveIglDiscord,
        captainName: effectiveIglName,
        captainPhone: effectiveIglPhone,
        captainDiscord: effectiveIglDiscord,
        category: `${tournamentTitle} • ${matchType}`
      });

      setSlotCode(result.slotCode);
      setTicketId(result.ticketId);

      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F172A', '#10B981', '#3B82F6', '#F59E0B']
      });

      setStep(3);
    }
  };

  const handleCopyPass = () => {
    const effectiveIglName = formData.iglName || formData.captainName || formData.player1Name;
    const effectiveIglPhone = formData.iglPhone || formData.captainPhone;
    const teamDisplayName = formData.teamName || (matchType === 'SOLO' ? `${effectiveIglName} (Solo)` : 'Custom Lineup');
    const passDetails = `LIVE TOURNAMENTS.IN APPLICATION TICKET\nFormat: ${matchType}\nEntry: ${teamDisplayName}\nSlot: ${slotCode}\nTicket ID: ${ticketId}\nTournament: ${tournamentTitle}\nContact: ${effectiveIglName} (${effectiveIglPhone})\nStatus: VERIFIED & CONFIRMED`;
    navigator.clipboard.writeText(passDetails);
    setCopiedPass(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-slate-200 flex flex-col">
      
      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#CBD5E1] p-0.5 bg-[#F1F5F9] shadow-xs flex items-center justify-center">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="font-montserrat font-black text-sm sm:text-base text-[#0F172A] tracking-wide uppercase leading-tight">
              LIVE TOURNAMENTS<span className="text-amber-500">.IN</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Official Esports Registration Portal
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenOverview && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenOverview?.();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] transition-all text-xs font-bold cursor-pointer shadow-xs"
            >
              <span>Tournaments Hub</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              onBackToPortal?.();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-black text-white transition-all text-xs font-bold cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-300" />
            <span>Back to Arena</span>
          </button>
        </div>
      </header>

      {/* Main Container - Entire Full Display Page (NOT a Floating Type) */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Card Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#0F172A] text-xs font-bold uppercase tracking-wider mb-2">
              <Swords className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Esports Registration Portal</span>
            </div>

            <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight uppercase">
              {tournamentTitle}
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3 font-medium">
              <span>Prize Pool: <strong className="text-amber-600 font-bold">{prizePool}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Format: <strong className="text-[#0F172A]">{format}</strong></span>
            </p>
          </div>

          {/* Stepper Progress Bar (Clean White Background + Black Text UI) */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0] text-xs font-bold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 1 ? 'bg-[#0F172A] text-white' : 'bg-slate-200 text-[#64748B]'
              }`}>
                1
              </span>
              <span>{matchType === 'SOLO' ? 'Solo Details' : matchType === 'DUO' ? 'Duo Lineup' : 'Squad Info'}</span>
            </div>

            <div className={`h-[2px] flex-1 mx-3 ${step >= 2 ? 'bg-[#0F172A]' : 'bg-[#E2E8F0]'}`} />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 2 ? 'bg-[#0F172A] text-white' : 'bg-slate-200 text-[#64748B]'
              }`}>
                2
              </span>
              <span>{matchType === 'SOLO' ? 'Solo IGID' : matchType === 'DUO' ? 'Duo IGIDs (2P)' : 'Roster & IGIDs (4P)'}</span>
            </div>

            <div className={`h-[2px] flex-1 mx-3 ${step >= 3 ? 'bg-[#0F172A]' : 'bg-[#E2E8F0]'}`} />

            <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-700' : 'text-[#94A3B8]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-[#64748B]'
              }`}>
                3
              </span>
              <span>Application Pass</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 1: MATCH FORMAT SELECTION & PLAYER/TEAM DETAILS     */}
          {/* ======================================================== */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-5">
              
              {/* Select Registration Match Format */}
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Select Registration Match Format *</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {matchType === 'SOLO' ? '1 PLAYER ONLY' : matchType === 'DUO' ? '2 PLAYERS' : '4 PLAYERS + SUB'}
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'SOLO', label: 'SOLO', subtitle: '1 Player', icon: User },
                    { id: 'DUO', label: 'DUO', subtitle: '2 Players', icon: Users },
                    { id: 'SQUAD', label: 'SQUAD', subtitle: '4 Players', icon: Shield },
                  ].map((f) => {
                    const active = matchType === f.id;
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setMatchType(f.id);
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center relative overflow-hidden ${
                          active
                            ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                            : 'bg-white hover:bg-slate-50 border-[#CBD5E1] text-[#475569]'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${active ? 'text-amber-400' : 'text-[#64748B]'}`} />
                        <span className="text-xs font-montserrat font-extrabold uppercase tracking-wide">
                          {f.label}
                        </span>
                        <span className={`text-[10px] mt-0.5 font-medium ${active ? 'text-slate-300' : 'text-[#64748B]'}`}>
                          {f.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clan Tag / Name and Avatar Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {matchType === 'SOLO'
                      ? 'Player / Solo Clan Tag (Optional)'
                      : matchType === 'DUO'
                      ? 'Duo Team / Clan Name *'
                      : 'Team / Clan Name *'}
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    required={matchType !== 'SOLO'}
                    placeholder={
                      matchType === 'SOLO'
                        ? 'e.g. Mortal Solo (or leave blank)'
                        : matchType === 'DUO'
                        ? 'e.g. Deadly Duo Esports'
                        : 'e.g. Tamil Titans Esports'
                    }
                    value={formData.teamName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none transition-all placeholder-[#94A3B8]"
                  />
                </div>

                {/* Clan / Player Logo Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>
                      {matchType === 'SOLO'
                        ? 'Upload Avatar / Logo (Optional)'
                        : matchType === 'DUO'
                        ? 'Upload Duo Logo (Optional)'
                        : 'Upload Clan Logo (Optional)'}
                    </span>
                    {formData.clanLogo && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  {isUploadingLogo ? (
                    <div className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#F1F5F9] border border-slate-300 text-[#0F172A] text-xs font-medium">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0F172A]" />
                      <span>Uploading image to Cloudinary CDN...</span>
                    </div>
                  ) : formData.clanLogo ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#0F172A] transition-all cursor-pointer group"
                      title="Click to replace logo"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#CBD5E1] bg-white shrink-0 flex items-center justify-center">
                        <img src={formData.clanLogo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-[#0F172A] font-bold truncate block">
                          {formData.clanLogoName || 'Attached_Logo.png'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                          <CloudUpload className="w-3 h-3" />
                          <span>Logo Attached • Click to change</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] hover:border-[#0F172A] hover:bg-slate-100 transition-all cursor-pointer text-[#64748B]"
                    >
                      <Upload className="w-4 h-4 text-[#0F172A]" />
                      <span className="text-xs font-semibold">Choose Logo (PNG/JPG/WEBP up to 10MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Phone Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {matchType === 'SOLO'
                      ? 'Solo Player In-Game / Full Name *'
                      : matchType === 'DUO'
                      ? 'Player 1 (Duo Leader) Full Name *'
                      : 'IGL (In Game Leader) Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="iglName"
                    required
                    placeholder={
                      matchType === 'SOLO'
                        ? 'e.g. Naman Mathur / Mortal'
                        : matchType === 'DUO'
                        ? 'e.g. Vijay / TTN_Alpha (Leader)'
                        : 'e.g. Vijay / TTN_Alpha (IGL)'
                    }
                    value={formData.iglName || formData.captainName || formData.player1Name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none transition-all placeholder-[#94A3B8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {matchType === 'SOLO' ? 'Player Contact Mobile *' : matchType === 'DUO' ? 'Leader Contact Mobile *' : 'IGL Contact Mobile *'}
                  </label>
                  <input
                    type="tel"
                    name="iglPhone"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.iglPhone || formData.captainPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none transition-all placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              {/* Discord Tag */}
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  {matchType === 'SOLO' ? 'Discord Tag (Optional)' : matchType === 'DUO' ? 'Leader Discord Tag (Optional)' : 'IGL Discord Tag (Optional)'}
                </label>
                <input
                  type="text"
                  name="iglDiscord"
                  placeholder="discord#1234 or discord username"
                  value={formData.iglDiscord || formData.captainDiscord}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none transition-all placeholder-[#94A3B8]"
                />
              </div>

              {/* Proceed Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>
                    {matchType === 'SOLO'
                      ? 'Proceed to IGID Verification (1 Player)'
                      : matchType === 'DUO'
                      ? 'Proceed to Duo Roster Entry (2 Players)'
                      : 'Proceed to Squad Roster Entry (4 Players)'}
                  </span>
                  <Swords className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: ROSTER & IN-GAME CHARACTER IDS (IGID)            */}
          {/* ======================================================== */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-5">
              
              {/* SOLO FORMAT */}
              {matchType === 'SOLO' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Solo Registration: Please enter your In-Game Character ID (<strong>numeric digits only</strong>). This is verified directly by Match Ops.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                      Solo Player In-Game Name & IGID (Numbers Only) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="player1Name"
                        required
                        placeholder="IGN (e.g. Mortal)"
                        value={formData.player1Name || formData.iglName || formData.captainName}
                        onChange={handleChange}
                        className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={12}
                        name="player1Id"
                        required
                        placeholder="IGID (Numbers Only e.g. 51293847)"
                        value={formData.player1Id}
                        onChange={handleChange}
                        className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DUO FORMAT */}
              {matchType === 'DUO' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Duo Lineup: Ensure both Duo players' In-Game Character IDs (IGIDs) contain <strong>numbers only</strong>.
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                        Player 1 (Duo Leader) IGN & IGID (Numbers Only) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="player1Name"
                          required
                          placeholder="Player 1 IGN (e.g. Mortal)"
                          value={formData.player1Name || formData.iglName || formData.captainName}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="player1Id"
                          required
                          placeholder="Player 1 IGID (Numbers Only)"
                          value={formData.player1Id}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                        Player 2 (Duo Partner) IGN & IGID (Numbers Only) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="player2Name"
                          required
                          placeholder="Player 2 IGN (e.g. Viper)"
                          value={formData.player2Name}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="player2Id"
                          required
                          placeholder="Player 2 IGID (Numbers Only)"
                          value={formData.player2Id}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SQUAD FORMAT */}
              {matchType === 'SQUAD' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Squad Roster: Ensure all 4 In-Game Character IDs (IGIDs) are <strong>numbers only</strong> (BGMI Character ID).
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Player 1 (IGL) *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="player1Name"
                          required
                          placeholder="IGN (e.g. Mortal)"
                          value={formData.player1Name || formData.iglName || formData.captainName}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="player1Id"
                          required
                          placeholder="IGID (Numbers Only)"
                          value={formData.player1Id}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Player 2 *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="player2Name"
                          required
                          placeholder="IGN (e.g. Viper)"
                          value={formData.player2Name}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="player2Id"
                          required
                          placeholder="IGID (Numbers Only)"
                          value={formData.player2Id}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Player 3 *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="player3Name"
                          required
                          placeholder="IGN (e.g. Regaltos)"
                          value={formData.player3Name}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="player3Id"
                          required
                          placeholder="IGID (Numbers Only)"
                          value={formData.player3Id}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                        Player 4 *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="player4Name"
                          required
                          placeholder="IGN (e.g. Aman)"
                          value={formData.player4Name}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="player4Id"
                          required
                          placeholder="IGID (Numbers Only)"
                          value={formData.player4Id}
                          onChange={handleChange}
                          className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Substitute Player (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="subName"
                        placeholder="Sub IGN (optional)"
                        value={formData.subName}
                        onChange={handleChange}
                        className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={12}
                        name="subId"
                        placeholder="Sub IGID (Numbers Only)"
                        value={formData.subId}
                        onChange={handleChange}
                        className="px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-bold text-xs uppercase hover:bg-slate-100 cursor-pointer transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application to Admin Desk</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 3: APPLICATION PASS & CONFIRMATION                  */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Notification Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  <strong>Application Confirmed!</strong> Your <strong>{matchType}</strong> entry for <strong>{tournamentTitle}</strong> has been registered and assigned an official slot.
                </span>
              </div>

              {/* Official Pass Ticket (White & Black UI Format) */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#F8FAFC] border-2 border-[#CBD5E1] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#CBD5E1] bg-white flex items-center justify-center shrink-0 shadow-xs">
                      {formData.clanLogo ? (
                        <img src={formData.clanLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <img src="/assets/conqueror_badge.jpg" alt="Badge" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5 uppercase">
                        <span>LIVE TOURNAMENTS.IN APPLICATION PASS</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#0F172A] text-white text-[9px] font-black">{matchType}</span>
                      </div>
                      <div className="font-mono font-black text-sm text-[#0F172A]">{ticketId}</div>
                    </div>
                  </div>

                  <div className="px-4 py-1.5 rounded-xl bg-[#0F172A] text-white font-mono font-black text-sm">
                    {slotCode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px] font-bold uppercase">
                      {matchType === 'SOLO' ? 'REGISTERED WARRIOR' : matchType === 'DUO' ? 'REGISTERED DUO' : 'REGISTERED SQUAD'}
                    </span>
                    <span className="font-bold text-sm text-[#0F172A] mt-0.5 block">
                      {formData.teamName || (formData.iglName || formData.captainName || formData.player1Name)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] font-bold uppercase">
                      LEADER CONTACT
                    </span>
                    <span className="font-mono text-[#0F172A] text-xs font-semibold mt-0.5 block">
                      {formData.iglName || formData.captainName || formData.player1Name} ({formData.iglPhone || formData.captainPhone})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E2E8F0] text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px] font-bold uppercase">
                      TOURNAMENT EVENT
                    </span>
                    <span className="font-semibold text-[#0F172A] text-xs">
                      {tournamentTitle}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] font-bold uppercase">
                      PRIZE POOL & MAP
                    </span>
                    <span className="font-bold text-amber-600 text-xs">
                      {prizePool} • {format}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="flex-1 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-slate-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {copiedPass ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Application Pass</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 px-5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-slate-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    if (onOpenOverview) {
                      onOpenOverview();
                    } else {
                      onBackToPortal();
                    }
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all text-center"
                >
                  Go to Tournaments Hub
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#E2E8F0] bg-white">
        © {new Date().getFullYear()} Live tournaments.in. Official Competitive BGMI Portal.
      </footer>

    </div>
  );
};

export default FullPageTournamentRegistration;
