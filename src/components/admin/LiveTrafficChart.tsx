"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowUpRight, Calendar, Activity } from "lucide-react";

interface Point {
  time: string;
  requests: number;
  cases: number;
  revenue: number;
}

const DATA_24H: Point[] = [
  { time: "00:00", requests: 1240, cases: 4, revenue: 5996 },
  { time: "03:00", requests: 820, cases: 2, revenue: 2998 },
  { time: "06:00", requests: 1150, cases: 6, revenue: 8994 },
  { time: "09:00", requests: 3420, cases: 28, revenue: 41972 },
  { time: "12:00", requests: 4890, cases: 42, revenue: 62958 },
  { time: "15:00", requests: 5120, cases: 38, revenue: 56962 },
  { time: "18:00", requests: 4210, cases: 31, revenue: 46469 },
  { time: "21:00", requests: 2840, cases: 18, revenue: 26982 },
];

const DATA_7D: Point[] = [
  { time: "Mon", requests: 28400, cases: 184, revenue: 275816 },
  { time: "Tue", requests: 31200, cases: 210, revenue: 314790 },
  { time: "Wed", requests: 34800, cases: 245, revenue: 367255 },
  { time: "Thu", requests: 32900, cases: 228, revenue: 341772 },
  { time: "Fri", requests: 36100, cases: 262, revenue: 392738 },
  { time: "Sat", requests: 19400, cases: 112, revenue: 167888 },
  { time: "Sun", requests: 16800, cases: 89, revenue: 133411 },
];

export default function LiveTrafficChart() {
  const [range, setRange] = useState<"24H" | "7D">("24H");
  const [metric, setMetric] = useState<"requests" | "cases" | "revenue">("requests");
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);

  const data = range === "24H" ? DATA_24H : DATA_7D;
  const values = data.map((d) => d[metric]);
  const maxValue = Math.max(...values) * 1.15;
  const minValue = 0;

  // Generate smooth SVG path coordinates
  const width = 680;
  const height = 180;
  const paddingX = 35;
  const paddingY = 20;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d[metric] - minValue) / (maxValue - minValue)) * (height - paddingY * 2);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const metricLabel =
    metric === "requests" ? "API & Ingress Traffic" : metric === "cases" ? "Intakes & Court Filings" : "Gross Settlement Revenue";

  const metricColor = metric === "requests" ? "#6366F1" : metric === "cases" ? "#F59E0B" : "#10B981";

  return (
    <div className="p-6 rounded-2xl bg-[#090D16] border border-slate-800 text-left shadow-xl space-y-6">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Platform Activity Telemetry</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {metric === "revenue" ? "₹" : ""}
              {(
                hoveredPoint
                  ? hoveredPoint[metric]
                  : values.reduce((a, b) => a + b, 0)
              ).toLocaleString("en-IN")}
            </h3>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +16.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {hoveredPoint ? `Recorded at ${hoveredPoint.time}` : `Aggregated total over selected ${range} window`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setMetric("requests")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                metric === "requests" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Traffic
            </button>
            <button
              onClick={() => setMetric("cases")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                metric === "cases" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Filings
            </button>
            <button
              onClick={() => setMetric("revenue")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                metric === "revenue" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Revenue
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setRange("24H")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                range === "24H" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              24H
            </button>
            <button
              onClick={() => setRange("7D")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                range === "7D" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              7D
            </button>
          </div>
        </div>
      </div>

      {/* SVG Time Series Graph */}
      <div className="relative w-full h-[190px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={metricColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Subtle Gridlines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1E293B"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Smooth Line */}
          <path d={pathD} fill="none" stroke={metricColor} strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.time === p.data.time ? "5" : "3.5"}
                fill="#0F172A"
                stroke={metricColor}
                strokeWidth="2"
                onMouseEnter={() => setHoveredPoint(p.data)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="transition-all hover:scale-125"
              />
            </g>
          ))}
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between px-6 text-[10px] font-mono text-slate-500 pt-1">
          {data.map((d, i) => (
            <span key={i}>{d.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
