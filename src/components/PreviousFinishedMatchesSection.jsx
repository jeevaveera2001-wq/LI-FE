import React, { useState, useEffect } from 'react';
import { getYouTubeEmbedUrl } from '../utils/urlValidator';

const DEFAULT_FINISHED_MATCHES = [];

export default function PreviousFinishedMatchesSection({ onNavigate, currentUser }) {
  // Load finished matches from localStorage (real published matches only, zero fake data)
  const [finishedMatches, setFinishedMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lt_finished_matches');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const clean = parsed.filter(m => m && m.id && !m.id.startsWith('finished-bgmi-') && !m.id.startsWith('finished-pubg-') && !m.id.startsWith('finished-ff-'));
            return clean;
          }
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lt_finished_matches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(m => m && m.id && !m.id.startsWith('finished-bgmi-') && !m.id.startsWith('finished-pubg-') && !m.id.startsWith('finished-ff-'));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_finished_matches', JSON.stringify(clean));
          }
        }
      }
    } catch (e) {}

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('lt_finished_matches');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter(m => m && m.id && !m.id.startsWith('finished-bgmi-') && !m.id.startsWith('finished-pubg-') && !m.id.startsWith('finished-ff-'));
            setFinishedMatches(clean);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lt_results_published', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lt_results_published', handleUpdate);
    };
  }, []);

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
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20 bg-white-dirty text-dark-default"
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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-black/10 pb-6">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold-primary text-black">
                  Esports Hall of Fame
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  45+ Official Matches Completed
                </span>
              </div>

              <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90 text-dark-default">
                Previous Finished Matches &amp; Leaderboards
              </h2>
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B7280] max-w-3xl leading-relaxed">
                Review verified results, complete 1 to 25 slot rankings (Kill Points, Position Points &amp; Overall Scores), and champion squads across all completed tournaments on LiveTournaments.in.
              </p>
            </div>

            {/* Host Results Upload Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowHostModal(true)}
                className="px-5 py-3 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Host: Publish Match Results</span>
              </button>
            </div>
          </div>

          {/* Finished Matches Cards Grid (White Theme Matching Homepage Canvas) */}
          <div className="pt-2 pb-6">
            {finishedMatches.length === 0 ? (
              <div className="py-12 px-6 rounded-2xl bg-white border border-dashed border-gray-300 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-gray-400">emoji_events</span>
                <h4 className="text-sm font-bold text-gray-800">No Finished Match Leaderboards Yet</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Official certified results and 25-slot leaderboards will appear here once verified and published by the Admin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {finishedMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className="group relative flex flex-col rounded-2xl bg-white border border-black/10 hover:border-gold-primary overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 ease-out transform-gpu will-change-transform hover:-translate-y-2 hover:scale-[1.025] relative z-0 hover:z-30 hover:ring-2 hover:ring-gold-primary/50 flex flex-col justify-between"
                  >
                {/* Image Banner with Smooth Hover Zoom & Forward Elevation */}
                <div className="relative aspect-[1.74/1] w-full overflow-hidden bg-neutral-900 rounded-t-2xl">
                  <img
                    src={match.image}
                    alt={match.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 transform-gpu"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow">
                      COMPLETED ✓
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 text-gray-200 border border-white/20 backdrop-blur-xs">
                      {match.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase text-dark-default group-hover:text-gold-primary transition-colors line-clamp-1">
                      {match.title}
                    </h3>
                    
                    {/* Completion Timestamp */}
                    <p className="text-[11px] text-gray-500 font-mono mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-gold-primary">history</span>
                      <span>{match.completedAt || match.date || 'Recently Completed'}</span>
                    </p>
                  </div>

                  {/* Winner Clan Card Highlight */}
                  <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-between group-hover:bg-gold-primary/15 transition-colors">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gold-primary block">
                        CHAMPION SQUAD (RANK 1)
                      </span>
                      <span className="text-xs font-black text-dark-default font-mono block mt-0.5 group-hover:text-gold-primary transition-colors">
                        👑 {match.winnerClan}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 block font-mono">PRIZE WON</span>
                      <span className="text-xs font-extrabold text-emerald-700 font-mono">
                        {match.prizePool || '₹ 50,000'}
                      </span>
                    </div>
                  </div>

                  {/* Leaderboard CTA Button */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">
                      {match.slotsData ? '25 Slot Breakdown' : 'Scoreboard Ready'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatch(match);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black text-white group-hover:bg-gold-primary group-hover:text-black text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1 shadow-xs group-hover:shadow-md"
                    >
                      <span>View Results</span>
                      <span className="material-symbols-outlined text-[13px]">leaderboard</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* =========================================================
          MODAL 1: 25-SLOTS LEADERBOARD & RESULTS INSPECTOR
          ========================================================= */}
      {selectedMatch && (
        <div
          onClick={() => setSelectedMatch(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-dark-default rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 bg-white-dirty flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-600 text-white">
                    VERIFIED MATCH RESULT
                  </span>
                  <span className="text-xs font-mono text-gold-primary font-bold">
                    {selectedMatch.game} &bull; {selectedMatch.format || 'Squad Battle Royale'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black uppercase text-dark-default mt-1">
                  {selectedMatch.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Results Body: Choice of 25-Slot Table OR Scoreboard Image */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 bg-white">
              
              {/* Champion Squad Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-gold-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="size-14 rounded-2xl bg-gold-primary text-black flex items-center justify-center text-3xl font-black shadow-md">
                    🏆
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold block">
                      TOURNAMENT CHAMPION
                    </span>
                    <h4 className="text-xl font-black text-dark-default uppercase mt-0.5">
                      {selectedMatch.winnerClan}
                    </h4>
                    <p className="text-xs text-gray-600 font-mono">
                      Completed: {selectedMatch.completedAt || selectedMatch.date || 'Recent Match'} &bull; {selectedMatch.totalKills || 'Finalist Squad'}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center sm:text-right shadow-xs">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Prize Pool</span>
                  <span className="text-lg font-black text-dark-default font-mono">{selectedMatch.prizePool || '₹ 50,000 INR'}</span>
                </div>
              </div>

              {/* Standings if Verified by Admin */}
              {selectedMatch.runnerUp && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">🥈 Runner-Up</span>
                    <span className="font-black text-gray-900 text-sm block mt-1">{selectedMatch.runnerUp}</span>
                  </div>
                  <div className="bg-amber-900/5 border border-amber-800/20 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">🥉 3rd Place</span>
                    <span className="font-black text-gray-900 text-sm block mt-1">{selectedMatch.thirdPlace || 'Finalist Clan'}</span>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-purple-700 uppercase block">🎖️ Match MVP</span>
                    <span className="font-black text-gray-900 text-sm block mt-1">{selectedMatch.mvp || 'Tournament Top Fragger'}</span>
                  </div>
                </div>
              )}

              {/* Verified Result Video Replay if available */}
              {selectedMatch.videoUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-rose-600">videocam</span>
                    Official Match Replay &amp; Result Video
                  </span>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-300 bg-black shadow-md">
                    <iframe
                      src={getYouTubeEmbedUrl(selectedMatch.videoUrl)}
                      title="Match Replay Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* If Host Uploaded an Image Scoreboard */}
              {selectedMatch.scoreboardImage && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                    Host Verified Final Trophy &amp; Scoreboard Graphic:
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white-dirty shadow-sm">
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
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Official 25-Slot Ranking Table (Kill Pts + Position Pts = Overall Pts)
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">
                      25 Competing Squads
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white-dirty text-gray-700 uppercase text-[10px] border-b border-gray-200 font-bold">
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
                      <tbody className="divide-y divide-gray-100">
                        {selectedMatch.slotsData.map((s) => (
                          <tr
                            key={s.rank}
                            className={`transition-colors ${
                              s.rank === 1
                                ? 'bg-gold-primary/20 font-bold text-dark-default'
                                : s.rank === 2
                                ? 'bg-amber-50 font-semibold text-dark-default'
                                : s.rank === 3
                                ? 'bg-amber-50/50 text-dark-default'
                                : 'hover:bg-gray-50 text-gray-800'
                            }`}
                          >
                            <td className="py-2.5 px-4 font-bold text-dark-default">
                              {s.rank === 1 ? '🥇 1st' : s.rank === 2 ? '🥈 2nd' : s.rank === 3 ? '🥉 3rd' : `#${s.rank}`}
                            </td>
                            <td className="py-2.5 px-4 text-gray-500">{s.slot}</td>
                            <td className="py-2.5 px-4 font-bold text-dark-default font-sans">{s.clan}</td>
                            <td className="py-2.5 px-4 text-center text-amber-700 font-bold">{s.kills}</td>
                            <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">{s.positionPts}</td>
                            <td className="py-2.5 px-4 text-right font-black text-dark-default text-sm">
                              {s.totalPts}
                            </td>
                            <td className="py-2.5 px-4 text-right text-gray-500">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-dark-default rounded-3xl w-full max-w-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 bg-white-dirty flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-gold-primary text-black">
                  Conductor / Host Studio
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-dark-default mt-1">
                  Publish Finished Match Results
                </h3>
              </div>

              <button
                onClick={() => setShowHostModal(false)}
                className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitResults} className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-white text-dark-default">
              
              {/* Tournament Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1">
                    Tournament Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tournament Title"
                    value={tourneyTitle}
                    onChange={(e) => setTourneyTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1">
                    Game Category
                  </label>
                  <select
                    value={tourneyGame}
                    onChange={(e) => setTourneyGame(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                  >
                    <option value="BATTLEGROUNDS MOBILE INDIA">BATTLEGROUNDS MOBILE INDIA (BGMI)</option>
                    <option value="PUBG MOBILE">PUBG MOBILE</option>
                    <option value="FREE FIRE MAX">FREE FIRE MAX</option>
                    <option value="VALORANT">VALORANT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold uppercase tracking-wider mb-1">
                    Champion Clan Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Champion Clan Name"
                    value={winnerClanName}
                    onChange={(e) => setWinnerClanName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Choose Publishing Mode: Slots Points OR Direct Image Upload */}
              <div className="bg-white-dirty p-4 rounded-2xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                  How would you like to submit the match results?
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEntryMethod('slots')}
                    className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      entryMethod === 'slots'
                        ? 'bg-gold-primary text-black border-gold-primary font-black shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                        ? 'bg-gold-primary text-black border-gold-primary font-black shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Enter Slots 1 to 25 (Kill Points &amp; Position Points):
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Overall points = Kill Pts + Position Pts
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-2xl p-3 bg-white-dirty/50">
                    {slotsList.map((slot, idx) => (
                      <div key={slot.slotNum} className="grid grid-cols-12 gap-2 items-center text-xs">
                        <span className="col-span-2 font-mono text-gray-600 font-bold">
                          Slot {slot.slotNum}:
                        </span>
                        <input
                          type="text"
                          placeholder={idx === 0 ? 'Winner Clan' : `Slot ${slot.slotNum} Clan`}
                          value={slot.clan}
                          onChange={(e) => handleSlotChange(idx, 'clan', e.target.value)}
                          className="col-span-5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-900 text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Kill Pts"
                          value={slot.kills}
                          onChange={(e) => handleSlotChange(idx, 'kills', e.target.value)}
                          className="col-span-2 px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-amber-700 font-mono text-center text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Pos Pts"
                          value={slot.positionPts}
                          onChange={(e) => handleSlotChange(idx, 'positionPts', e.target.value)}
                          className="col-span-2 px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-emerald-700 font-mono text-center text-xs"
                        />
                        <span className="col-span-1 text-right font-mono font-black text-dark-default text-xs">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Upload Scoreboard / Trophy Winner Graphic:
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center space-y-3 bg-white-dirty/50 hover:border-gold-primary transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span className="material-symbols-outlined text-4xl text-gold-primary">add_photo_alternate</span>
                    <p className="text-xs text-gray-600">
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
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
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
