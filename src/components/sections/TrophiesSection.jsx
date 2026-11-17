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
    <section id="trophies" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header & Overview Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              FEATURED TOURNAMENTS
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium">
              Championship Metrics & Competitive Milestones
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-[#1A202C] pb-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAchievementsTab('ACTIVE');
                }}
                className={`text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  achievementsTab === 'ACTIVE'
                    ? 'text-[#E5C05B] border-b-2 border-[#E5C05B] pb-1'
                    : 'text-[#64748B] hover:text-[#CBD5E1]'
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
                    ? 'text-[#E5C05B] border-b-2 border-[#E5C05B] pb-1'
                    : 'text-[#64748B] hover:text-[#CBD5E1]'
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
                className="p-4 rounded-lg bg-[#11151E] border border-[#1E2536] hover:border-[#E5C05B]/40 transition-all flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E5C05B]/10 border border-[#E5C05B]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#E5C05B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-[#E5C05B] uppercase block font-extrabold tracking-wider">
                      {m.heading}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">
                      {m.label}
                    </span>
                  </div>
                  <span className="font-montserrat font-bold text-sm sm:text-base text-[#E2E8F0] mt-0.5 block truncate">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] font-sans block mt-1">
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