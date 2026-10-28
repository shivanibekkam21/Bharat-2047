import React, { useState, useMemo } from 'react';
import { Region, RegionalScores } from '../types';
import { IndiaMap } from '../components/IndiaMap';
import { Search, Filter, ArrowUpDown, ChevronRight, Compass } from 'lucide-react';

interface IndiaOverviewViewProps {
  regions: Region[];
  scoresMap: Record<string, RegionalScores>;
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
  onOpenDashboard: (id: string) => void;
  onOpenSimulator: (id: string) => void;
}

export const IndiaOverviewView: React.FC<IndiaOverviewViewProps> = ({
  regions,
  scoresMap,
  selectedRegionId,
  onSelectRegion,
  onOpenDashboard,
  onOpenSimulator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState<'developmentIndex' | 'population' | 'literacy_rate'>('developmentIndex');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const states = useMemo(() => Array.from(new Set(regions.map(r => r.state))).sort(), [regions]);
  const zones = useMemo(() => Array.from(new Set(regions.map(r => r.zone))).sort(), [regions]);

  const filteredRegions = useMemo(() => {
    return regions.filter(r => {
      const matchSearch =
        r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchState = selectedState === 'All' || r.state === selectedState;
      const matchZone = selectedZone === 'All' || r.zone === selectedZone;
      const matchTier = selectedTier === 'All' || r.tier === selectedTier;
      return matchSearch && matchState && matchZone && matchTier;
    }).sort((a, b) => {
      let valA: number;
      let valB: number;
      if (sortBy === 'developmentIndex') {
        valA = scoresMap[a.id]?.developmentIndex || 0;
        valB = scoresMap[b.id]?.developmentIndex || 0;
      } else {
        valA = a[sortBy];
        valB = b[sortBy];
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [regions, scoresMap, searchQuery, selectedState, selectedZone, selectedTier, sortBy, sortOrder]);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008C95]" />
            <span className="text-xs font-bold text-[#173B63] uppercase tracking-wider">
              National Geospatial Dashboard
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#173B63] mt-1">India Regional Development Overview</h2>
          <p className="text-xs text-[#5B6B7A] mt-1">
            Empirical multi-dimensional indicators across Indian states and calibrated district nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#173B63] bg-[#EEF3F7] px-3 py-1.5 rounded-lg border border-[#CBD5E1] font-mono tabular-nums">
            Showing {filteredRegions.length} of {regions.length} districts
          </span>
        </div>
      </div>

      {/* Interactive Map Component */}
      <IndiaMap
        regions={regions}
        scoresMap={scoresMap}
        selectedRegionId={selectedRegionId}
        onSelectRegion={onSelectRegion}
        selectedStateFilter={selectedState}
        onSelectStateFilter={setSelectedState}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8795A1] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search district or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#F5F7FA] border border-[#CBD5E1] rounded-lg text-[#172B4D] placeholder-[#8795A1] focus:outline-none focus:border-[#008C95]"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="Filter by state"
              className="w-full text-xs px-3 py-2 bg-[#F5F7FA] border border-[#CBD5E1] rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95] font-medium"
            >
              <option value="All">All States ({states.length})</option>
              {states.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          {/* Zone Filter */}
          <div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              aria-label="Filter by geographic zone"
              className="w-full text-xs px-3 py-2 bg-[#F5F7FA] border border-[#CBD5E1] rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95] font-medium"
            >
              <option value="All">All Zones ({zones.length})</option>
              {zones.map(z => <option key={z} value={z}>{z} Zone</option>)}
            </select>
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              aria-label="Filter by district tier"
              className="w-full text-xs px-3 py-2 bg-[#F5F7FA] border border-[#CBD5E1] rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95] font-medium"
            >
              <option value="All">All Tiers</option>
              <option value="Tier 1">Tier 1 Metros</option>
              <option value="Tier 2">Tier 2 Growth Hubs</option>
              <option value="Tier 3">Tier 3 Emerging Towns</option>
              <option value="Aspirational District">Aspirational Districts</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-density Regional Table with Navy & Teal Accents */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#EEF3F7] flex flex-wrap items-center justify-between gap-3 bg-[#F5F7FA]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#173B63]" />
            <h3 className="text-sm font-bold text-[#173B63]">Regional Development Indicator Matrix</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5B6B7A]">
            <span className="font-semibold">Sort by:</span>
            <button
              onClick={() => {
                if (sortBy === 'developmentIndex') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('developmentIndex');
                  setSortOrder('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                sortBy === 'developmentIndex'
                  ? 'bg-[#173B63] text-white font-bold'
                  : 'bg-white text-[#5B6B7A] border border-[#CBD5E1] hover:text-[#173B63]'
              }`}
            >
              Development Index {sortBy === 'developmentIndex' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'population') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('population');
                  setSortOrder('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                sortBy === 'population'
                  ? 'bg-[#173B63] text-white font-bold'
                  : 'bg-white text-[#5B6B7A] border border-[#CBD5E1] hover:text-[#173B63]'
              }`}
            >
              Population {sortBy === 'population' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#102A43] text-white font-bold border-b border-[#1E3E5F]">
                <th className="py-3 px-4">District & State</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3 text-right">Population</th>
                <th className="py-3 px-3 text-right">Literacy</th>
                <th className="py-3 px-3 text-right font-black text-[#8EC5CC]">Dev Index</th>
                <th className="py-3 px-3 text-right">Human Capital</th>
                <th className="py-3 px-3 text-right">Infrastructure</th>
                <th className="py-3 px-3 text-right">Economic</th>
                <th className="py-3 px-3 text-right">Sustainability</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-mono tabular-nums">
              {filteredRegions.map((region, idx) => {
                const scores = scoresMap[region.id];
                const isSelected = selectedRegionId === region.id;
                const devIndex = scores?.developmentIndex ?? 0;

                // Semantic badge color
                const scoreBadge =
                  devIndex >= 80 ? 'bg-[#DCFCE7] text-[#2E8B57]' :
                  devIndex >= 65 ? 'bg-[#DCEAF2] text-[#008C95]' :
                  devIndex >= 50 ? 'bg-[#FEF3C7] text-[#D97706]' :
                  'bg-[#FEE2E2] text-[#DC4C4C]';

                return (
                  <tr
                    key={region.id}
                    onClick={() => onSelectRegion(region.id)}
                    className={`hover:bg-[#EEF3F7] transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#DCEAF2]/50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]/70'
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-[#173B63]">
                      <div>{region.district}</div>
                      <div className="text-[11px] text-[#5B6B7A] font-normal">{region.state}</div>
                    </td>
                    <td className="py-3 px-3 font-sans text-[#5B6B7A]">
                      <div className="font-semibold text-[#172B4D]">{region.tier}</div>
                      <div className="text-[11px] text-[#8795A1]">{region.zone} Zone</div>
                    </td>
                    <td className="py-3 px-3 text-right text-[#172B4D]">
                      {(region.population / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-3 text-right text-[#172B4D]">
                      {region.literacy_rate}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-black ${scoreBadge}`}>
                        {scores?.developmentIndex ?? '--'}
                      </span>
                      <span className="block text-[10px] font-sans font-medium text-[#5B6B7A] mt-0.5">
                        {scores?.category ?? ''}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6B7A]">
                      {scores?.humanCapitalIndex ?? '--'}
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6B7A]">
                      {scores?.infrastructureIndex ?? '--'}
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6B7A]">
                      {scores?.economicIndex ?? '--'}
                    </td>
                    <td className="py-3 px-3 text-right text-[#2E8B57] font-semibold">
                      {scores?.sustainabilityIndex ?? '--'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDashboard(region.id);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#173B63] bg-white border border-[#173B63]/40 rounded hover:bg-[#EEF3F7] transition-colors cursor-pointer shadow-2xs"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSimulator(region.id);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#008C95] hover:bg-[#00767E] rounded transition-colors cursor-pointer shadow-2xs"
                        >
                          Simulate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
