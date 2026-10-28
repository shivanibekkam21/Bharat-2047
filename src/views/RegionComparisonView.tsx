import React, { useState } from 'react';
import { Region, RegionalScores } from '../types';
import { RadarChart } from '../components/RadarChart';
import { BarComparisonChart, ComparisonBarItem } from '../components/BarComparisonChart';
import { rankOpportunities } from '../services/mlEngine';
import { Plus, X, Layers } from 'lucide-react';

interface RegionComparisonViewProps {
  regions: Region[];
  scoresMap: Record<string, RegionalScores>;
  onSelectRegion: (id: string) => void;
}

export const RegionComparisonView: React.FC<RegionComparisonViewProps> = ({
  regions,
  scoresMap,
  onSelectRegion
}) => {
  // Up to 4 regions for comparison
  const [selectedIds, setSelectedIds] = useState<string[]>([
    regions[0]?.id || 'reg_up_varanasi',
    regions[1]?.id || 'reg_mh_pune',
    regions[2]?.id || 'reg_tn_coimbatore'
  ]);

  const selectedRegions = regions.filter(r => selectedIds.includes(r.id));

  const handleAddRegion = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveRegion = (id: string) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    }
  };

  // Prepare comparison bars
  const barItems: ComparisonBarItem[] = [
    {
      label: 'Development Index',
      baseline: scoresMap[selectedRegions[0]?.id]?.developmentIndex || 0,
      scenario: scoresMap[selectedRegions[1]?.id]?.developmentIndex,
      scenarioB: scoresMap[selectedRegions[2]?.id]?.developmentIndex,
      scenarioC: scoresMap[selectedRegions[3]?.id]?.developmentIndex
    },
    {
      label: 'Human Capital',
      baseline: scoresMap[selectedRegions[0]?.id]?.humanCapitalIndex || 0,
      scenario: scoresMap[selectedRegions[1]?.id]?.humanCapitalIndex,
      scenarioB: scoresMap[selectedRegions[2]?.id]?.humanCapitalIndex,
      scenarioC: scoresMap[selectedRegions[3]?.id]?.humanCapitalIndex
    },
    {
      label: 'Infrastructure',
      baseline: scoresMap[selectedRegions[0]?.id]?.infrastructureIndex || 0,
      scenario: scoresMap[selectedRegions[1]?.id]?.infrastructureIndex,
      scenarioB: scoresMap[selectedRegions[2]?.id]?.infrastructureIndex,
      scenarioC: scoresMap[selectedRegions[3]?.id]?.infrastructureIndex
    },
    {
      label: 'Economic Index',
      baseline: scoresMap[selectedRegions[0]?.id]?.economicIndex || 0,
      scenario: scoresMap[selectedRegions[1]?.id]?.economicIndex,
      scenarioB: scoresMap[selectedRegions[2]?.id]?.economicIndex,
      scenarioC: scoresMap[selectedRegions[3]?.id]?.economicIndex
    },
    {
      label: 'Employment Index',
      baseline: scoresMap[selectedRegions[0]?.id]?.employmentIndex || 0,
      scenario: scoresMap[selectedRegions[1]?.id]?.employmentIndex,
      scenarioB: scoresMap[selectedRegions[2]?.id]?.employmentIndex,
      scenarioC: scoresMap[selectedRegions[3]?.id]?.employmentIndex
    },
    {
      label: 'Sustainability',
      baseline: scoresMap[selectedRegions[0]?.id]?.sustainabilityIndex || 0,
      scenario: scoresMap[selectedRegions[1]?.id]?.sustainabilityIndex,
      scenarioB: scoresMap[selectedRegions[2]?.id]?.sustainabilityIndex,
      scenarioC: scoresMap[selectedRegions[3]?.id]?.sustainabilityIndex
    }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008C95]" />
            Comparative Regional Intelligence
          </div>
          <h2 className="text-2xl font-bold text-[#173B63] mt-1">
            Multi-Region Comparative Benchmark
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1">
            Benchmark up to 4 districts side-by-side across empirical development pillars and top sectoral opportunities.
          </p>
        </div>

        {/* Add region dropdown */}
        {selectedIds.length < 4 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddRegion(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              aria-label="Add region to compare"
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#173B63] focus:outline-none focus:border-[#008C95] shadow-xs cursor-pointer"
            >
              <option value="" disabled>+ Add District to Compare...</option>
              {regions
                .filter(r => !selectedIds.includes(r.id))
                .map(r => (
                  <option key={r.id} value={r.id}>{r.district} ({r.state})</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Regions Tag Strip */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-semibold text-[#173B63]">Active Benchmark Regions:</span>
        {selectedRegions.map((r, idx) => {
          const tagColors = ['#173B63', '#008C95', '#F59E0B', '#2E8B57'];
          const tagColor = tagColors[idx % tagColors.length];

          return (
            <div
              key={r.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-[#172B4D] shadow-xs"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tagColor }} />
              <span className="font-semibold text-[#173B63]">{r.district}</span>
              <span className="text-[#5B6B7A]">({r.state})</span>
              {selectedRegions.length > 1 && (
                <button
                  onClick={() => handleRemoveRegion(r.id)}
                  className="text-slate-400 hover:text-[#DC4C4C] cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bar Comparison Chart */}
      <BarComparisonChart
        items={barItems}
        title="Cross-Regional Comparative Indicators"
        labels={{
          baseline: selectedRegions[0]?.district || 'Region 1',
          scenario: selectedRegions[1]?.district || 'Region 2',
          scenarioB: selectedRegions[2]?.district,
          scenarioC: selectedRegions[3]?.district
        }}
      />

      {/* Side-by-Side Detailed Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedRegions.map((region, idx) => {
          const scores = scoresMap[region.id];
          const topOps = rankOpportunities(region).slice(0, 3);
          const topColors = ['#173B63', '#008C95', '#F59E0B', '#2E8B57'];
          const cardAccent = topColors[idx % topColors.length];

          return (
            <div
              key={region.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden hover:shadow-md transition-all"
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cardAccent }} />

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-[#5B6B7A] uppercase tracking-wider">
                      {region.zone} Zone · {region.tier}
                    </span>
                    <h3 className="text-lg font-bold text-[#173B63] mt-0.5">{region.district}</h3>
                    <div className="text-xs text-[#5B6B7A] font-medium">{region.state}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">
                      {scores?.developmentIndex}
                    </span>
                    <span className="text-xs text-[#8795A1]">/100</span>
                    <div className="text-[10px] font-semibold text-[#008C95] bg-[#DCEAF2] px-2 py-0.5 rounded-full mt-0.5">
                      {scores?.category}
                    </div>
                  </div>
                </div>

                {/* Radar Mini View */}
                {scores && (
                  <div className="flex justify-center pt-2">
                    <RadarChart primaryScores={scores} primaryLabel={region.district} size={220} />
                  </div>
                )}

                {/* Key Metrics List */}
                <div className="space-y-1.5 text-xs font-mono tabular-nums border-t border-slate-100 pt-3">
                  <div className="flex justify-between font-sans">
                    <span className="text-[#5B6B7A]">Population:</span>
                    <span className="text-[#172B4D] font-mono font-medium">{(region.population / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-[#5B6B7A]">Literacy:</span>
                    <span className="text-[#172B4D] font-mono font-medium">{region.literacy_rate}%</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-[#5B6B7A]">Unemployment:</span>
                    <span className="text-[#172B4D] font-mono font-medium">{region.unemployment_rate}%</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-[#5B6B7A]">Women Workforce:</span>
                    <span className="text-[#172B4D] font-mono font-medium">{region.women_workforce_participation}%</span>
                  </div>
                </div>

                {/* Top Opportunities */}
                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <span className="font-semibold text-[#173B63] text-[11px] uppercase tracking-wider">Top 3 Recommended Sectors:</span>
                  <div className="space-y-1">
                    {topOps.map((op) => (
                      <div key={op.sectorId} className="flex items-center justify-between p-1.5 bg-[#EEF3F7] rounded border border-slate-200">
                        <span className="text-[#172B4D] font-medium truncate">{op.sectorName}</span>
                        <span className="font-mono font-bold text-[#008C95] ml-2">{op.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectRegion(region.id)}
                className="w-full py-2 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Open Full Deep-Dive
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
