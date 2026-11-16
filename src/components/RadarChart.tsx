import React, { useState } from 'react';
import { RadarMetrics } from '../services/radEngine';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface RadarChartProps {
  metrics: RadarMetrics;
  corpusName: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ metrics, corpusName }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const axes = [
    { label: 'Methodological Rigor', key: 'methodologicalRigor', value: metrics.methodologicalRigor, desc: 'Quality of baseline comparisons, ablation studies, and control groups.' },
    { label: 'Empirical & Data Diversity', key: 'datasetDiversity', value: metrics.datasetDiversity, desc: 'Breadth beyond narrow single-domain or synthetic benchmarks.' },
    { label: 'Theoretical Depth', key: 'theoreticalDepth', value: metrics.theoreticalDepth, desc: 'Formal mathematical models, theoretical bounds, and mechanistic grounding.' },
    { label: 'Scalability & Efficiency', key: 'scalabilityEfficiency', value: metrics.scalabilityEfficiency, desc: 'Inference latency, memory footprint, and low-compute feasibility.' },
    { label: 'Benchmark Reproducibility', key: 'benchmarkReproducibility', value: metrics.benchmarkReproducibility, desc: 'Public artifacts, compute disclosures, and reproducible suites.' },
  ];

  const size = 320;
  const center = size / 2;
  const radius = 105;
  const totalAxes = axes.length;

  // Compute polygon points for values
  const getCoordinates = (index: number, val: number, maxVal = 100) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (val / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.value);
      return `${x},${y}`;
    })
    .join(' ');

  // Average health score
  const avgScore = Math.round(
    axes.reduce((sum, a) => sum + a.value, 0) / axes.length
  );

  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm flex flex-col md:flex-row items-center gap-6">
      {/* SVG Canvas */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
            </radialGradient>
            <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Background concentric rings */}
          {[20, 40, 60, 80, 100].map((level) => {
            const levelPoints = axes
              .map((_, i) => {
                const { x, y } = getCoordinates(i, level);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={level}
                points={levelPoints}
                fill={level === 100 ? 'url(#radarGlow)' : 'none'}
                stroke="#334155"
                strokeWidth={level === 100 ? "1.5" : "1"}
                strokeDasharray={level < 100 ? "2,2" : undefined}
              />
            );
          })}

          {/* Spokes from center */}
          {axes.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#475569"
                strokeWidth="1"
              />
            );
          })}

          {/* Radar Active Polygon */}
          <polygon
            points={polygonPoints}
            fill="url(#polyGrad)"
            stroke="#38bdf8"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
          />

          {/* Axis Labels & Interactive Points */}
          {axes.map((axis, i) => {
            const { x, y } = getCoordinates(i, axis.value);
            const labelCoord = getCoordinates(i, 124);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Active Data Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4.5}
                  fill={axis.value < 60 ? '#f97316' : '#38bdf8'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Score text near point */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none font-mono"
                >
                  {axis.value}
                </text>

                {/* Label on boundary */}
                <text
                  x={labelCoord.x}
                  y={labelCoord.y + 4}
                  textAnchor={
                    labelCoord.x < center - 10
                      ? 'end'
                      : labelCoord.x > center + 10
                      ? 'start'
                      : 'middle'
                  }
                  fill={isHovered ? '#38bdf8' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={isHovered ? 'bold' : '500'}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {axis.label.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Center Score Badge */}
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span className="text-2xl font-black tracking-tight text-white font-mono">
            {avgScore}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
            Index
          </span>
        </div>
      </div>

      {/* Right Column: Breakdown & Diagnosis */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>RAD Corpus Vulnerability Radar</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-300 font-mono">
                {corpusName}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Heuristic diagnostic revealing structural research blindspots across the collection
            </p>
          </div>
        </div>

        {/* Axis bars list */}
        <div className="space-y-2.5">
          {axes.map((axis, i) => {
            const isDeficient = axis.value < 65;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={axis.key}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2 rounded-xl transition-all ${
                  isHovered ? 'bg-slate-700/60 ring-1 ring-brand-500/40' : 'bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    {isDeficient ? (
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-slate-200">{axis.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDeficient && (
                      <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">
                        Critical Gap Area
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-100">{axis.value}/100</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDeficient
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-brand-500 to-emerald-400'
                    }`}
                    style={{ width: `${axis.value}%` }}
                  />
                </div>

                {isHovered && (
                  <p className="text-[11px] text-slate-300 mt-1.5 italic animate-fadeIn">
                    {axis.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
