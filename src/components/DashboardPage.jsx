import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { SkeletonCard, SkeletonChart, PullToRefresh } from './loaders';
import {
  DollarSign,
  Receipt,
  CreditCard,
  Armchair,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

const DEFAULT_METRICS = {
  summary: {
    todaySales: 6004,
    todayBills: 29,
    todayTrend: { percentage: '-15.4%', isPositive: false, label: 'vs yesterday' },
    weekSales: 32468,
    weekBills: 149,
    weekTrend: { percentage: '-40.6%', isPositive: false, label: 'vs last week' },
    monthSales: 169400,
    monthBills: 724,
    monthTrend: { percentage: '+1025.1%', isPositive: true, label: 'vs last month' },
    activeChairs: 0,
    totalChairs: 9,
    cashPayments: 73151,
    upiPayments: 85484,
    cardPayments: 0,
    totalCustomers: 702,
  },
  lowStockProducts: [],
  dailySalesChart: [
    { day: 'Thu', sales: 7500 },
    { day: 'Fri', sales: 7800 },
    { day: 'Sat', sales: 9100 },
    { day: 'Sun', sales: 10800 },
    { day: 'Mon', sales: 8400 },
    { day: 'Tue', sales: 6800 },
    { day: 'Wed', sales: 6004 },
  ],
  paymentBreakdown: [
    { method: 'Cash', amount: 73151 },
    { method: 'UPI', amount: 85484 },
    { method: 'Debit card', amount: 0 },
    { method: 'Credit card', amount: 0 },
    { method: 'Split payment', amount: 10765 },
    { method: 'Other', amount: 0 },
  ],
  topAttendants: [
    {
      fullName: 'mohan',
      specialization: 'Hair Cut, Beard Styling',
      totalSalesGenerated: 110528,
      servicesCompleted: 486,
    },
    {
      fullName: 'SAKTHI 1031',
      specialization: 'Hair Cut, Beard Styling',
      totalSalesGenerated: 51801,
      servicesCompleted: 286,
    },
    {
      fullName: 'SANU',
      specialization: 'Hair Cut, Beard Styling',
      totalSalesGenerated: 10203,
      servicesCompleted: 63,
    },
  ],
  popularServices: [
    { name: 'Haircut,Trimming(or)shaving', count: 451 },
    { name: 'beard trimming (OR) shaving', count: 94 },
    { name: 'haircut only', count: 79 },
  ],
};

export const DashboardPage = ({ metricsData = null }) => {
  const [data, setData] = useState(metricsData || DEFAULT_METRICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (metricsData) {
      setData(metricsData);
    }
  }, [metricsData]);

  if (loading) {
    return (
      <div className="space-y-3.5 p-1">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <SkeletonChart title="Sales Trend Pacing" height="h-56" />
          </div>
          <div>
            <SkeletonChart title="Payment Channels" height="h-56" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const summary = data?.summary || DEFAULT_METRICS.summary;

  return (
    <PullToRefresh onRefresh={() => setData(DEFAULT_METRICS)}>
      <div className="space-y-3 lg:space-y-3.5 flex flex-col justify-between overflow-y-auto">
        {/* Low Stock Warning (if any) */}
        {data?.lowStockProducts?.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-bold text-amber-800">
                Low Stock Warning ({data.lowStockProducts.length} Items):
              </span>
              <span className="text-amber-700 font-medium truncate max-w-xl">
                {data.lowStockProducts.map((p) => `${p.name} (${p.currentStock})`).join(', ')}
              </span>
            </div>
            <a
              href="#products"
              className="text-[11px] font-bold text-amber-600 hover:underline shrink-0"
            >
              Manage Stock &rarr;
            </a>
          </div>
        )}

        {/* Row 1: Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
          <StatCard
            title="Today's Revenue"
            value={`₹ ${Number(summary.todaySales || 0).toLocaleString('en-IN')}`}
            subtitle={`${summary.todayBills || 0} Bills Today`}
            icon={DollarSign}
            trend={summary.todayTrend?.percentage}
            trendPositive={summary.todayTrend?.isPositive}
            comparisonLabel={summary.todayTrend?.label || 'vs yesterday'}
          />
          <StatCard
            title="Weekly Sales"
            value={`₹ ${Number(summary.weekSales || 0).toLocaleString('en-IN')}`}
            subtitle={`${summary.weekBills || 0} Bills this week`}
            icon={Receipt}
            trend={summary.weekTrend?.percentage}
            trendPositive={summary.weekTrend?.isPositive}
            comparisonLabel={summary.weekTrend?.label || 'vs last week'}
          />
          <StatCard
            title="Monthly Sales"
            value={`₹ ${Number(summary.monthSales || 0).toLocaleString('en-IN')}`}
            subtitle={`${summary.monthBills || 0} Bills this month`}
            icon={TrendingUp}
            trend={summary.monthTrend?.percentage}
            trendPositive={summary.monthTrend?.isPositive}
            comparisonLabel={summary.monthTrend?.label || 'vs last month'}
          />
          <StatCard
            title="Styling Stations"
            value={`${summary.activeChairs || 0} / ${summary.totalChairs || 0}`}
            subtitle={`${(summary.totalChairs || 0) - (summary.activeChairs || 0)} Stations Free`}
            icon={Armchair}
            trend={summary.totalChairs > 0 ? `${Math.round(((summary.activeChairs || 0) / summary.totalChairs) * 100)}%` : null}
            trendPositive={(summary.activeChairs || 0) > 0}
            comparisonLabel="Occupancy Rate"
          />
        </div>

        {/* Row 2: 4 Payment Channels Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
          <div className="bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                Cash Collections
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 font-mono mt-0.5 block">
                ₹ {Number(summary.cashPayments || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          </div>

          <div className="bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                UPI / QR Payments
              </span>
              <span className="text-sm sm:text-base font-bold text-purple-600 font-mono mt-0.5 block">
                ₹ {Number(summary.upiPayments || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
          </div>

          <div className="bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                Card Payments
              </span>
              <span className="text-sm sm:text-base font-bold text-amber-600 font-mono mt-0.5 block">
                ₹ {Number(summary.cardPayments || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          </div>

          <div className="bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Clients
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 font-mono mt-0.5 block">
                {summary.totalCustomers || 0} Registered
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          </div>
        </div>

        {/* Row 3: Visual Charts Section (Revenue Trend & Payment Share) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
          {/* Daily Sales Area Chart */}
          <div className="lg:col-span-2 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gold-500" />
                  7-Day Revenue Trend
                </h3>
                <p className="text-[10px] text-gray-400">Daily gross turnover</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-500">
                Live
              </span>
            </div>

            <div className="h-44 sm:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailySalesChart || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} domain={[0, 12000]} ticks={[0, 3000, 6000, 9000, 12000]} />
                  <Tooltip
                    formatter={(val) => [`₹ ${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                    labelFormatter={(lbl) => `Day: ${lbl}`}
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods Breakdown Pie */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gold-500" />
                Payment Share
              </h3>
              <span className="text-[10px] text-gray-400">By Mode</span>
            </div>

            <div className="h-36 sm:h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(data?.paymentBreakdown || []).filter((p) => p.amount > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="method"
                  >
                    {(data?.paymentBreakdown || [])
                      .filter((p) => p.amount > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹ ${Number(val).toLocaleString('en-IN')}`, 'Total']}
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1.5 border-t border-gray-100">
              {(data?.paymentBreakdown || []).map((p, idx) => (
                <div key={idx} className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-gray-500 truncate">{p.method}:</span>
                  <span className="font-bold text-gray-900 font-mono">₹{p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Top Performing Attendants & Popular Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
          {/* Top Attendants */}
          <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-gold-500" />
                Top Stylists & Attendants
              </h3>
              <a href="#attendants" className="text-[10px] text-gold-600 font-semibold hover:underline">
                View All &rarr;
              </a>
            </div>

            <div className="space-y-1.5">
              {(data?.topAttendants || []).slice(0, 3).map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-gold-400 font-bold text-[10px] flex items-center justify-center shrink-0 border border-gold-500/30">
                      {idx + 1}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-gray-900 truncate">{att.fullName}</h4>
                      <p className="text-[9px] text-gray-400 truncate">
                        {Array.isArray(att.specialization) ? att.specialization.join(', ') : att.specialization || 'Stylist'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-gray-900 font-mono block">
                      ₹ {Number(att.totalSalesGenerated || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-green-600 font-semibold">
                      {att.servicesCompleted || 0} services
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Popular Services */}
          <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                Most Popular Services
              </h3>
              <a href="#services" className="text-[10px] text-gold-600 font-semibold hover:underline">
                Menu &rarr;
              </a>
            </div>

            <div className="space-y-1.5">
              {(data?.popularServices || []).slice(0, 3).map((srv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    <span className="font-medium text-gray-800 truncate">
                      {srv.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gold-600 px-2 py-0.5 rounded bg-gold-500/10 shrink-0">
                    {srv.count} Bookings
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default DashboardPage;
