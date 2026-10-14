import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';

export interface DailyQrFrequency {
  date: string;        // YYYY-MM-DD
  displayDate: string; // e.g. "14 Okt"
  fullDate: string;    // e.g. "14 Oktober 2026"
  dayName: string;     // e.g. "Sen", "Sel", "Rab"
  count: number;
  isToday?: boolean;
}

export const QR_30DAY_STORAGE_KEY = 'kgr_qr_30day_frequencies_v1';

/**
 * Helper to generate or retrieve the 30-day daily frequency data from localStorage.
 */
export function getStored30DayFrequencies(): DailyQrFrequency[] {
  if (typeof window === 'undefined') return [];

  const now = new Date();
  const dayList: DailyQrFrequency[] = [];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  // Try reading persisted daily counts
  let savedDailyMap: Record<string, number> = {};
  try {
    const raw = localStorage.getItem(QR_30DAY_STORAGE_KEY);
    if (raw) {
      savedDailyMap = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse 30-day frequency storage:', err);
  }

  // Pre-seeded baseline for 30 days if not present
  const baseSeedPattern = [
    5, 7, 8, 12, 11, 4, 3,
    6, 9, 14, 10, 13, 5, 4,
    7, 10, 15, 12, 11, 6, 4,
    8, 11, 13, 16, 12, 5, 6,
    9, 14
  ];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;

    const isToday = i === 0;
    const defaultCount = baseSeedPattern[29 - i] ?? Math.floor(Math.random() * 8 + 4);
    const count = savedDailyMap[dateKey] !== undefined ? savedDailyMap[dateKey] : defaultCount;

    // Save back if was missing
    if (savedDailyMap[dateKey] === undefined) {
      savedDailyMap[dateKey] = count;
    }

    dayList.push({
      date: dateKey,
      displayDate: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      fullDate: `${d.getDate()} ${monthNames[d.getMonth()]} ${yyyy}`,
      dayName: dayNames[d.getDay()],
      count,
      isToday,
    });
  }

  try {
    localStorage.setItem(QR_30DAY_STORAGE_KEY, JSON.stringify(savedDailyMap));
  } catch (e) {
    console.warn('Failed to persist 30-day frequency storage:', e);
  }

  return dayList;
}

/**
 * Increment today's count in the 30-day localStorage storage.
 */
export function recordQrGenerationIn30DayStorage(increment: number = 1): void {
  if (typeof window === 'undefined') return;
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayKey = `${yyyy}-${mm}-${dd}`;

  try {
    let saved: Record<string, number> = {};
    const raw = localStorage.getItem(QR_30DAY_STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
    saved[todayKey] = (saved[todayKey] || 0) + increment;
    localStorage.setItem(QR_30DAY_STORAGE_KEY, JSON.stringify(saved));
  } catch (err) {
    console.warn('Failed to record QR generation in 30-day storage:', err);
  }
}

interface QrCodeFrequencyD3ChartProps {
  lastUpdatedTimestamp?: string;
  onRefresh?: () => void;
}

export const QrCodeFrequencyD3Chart: React.FC<QrCodeFrequencyD3ChartProps> = ({
  lastUpdatedTimestamp,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DailyQrFrequency[]>([]);
  const [hoveredDay, setHoveredDay] = useState<DailyQrFrequency | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Load and refresh 30-day frequencies from localStorage
  const refreshData = () => {
    const list = getStored30DayFrequencies();
    setData(list);
  };

  useEffect(() => {
    refreshData();
  }, [lastUpdatedTimestamp]);

  // Compute key statistics
  const totalGenerations = useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  );
  const averageDaily = useMemo(
    () => (data.length > 0 ? (totalGenerations / data.length).toFixed(1) : '0'),
    [totalGenerations, data.length]
  );
  const peakDay = useMemo(() => {
    if (data.length === 0) return null;
    return [...data].sort((a, b) => b.count - a.count)[0];
  }, [data]);
  const todayEntry = useMemo(() => data.find((d) => d.isToday), [data]);

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 760;
    const height = 230;
    const margin = { top: 25, right: 25, bottom: 42, left: 42 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define Gradients and filters in defs
    const defs = svg.append('defs');

    // Bar Gradient (Navy to Cyan)
    const barGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-qr-bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    barGradient.append('stop').attr('offset', '0%').attr('stop-color', '#00f2fe').attr('stop-opacity', 0.95);
    barGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0a192f').attr('stop-opacity', 0.95);

    // Active Today Bar Gradient (Orange / Amber)
    const todayGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-qr-today-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    todayGradient.append('stop').attr('offset', '0%').attr('stop-color', '#ff8c00').attr('stop-opacity', 1);
    todayGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ea580c').attr('stop-opacity', 0.9);

    // Area Trend Gradient
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-qr-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.25);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.28);

    const maxCount = d3.max(data, (d) => d.count) || 10;
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxCount * 1.2)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const g = svg.append('g');

    // Horizontal Grid Lines
    const yAxisGrid = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(5);

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-opacity', 0.8);

    g.select('.grid .domain').remove();

    // Area Under Trend
    const areaGenerator = d3
      .area<DailyQrFrequency>()
      .x((d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#d3-qr-area-gradient)')
      .attr('d', areaGenerator);

    // Trend Curve Line
    const lineGenerator = d3
      .line<DailyQrFrequency>()
      .x((d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#0891b2')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator);

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.date) || 0)
      .attr('y', (d) => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d.count))
      .attr('fill', (d) => (d.isToday ? 'url(#d3-qr-today-gradient)' : 'url(#d3-qr-bar-gradient)'))
      .attr('rx', 3)
      .attr('ry', 3)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('opacity', 0.85)
          .attr('stroke', '#0a192f')
          .attr('stroke-width', 1.5);
        setHoveredDay(d);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      })
      .on('mousemove', function (event) {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', 'none');
        setHoveredDay(null);
        setTooltipPos(null);
      });

    // Peak and Today Value Labels on Top of Bars
    g.selectAll('.bar-label')
      .data(data.filter((d, idx) => d.isToday || d.count === maxCount || idx % 5 === 0))
      .enter()
      .append('text')
      .attr('class', 'bar-label font-mono font-bold text-[9px]')
      .attr('x', (d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.count) - 4)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.isToday ? '#ea580c' : '#0a192f'))
      .text((d) => d.count);

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(
        data
          .filter((_, idx) => idx === 0 || idx === 7 || idx === 14 || idx === 21 || idx === 29)
          .map((d) => d.date)
      )
      .tickFormat((dateStr) => {
        const item = data.find((d) => d.date === dateStr);
        return item ? item.displayDate : (dateStr as string);
      });

    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#cbd5e1');
    xAxisGroup.selectAll('.tick line').attr('stroke', '#cbd5e1');
    xAxisGroup
      .selectAll('.tick text')
      .attr('class', 'text-[10px] font-mono font-semibold text-gray-600')
      .attr('dy', '0.8em');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('d'));
    const yAxisGroup = g
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    yAxisGroup.select('.domain').attr('stroke', '#cbd5e1');
    yAxisGroup.selectAll('.tick line').attr('stroke', '#cbd5e1');
    yAxisGroup
      .selectAll('.tick text')
      .attr('class', 'text-[10px] font-mono text-gray-600');

    // Axis Labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 12)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-[9px] font-bold text-gray-500 uppercase tracking-wider')
      .text('Freq (QR / Hari)');

    g.append('text')
      .attr('x', width - margin.right)
      .attr('y', height - 8)
      .attr('text-anchor', 'end')
      .attr('class', 'text-[9px] font-bold text-gray-400')
      .text('30 Hari Terakhir →');
  }, [data]);

  return (
    <div
      id="print-hub-qr-frequency-chart"
      ref={containerRef}
      className="border-2 border-cyan/40 bg-white rounded-xl p-3.5 sm:p-4 mb-4 text-xs shadow-xs relative overflow-hidden"
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 mb-3 border-b border-gray-200 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy to-navy-light text-cyan flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-navy text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                <span>Frekuensi QR Code 30 Hari Terakhir</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan/15 text-cyan-dark border border-cyan/30">
                  d3.js Visualization
                </span>
              </h3>
            </div>
            <p className="text-[10px] text-gray-500">
              Visualisasi tren dan frekuensi pembuatan QR Code teknisi lapangan selama 30 hari berdasarkan riwayat di localStorage.
            </p>
          </div>
        </div>

        {/* 30-Day Metric Badges */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-gray-200 text-left">
            <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">Total 30 Hari</span>
            <span className="font-mono font-extrabold text-navy text-xs">{totalGenerations} QR</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-cyan/10 border border-cyan/30 text-left">
            <span className="block text-[8px] uppercase tracking-wider text-cyan-dark font-bold">Rata-rata</span>
            <span className="font-mono font-extrabold text-cyan-dark text-xs">{averageDaily} / hari</span>
          </div>
          {todayEntry && (
            <div className="px-2.5 py-1 rounded-lg bg-orange/10 border border-orange/30 text-left">
              <span className="block text-[8px] uppercase tracking-wider text-orange-dark font-bold">Hari Ini</span>
              <span className="font-mono font-extrabold text-orange text-xs">+{todayEntry.count} QR</span>
            </div>
          )}
        </div>
      </div>

      {/* D3 Vector Chart Container */}
      <div className="relative w-full overflow-hidden bg-slate-50/60 rounded-xl p-2 border border-gray-200">
        <svg
          ref={svgRef}
          viewBox="0 0 760 230"
          className="w-full h-auto block select-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Grafik D3 Frekuensi Pembuatan QR Code 30 Hari Terakhir"
        />

        {/* Floating Tooltip */}
        {hoveredDay && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none bg-navy text-white text-[10px] p-2 rounded-lg shadow-xl border border-cyan/40 transition-transform duration-75"
            style={{
              left: `${Math.min(Math.max(tooltipPos.x - 70, 10), 600)}px`,
              top: `${Math.max(tooltipPos.y - 75, 10)}px`,
            }}
          >
            <div className="font-bold text-cyan text-[11px] flex items-center justify-between gap-2">
              <span>{hoveredDay.fullDate}</span>
              {hoveredDay.isToday && (
                <span className="text-[8px] px-1 rounded bg-orange text-white font-extrabold">HARI INI</span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between gap-4 text-gray-200 font-mono">
              <span>Frekuensi Generate:</span>
              <span className="font-bold text-white text-xs">{hoveredDay.count} Kode QR</span>
            </div>
            <div className="text-[8px] text-gray-400 mt-0.5">
              Tercatat otomatis di localStorage browser
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Legend & Insights */}
      <div className="mt-2.5 pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between text-[10px] text-gray-600 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-gradient-to-b from-cyan to-navy border border-cyan/40 inline-block" />
            <span>Frekuensi Harian</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-gradient-to-b from-orange to-orange-dark inline-block" />
            <span className="font-semibold text-orange-dark">Aktivitas Hari Ini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-cyan inline-block rounded" />
            <span className="text-gray-500">Garis Tren D3</span>
          </div>
        </div>

        <div className="text-gray-500 font-mono text-[9px] flex items-center gap-2">
          {peakDay && (
            <span>
              Puncak: <strong>{peakDay.displayDate}</strong> ({peakDay.count} QR)
            </span>
          )}
          <span>• Sinkronisasi otomatis saat generate QR</span>
        </div>
      </div>
    </div>
  );
};
