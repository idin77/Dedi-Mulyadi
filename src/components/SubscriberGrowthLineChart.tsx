import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface SubscriberGrowthLineChartProps {
  totalSubscribersCount: number;
  commercialSubscribersCount: number;
  residentialSubscribersCount: number;
}

type ChartViewMode = 'all' | 'total' | 'segments';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomSubscriberTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-cyan/40 text-xs min-w-[220px] pointer-events-none transition-all">
        <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-2.5">
          <span className="font-bold text-white text-sm flex items-center gap-1.5">
            <span>📅</span>
            <span>{data.fullMonth}</span>
          </span>
          {data.isLive && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 animate-pulse">
              ● Live Sync
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan inline-block"></span>
              <span>Total Subscriber:</span>
            </span>
            <span className="font-mono font-black text-cyan text-sm">
              {Number(data.total).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
              <span>B2B / Pabrik (64%):</span>
            </span>
            <span className="font-mono font-semibold text-white">
              {Number(data.b2b).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange inline-block"></span>
              <span>Residensial (36%):</span>
            </span>
            <span className="font-mono font-semibold text-white">
              {Number(data.residensial).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold">Kenaikan Bulanan:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {data.growth}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const SubscriberGrowthLineChart: React.FC<SubscriberGrowthLineChartProps> = ({
  totalSubscribersCount,
  commercialSubscribersCount,
  residentialSubscribersCount,
}) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('all');

  // Compute 6-Month Subscriber Trend Data
  const chartData = useMemo(() => {
    const liveTotal = totalSubscribersCount;
    const liveB2B = commercialSubscribersCount;
    const liveRes = residentialSubscribersCount;
    const liveGrowth = liveTotal - 1340;

    return [
      {
        month: 'Jan',
        fullMonth: 'Januari 2026',
        total: 860,
        b2b: 550,
        residensial: 310,
        growth: '+110',
        growthNum: 110,
      },
      {
        month: 'Feb',
        fullMonth: 'Februari 2026',
        total: 980,
        b2b: 625,
        residensial: 355,
        growth: '+120',
        growthNum: 120,
      },
      {
        month: 'Mar',
        fullMonth: 'Maret 2026',
        total: 1120,
        b2b: 715,
        residensial: 405,
        growth: '+140',
        growthNum: 140,
      },
      {
        month: 'Apr',
        fullMonth: 'April 2026',
        total: 1240,
        b2b: 790,
        residensial: 450,
        growth: '+120',
        growthNum: 120,
      },
      {
        month: 'Mei',
        fullMonth: 'Mei 2026',
        total: 1340,
        b2b: 855,
        residensial: 485,
        growth: '+100',
        growthNum: 100,
      },
      {
        month: 'Jun (Now)',
        fullMonth: 'Juni 2026 (Bulan Berjalan)',
        total: liveTotal,
        b2b: liveB2B,
        residensial: liveRes,
        growth: liveGrowth >= 0 ? `+${liveGrowth}` : `${liveGrowth}`,
        growthNum: liveGrowth,
        isLive: true,
      },
    ];
  }, [totalSubscribersCount, commercialSubscribersCount, residentialSubscribersCount]);

  const targetQ3 = 2000;
  const progressPercent = Math.min(100, Math.round((totalSubscribersCount / targetQ3) * 100));
  const remainingToTarget = Math.max(0, targetQ3 - totalSubscribersCount);

  return (
    <div className="w-full">
      {/* Chart View Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'all'
                ? 'bg-navy text-white shadow-xs'
                : 'text-gray-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            Semua Garis (Total & Segmen)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('total')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'total'
                ? 'bg-cyan-dark text-white shadow-xs'
                : 'text-gray-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            Fokus Total
          </button>
          <button
            type="button"
            onClick={() => setViewMode('segments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'segments'
                ? 'bg-orange text-white shadow-xs'
                : 'text-gray-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            Komparasi B2B vs Residensial
          </button>
        </div>

        {/* Live sync badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Sinkronisasi Data Real-Time</span>
        </div>
      </div>

      {/* Recharts LineChart Responsive Viewport */}
      <div className="w-full h-64 sm:h-72 md:h-80 pt-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dy={6}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 120', 'dataMax + 100']}
              tickFormatter={(v: number) => v.toLocaleString('id-ID')}
            />
            <Tooltip content={<CustomSubscriberTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 600 }}
              iconType="circle"
            />

            {(viewMode === 'all' || viewMode === 'total') && (
              <Line
                type="monotone"
                dataKey="total"
                name="Total Subscriber"
                stroke="#06b6d4"
                strokeWidth={3.5}
                dot={{ r: 4.5, fill: '#0f172a', stroke: '#06b6d4', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 3 }}
                animationDuration={900}
              />
            )}

            {(viewMode === 'all' || viewMode === 'segments') && (
              <Line
                type="monotone"
                dataKey="b2b"
                name="Segmen B2B / Pabrik (64%)"
                stroke="#1e293b"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#1e293b', stroke: '#cbd5e1', strokeWidth: 1.5 }}
                activeDot={{ r: 7, fill: '#1e293b', stroke: '#38bdf8', strokeWidth: 2 }}
                animationDuration={900}
              />
            )}

            {(viewMode === 'all' || viewMode === 'segments') && (
              <Line
                type="monotone"
                dataKey="residensial"
                name="Segmen Residensial (36%)"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f97316', stroke: '#ffedd5', strokeWidth: 1.5 }}
                activeDot={{ r: 7, fill: '#f97316', stroke: '#0f172a', strokeWidth: 2 }}
                animationDuration={900}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Toward Milestone Card */}
      <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-2/3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-gray-700">Pencapaian Target Q3 2026 (2.000 Email):</span>
            <span className="text-cyan-dark">
              {progressPercent}% ({remainingToTarget > 0 ? `${remainingToTarget.toLocaleString('id-ID')} lagi` : 'Target Tercapai!'})
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-navy via-cyan to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center sm:text-right">
          <span className="font-bold text-navy block">Reaktivitas Real-Time</span>
          Grafik Recharts otomatis update saat subscriber bertambah
        </div>
      </div>
    </div>
  );
};
