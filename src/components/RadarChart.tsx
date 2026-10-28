import React from 'react';
import { RegionalScores } from '../types';

interface RadarChartProps {
  primaryScores: RegionalScores;
  primaryLabel?: string;
  secondaryScores?: RegionalScores;
  secondaryLabel?: string;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  primaryScores,
  primaryLabel = 'Baseline',
  secondaryScores,
  secondaryLabel = 'Scenario',
  size = 340
}) => {
  const axes = [
    { key: 'humanCapitalIndex', label: 'Human Capital' },
    { key: 'infrastructureIndex', label: 'Infrastructure' },
    { key: 'economicIndex', label: 'Economic' },
    { key: 'employmentIndex', label: 'Employment' },
    { key: 'digitalReadinessIndex', label: 'Digital' },
    { key: 'socialIndex', label: 'Social Infra' },
    { key: 'sustainabilityIndex', label: 'Sustainability' }
  ] as const;

  const totalAxes = axes.length;
  const center = size / 2;
  const radius = (size / 2) - 52;

  // Angle step for 7 axes
  const angleStep = (Math.PI * 2) / totalAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [20, 40, 60, 80, 100];

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return [x, y];
  };

  const buildPolygonPath = (scores: RegionalScores) => {
    return axes
      .map((axis, i) => {
        const val = scores[axis.key];
        const [x, y] = getCoordinates(val, i);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const primaryPath = buildPolygonPath(primaryScores);
  const secondaryPath = secondaryScores ? buildPolygonPath(secondaryScores) : null;

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Concentric grid polygons */}
        {levels.map((lvl) => {
          const gridPoints = axes
            .map((_, i) => {
              const [x, y] = getCoordinates(lvl, i);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Axis radial spokes */}
        {axes.map((axis, i) => {
          const [x, y] = getCoordinates(100, i);
          const [labelX, labelY] = getCoordinates(118, i);
          return (
            <g key={axis.key}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#8EC5CC"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.7"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fontWeight="700"
                fill="#173B63"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Secondary polygon (e.g. Scenario) in Saffron #F59E0B */}
        {secondaryPath && (
          <polygon
            points={secondaryPath}
            fill="#F59E0B"
            fillOpacity="0.22"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="4,3"
          />
        )}

        {/* Primary polygon (e.g. Baseline) in Deep Navy #173B63 with Teal border */}
        <polygon
          points={primaryPath}
          fill="#173B63"
          fillOpacity="0.25"
          stroke="#008C95"
          strokeWidth="2.5"
        />

        {/* Data points for Primary (Teal #008C95 with white core) */}
        {axes.map((axis, i) => {
          const val = primaryScores[axis.key];
          const [x, y] = getCoordinates(val, i);
          return (
            <circle
              key={axis.key}
              cx={x}
              cy={y}
              r="4"
              fill="#008C95"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          );
        })}

        {/* Data points for Secondary (Saffron #F59E0B) */}
        {secondaryScores &&
          axes.map((axis, i) => {
            const val = secondaryScores[axis.key];
            const [x, y] = getCoordinates(val, i);
            return (
              <circle
                key={`sec_${axis.key}`}
                cx={x}
                cy={y}
                r="4"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            );
          })}
      </svg>

      {/* Legend with standardized palette */}
      <div className="flex items-center gap-6 mt-3 text-xs font-semibold">
        <div className="flex items-center gap-2 text-[#173B63]">
          <span className="w-3 h-3 rounded-xs bg-[#008C95] inline-block shadow-2xs" />
          <span>{primaryLabel}</span>
        </div>
        {secondaryScores && (
          <div className="flex items-center gap-2 text-[#173B63]">
            <span className="w-3 h-3 rounded-xs bg-[#F59E0B] inline-block shadow-2xs" />
            <span>{secondaryLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
