import React, { useState } from 'react';
import { Region, MLClusterResult } from '../types';

interface ClusterScatterPlotProps {
  regions: Region[];
  clusterResult: MLClusterResult;
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

// Consistent palette matching guidelines:
// Navy #173B63, Teal #008C95, Saffron #F59E0B, Green #2E8B57, Light Blue #8EC5CC, Amber #D97706
const CLUSTER_COLORS = [
  '#008C95', // Teal
  '#173B63', // Deep Navy
  '#F59E0B', // Saffron
  '#2E8B57', // Success Green
  '#8EC5CC', // Light Blue
  '#D97706', // Warning Amber
  '#102A43', // Dark Slate Navy
  '#DC4C4C'  // Risk Red
];

export const ClusterScatterPlot: React.FC<ClusterScatterPlotProps> = ({
  regions,
  clusterResult,
  selectedRegionId,
  onSelectRegion
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ id: string; name: string; x: number; y: number; cluster: string } | null>(null);

  const width = 640;
  const height = 400;
  const padding = 50;

  const points = regions.map((region) => {
    const xVal = (region.manufacturing_index + region.services_index + region.logistics_index) / 3;
    const yVal = (region.agriculture_index + region.renewable_energy_potential) / 2;
    const clusterId = clusterResult.regionAssignments[region.id] ?? 0;
    const clusterName = clusterResult.clusters[clusterId]?.clusterName || `Cluster ${clusterId}`;

    const svgX = padding + (xVal / 100) * (width - padding * 2);
    const svgY = height - padding - (yVal / 100) * (height - padding * 2);

    return {
      id: region.id,
      name: `${region.district}, ${region.state}`,
      x: svgX,
      y: svgY,
      rawX: Math.round(xVal),
      rawY: Math.round(yVal),
      clusterId,
      clusterName
    };
  });

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#EEF3F7] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008C95]" />
            <h4 className="text-sm font-bold text-[#173B63]">K-Means Typology Distribution (K={clusterResult.k})</h4>
          </div>
          <p className="text-xs text-[#5B6B7A] mt-0.5">
            2D projection: Industrial & Services Axis (X) vs Agro & Clean Energy Potential (Y) · Model Inertia: {clusterResult.inertia}
          </p>
        </div>
      </div>

      <div className="relative flex justify-center bg-[#EEF3F7]/50 rounded-xl p-3 border border-[#E2E8F0]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[420px] select-none">
          {/* Axis lines */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#173B63"
            strokeWidth="1.5"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#173B63"
            strokeWidth="1.5"
          />

          {/* Grid lines */}
          {[25, 50, 75].map((tick) => {
            const x = padding + (tick / 100) * (width - padding * 2);
            const y = height - padding - (tick / 100) * (height - padding * 2);
            return (
              <g key={tick}>
                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#CBD5E1" strokeDasharray="3,3" opacity="0.8" />
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#CBD5E1" strokeDasharray="3,3" opacity="0.8" />
                <text x={x} y={height - padding + 15} fontSize="9" fontWeight="600" fill="#5B6B7A" textAnchor="middle">
                  {tick}
                </text>
                <text x={padding - 10} y={y + 3} fontSize="9" fontWeight="600" fill="#5B6B7A" textAnchor="end">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#173B63"
          >
            Industrial, Services & Multimodal Logistics Index →
          </text>
          <text
            transform={`rotate(-90, 15, ${height / 2})`}
            x={15}
            y={height / 2}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#173B63"
          >
            Agro-Resource & Renewable Potential →
          </text>

          {/* Points */}
          {points.map((pt) => {
            const isSelected = selectedRegionId === pt.id;
            const color = CLUSTER_COLORS[pt.clusterId % CLUSTER_COLORS.length];

            return (
              <g
                key={pt.id}
                className="cursor-pointer"
                onClick={() => onSelectRegion(pt.id)}
                onMouseEnter={() => setHoveredPoint({ id: pt.id, name: pt.name, x: pt.x, y: pt.y, cluster: pt.clusterName })}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {isSelected && (
                  <circle cx={pt.x} cy={pt.y} r="14" fill="#F59E0B" fillOpacity="0.3" className="animate-pulse" />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 7.5 : 5.5}
                  fill={isSelected ? '#F59E0B' : color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="drop-shadow-xs"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip in dark navy #102A43 with teal highlight */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-[#102A43] text-white rounded-lg px-3 py-2 text-xs shadow-xl z-10 border border-[#2A527A]"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 15}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="font-bold text-white">{hoveredPoint.name}</div>
            <div className="text-[11px] text-[#8EC5CC] font-semibold">{hoveredPoint.cluster}</div>
          </div>
        )}
      </div>

      {/* Cluster Legend cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {clusterResult.clusters.map((c) => {
          const color = CLUSTER_COLORS[c.clusterId % CLUSTER_COLORS.length];
          return (
            <div key={c.clusterId} className="p-3 bg-[#EEF3F7] rounded-lg border border-[#CBD5E1] text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="font-bold text-[#173B63] truncate">{c.clusterName}</span>
              </div>
              <p className="text-[#5B6B7A] text-[11px] line-clamp-1">{c.description}</p>
              <div className="mt-1.5 text-[11px] text-[#008C95] font-semibold">
                {c.size} districts · Top strength: {c.dominantFeatures[0]?.feature}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
