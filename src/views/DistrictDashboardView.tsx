import React from 'react';
import { Region, RegionalScores, DevelopmentGap } from '../types';
import { RadarChart } from '../components/RadarChart';
import { AlertCircle, ArrowRight, TrendingUp, Sparkles, FileText, CheckCircle2, Building, Users, Leaf, Activity } from 'lucide-react';

interface DistrictDashboardViewProps {
  region: Region;
  scores: RegionalScores;
  gaps: DevelopmentGap[];
  allRegions: Region[];
  onSelectRegion: (id: string) => void;
  onNavigateToOpportunities: () => void;
  onNavigateToSimulator: () => void;
  onNavigateToReport: () => void;
  onNavigateToCompare: () => void;
}

export const DistrictDashboardView: React.FC<DistrictDashboardViewProps> = ({
  region,
  scores,
  gaps,
  allRegions,
  onSelectRegion,
  onNavigateToOpportunities,
  onNavigateToSimulator,
  onNavigateToReport,
  onNavigateToCompare
}) => {
  return (
    <div className="space-y-8 py-4">
      {/* Region Selector & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5B6B7A]">
            <span className="text-[#173B63]">India</span>
            <span aria-hidden="true">/</span>
            <span>{region.state}</span>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#008C95]">{region.district}</span>
            <span aria-hidden="true">·</span>
            <span>{region.zone} Zone</span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded bg-[#EEF3F7] text-[#173B63]">{region.tier}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173B63] mt-1.5">
            {region.district} Development Intelligence Profile
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1 max-w-3xl leading-relaxed">
            {region.notes || 'Integrated regional analysis grounded in demographic, economic, and infrastructure indices.'}
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <label htmlFor="district-select" className="text-xs font-bold text-[#173B63]">Switch Region:</label>
          <select
            id="district-select"
            value={region.id}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="text-xs font-semibold bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-[#172B4D] focus:outline-none focus:border-[#008C95] shadow-2xs cursor-pointer"
          >
            {allRegions.map(r => (
              <option key={r.id} value={r.id}>{r.district} ({r.state})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Strip - Upgraded with clean top accent lines */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Prototype Development Index */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs card-hover-lift border-t-3 border-t-[#008C95]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7A]">
              Prototype Dev Index
            </span>
            <Activity className="w-4 h-4 text-[#008C95]" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black font-mono tabular-nums text-[#173B63]">
              {scores.developmentIndex}
            </span>
            <span className="text-xs text-[#8795A1]">/100</span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-[#008C95] bg-[#DCEAF2] px-2 py-0.5 rounded inline-block">
            {scores.category}
          </div>
        </div>

        {/* Population & Youth */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs card-hover-lift border-t-3 border-t-[#173B63]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7A]">
              Demographic Dividend
            </span>
            <Users className="w-4 h-4 text-[#173B63]" />
          </div>
          <div className="flex items-baseline gap-1 mt-2 font-mono tabular-nums">
            <span className="text-2xl font-black text-[#173B63]">
              {(region.population / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-[#5B6B7A] font-sans">pop</span>
          </div>
          <div className="mt-1.5 text-xs text-[#5B6B7A]">
            <span className="font-bold text-[#172B4D]">{region.youth_population_percentage}%</span> youth cohort (15–29y)
          </div>
        </div>

        {/* Human Capital & Workforce */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs card-hover-lift border-t-3 border-t-[#173B63]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7A]">
              Human Capital & Labor
            </span>
            <Building className="w-4 h-4 text-[#173B63]" />
          </div>
          <div className="flex items-baseline gap-1 mt-2 font-mono tabular-nums">
            <span className="text-2xl font-black text-[#173B63]">
              {region.literacy_rate}%
            </span>
            <span className="text-xs text-[#5B6B7A] font-sans">literacy</span>
          </div>
          <div className="mt-1.5 text-xs text-[#5B6B7A]">
            <span className="font-bold text-[#172B4D]">{region.unemployment_rate}%</span> unemployment rate
          </div>
        </div>

        {/* Women Participation & Sustainability */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs card-hover-lift border-t-3 border-t-[#2E8B57]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7A]">
              Inclusion & Resilience
            </span>
            <Leaf className="w-4 h-4 text-[#2E8B57]" />
          </div>
          <div className="flex items-baseline gap-1 mt-2 font-mono tabular-nums">
            <span className="text-2xl font-black text-[#173B63]">
              {region.women_workforce_participation}%
            </span>
            <span className="text-xs text-[#5B6B7A] font-sans">women workforce</span>
          </div>
          <div className="mt-1.5 text-xs text-[#5B6B7A]">
            <span className="font-bold text-[#2E8B57]">{scores.sustainabilityIndex}/100</span> sustainability score
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart + Detailed Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar Chart Viewport */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col items-center">
          <div className="w-full pb-3 mb-2 border-b border-[#EEF3F7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008C95]" />
              <h3 className="text-sm font-bold text-[#173B63]">Multi-Dimensional Footprint</h3>
            </div>
            <span className="text-xs font-semibold text-[#5B6B7A]">7 Core Pillars</span>
          </div>
          <RadarChart primaryScores={scores} primaryLabel={`${region.district} Baseline`} size={320} />
          <p className="text-[11px] text-[#5B6B7A] text-center mt-3 max-w-xs leading-relaxed">
            Polygon area visualizes overall regional development depth. Balance across economic, human, and ecological pillars indicates sustainable resilience.
          </p>
        </div>

        {/* Detailed Indicator Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F7]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#173B63]" />
              <h3 className="text-sm font-bold text-[#173B63]">Dimension Score Breakdown</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-[#5B6B7A]">Calibrated Indicators</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#EEF3F7]/70 rounded-lg border border-[#CBD5E1]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#173B63]">Human Capital Index</span>
                <span className="font-bold font-mono tabular-nums text-[#173B63]">{scores.humanCapitalIndex}</span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">Literacy ({region.literacy_rate}%), Higher education ({region.higher_education_rate}%), Workforce ({region.workforce_participation}%)</p>
            </div>

            <div className="p-3 bg-[#EEF3F7]/70 rounded-lg border border-[#CBD5E1]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#173B63]">Infrastructure Index</span>
                <span className="font-bold font-mono tabular-nums text-[#173B63]">{scores.infrastructureIndex}</span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">Roads ({region.road_connectivity}), Rail ({region.railway_connectivity}), Power ({region.electricity_access})</p>
            </div>

            <div className="p-3 bg-[#EEF3F7]/70 rounded-lg border border-[#CBD5E1]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#173B63]">Economic Index</span>
                <span className="font-bold font-mono tabular-nums text-[#173B63]">{scores.economicIndex}</span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">Agri ({region.agriculture_index}), Mfg ({region.manufacturing_index}), Services ({region.services_index}), MSME ({region.msme_presence})</p>
            </div>

            <div className="p-3 bg-[#EEF3F7]/70 rounded-lg border border-[#CBD5E1]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#173B63]">Employment Index</span>
                <span className="font-bold font-mono tabular-nums text-[#173B63]">{scores.employmentIndex}</span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">Unemployment ({region.unemployment_rate}%), Participation ({region.workforce_participation}%)</p>
            </div>

            <div className="p-3 bg-[#EEF3F7]/70 rounded-lg border border-[#CBD5E1]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#173B63]">Digital Readiness</span>
                <span className="font-bold font-mono tabular-nums text-[#008C95]">{scores.digitalReadinessIndex}</span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">Digital connectivity ({region.digital_connectivity}), Startup ecosystem ({region.startup_ecosystem})</p>
            </div>

            <div className="p-3 bg-[#EEF3F7]/70 rounded-lg border border-[#CBD5E1]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#2E8B57]">Sustainability Index</span>
                <span className="font-bold font-mono tabular-nums text-[#2E8B57]">{scores.sustainabilityIndex}</span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">Renewable energy ({region.renewable_energy_potential}), Water security ({region.water_availability})</p>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNavigateToOpportunities}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Ranked Opportunities</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#008C95] hover:bg-[#00767E] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate 2047</span>
            </button>
            <button
              onClick={onNavigateToReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EEF3F7] text-[#173B63] border border-[#CBD5E1] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#5B6B7A]" />
              <span>Generate PDF Report</span>
            </button>
            <button
              onClick={onNavigateToCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EEF3F7] text-[#173B63] border border-[#CBD5E1] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <span>Compare Regions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structural Development Gap Analysis Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#EEF3F7] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
                Diagnostic Intelligence
              </span>
            </div>
            <h3 className="text-base font-bold text-[#173B63] mt-0.5">
              Structural Development Gap & Intervention Analysis
            </h3>
          </div>
          <span className="text-xs font-bold text-[#173B63] bg-[#EEF3F7] border border-[#CBD5E1] px-3 py-1 rounded-lg">
            {gaps.length} Structural Gaps Identified
          </span>
        </div>

        <p className="text-xs text-[#5B6B7A] leading-relaxed max-w-3xl">
          Regional advancement depends on unblocking bottlenecks where natural strengths are not currently converted into local economic value.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {gaps.map((gap) => {
            return (
              <div key={gap.id} className="p-4 rounded-xl border border-[#CBD5E1] bg-[#EEF3F7]/50 space-y-3 card-hover-lift">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-[#173B63]">{gap.strengthTitle}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    gap.priority === 'Immediate' ? 'bg-[#FEE2E2] text-[#DC4C4C] border border-[#DC4C4C]/30' :
                    gap.priority === 'Strategic' ? 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30' :
                    'bg-[#DCEAF2] text-[#008C95] border border-[#008C95]/30'
                  }`}>
                    {gap.priority} Priority
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1]">
                    <span className="text-[10px] text-[#5B6B7A] font-semibold block">Baseline Strength</span>
                    <span className="font-bold text-[#2E8B57] font-mono tabular-nums text-sm">{gap.strengthValue}/100</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1]">
                    <span className="text-[10px] text-[#5B6B7A] font-semibold block">Identified Bottleneck</span>
                    <span className="font-bold text-[#DC4C4C] font-mono tabular-nums text-sm">{gap.bottleneckValue}/100</span>
                  </div>
                </div>

                <p className="text-xs text-[#5B6B7A] leading-relaxed">
                  {gap.gapSummary}
                </p>

                <div className="pt-2 border-t border-[#CBD5E1] space-y-1.5 text-xs">
                  <div>
                    <span className="font-bold text-[#173B63]">Policy Intervention: </span>
                    <span className="text-[#5B6B7A]">{gap.intervention}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#173B63]">Target Opportunity: </span>
                    <span className="text-[#008C95] font-bold">{gap.targetOpportunity}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
