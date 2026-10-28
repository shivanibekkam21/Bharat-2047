import React, { useState } from 'react';
import { Region, RegionalScores } from '../types';
import { MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface IndiaMapProps {
  regions: Region[];
  scoresMap: Record<string, RegionalScores>;
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  selectedStateFilter: string;
  onSelectStateFilter: (state: string) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  regions,
  scoresMap,
  selectedRegionId,
  onSelectRegion,
  selectedStateFilter,
  onSelectStateFilter
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  // Geographic bounds for India projection:
  // Lat: 8°N to 37°N (~29 degrees range)
  // Lng: 68°E to 97°E (~29 degrees range)
  const projectCoordinates = (lat: number, lng: number): [number, number] => {
    const minLat = 7.5;
    const maxLat = 36.5;
    const minLng = 67.5;
    const maxLng = 97.5;

    // SVG width: 800, height: 900
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = 870 - ((lat - minLat) / (maxLat - minLat)) * 820;

    return [Math.round(x), Math.round(y)];
  };

  // Professional Choropleth-style palette as specified:
  // Very High: #173B63, High: #008C95, Medium: #8EC5CC, Low: #DCEAF2, Selected: #F59E0B
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#173B63'; // Very High Development
    if (score >= 65) return '#008C95'; // High Development (Teal)
    if (score >= 50) return '#8EC5CC'; // Medium Development
    return '#DCEAF2'; // Low / Emerging
  };

  // Group states
  const states = Array.from(new Set(regions.map(r => r.state))).sort();

  return (
    <div className="relative bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#EEF3F7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008C95]" />
            <h3 className="text-base font-bold text-[#173B63]">National Regional Intelligence Map</h3>
          </div>
          <p className="text-xs text-[#5B6B7A] mt-0.5">
            Geospatial nodes colored by calculated Prototype Development Index (0–100)
          </p>
        </div>

        {/* State filter selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="state-filter-select" className="text-xs font-semibold text-[#173B63]">Filter State:</label>
          <select
            id="state-filter-select"
            value={selectedStateFilter}
            onChange={(e) => onSelectStateFilter(e.target.value)}
            className="text-xs font-medium bg-[#EEF3F7] border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[#172B4D] focus:outline-none focus:border-[#008C95]"
          >
            <option value="All">All States ({states.length})</option>
            {states.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Map Visualization SVG Container */}
        <div className="lg:col-span-8 relative flex items-center justify-center bg-[#EEF3F7]/50 rounded-xl p-3 border border-[#E2E8F0] min-h-[460px]">
          <svg
            viewBox="0 0 800 880"
            className="w-full h-auto max-h-[500px] select-none"
            aria-label="Map of India showing regional development indicators"
          >
            {/* Subtle network/cartographic grid pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="800" height="880" fill="url(#grid)" />

            {/* Geographic Boundary Outline of India */}
            <path
              d="M 280 70 
                 L 350 90 L 370 140 L 410 170 L 460 210 L 520 220 L 570 210 L 640 230 L 720 250 L 750 290 
                 L 740 330 L 680 340 L 640 370 L 600 370 L 570 410 L 560 480 L 580 540 L 540 620 L 480 700 
                 L 430 770 L 390 850 L 370 850 L 350 780 L 320 720 L 300 640 L 270 560 L 250 510 L 210 470 
                 L 170 460 L 150 420 L 140 380 L 160 340 L 210 320 L 240 270 L 240 210 L 230 160 L 250 110 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.75"
              strokeLinejoin="round"
              className="drop-shadow-xs"
            />

            {/* Strategic Regional Freight & Economic Corridors */}
            <g stroke="#8EC5CC" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.65">
              <line x1="390" y1="380" x2="270" y2="550" />
              <line x1="390" y1="380" x2="350" y2="780" />
              <line x1="270" y1="550" x2="350" y2="780" />
              <line x1="390" y1="380" x2="680" y2="340" />
            </g>

            {/* Regional Point Markers */}
            {regions.map((region) => {
              const [cx, cy] = projectCoordinates(region.coordinates[0], region.coordinates[1]);
              const score = scoresMap[region.id]?.developmentIndex || 60;
              const isSelected = selectedRegionId === region.id;
              const isHovered = hoveredRegion?.id === region.id;
              const isFilteredIn = selectedStateFilter === 'All' || region.state === selectedStateFilter;
              const markerColor = isSelected ? '#F59E0B' : getScoreColor(score);

              return (
                <g
                  key={region.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectRegion(region.id)}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  opacity={isFilteredIn ? 1 : 0.25}
                >
                  {/* Outer pulsating ring for selected (Saffron #F59E0B) */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="#F59E0B"
                      fillOpacity="0.25"
                      className="animate-pulse"
                    />
                  )}

                  {/* Marker Circle with high-contrast border */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 10 : isHovered ? 8 : 6}
                    fill={markerColor}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150 drop-shadow-xs"
                  />

                  {/* District Label */}
                  <text
                    x={cx + 10}
                    y={cy + 4}
                    fontSize={isSelected || isHovered ? "11" : "9"}
                    fontWeight={isSelected ? "800" : "600"}
                    fill={isSelected ? "#173B63" : "#172B4D"}
                    className="pointer-events-none drop-shadow-xs"
                  >
                    {region.district}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Professional Legend adhering to specified palette */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#CBD5E1] rounded-lg p-3 shadow-xs text-xs space-y-1.5">
            <div className="font-bold text-[#173B63] text-[11px] uppercase tracking-wider">
              Development Index Scale
            </div>
            <div className="flex items-center gap-2 text-[#5B6B7A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#173B63] inline-block" />
              <span>80–100 : Very High (Navy)</span>
            </div>
            <div className="flex items-center gap-2 text-[#5B6B7A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008C95] inline-block" />
              <span>65–79 : High (Teal)</span>
            </div>
            <div className="flex items-center gap-2 text-[#5B6B7A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EC5CC] inline-block" />
              <span>50–64 : Medium (Light Blue)</span>
            </div>
            <div className="flex items-center gap-2 text-[#5B6B7A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DCEAF2] border border-[#CBD5E1] inline-block" />
              <span>0–49 : Low / Emerging</span>
            </div>
            <div className="flex items-center gap-2 text-[#F59E0B] font-semibold pt-1 border-t border-[#EEF3F7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
              <span>Selected Region (Saffron)</span>
            </div>
          </div>
        </div>

        {/* Selected / Hovered Region Quick Inspector Panel */}
        <div className="lg:col-span-4 bg-[#EEF3F7] rounded-xl p-5 border border-[#CBD5E1] shadow-xs">
          {(() => {
            const activeReg = hoveredRegion || regions.find(r => r.id === selectedRegionId) || regions[0];
            const activeScore = scoresMap[activeReg.id];

            if (!activeReg || !activeScore) {
              return <div className="text-xs text-[#5B6B7A]">Select a region marker on the map to inspect.</div>;
            }

            return (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A]">
                      {activeReg.zone} Zone · {activeReg.tier}
                    </span>
                    <span className="text-xs font-semibold text-[#173B63] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                      {activeReg.state}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-[#173B63] mt-1">{activeReg.district}</h4>
                  <p className="text-xs text-[#5B6B7A] mt-1 leading-relaxed line-clamp-2">
                    {activeReg.notes || 'Strategic economic and demographic regional development node.'}
                  </p>
                </div>

                {/* Score Spotlight */}
                <div className="p-3.5 bg-white rounded-lg border border-[#CBD5E1] flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="text-[11px] font-semibold text-[#5B6B7A]">Prototype Development Index</div>
                    <div className="text-xs font-bold text-[#008C95]">{activeScore.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">
                      {activeScore.developmentIndex}
                    </span>
                    <span className="text-xs text-[#8795A1]">/100</span>
                  </div>
                </div>

                {/* Indicators grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1]">
                    <span className="text-[#5B6B7A] block text-[11px]">Human Capital</span>
                    <span className="font-bold font-mono tabular-nums text-[#173B63] text-sm">
                      {activeScore.humanCapitalIndex}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1]">
                    <span className="text-[#5B6B7A] block text-[11px]">Infrastructure</span>
                    <span className="font-bold font-mono tabular-nums text-[#173B63] text-sm">
                      {activeScore.infrastructureIndex}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1]">
                    <span className="text-[#5B6B7A] block text-[11px]">Economic Index</span>
                    <span className="font-bold font-mono tabular-nums text-[#173B63] text-sm">
                      {activeScore.economicIndex}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1]">
                    <span className="text-[#5B6B7A] block text-[11px]">Sustainability</span>
                    <span className="font-bold font-mono tabular-nums text-[#2E8B57] text-sm">
                      {activeScore.sustainabilityIndex}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRegion(activeReg.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Open Regional Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#008C95]" />
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
