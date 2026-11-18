import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Award, Flame, Zap, Shield, Crown, Swords, Users, User, Radio, Sparkles, Star, Medal } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredHallOfFame } from '../../utils/portalData';

export const WinnersSection = ({ onOpenTournamentModal }) => {
  const [activeCategory, setActiveCategory] = useState('SQUAD');
  const [hofData, setHofData] = useState(() => getStoredHallOfFame());

  // Listen for real-time Hall of Fame updates from Admin / SuperAdmin
  useEffect(() => {
    const handleHofUpdate = (e) => {
      if (e.detail?.all) {
        setHofData(e.detail.all);
      } else if (e.detail?.format && e.detail?.teams) {
        setHofData(prev => ({ ...prev, [e.detail.format]: e.detail.teams }));
      } else {
        setHofData(getStoredHallOfFame());
      }
    };

    window.addEventListener('portal_hof_updated', handleHofUpdate);
    return () => window.removeEventListener('portal_hof_updated', handleHofUpdate);
  }, []);

  const categories = [
    { id: 'SQUAD', label: 'Squad Top 10', subtitle: 'Pro Squad Championship', icon: Shield },
    { id: 'DUO', label: 'Duo Top 10', subtitle: 'Dynamic Duo Clash', icon: Users },
    { id: 'SOLO', label: 'Solo Top 10', subtitle: 'Bootcamp Deathmatch', icon: User },
  ];

  const currentTeams = hofData[activeCategory] || getStoredHallOfFame(activeCategory) || [];
  const top1 = currentTeams[0] || {};
  const top2 = currentTeams[1] || {};
  const top3 = currentTeams[2] || {};

  return (
    <section id="winners" className="space-y-6 pt-2">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-montserrat font-black text-xl sm:text-2xl text-[#0F172A] tracking-wider uppercase">
              SCRIMS & OFFICIAL TOP 10 STANDINGS
            </h2>
          </div>
          <p className="font-rajdhani text-xs sm:text-sm text-[#64748B]">
            Verified official points tables, kill records, and scrims standings managed by Match Ops.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold shadow-2xs self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>OFFICIAL STANDINGS: SYNCED LIVE</span>
        </div>
      </div>

      {/* Category Tabs: SQUAD TOP 10 | DUO TOP 10 | SOLO TOP 10 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.id);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between group shadow-xs ${
                active
                  ? 'bg-amber-50/90 border-2 border-amber-500 shadow-sm'
                  : 'bg-white border-[#E2E8F0] hover:border-slate-300 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-[#64748B] group-hover:text-[#0F172A]'}`} />
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  active ? 'bg-amber-500 text-slate-950 font-black' : 'bg-[#F1F5F9] text-[#64748B]'
                }`}>
                  TOP 10 TABLE
                </span>
              </div>
              <div>
                <span className={`font-montserrat font-extrabold text-xs sm:text-sm block tracking-wide uppercase ${
                  active ? 'text-[#0F172A]' : 'text-slate-700'
                }`}>
                  {cat.label}
                </span>
                <span className="font-rajdhani text-[11px] text-[#64748B] font-medium block truncate">
                  {cat.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* TOP 10 LEADERBOARD VIEW (SQUAD, DUO, SOLO) */}
      <div className="space-y-6">
          
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 🥈 Rank 2 - Silver Podium */}
            <div className="order-2 md:order-1 rounded-2xl p-4 sm:p-5 bg-white border-2 border-slate-300 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-slate-400 transition-all text-[#0F172A]">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-slate-500" />
                  <span>2ND RUNNER UP</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-600">#2 RANK</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 mx-auto flex items-center justify-center text-slate-900 font-black text-lg border border-slate-300 shadow-xs">
                  {top2.clanTag || (top2.name ? top2.name.slice(0, 2).toUpperCase() : '2')}
                </div>
                <h4 className="font-montserrat font-black text-sm sm:text-base text-[#0F172A] truncate pt-1">
                  {top2.teamName || top2.name || 'Runner Up'}
                </h4>
                <span className="text-[11px] font-mono text-[#64748B] block font-bold">
                  TAG: {top2.clanTag || 'OFFICIAL'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-3 gap-1 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] block">WWCD</span>
                  <span className="text-xs font-bold text-[#0F172A]">{top2.wwcd || 0} 👑</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] block">KILLS</span>
                  <span className="text-xs font-bold text-[#0F172A]">{top2.kills || 0} 🎯</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] block">TOTAL</span>
                  <span className="text-xs font-black text-slate-800">{top2.totalPts || top2.total || 0} PTS</span>
                </div>
              </div>
            </div>

            {/* 👑 Rank 1 - Gold Champion Podium */}
            <div className="order-1 md:order-2 rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-amber-50 to-white border-2 border-amber-400 flex flex-col justify-between shadow-md relative overflow-hidden transform md:-translate-y-2 group hover:scale-[1.02] transition-transform text-[#0F172A]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3 z-10">
                <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-montserrat font-black uppercase flex items-center gap-1 shadow-xs">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>UNDISPUTED CHAMPION</span>
                </span>
                <span className="font-mono text-xs font-black text-amber-700">#1 RANK</span>
              </div>

              <div className="text-center py-2 space-y-1 z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-400 to-amber-500 mx-auto flex items-center justify-center text-slate-950 font-black text-2xl border-2 border-yellow-200 shadow-md">
                  {top1.clanTag || (top1.name ? top1.name.slice(0, 2).toUpperCase() : '1')}
                </div>
                <h4 className="font-montserrat font-black text-base sm:text-lg text-[#0F172A] truncate pt-1">
                  {top1.teamName || top1.name || 'Champion Team'}
                </h4>
                <span className="text-xs font-mono text-amber-700 block font-bold">
                  TAG: {top1.clanTag || 'CHAMPION'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-amber-200 grid grid-cols-3 gap-1.5 text-center font-mono z-10">
                <div className="p-2 rounded-lg bg-white border border-amber-200 shadow-2xs">
                  <span className="text-[9px] text-amber-700 block font-bold">WWCD</span>
                  <span className="text-sm font-black text-[#0F172A]">{top1.wwcd || 0} 👑</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-amber-200 shadow-2xs">
                  <span className="text-[9px] text-amber-700 block font-bold">KILLS</span>
                  <span className="text-sm font-black text-[#0F172A]">{top1.kills || 0} 🎯</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-amber-200 shadow-2xs">
                  <span className="text-[9px] text-amber-700 block font-bold">TOTAL</span>
                  <span className="text-sm font-black text-amber-600">{top1.totalPts || top1.total || 0} PTS</span>
                </div>
              </div>
            </div>

            {/* 🥉 Rank 3 - Bronze Podium */}
            <div className="order-3 md:order-3 rounded-2xl p-4 sm:p-5 bg-white border-2 border-amber-700/30 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-amber-700/50 transition-all text-[#0F172A]">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-amber-700" />
                  <span>3RD PLACE</span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-800">#3 RANK</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 mx-auto flex items-center justify-center text-white font-black text-lg border border-amber-500 shadow-xs">
                  {top3.clanTag || (top3.name ? top3.name.slice(0, 2).toUpperCase() : '3')}
                </div>
                <h4 className="font-montserrat font-black text-sm sm:text-base text-[#0F172A] truncate pt-1">
                  {top3.teamName || top3.name || '3rd Place Team'}
                </h4>
                <span className="text-[11px] font-mono text-[#64748B] block font-bold">
                  TAG: {top3.clanTag || 'OFFICIAL'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-3 gap-1 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] block">WWCD</span>
                  <span className="text-xs font-bold text-[#0F172A]">{top3.wwcd || 0} 👑</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] block">KILLS</span>
                  <span className="text-xs font-bold text-[#0F172A]">{top3.kills || 0} 🎯</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] block">TOTAL</span>
                  <span className="text-xs font-black text-amber-700">{top3.totalPts || top3.total || 0} PTS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Full Top 10 Standings Table (#1 through #10) */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-[#0F172A] uppercase tracking-wider">
                  {activeCategory} COMPLETE TOP 10 LEADERBOARD
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] font-bold">
                10 TEAMS OFFICIALLY RANKED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[10px] font-mono text-[#475569] uppercase">
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Team / In-Game Player</th>
                    <th className="py-2.5 px-3">Clan Tag</th>
                    <th className="py-2.5 px-3 text-center">WWCD 👑</th>
                    <th className="py-2.5 px-3 text-center">Kills 🎯</th>
                    <th className="py-2.5 px-3 text-center">Placement Pts</th>
                    <th className="py-2.5 px-3 text-center font-bold text-amber-700">Total Points 🔥</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] font-mono">
                  {currentTeams.map((team, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isTop1
                            ? 'bg-amber-50/70 hover:bg-amber-100/50 text-[#0F172A] font-bold'
                            : isTop2
                            ? 'bg-slate-50 hover:bg-slate-100/60 text-[#0F172A]'
                            : isTop3
                            ? 'bg-orange-50/40 hover:bg-orange-100/40 text-[#0F172A]'
                            : 'hover:bg-[#F8FAFC] text-[#0F172A]'
                        }`}
                      >
                        {/* Position Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isTop1 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow-2xs">
                              👑 #1
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-300 text-slate-900 font-black text-xs">
                              🥈 #2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600 text-white font-black text-xs">
                              🥉 #3
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] font-bold text-xs border border-[#CBD5E1]">
                              #{team.rank || idx + 1}
                            </span>
                          )}
                        </td>

                        {/* Team Name */}
                        <td className="py-3 px-3 font-sans font-bold text-xs sm:text-sm text-[#0F172A]">
                          <div className="flex items-center gap-2">
                            <span>{team.teamName || team.name || `Team Position #${idx + 1}`}</span>
                            {team.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                                {team.badge}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Clan Tag */}
                        <td className="py-3 px-3 font-mono font-bold text-xs text-[#64748B] uppercase">
                          {team.clanTag || '—'}
                        </td>

                        {/* WWCD */}
                        <td className="py-3 px-3 text-center font-bold text-[#0F172A]">
                          {team.wwcd || 0}
                        </td>

                        {/* Kills */}
                        <td className="py-3 px-3 text-center font-bold text-[#0F172A]">
                          {team.kills || 0}
                        </td>

                        {/* Placement Pts */}
                        <td className="py-3 px-3 text-center text-[#64748B]">
                          {team.placementPts || 0}
                        </td>

                        {/* Total Points */}
                        <td className="py-3 px-3 text-center font-black text-sm text-amber-600">
                          {team.totalPts !== undefined ? team.totalPts : (team.total !== undefined ? team.total : ((Number(team.kills) || 0) + (Number(team.placementPts) || 0)))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>

    </section>
  );
};

export default WinnersSection;
