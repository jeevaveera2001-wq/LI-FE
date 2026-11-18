import React, { useState } from 'react';
import { Trophy, Award, Shield, Users, Target, Zap, PlaySquare } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const TrophiesSection = () => {
  const [achievementsTab, setAchievementsTab] = useState('ACTIVE');

  const activeMetrics = [
    { heading: 'FEATURED 1', label: 'Teams Slots', value: '25 Squads Limit', desc: 'Verified Tournament Roster Slots', icon: Shield },
    { heading: 'FEATURED 2', label: 'Teams Slots', value: '50 Duos Limit', desc: 'Competitive Duo Match Slots', icon: Target },
    { heading: 'FEATURED 3', label: 'Teams Slots', value: '100 Solo Slots', desc: 'Battlegrounds Solo Arena Slots', icon: Trophy },
    { heading: 'FEATURED 4', label: 'Teams Slots', value: 'Custom Room Dispatcher', desc: 'Instant Room ID & Passcode Slots', icon: Zap },
    { heading: 'FEATURED 5', label: 'Teams Slots', value: 'Top 10 Scrims', desc: 'Official Teams Points Table', icon: Award },
    { heading: 'FEATURED 6', label: 'Teams Slots', value: 'Championship Finalists', desc: 'Verified Finals Qualified Teams', icon: Users },
  ];

  const historicMetrics = [
    { heading: 'FEATURED 1', label: 'Teams Slots', value: 'Verified Squad Lineups', desc: 'Competitive Tournament Rosters', icon: Shield },
    { heading: 'FEATURED 2', label: 'Teams Slots', value: 'Custom Room Scrims', desc: 'Dedicated Scrim Match Slots', icon: Target },
    { heading: 'FEATURED 3', label: 'Teams Slots', value: 'Competitive Match Slots', desc: 'Registered Teams Allocation', icon: Trophy },
    { heading: 'FEATURED 4', label: 'Teams Slots', value: 'Scrims Champions', desc: 'Top Tier Trophy Holding Teams', icon: Award },
    { heading: 'FEATURED 5', label: 'Teams Slots', value: 'Qualified Squad Slots', desc: 'Weekly Scrims Qualified Teams', icon: Zap },
    { heading: 'FEATURED 6', label: 'Teams Slots', value: 'Anti-Cheat Whitelisted Teams', desc: 'Verified Match Ops Approved Slots', icon: Users },
  ];

  const currentMetrics = achievementsTab === 'ACTIVE' ? activeMetrics : historicMetrics;

  return (
    <section id="trophies" className="w-full">
      <div className="rounded-2xl p-6 sm:p-7 bg-white border border-[#E2E8F0] shadow-sm">
        
        {/* Header & Overview Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>FEATURED TOURNAMENTS</span>
            </h3>
            <p className="font-rajdhani text-xs text-[#64748B] font-medium mt-0.5">
              Championship Metrics & Competitive Milestones
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAchievementsTab('ACTIVE');
                }}
                className={`text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  achievementsTab === 'ACTIVE'
                    ? 'text-amber-600 border-b-2 border-amber-500 pb-1'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                ACTIVE
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAchievementsTab('HISTORIC');
                }}
                className={`text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  achievementsTab === 'HISTORIC'
                    ? 'text-amber-600 border-b-2 border-amber-500 pb-1'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                HISTORIC
              </button>
            </div>
          </div>
        </div>

        {/* 2x3 Metric Grid (3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-rajdhani">
          {currentMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => soundFx.playHover()}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-amber-400 hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-600 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-amber-600 uppercase block font-extrabold tracking-wider">
                      {m.heading}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">
                      {m.label}
                    </span>
                  </div>
                  <span className="font-montserrat font-bold text-sm sm:text-base text-[#0F172A] mt-0.5 block truncate">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-[#64748B] font-sans block mt-1">
                    {m.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TrophiesSection;
