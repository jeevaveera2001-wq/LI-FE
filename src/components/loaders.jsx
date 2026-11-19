import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm animate-pulse space-y-3">
    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    <div className="h-7 bg-gray-200 rounded w-2/3"></div>
    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
  </div>
);

export const SkeletonChart = ({ title, height = 'h-56' }) => (
  <div className={`bg-white p-4 rounded-2xl border border-gray-200 shadow-sm animate-pulse flex flex-col justify-between ${height}`}>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="h-32 bg-gray-100 rounded w-full"></div>
  </div>
);

export const PulsingBeacon = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
);

export const PullToRefresh = ({ onRefresh, children }) => (
  <div className="w-full">
    {children}
  </div>
);

export default {
  SkeletonCard,
  SkeletonChart,
  PulsingBeacon,
  PullToRefresh,
};
