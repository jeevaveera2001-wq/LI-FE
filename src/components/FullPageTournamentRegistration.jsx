import React, { useState, useRef, useEffect } from 'react';
import { Swords, Shield, CheckCircle2, Copy, Check, Download, AlertCircle, Sparkles, User, Users, Clock, Send, Upload, Trash2, Loader2, CloudUpload, ArrowLeft, Printer, Phone, Mail, Award, KeyRound, UserCheck } from 'lucide-react';
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
  // 'form' = directly fill fields, 'pass' = official confirmed pass
  const [viewState, setViewState] = useState('form');
  const [matchType, setMatchType] = useState('SQUAD'); // 'SOLO' | 'DUO' | 'SQUAD'
  const fileInputRef = useRef(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Data pre-filled with logged-in user details where relevant
  const [formData, setFormData] = useState({
    // Squad match specific fields
    teamName: '',
    clanTag: '',
    clanLogo: '',
    clanLogoName: '',
    managerName: '',
    managerPhone: currentUser?.phone || '',
    managerEmail: currentUser?.email || '',

    // Duo match specific fields
    duoTeamName: '',
    duoClanTag: '',
    duoPhone: currentUser?.phone || '',
    duoEmail: currentUser?.email || '',

    // Solo match specific fields
    soloPlayerName: currentUser?.name || '',
    soloClanTag: '',
    soloEmail: currentUser?.email || '',
    soloPhone: currentUser?.phone || '',
    soloPlayerId: '',

    // Starting Roster Players (for Squad & Duo)
    player1Name: currentUser?.name || '',
    player1Id: '',
    player2Name: '',
    player2Id: '',
    player3Name: '',
    player3Id: '',
    player4Name: '',
    player4Id: '',

    // Squad 1 Substitute Player
    subName: '',
    subId: '',

    // Optional tags
    discordTag: '',
  });

  const [confirmedPassData, setConfirmedPassData] = useState(null);

  // Check if current tournament is a Scrim (Scrims are strictly Squad Only)
  const isScrim = Boolean(
    selectedTournament && (
      selectedTournament.isScrim ||
      (selectedTournament.id && String(selectedTournament.id).toLowerCase().includes('scrim')) ||
      (selectedTournament.title && String(selectedTournament.title).toUpperCase().includes('SCRIM')) ||
      (selectedTournament.mode && String(selectedTournament.mode).toUpperCase().includes('SCRIM')) ||
      (selectedTournament.category && String(selectedTournament.category).toUpperCase().includes('SCRIM'))
    )
  );

  // Auto-detect match format when opening for specific tournament
  useEffect(() => {
    if (selectedTournament) {
      if (isScrim) {
        setMatchType('SQUAD');
        return;
      }
      const text = `${selectedTournament.title || ''} ${selectedTournament.category || ''} ${selectedTournament.format || ''}`.toUpperCase();
      if (text.includes('SOLO')) {
        setMatchType('SOLO');
      } else if (text.includes('DUO')) {
        setMatchType('DUO');
      } else {
        setMatchType('SQUAD');
      }
    }
  }, [selectedTournament, isScrim]);

  const tournamentTitle = selectedTournament?.title || "LIVE TOURNAMENTS.IN GRAND ESPORTS FINALE";
  const prizePool = selectedTournament?.prizePool || selectedTournament?.prize || "₹2,50,000 INR";
  const format = selectedTournament?.format || (matchType === 'SOLO' ? "Solo TPP Sanhok" : matchType === 'DUO' ? "Duo TPP Miramar" : "Squad TPP Erangel");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Strict numeric-only enforcement for all player IGIDs
    if (['player1Id', 'player2Id', 'player3Id', 'player4Id', 'subId', 'soloPlayerId'].includes(name)) {
      const numericOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericOnly }));
      return;
    }
    // Phone numbers cleaning
    if (['managerPhone', 'duoPhone', 'soloPhone'].includes(name)) {
      const phoneClean = value.replace(/[^0-9+\s-]/g, '');
      setFormData(prev => ({ ...prev, [name]: phoneClean }));
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

    // 2. Direct upload to Cloudinary CDN
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

  // Submit Registration directly with format-specific validations
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // VALIDATION 1: SQUAD MATCH (Directly 4 Players + 1 Substitute + Team Owner/Manager & Mobile)
    if (matchType === 'SQUAD') {
      if (!formData.teamName.trim()) {
        setErrorMessage('Please enter your Squad / Clan Name.');
        soundFx.playClick();
        return;
      }
      if (!formData.managerName.trim()) {
        setErrorMessage('Please enter the Team Owner or Manager full name.');
        soundFx.playClick();
        return;
      }
      if (!formData.managerPhone.trim() || formData.managerPhone.trim().length < 8) {
        setErrorMessage('Please enter a valid Team Owner or Manager contact mobile number.');
        soundFx.playClick();
        return;
      }

      // Check all 4 starting roster players
      if (!formData.player1Name.trim() || !formData.player1Id.trim()) {
        setErrorMessage('Player 1 (Captain / IGL) Name and numeric Character ID (IGID) are required.');
        soundFx.playClick();
        return;
      }
      if (!formData.player2Name.trim() || !formData.player2Id.trim()) {
        setErrorMessage('Player 2 Name and numeric Character ID (IGID) are required.');
        soundFx.playClick();
        return;
      }
      if (!formData.player3Name.trim() || !formData.player3Id.trim()) {
        setErrorMessage('Player 3 Name and numeric Character ID (IGID) are required.');
        soundFx.playClick();
        return;
      }
      if (!formData.player4Name.trim() || !formData.player4Id.trim()) {
        setErrorMessage('Player 4 Name and numeric Character ID (IGID) are required.');
        soundFx.playClick();
        return;
      }

      // Check if substitute IGID is valid if provided
      if (formData.subName && !formData.subId) {
        setErrorMessage('Please enter the Substitute Player numeric Character ID (IGID).');
        soundFx.playClick();
        return;
      }
    }

    // VALIDATION 2: DUO MATCH (Directly 2 Players + Clan Name + Mobile Number + Team Name)
    if (matchType === 'DUO') {
      if (!formData.duoTeamName.trim()) {
        setErrorMessage('Please enter your Duo Team Name.');
        soundFx.playClick();
        return;
      }
      if (!formData.duoClanTag.trim()) {
        setErrorMessage('Please enter your Clan Name / Tag.');
        soundFx.playClick();
        return;
      }
      if (!formData.duoPhone.trim() || formData.duoPhone.trim().length < 8) {
        setErrorMessage('Please enter a valid contact mobile number.');
        soundFx.playClick();
        return;
      }
      if (!formData.duoEmail.trim() || !formData.duoEmail.includes('@')) {
        setErrorMessage('Please enter a valid contact email address.');
        soundFx.playClick();
        return;
      }

      // Check both 2 Duo players
      if (!formData.player1Name.trim() || !formData.player1Id.trim()) {
        setErrorMessage('Player 1 (Duo Leader) Name and numeric Character ID (IGID) are required.');
        soundFx.playClick();
        return;
      }
      if (!formData.player2Name.trim() || !formData.player2Id.trim()) {
        setErrorMessage('Player 2 (Duo Partner) Name and numeric Character ID (IGID) are required.');
        soundFx.playClick();
        return;
      }
    }

    // VALIDATION 3: SOLO MATCH (Only 1 Player Name + Clan Name + Email + Mobile Number)
    if (matchType === 'SOLO') {
      if (!formData.soloPlayerName.trim()) {
        setErrorMessage('Please enter your Solo Player Name (In-Game Name).');
        soundFx.playClick();
        return;
      }
      if (!formData.soloPlayerId.trim()) {
        setErrorMessage('Please enter your In-Game Character ID (IGID - numeric digits only).');
        soundFx.playClick();
        return;
      }
      if (!formData.soloMobile && !formData.soloPhone.trim()) {
        setErrorMessage('Please enter your contact mobile number.');
        soundFx.playClick();
        return;
      }
      if (!formData.soloEmail.trim() || !formData.soloEmail.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        soundFx.playClick();
        return;
      }
    }

    soundFx.playVictory();

    // Prepare clean registration payload according to match type
    const registrationPayload = {
      matchType,
      category: `${tournamentTitle} • ${matchType}`,
      clanLogo: formData.clanLogo,
      clanLogoName: formData.clanLogoName,
      discordTag: formData.discordTag,
      ...(matchType === 'SQUAD' ? {
        teamName: formData.teamName.trim(),
        clanTag: formData.clanTag.trim(),
        managerName: formData.managerName.trim(),
        managerPhone: formData.managerPhone.trim(),
        ownerName: formData.managerName.trim(),
        ownerPhone: formData.managerPhone.trim(),
        phone: formData.managerPhone.trim(),
        email: formData.managerEmail.trim(),
        iglName: formData.player1Name.trim(),
        iglPhone: formData.managerPhone.trim(),
        captainName: formData.player1Name.trim(),
        captainPhone: formData.managerPhone.trim(),
        player1Name: formData.player1Name.trim(),
        player1Id: formData.player1Id.trim(),
        player2Name: formData.player2Name.trim(),
        player2Id: formData.player2Id.trim(),
        player3Name: formData.player3Name.trim(),
        player3Id: formData.player3Id.trim(),
        player4Name: formData.player4Name.trim(),
        player4Id: formData.player4Id.trim(),
        subName: formData.subName.trim(),
        subId: formData.subId.trim(),
      } : matchType === 'DUO' ? {
        teamName: formData.duoTeamName.trim(),
        clanTag: formData.duoClanTag.trim(),
        phone: formData.duoPhone.trim(),
        email: formData.duoEmail.trim(),
        iglName: formData.player1Name.trim(),
        iglPhone: formData.duoPhone.trim(),
        captainName: formData.player1Name.trim(),
        captainPhone: formData.duoPhone.trim(),
        player1Name: formData.player1Name.trim(),
        player1Id: formData.player1Id.trim(),
        player2Name: formData.player2Name.trim(),
        player2Id: formData.player2Id.trim(),
      } : {
        teamName: `${formData.soloPlayerName.trim()} (Solo)`,
        clanTag: formData.soloClanTag.trim(),
        playerName: formData.soloPlayerName.trim(),
        player1Name: formData.soloPlayerName.trim(),
        player1Id: formData.soloPlayerId.trim(),
        phone: formData.soloPhone.trim(),
        email: formData.soloEmail.trim(),
        iglName: formData.soloPlayerName.trim(),
        iglPhone: formData.soloPhone.trim(),
        captainName: formData.soloPlayerName.trim(),
      })
    };

    const result = submitTournamentRegistration(registrationPayload);

    setConfirmedPassData({
      ...registrationPayload,
      slotCode: result.slotCode,
      ticketId: result.ticketId,
      passcode: result.passcode,
      players: result.squad?.players || []
    });

    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#0F172A', '#10B981', '#3B82F6', '#F59E0B']
    });

    setViewState('pass');
  };

  const handleCopyPass = () => {
    if (!confirmedPassData) return;
    const passDetails = `LIVE TOURNAMENTS.IN OFFICIAL APPLICATION PASS
Tournament: ${tournamentTitle}
Match Format: ${confirmedPassData.matchType}
Entry Name: ${confirmedPassData.teamName}
Slot Assigned: ${confirmedPassData.slotCode}
Ticket ID: ${confirmedPassData.ticketId}
Team Passcode: ${confirmedPassData.passcode}
Contact: ${confirmedPassData.managerName || confirmedPassData.iglName} (${confirmedPassData.phone})
Status: VERIFIED & CONFIRMED`;

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

      {/* Main Full Display Page (Entire Page, NOT a Floating Popup) */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Card Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#0F172A] text-xs font-bold uppercase tracking-wider mb-2">
              <Swords className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Tournament Registration</span>
            </div>

            <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight uppercase">
              {tournamentTitle}
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3 font-medium">
              <span>Prize Pool: <strong className="text-amber-600 font-bold">{prizePool}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Default Format: <strong className="text-[#0F172A]">{format}</strong></span>
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: DIRECT REGISTRATION FORM                         */}
          {/* ======================================================== */}
          {viewState === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Designated Match Format (Set directly by Tournament Organizers) */}
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Designated Match Format</span>
                  <span className="text-[10px] font-bold text-amber-600 font-mono">
                    {matchType === 'SQUAD' && '4 PLAYERS + 1 SUBSTITUTE'}
                    {matchType === 'DUO' && '2 PLAYERS ROSTER'}
                    {matchType === 'SOLO' && '1 SOLO PLAYER'}
                  </span>
                </label>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                      {matchType === 'SQUAD' && <Shield className="w-5 h-5" />}
                      {matchType === 'DUO' && <Users className="w-5 h-5" />}
                      {matchType === 'SOLO' && <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-extrabold uppercase text-[#0F172A] block tracking-wide">
                        {matchType === 'SQUAD' && 'SQUAD MATCH FORMAT (4 PLAYERS + 1 SUBSTITUTE)'}
                        {matchType === 'DUO' && 'DUO MATCH FORMAT (2 PLAYERS ROSTER)'}
                        {matchType === 'SOLO' && 'SOLO MATCH FORMAT (1 SOLO PLAYER)'}
                      </span>
                      <span className="text-[11px] text-[#64748B] font-medium">
                        {isScrim
                          ? 'Daily Scrims are designated exclusively for 4-Player Squads + 1 Reserve.'
                          : `Format designated directly by tournament organizers (${matchType} only).`}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0F172A] text-amber-400 text-[10px] font-bold tracking-wider uppercase shrink-0 font-mono">
                    {matchType} ONLY
                  </span>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* CASE A: SQUAD MATCH (4 PLAYERS + 1 SUB + OWNER/MANAGER) */}
              {/* ---------------------------------------------------- */}
              {matchType === 'SQUAD' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Squad Team & Owner/Manager Details Section */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-black uppercase text-[#0F172A] tracking-wider">
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>Squad Team & Management Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Team / Clan Name *
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          required
                          placeholder="e.g. Tamil Titans, GodLike, Soul"
                          value={formData.teamName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Clan Tag (Optional)
                        </label>
                        <input
                          type="text"
                          name="clanTag"
                          placeholder="e.g. TTN, SOUL, GL"
                          value={formData.clanTag}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Team Owner / Manager & Mobile Number (EXPLICIT USER REQUIREMENT) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Team Owner or Manager Name *</span>
                        </label>
                        <input
                          type="text"
                          name="managerName"
                          required
                          placeholder="e.g. Rajesh Kumar (Owner / Manager)"
                          value={formData.managerName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Owner / Manager Mobile Number *</span>
                        </label>
                        <input
                          type="tel"
                          name="managerPhone"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.managerPhone}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Email & Logo Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Manager / Contact Email (Optional)
                        </label>
                        <input
                          type="email"
                          name="managerEmail"
                          placeholder="manager@clan.com"
                          value={formData.managerEmail}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Upload Clan Logo (Optional)</span>
                          {formData.clanLogo && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="text-[10px] text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </label>

                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />

                        {isUploadingLogo ? (
                          <div className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to CDN...</span>
                          </div>
                        ) : formData.clanLogo ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0F172A] cursor-pointer"
                          >
                            <img src={formData.clanLogo} alt="Logo" className="w-7 h-7 rounded object-cover" />
                            <span className="text-xs text-[#0F172A] font-bold truncate">Logo Attached (Click to change)</span>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-dashed border-[#CBD5E1] hover:border-[#0F172A] cursor-pointer text-[#64748B] text-xs font-semibold"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#0F172A]" />
                            <span>Upload Logo (PNG/JPG)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DIRECTLY 4 PLAYERS ROSTER (EXPLICIT USER REQUIREMENT) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0F172A] tracking-wider">
                        <Swords className="w-4 h-4 text-amber-500" />
                        <span>Squad Starting Roster (4 Players) *</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">IGID = Numeric BGMI ID</span>
                    </div>

                    <div className="space-y-3">
                      {/* Player 1 */}
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Player 1 (Captain / IGL) *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            name="player1Name"
                            required
                            placeholder="Player 1 In-Game Name (IGN) *"
                            value={formData.player1Name}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            name="player1Id"
                            required
                            placeholder="Player 1 Character ID (IGID numbers only) *"
                            value={formData.player1Id}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Player 2 */}
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Player 2 *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            name="player2Name"
                            required
                            placeholder="Player 2 In-Game Name (IGN) *"
                            value={formData.player2Name}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            name="player2Id"
                            required
                            placeholder="Player 2 Character ID (IGID numbers only) *"
                            value={formData.player2Id}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Player 3 */}
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Player 3 *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            name="player3Name"
                            required
                            placeholder="Player 3 In-Game Name (IGN) *"
                            value={formData.player3Name}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            name="player3Id"
                            required
                            placeholder="Player 3 Character ID (IGID numbers only) *"
                            value={formData.player3Id}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Player 4 */}
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Player 4 *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            name="player4Name"
                            required
                            placeholder="Player 4 In-Game Name (IGN) *"
                            value={formData.player4Name}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            name="player4Id"
                            required
                            placeholder="Player 4 Character ID (IGID numbers only) *"
                            value={formData.player4Id}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DIRECTLY ONE SUBSTITUTE PLAYER (EXPLICIT USER REQUIREMENT) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-black uppercase text-[#0F172A] tracking-wider">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>One Substitute Player (Optional 5th Player Reserve)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        name="subName"
                        placeholder="Substitute Player In-Game Name (IGN)"
                        value={formData.subName}
                        onChange={handleChange}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={12}
                        name="subId"
                        placeholder="Substitute Character ID (IGID numbers only)"
                        value={formData.subId}
                        onChange={handleChange}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* CASE B: DUO MATCH (2 PLAYERS + CLAN NAME + MOBILE + TEAM NAME) */}
              {/* ---------------------------------------------------- */}
              {matchType === 'DUO' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Duo Clan, Mobile & Team Details Section */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-black uppercase text-[#0F172A] tracking-wider">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span>Duo Team & Clan Contact Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Team Name *
                        </label>
                        <input
                          type="text"
                          name="duoTeamName"
                          required
                          placeholder="e.g. Deadly Duo, Falcon Duo"
                          value={formData.duoTeamName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Clan Name / Clan Tag *
                        </label>
                        <input
                          type="text"
                          name="duoClanTag"
                          required
                          placeholder="e.g. FALCON / FLCN"
                          value={formData.duoClanTag}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Contact Mobile Number *</span>
                        </label>
                        <input
                          type="tel"
                          name="duoPhone"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.duoPhone}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>Contact Email Address *</span>
                        </label>
                        <input
                          type="email"
                          name="duoEmail"
                          required
                          placeholder="leader@duo.com"
                          value={formData.duoEmail}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DIRECTLY 2 PLAYERS DETAILS (EXPLICIT USER REQUIREMENT) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0F172A] tracking-wider">
                        <Swords className="w-4 h-4 text-amber-500" />
                        <span>Duo Lineup (Directly 2 Players) *</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">IGID = Numeric BGMI ID</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Player 1 (Duo Leader) *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            name="player1Name"
                            required
                            placeholder="Player 1 In-Game Name (IGN) *"
                            value={formData.player1Name}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            name="player1Id"
                            required
                            placeholder="Player 1 Character ID (IGID numbers only) *"
                            value={formData.player1Id}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Player 2 (Duo Partner) *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            name="player2Name"
                            required
                            placeholder="Player 2 In-Game Name (IGN) *"
                            value={formData.player2Name}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            name="player2Id"
                            required
                            placeholder="Player 2 Character ID (IGID numbers only) *"
                            value={formData.player2Id}
                            onChange={handleChange}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* CASE C: SOLO MATCH (ONLY 1 PLAYER NAME + CLAN + EMAIL + MOBILE) */}
              {/* ---------------------------------------------------- */}
              {matchType === 'SOLO' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Solo Player Details Section */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-black uppercase text-[#0F172A] tracking-wider">
                      <User className="w-4 h-4 text-amber-500" />
                      <span>Solo Competitor Profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Solo Player Name (In-Game / Full Name) *
                        </label>
                        <input
                          type="text"
                          name="soloPlayerName"
                          required
                          placeholder="e.g. Naman Mathur / Mortal"
                          value={formData.soloPlayerName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          In-Game Character ID (IGID Numbers Only) *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          name="soloPlayerId"
                          required
                          placeholder="e.g. 512938471"
                          value={formData.soloPlayerId}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                          Clan Name / Clan Tag
                        </label>
                        <input
                          type="text"
                          name="soloClanTag"
                          placeholder="e.g. SOUL (or leave blank)"
                          value={formData.soloClanTag}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mobile Number *</span>
                        </label>
                        <input
                          type="tel"
                          name="soloPhone"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.soloPhone}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          name="soloEmail"
                          required
                          placeholder="player@gmail.com"
                          value={formData.soloEmail}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F172A] text-[#0F172A] text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Discord Tag for all formats */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Discord Tag (Optional)
                </label>
                <input
                  type="text"
                  name="discordTag"
                  placeholder="discord#1234 or discord username"
                  value={formData.discordTag}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                />
              </div>

              {/* Submit Registration Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4 text-amber-400" />
                  <span>
                    {matchType === 'SQUAD' && 'Submit Squad Registration (4 Players + 1 Sub)'}
                    {matchType === 'DUO' && 'Submit Duo Registration (2 Players)'}
                    {matchType === 'SOLO' && 'Submit Solo Registration (1 Player)'}
                  </span>
                </button>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: CONFIRMED APPLICATION PASS (TICKET & DETAILS)    */}
          {/* ======================================================== */}
          {viewState === 'pass' && confirmedPassData && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Confirmed Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm block">Registration Successfully Confirmed!</span>
                  <span className="font-medium text-slate-600">
                    Your {confirmedPassData.matchType} entry for <strong>{tournamentTitle}</strong> has been officially booked.
                  </span>
                </div>
              </div>

              {/* Official Ticket Pass (Clean White & Black UI Format) */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#F8FAFC] border-2 border-[#CBD5E1] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#CBD5E1] bg-white flex items-center justify-center shrink-0 shadow-xs">
                      {confirmedPassData.clanLogo ? (
                        <img src={confirmedPassData.clanLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <img src="/assets/conqueror_badge.jpg" alt="Badge" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5 uppercase">
                        <span>LIVE TOURNAMENTS.IN OFFICIAL PASS</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#0F172A] text-white text-[9px] font-black">{confirmedPassData.matchType}</span>
                      </div>
                      <h3 className="font-montserrat font-black text-base sm:text-lg text-[#0F172A] tracking-tight uppercase leading-tight">
                        {confirmedPassData.teamName}
                      </h3>
                      {confirmedPassData.clanTag && (
                        <span className="text-[11px] font-mono font-bold text-amber-600">
                          Clan Tag: [{confirmedPassData.clanTag}]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slot Number */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      Assigned Slot
                    </div>
                    <div className="font-montserrat font-black text-xl sm:text-2xl text-amber-600 tracking-tight">
                      {confirmedPassData.slotCode}
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#E2E8F0] text-xs mb-5 shadow-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Ticket ID</span>
                    <span className="font-mono font-black text-[#0F172A] text-sm">{confirmedPassData.ticketId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Team Passcode</span>
                    <span className="font-mono font-black text-[#0F172A] text-sm">{confirmedPassData.passcode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                      {confirmedPassData.matchType === 'SQUAD' ? 'Owner / Manager' : 'Contact Person'}
                    </span>
                    <span className="font-bold text-[#0F172A] truncate block">
                      {confirmedPassData.managerName || confirmedPassData.iglName || confirmedPassData.playerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Mobile Phone</span>
                    <span className="font-bold text-[#0F172A]">{confirmedPassData.phone}</span>
                  </div>
                </div>

                {/* Roster Breakdown Table */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 text-xs">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#334155] mb-2 flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <span>Registered Lineup ({confirmedPassData.players.length} Players)</span>
                    <span className="text-emerald-700 text-[10px]">Verified Roster</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {confirmedPassData.players.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
                        <div>
                          <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#0F172A] text-white text-[9px] font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{p.name}</span>
                          </div>
                          <div className="text-[10px] text-[#64748B] pl-5 font-medium">{p.role}</div>
                        </div>
                        <div className="font-mono text-xs font-black text-[#0F172A] bg-white px-2 py-1 rounded-md border border-[#CBD5E1]">
                          ID: {p.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer notes */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-[11px] text-[#64748B]">
                  <span>Tournament: <strong>{tournamentTitle}</strong></span>
                  <span>Entry: Verified on BGMI Esports Grid</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPass ? 'Details Copied!' : 'Copy Pass Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 px-5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setViewState('form');
                    onBackToPortal?.();
                  }}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Return to Arena</span>
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
