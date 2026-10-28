import React, { useState } from 'react';
import { Region, Sector } from '../types';
import { SECTORS_CATALOG } from '../data/sectorsData';
import { rankOpportunities } from '../services/mlEngine';
import { Building2, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

interface EntrepreneurPortalViewProps {
  regions: Region[];
  onSelectRegion: (id: string) => void;
}

export const EntrepreneurPortalView: React.FC<EntrepreneurPortalViewProps> = ({
  regions,
  onSelectRegion
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(SECTORS_CATALOG[0].id);
  const [investmentScale, setInvestmentScale] = useState<string>('Small (₹1 Cr – ₹10 Cr)');
  const [infraPreference, setInfraPreference] = useState<string>('High-capacity Freight Roads & Expressways');

  const selectedSector = SECTORS_CATALOG.find(s => s.id === selectedSectorId) || SECTORS_CATALOG[0];

  // Rank regions for this sector
  const rankedRegions = React.useMemo(() => {
    return regions
      .map(r => {
        const ops = rankOpportunities(r, 'balanced', [selectedSector]);
        const op = ops[0];
        return {
          region: r,
          score: op?.score || 50,
          confidence: op?.confidence || 'Medium',
          positiveFactors: op?.positiveFactors || [],
          challenges: op?.challenges || [],
          dataPoints: op?.dataPointsUsed || []
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [regions, selectedSector]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#008C95]" />
          Enterprise & Industrial Siting Intelligence
        </div>
        <h2 className="text-2xl font-bold text-[#173B63] mt-1">
          Entrepreneur Regional Feasibility & Siting Portal
        </h2>
        <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
          Evaluate district readiness across India for private enterprise setup. Assess supply chain inputs, power stability, logistics corridors, and local workforce availability.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 bg-[#EEF3F7] border border-slate-200 rounded-xl text-xs text-[#172B4D] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#008C95] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#173B63]">Commercial Advisory Notice: </span>
          <span className="text-[#5B6B7A]">
            Prototype feasibility rankings are derived from aggregate public indicators (DPIIT, Udyam, PLFS, MoRTH). Detailed commercial due diligence, local environmental clearances, and land registry verifications remain required before capital deployment.
          </span>
        </div>
      </div>

      {/* Siting Criteria Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#173B63]">Project Siting Parameters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Sector */}
          <div className="space-y-1.5">
            <label htmlFor="target-sector-select" className="font-semibold text-[#172B4D]">Target Industry / Sector:</label>
            <select
              id="target-sector-select"
              value={selectedSectorId}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3F7] border border-slate-200 rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95] font-medium"
            >
              {SECTORS_CATALOG.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>

          {/* Investment Scale */}
          <div className="space-y-1.5">
            <label htmlFor="investment-scale-select" className="font-semibold text-[#172B4D]">Planned Capital Outlay:</label>
            <select
              id="investment-scale-select"
              value={investmentScale}
              onChange={(e) => setInvestmentScale(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3F7] border border-slate-200 rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95] font-medium"
            >
              <option value="Micro (< ₹1 Cr)">Micro Enterprise (&lt; ₹1 Cr)</option>
              <option value="Small (₹1 Cr – ₹10 Cr)">Small Enterprise (₹1 Cr – ₹10 Cr)</option>
              <option value="Medium (₹10 Cr – ₹50 Cr)">Medium Enterprise (₹10 Cr – ₹50 Cr)</option>
              <option value="Large (> ₹50 Cr)">Large Industrial Unit (&gt; ₹50 Cr)</option>
            </select>
          </div>

          {/* Infrastructure Preference */}
          <div className="space-y-1.5">
            <label htmlFor="infra-preference-select" className="font-semibold text-[#172B4D]">Critical Infrastructure Requirement:</label>
            <select
              id="infra-preference-select"
              value={infraPreference}
              onChange={(e) => setInfraPreference(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3F7] border border-slate-200 rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95] font-medium"
            >
              <option value="High-capacity Freight Roads & Expressways">High-capacity Freight Roads & Expressways</option>
              <option value="Uninterrupted 24/7 High-Voltage Power Feeder">Uninterrupted 24/7 Industrial Power Feeder</option>
              <option value="Raw Crop Biomass & Farm-Gate Proximity">Raw Agricultural Biomass & Farm-Gate Proximity</option>
              <option value="Deep-water Port or Dry Port ICD Access">Deep-water Port or ICD Container Access</option>
              <option value="High-Speed Gigabit Fiber & STPI Zones">High-Speed Gigabit Fiber & STPI Tech Parks</option>
            </select>
          </div>
        </div>

        {/* Selected Sector Enterprise Models */}
        <div className="pt-2 text-xs border-t border-slate-100">
          <span className="font-bold text-[#173B63] text-[11px] uppercase tracking-wider block mb-1.5">
            Proven Business Models in {selectedSector.name}:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedSector.businessOpportunities.map((biz, i) => (
              <span key={i} className="px-2.5 py-1 bg-[#EEF3F7] rounded text-[#172B4D] font-medium border border-slate-200">
                {biz}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feasibility Rankings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#173B63]">
              Ranked Feasibility Siting for {selectedSector.name}
            </h3>
            <p className="text-xs text-[#5B6B7A] mt-0.5">Multi-criteria suitability scoring grounded in supply-chain telemetry.</p>
          </div>
          <span className="text-xs text-[#5B6B7A] font-mono">
            Evaluating {regions.length} regional nodes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rankedRegions.slice(0, 6).map((item, idx) => {
            const { region, score, confidence, positiveFactors, challenges } = item;
            const topColors = ['#F59E0B', '#008C95', '#173B63', '#2E8B57', '#8EC5CC', '#D97706'];
            const cardAccent = topColors[idx % topColors.length];

            return (
              <div
                key={region.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#008C95] hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cardAccent }} />

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6B7A] font-bold">
                        Rank #{idx + 1} Siting
                      </span>
                      <h4 className="text-base font-bold text-[#173B63] mt-0.5">{region.district}</h4>
                      <div className="text-xs text-[#5B6B7A]">{region.state} · {region.tier}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">{score}</span>
                      <span className="text-xs text-[#8795A1]">/100</span>
                      <div className="text-[10px] font-semibold text-[#2E8B57]">{confidence} Fit</div>
                    </div>
                  </div>

                  {/* Positive factors */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-[#173B63] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                      Key Competitive Strengths
                    </span>
                    <ul className="pl-4 list-disc text-[#5B6B7A] space-y-0.5 marker:text-[#2E8B57]">
                      {positiveFactors.slice(0, 2).map((pf, i) => (
                        <li key={i} className="line-clamp-2">{pf}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottlenecks to Mitigate */}
                  <div className="space-y-1 text-xs pt-1">
                    <span className="font-semibold text-[#173B63] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                      Infrastructure Gaps to Plan For
                    </span>
                    <ul className="pl-4 list-disc text-[#5B6B7A] space-y-0.5 marker:text-[#D97706]">
                      {challenges.slice(0, 2).map((ch, i) => (
                        <li key={i} className="line-clamp-2">{ch}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRegion(region.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Inspect Regional Infrastructure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
