import React, { useState, useEffect } from 'react';

const DEFAULT_FINISHED_MATCHES = [
  {
    id: 'finished-bgmi-masters-s1',
    title: 'BGMI PRO MASTERS FINALS — SEASON 1',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    format: 'Squad (Erangel + Miramar)',
    completedAt: 'Yesterday • 9:30 PM IST',
    prizePool: '₹ 2,00,000 INR',
    winnerClan: 'SOUL ESPORTS',
    winnerLeader: 'Omega_07',
    mvpPlayer: 'Mortal_007',
    totalKills: '42 Team Kills',
    disbursed: '₹ 1,00,000 Disbursed to 1st Place',
    image: '/assets/tournament_bgmi_showdown_4k.jpg',
    resultType: 'table', // 'table' or 'image'
    slotsData: [
      { rank: 1, slot: 'Slot 1', clan: 'Team Soul', kills: 42, positionPts: 15, totalPts: 57, prize: '₹ 1,00,000' },
      { rank: 2, slot: 'Slot 4', clan: 'GodLike Esports', kills: 38, positionPts: 12, totalPts: 50, prize: '₹ 60,000' },
      { rank: 3, slot: 'Slot 7', clan: 'Blind Esports', kills: 31, positionPts: 10, totalPts: 41, prize: '₹ 40,000' },
      { rank: 4, slot: 'Slot 12', clan: 'Team X-Spark', kills: 27, positionPts: 8, totalPts: 35, prize: 'Finalist' },
      { rank: 5, slot: 'Slot 2', clan: 'Revenant Esports', kills: 22, positionPts: 6, totalPts: 28, prize: 'Finalist' },
      { rank: 6, slot: 'Slot 9', clan: 'Gladiators Esports', kills: 20, positionPts: 4, totalPts: 24, prize: 'Finalist' },
      { rank: 7, slot: 'Slot 15', clan: 'Medal Esports', kills: 18, positionPts: 2, totalPts: 20, prize: 'Finalist' },
      { rank: 8, slot: 'Slot 3', clan: 'Enigma Gaming', kills: 16, positionPts: 1, totalPts: 17, prize: 'Finalist' },
      { rank: 9, slot: 'Slot 18', clan: 'Orangutan Esports', kills: 15, positionPts: 1, totalPts: 16, prize: 'Finalist' },
      { rank: 10, slot: 'Slot 6', clan: 'Marcos Gaming', kills: 14, positionPts: 1, totalPts: 15, prize: 'Finalist' },
      { rank: 11, slot: 'Slot 21', clan: 'Entity Gaming', kills: 12, positionPts: 0, totalPts: 12, prize: 'Finalist' },
      { rank: 12, slot: 'Slot 8', clan: 'Big Brother Esports', kills: 11, positionPts: 0, totalPts: 11, prize: 'Finalist' },
      { rank: 13, slot: 'Slot 14', clan: 'Team Insane', kills: 10, positionPts: 0, totalPts: 10, prize: 'Finalist' },
      { rank: 14, slot: 'Slot 19', clan: 'Gujarat Tigers', kills: 9, positionPts: 0, totalPts: 9, prize: 'Finalist' },
      { rank: 15, slot: 'Slot 5', clan: 'Velocity Gaming', kills: 8, positionPts: 0, totalPts: 8, prize: 'Finalist' },
      { rank: 16, slot: 'Slot 23', clan: 'Hyderabad Hydras', kills: 7, positionPts: 0, totalPts: 7, prize: 'Finalist' },
      { rank: 17, slot: 'Slot 10', clan: 'Midwave Esports', kills: 6, positionPts: 0, totalPts: 6, prize: 'Finalist' },
      { rank: 18, slot: 'Slot 25', clan: 'Autobotz Esports', kills: 5, positionPts: 0, totalPts: 5, prize: 'Finalist' },
      { rank: 19, slot: 'Slot 11', clan: 'Team Mayhem', kills: 5, positionPts: 0, totalPts: 5, prize: 'Finalist' },
      { rank: 20, slot: 'Slot 16', clan: 'Claw Esports', kills: 4, positionPts: 0, totalPts: 4, prize: 'Finalist' },
      { rank: 21, slot: 'Slot 20', clan: 'Reckoning Esports', kills: 3, positionPts: 0, totalPts: 3, prize: 'Finalist' },
      { rank: 22, slot: 'Slot 13', clan: 'Rivalry Squad', kills: 3, positionPts: 0, totalPts: 3, prize: 'Finalist' },
      { rank: 23, slot: 'Slot 17', clan: '7Sea Esports', kills: 2, positionPts: 0, totalPts: 2, prize: 'Finalist' },
      { rank: 24, slot: 'Slot 22', clan: 'Genesis Warriors', kills: 1, positionPts: 0, totalPts: 1, prize: 'Finalist' },
      { rank: 25, slot: 'Slot 24', clan: 'Vortex Legion', kills: 0, positionPts: 0, totalPts: 0, prize: 'Finalist' }
    ]
  },
  {
    id: 'finished-pubg-pmgc-qualifier',
    title: 'PUBG GLOBAL PRO SCRIMS SHOWDOWN',
    game: 'PUBG MOBILE',
    category: 'PUBG',
    format: 'Squad (Miramar)',
    completedAt: '2 Days Ago • 10:00 PM IST',
    prizePool: '₹ 1,00,000 INR',
    winnerClan: 'ALPHA REIGN',
    winnerLeader: 'Viper_OP',
    mvpPlayer: 'SniperKing',
    totalKills: '36 Team Kills',
    disbursed: '₹ 50,00,000 Disbursed to 1st Place',
    image: '/assets/tournament_pubg_mobile_4k.jpg',
    resultType: 'table',
    slotsData: [
      { rank: 1, slot: 'Slot 2', clan: 'Alpha Reign', kills: 36, positionPts: 15, totalPts: 51, prize: '₹ 50,000' },
      { rank: 2, slot: 'Slot 5', clan: 'Team Entity', kills: 29, positionPts: 12, totalPts: 41, prize: '₹ 30,000' },
      { rank: 3, slot: 'Slot 11', clan: 'X-Force Gaming', kills: 24, positionPts: 10, totalPts: 34, prize: '₹ 20,000' },
      { rank: 4, slot: 'Slot 1', clan: 'Apex Predators', kills: 21, positionPts: 8, totalPts: 29, prize: 'Finalist' },
      { rank: 5, slot: 'Slot 8', clan: 'Titanium Squad', kills: 19, positionPts: 6, totalPts: 25, prize: 'Finalist' },
      { rank: 6, slot: 'Slot 14', clan: 'Omega Dynasty', kills: 16, positionPts: 4, totalPts: 20, prize: 'Finalist' },
      { rank: 7, slot: 'Slot 19', clan: 'Nova Knights', kills: 14, positionPts: 2, totalPts: 16, prize: 'Finalist' },
      { rank: 8, slot: 'Slot 3', clan: 'Redline Esports', kills: 13, positionPts: 1, totalPts: 14, prize: 'Finalist' },
      { rank: 9, slot: 'Slot 7', clan: 'Immortal Legends', kills: 11, positionPts: 1, totalPts: 12, prize: 'Finalist' },
      { rank: 10, slot: 'Slot 22', clan: 'Shadow Hunters', kills: 10, positionPts: 1, totalPts: 11, prize: 'Finalist' },
      { rank: 11, slot: 'Slot 4', clan: 'Phantom Force', kills: 9, positionPts: 0, totalPts: 9, prize: 'Finalist' },
      { rank: 12, slot: 'Slot 15', clan: 'Raptor Gaming', kills: 8, positionPts: 0, totalPts: 8, prize: 'Finalist' },
      { rank: 13, slot: 'Slot 6', clan: 'Ironclad Crew', kills: 7, positionPts: 0, totalPts: 7, prize: 'Finalist' },
      { rank: 14, slot: 'Slot 17', clan: 'Blaze Battalion', kills: 6, positionPts: 0, totalPts: 6, prize: 'Finalist' },
      { rank: 15, slot: 'Slot 9', clan: 'Cyber Strike', kills: 6, positionPts: 0, totalPts: 6, prize: 'Finalist' },
      { rank: 16, slot: 'Slot 21', clan: 'Vanguard Elite', kills: 5, positionPts: 0, totalPts: 5, prize: 'Finalist' },
      { rank: 17, slot: 'Slot 12', clan: 'Ghost Protocol', kills: 4, positionPts: 0, totalPts: 4, prize: 'Finalist' },
      { rank: 18, slot: 'Slot 24', clan: 'Rebel Storm', kills: 4, positionPts: 0, totalPts: 4, prize: 'Finalist' },
      { rank: 19, slot: 'Slot 10', clan: 'Venom Syndicate', kills: 3, positionPts: 0, totalPts: 3, prize: 'Finalist' },
      { rank: 20, slot: 'Slot 16', clan: 'Eclipse Squad', kills: 3, positionPts: 0, totalPts: 3, prize: 'Finalist' },
      { rank: 21, slot: 'Slot 25', clan: 'Thunderbolts', kills: 2, positionPts: 0, totalPts: 2, prize: 'Finalist' },
      { rank: 22, slot: 'Slot 18', clan: 'Wildfire Club', kills: 2, positionPts: 0, totalPts: 2, prize: 'Finalist' },
      { rank: 23, slot: 'Slot 13', clan: 'Kraken Esports', kills: 1, positionPts: 0, totalPts: 1, prize: 'Finalist' },
      { rank: 24, slot: 'Slot 20', clan: 'Frostbite Clan', kills: 1, positionPts: 0, totalPts: 1, prize: 'Finalist' },
      { rank: 25, slot: 'Slot 23', clan: 'Valkyrie Unit', kills: 0, positionPts: 0, totalPts: 0, prize: 'Finalist' }
    ]
  },
  {
    id: 'finished-ff-clutch-cup',
    title: 'FREE FIRE MAX CLUTCH CHAMPIONSHIP',
    game: 'FREE FIRE MAX',
    category: 'FREEFIRE',
    format: 'Squad (Bermuda)',
    completedAt: 'Nov 18, 2026 • 8:00 PM IST',
    prizePool: '₹ 75,000 INR',
    winnerClan: 'TEAM ELITE',
    winnerLeader: 'Killer_FF',
    mvpPlayer: 'Jahanzeb (18 Kills)',
    totalKills: '48 Team Kills',
    disbursed: '₹ 40,000 Disbursed to 1st Place',
    image: '/assets/tournament_bgmi_showdown_4k.jpg',
    resultType: 'image', // direct scoreboard upload
    scoreboardImage: '/assets/lt_championship_trophy_card_4k.png',
    slotsData: [
      { rank: 1, slot: 'Slot 3', clan: 'Team Elite', kills: 48, positionPts: 15, totalPts: 63, prize: '₹ 40,000' },
      { rank: 2, slot: 'Slot 6', clan: 'Total Gaming', kills: 39, positionPts: 12, totalPts: 51, prize: '₹ 22,000' },
      { rank: 3, slot: 'Slot 12', clan: 'Desi Gamers', kills: 27, positionPts: 10, totalPts: 37, prize: '₹ 13,000' }
    ]
  },
  {
    id: 'finished-bgmi-lan-warriors',
    title: 'BGMI LAN WARRIORS CHALLENGE (DUO)',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    format: 'Duo Showdown',
    completedAt: 'Nov 17, 2026 • 7:00 PM IST',
    prizePool: '₹ 50,000 INR',
    winnerClan: 'DELTA DUO',
    winnerLeader: 'Punk_God',
    mvpPlayer: 'Punk_God (16 Kills)',
    totalKills: '24 Team Kills',
    disbursed: '₹ 30,000 Disbursed to 1st Place',
    image: '/assets/tournament_bgmi_lan_warriors_4k.jpg',
    resultType: 'table',
    slotsData: Array.from({ length: 25 }, (_, idx) => ({
      rank: idx + 1,
      slot: `Slot ${idx + 1}`,
      clan: idx === 0 ? 'Delta Duo' : idx === 1 ? 'Sniper Squad Duo' : idx === 2 ? 'Eagle Duo' : `Competitor Duo ${idx + 1}`,
      kills: Math.max(0, 24 - idx),
      positionPts: idx === 0 ? 15 : idx === 1 ? 12 : idx === 2 ? 10 : Math.max(0, 8 - idx),
      totalPts: (idx === 0 ? 15 : idx === 1 ? 12 : idx === 2 ? 10 : Math.max(0, 8 - idx)) + Math.max(0, 24 - idx),
      prize: idx === 0 ? '₹ 30,000' : idx === 1 ? '₹ 13,000' : idx === 2 ? '₹ 7,000' : 'Participant'
    }))
  }
];

export default function PreviousFinishedMatchesSection({ onNavigate, currentUser }) {
  // Load finished matches from localStorage or fallback
  const [finishedMatches, setFinishedMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lt_finished_matches');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_FINISHED_MATCHES;
  });

  // Selected match for 25-slot Leaderboard modal
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Host Results Submission Modal
  const [showHostModal, setShowHostModal] = useState(false);
  const [entryMethod, setEntryMethod] = useState('slots'); // 'slots' or 'image'
  const [tourneyTitle, setTourneyTitle] = useState('');
  const [tourneyGame, setTourneyGame] = useState('BATTLEGROUNDS MOBILE INDIA');
  const [tourneyPrize, setTourneyPrize] = useState('₹ 50,000 INR');
  const [winnerClanName, setWinnerClanName] = useState('');
  const [scoreboardImageUrl, setScoreboardImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // 25 slots state for host manual entry
  const [slotsList, setSlotsList] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      slotNum: i + 1,
      clan: i === 0 ? 'Champion Clan' : '',
      kills: 0,
      positionPts: i === 0 ? 15 : i === 1 ? 12 : i === 2 ? 10 : 0
    }))
  );

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Handle slot update
  const handleSlotChange = (index, field, value) => {
    setSlotsList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Handle image upload from file input
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setScoreboardImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Host Results
  const handleSubmitResults = (e) => {
    e.preventDefault();

    if (!tourneyTitle.trim()) {
      showToast('Please enter the tournament name.');
      return;
    }

    if (!winnerClanName.trim()) {
      showToast('Please specify the Winner Clan.');
      return;
    }

    // Build the 25 slots points table with auto-calculated overall points
    const compiledSlots = slotsList.map((s, idx) => {
      const killPts = parseInt(s.kills) || 0;
      const posPts = parseInt(s.positionPts) || 0;
      const total = killPts + posPts;
      return {
        rank: idx + 1,
        slot: `Slot ${s.slotNum}`,
        clan: s.clan.trim() || `Slot ${s.slotNum} Squad`,
        kills: killPts,
        positionPts: posPts,
        totalPts: total,
        prize: idx === 0 ? 'Champion' : idx === 1 ? 'Runner Up' : idx === 2 ? '3rd Place' : 'Finalist'
      };
    });

    // Sort by totalPts descending
    compiledSlots.sort((a, b) => b.totalPts - a.totalPts);
    // Reassign ranks
    compiledSlots.forEach((s, i) => { s.rank = i + 1; });

    const newMatchResult = {
      id: 'finished_' + Date.now(),
      title: tourneyTitle.trim().toUpperCase(),
      game: tourneyGame,
      category: tourneyGame.includes('BGMI') ? 'BGMI' : tourneyGame.includes('PUBG') ? 'PUBG' : 'FREEFIRE',
      format: 'Squad (25 Slots)',
      completedAt: 'Just Now • Final Results Published',
      prizePool: tourneyPrize.trim() || '₹ 50,000 INR',
      winnerClan: winnerClanName.trim().toUpperCase(),
      winnerLeader: compiledSlots[0]?.clan || winnerClanName,
      mvpPlayer: `${compiledSlots[0]?.clan} MVP`,
      totalKills: `${compiledSlots[0]?.kills || 18} Kills`,
      disbursed: 'Official Prize Pool Disbursed',
      image: tourneyGame.includes('PUBG') ? '/assets/tournament_pubg_mobile_4k.jpg' : '/assets/tournament_bgmi_showdown_4k.jpg',
      resultType: entryMethod,
      scoreboardImage: scoreboardImageUrl || imagePreview || '/assets/lt_championship_trophy_card_4k.png',
      slotsData: compiledSlots
    };

    const updated = [newMatchResult, ...finishedMatches];
    setFinishedMatches(updated);

    try {
      localStorage.setItem('lt_finished_matches', JSON.stringify(updated));
    } catch (err) {}

    setShowHostModal(false);
    showToast('🏆 Match Results & 25-Slot Leaderboard Published!');

    // Reset form
    setTourneyTitle('');
    setWinnerClanName('');
    setScoreboardImageUrl('');
    setImagePreview(null);
  };

  return (
    <section
      id="finished-matches-section"
      data-section="finished-matches"
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20 bg-neutral-900 text-white"
    >
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-black text-white text-xs font-bold border border-gold-primary shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-gold-primary">emoji_events</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Host Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold-primary text-black">
                  Esports Hall of Fame
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  45+ Official Matches Completed
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Previous Finished Matches &amp; Leaderboards
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                Review verified results, complete 1 to 25 slot rankings (Kill Points, Position Points &amp; Overall Scores), and champion squads across all completed tournaments on LiveTournaments.in.
              </p>
            </div>

            {/* Host Results Upload Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowHostModal(true)}
                className="px-5 py-3 rounded-xl bg-gold-primary hover:bg-gold-light text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Host: Publish Match Results</span>
              </button>
            </div>
          </div>

          {/* Finished Matches Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {finishedMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="group relative flex flex-col rounded-2xl bg-[#14151B] border border-white/10 hover:border-gold-primary/80 overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/70 transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.05] hover:-translate-y-2.5 hover:z-30 hover:ring-2 hover:ring-gold-primary/40 flex flex-col justify-between"
              >
                {/* Image Banner with Sleek Prize Overlay */}
                <div className="relative aspect-[1.74/1] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={match.image}
                    alt={match.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#14151B] via-transparent to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow">
                      COMPLETED ✓
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 text-gray-200 border border-white/20 backdrop-blur-xs">
                      {match.category}
                    </span>
                  </div>

                  {/* Clean Minimal Hover Overlay: Exclusively Showing Image & Prize Amount */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-3 text-center pointer-events-none">
                    <div className="bg-black/85 backdrop-blur-md border border-gold-primary/70 rounded-xl px-4 py-1.5 shadow-xl transform-gpu translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gold-primary font-bold block">
                        Prize Disbursed
                      </span>
                      <span className="text-lg font-black text-white font-mono drop-shadow-md">
                        {match.prizePool}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase text-white group-hover:text-gold-primary transition-colors line-clamp-1">
                      {match.title}
                    </h3>
                    
                    {/* Completion Timestamp */}
                    <p className="text-[11px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-gold-primary">history</span>
                      <span>{match.completedAt}</span>
                    </p>
                  </div>

                  {/* Winner Clan Card Highlight */}
                  <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gold-primary block">
                        CHAMPION SQUAD (RANK 1)
                      </span>
                      <span className="text-xs font-black text-white font-mono block mt-0.5">
                        👑 {match.winnerClan}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 block font-mono">PRIZE WON</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {match.prizePool.split(' ')[0]} {match.prizePool.split(' ')[1]}
                      </span>
                    </div>
                  </div>

                  {/* Leaderboard CTA Button */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">
                      {match.slotsData ? '25 Slot Breakdown' : 'Scoreboard Ready'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatch(match);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-gold-primary hover:text-black text-white text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <span>View Results</span>
                      <span className="material-symbols-outlined text-[13px]">leaderboard</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* =========================================================
          MODAL 1: 25-SLOTS LEADERBOARD & RESULTS INSPECTOR
          ========================================================= */}
      {selectedMatch && (
        <div
          onClick={() => setSelectedMatch(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#14151B] text-white rounded-3xl w-full max-w-4xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-600 text-white">
                    VERIFIED MATCH RESULT
                  </span>
                  <span className="text-xs font-mono text-gold-primary font-bold">
                    {selectedMatch.game} &bull; {selectedMatch.format}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black uppercase text-white mt-1">
                  {selectedMatch.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Results Body: Choice of 25-Slot Table OR Scoreboard Image */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Champion Squad Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-gold-primary/20 via-black/40 to-transparent border border-gold-primary/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="size-14 rounded-2xl bg-gold-primary text-black flex items-center justify-center text-3xl font-black shadow-lg">
                    🏆
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-primary font-bold block">
                      TOURNAMENT CHAMPION
                    </span>
                    <h4 className="text-xl font-black text-white uppercase mt-0.5">
                      {selectedMatch.winnerClan}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">
                      Completed: {selectedMatch.completedAt} &bull; {selectedMatch.totalKills}
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-center sm:text-right">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Total Prize Pool</span>
                  <span className="text-lg font-black text-gold-primary font-mono">{selectedMatch.prizePool}</span>
                </div>
              </div>

              {/* If Host Uploaded an Image Scoreboard */}
              {selectedMatch.resultType === 'image' && selectedMatch.scoreboardImage && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Host Verified Final Trophy &amp; Scoreboard Graphic:
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-white/20 bg-black shadow-xl">
                    <img
                      src={selectedMatch.scoreboardImage}
                      alt="Verified Trophy Scoreboard"
                      className="w-full h-auto object-contain max-h-[500px] mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* 25 Slots Points Table (Kill Points, Position Points, Overall Points) */}
              {selectedMatch.slotsData && selectedMatch.slotsData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Official 25-Slot Ranking Table (Kill Pts + Position Pts = Overall Pts)
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">
                      25 Competing Squads
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 text-gray-400 uppercase text-[10px] border-b border-white/10">
                        <tr>
                          <th className="py-3 px-4">Rank</th>
                          <th className="py-3 px-4">Slot</th>
                          <th className="py-3 px-4">Clan / Team Name</th>
                          <th className="py-3 px-4 text-center">Kill Pts</th>
                          <th className="py-3 px-4 text-center">Place Pts</th>
                          <th className="py-3 px-4 text-right">Overall Points</th>
                          <th className="py-3 px-4 text-right">Prize / Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedMatch.slotsData.map((s) => (
                          <tr
                            key={s.rank}
                            className={`transition-colors ${
                              s.rank === 1
                                ? 'bg-gold-primary/15 font-bold text-white'
                                : s.rank === 2
                                ? 'bg-white/5 font-semibold text-gray-200'
                                : s.rank === 3
                                ? 'bg-amber-900/20 text-gray-200'
                                : 'hover:bg-white/5 text-gray-300'
                            }`}
                          >
                            <td className="py-2.5 px-4">
                              {s.rank === 1 ? '🥇 1st' : s.rank === 2 ? '🥈 2nd' : s.rank === 3 ? '🥉 3rd' : `#${s.rank}`}
                            </td>
                            <td className="py-2.5 px-4 text-gray-400">{s.slot}</td>
                            <td className="py-2.5 px-4 font-bold text-white font-sans">{s.clan}</td>
                            <td className="py-2.5 px-4 text-center text-amber-400">{s.kills}</td>
                            <td className="py-2.5 px-4 text-center text-emerald-400">{s.positionPts}</td>
                            <td className="py-2.5 px-4 text-right font-black text-white text-sm">
                              {s.totalPts}
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-400">
                              <span className={s.rank <= 3 ? 'text-gold-primary font-bold' : ''}>
                                {s.prize}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: HOST MATCH RESULTS SUBMISSION / PUBLISH TOOL
          ========================================================= */}
      {showHostModal && (
        <div
          onClick={() => setShowHostModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#14151B] text-white rounded-3xl w-full max-w-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-gold-primary text-black">
                  Conductor / Host Studio
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  Publish Finished Match Results
                </h3>
              </div>

              <button
                onClick={() => setShowHostModal(false)}
                className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitResults} className="p-5 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Tournament Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Tournament Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BGMI BATTLE SHOWDOWN S2"
                    value={tourneyTitle}
                    onChange={(e) => setTourneyTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/20 focus:border-gold-primary focus:outline-hidden text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Game Category
                  </label>
                  <select
                    value={tourneyGame}
                    onChange={(e) => setTourneyGame(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/20 focus:border-gold-primary focus:outline-hidden text-white font-medium"
                  >
                    <option value="BATTLEGROUNDS MOBILE INDIA">BATTLEGROUNDS MOBILE INDIA (BGMI)</option>
                    <option value="PUBG MOBILE">PUBG MOBILE</option>
                    <option value="FREE FIRE MAX">FREE FIRE MAX</option>
                    <option value="VALORANT">VALORANT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Champion Clan Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team Soul, GodLike"
                    value={winnerClanName}
                    onChange={(e) => setWinnerClanName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/20 focus:border-gold-primary focus:outline-hidden text-white font-medium"
                  />
                </div>
              </div>

              {/* Choose Publishing Mode: Slots Points OR Direct Image Upload */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                  How would you like to submit the match results?
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEntryMethod('slots')}
                    className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      entryMethod === 'slots'
                        ? 'bg-gold-primary text-black border-gold-primary font-black shadow-md'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                    <span>1 to 25 Slots (Kill + Position Points)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEntryMethod('image')}
                    className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      entryMethod === 'image'
                        ? 'bg-gold-primary text-black border-gold-primary font-black shadow-md'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">image</span>
                    <span>Direct Scoreboard Image Upload</span>
                  </button>
                </div>
              </div>

              {/* Mode A: 25-Slots Entry Form */}
              {entryMethod === 'slots' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Enter Slots 1 to 25 (Kill Points &amp; Position Points):
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Overall points = Kill Pts + Position Pts
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 border border-white/10 rounded-2xl p-3 bg-black/40">
                    {slotsList.map((slot, idx) => (
                      <div key={slot.slotNum} className="grid grid-cols-12 gap-2 items-center text-xs">
                        <span className="col-span-2 font-mono text-gray-400 font-bold">
                          Slot {slot.slotNum}:
                        </span>
                        <input
                          type="text"
                          placeholder={idx === 0 ? 'Winner Clan' : `Slot ${slot.slotNum} Clan`}
                          value={slot.clan}
                          onChange={(e) => handleSlotChange(idx, 'clan', e.target.value)}
                          className="col-span-5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Kill Pts"
                          value={slot.kills}
                          onChange={(e) => handleSlotChange(idx, 'kills', e.target.value)}
                          className="col-span-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-amber-400 font-mono text-center text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Pos Pts"
                          value={slot.positionPts}
                          onChange={(e) => handleSlotChange(idx, 'positionPts', e.target.value)}
                          className="col-span-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-emerald-400 font-mono text-center text-xs"
                        />
                        <span className="col-span-1 text-right font-mono font-black text-white text-xs">
                          {(parseInt(slot.kills) || 0) + (parseInt(slot.positionPts) || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode B: Direct Image Upload */}
              {entryMethod === 'image' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Upload Scoreboard / Trophy Winner Graphic:
                  </label>
                  
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center space-y-3 bg-white/5 hover:border-gold-primary transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span className="material-symbols-outlined text-4xl text-gold-primary">add_photo_alternate</span>
                    <p className="text-xs text-gray-300">
                      Click to choose image or drag &amp; drop final match screenshot / scoreboard graphic
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono block">Supports PNG, JPG, WebP</span>
                  </div>

                  {imagePreview && (
                    <div className="rounded-xl overflow-hidden border border-gold-primary/60 max-h-48">
                      <img src={imagePreview} alt="Scoreboard Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-primary hover:bg-gold-light text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">publish</span>
                  <span>Publish Results to Hall of Fame</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}
