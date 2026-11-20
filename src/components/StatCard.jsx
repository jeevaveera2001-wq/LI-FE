import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  comparisonLabel = 'vs yesterday'
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-gold-primary/50 hover:-translate-y-1 transition-all duration-300 ease-out transform-gpu flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {title}
          </span>
          <h2 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight mt-1 font-mono leading-tight">
            {value}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="size-9 rounded-lg bg-gray-100/80 border border-gray-200/60 flex items-center justify-center text-gray-700 shrink-0">
            <Icon className="w-4 h-4 text-gray-700" />
          </div>
        )}
      </div>

      <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px]">
        {trend && (
          <span className={`font-semibold flex items-center gap-0.5 ${trendPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
            <span>{trendPositive ? '↗' : '↘'}</span>
            <span>{trend}</span>
          </span>
        )}
        {comparisonLabel && (
          <span className="text-gray-400 font-normal">
            {comparisonLabel}
          </span>
        )}
      </div>
    </div>
  );
}
