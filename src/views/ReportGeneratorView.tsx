import React, { useState } from 'react';
import { Region, RegionalScores, DevelopmentGap, RoadmapPhase } from '../types';
import { RadarChart } from '../components/RadarChart';
import { rankOpportunities } from '../services/mlEngine';
import { Printer, Download, Sparkles, Building, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

interface ReportGeneratorViewProps {
  region: Region;
  scores: RegionalScores;
  gaps: DevelopmentGap[];
  allRegions: Region[];
  onSelectRegion: (id: string) => void;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  region,
  scores,
  gaps,
  allRegions,
  onSelectRegion
}) => {
  const opportunities = rankOpportunities(region).slice(0, 4);

  // 4-Phase Roadmap data (editable)
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([
    {
      phaseNumber: 1,
      timeframe: '2026 – 2030',
      title: 'Foundation Infrastructure & Multi-Modal Connectivity',
      keyInitiatives: [
        'Complete highway bypass connecting local industrial estates to national expressway network',
        'Upgrade primary substation with dedicated green-energy feeder line',
        'Establish common testing laboratory accredited by NABL for export goods'
      ],
      infrastructureMilestones: ['100% all-weather freight roads', 'Gigabit fiber in district industrial estate'],
      skillsAndTalentTargets: ['Establish PMKVY vocational center in agro & mechanical trades', 'Train 2,500 youth'],
      expectedImpact: 'Reduces transit turnaround by 35% and prevents post-harvest crop distress sales.'
    },
    {
      phaseNumber: 2,
      timeframe: '2030 – 2035',
      title: 'Skill Development & Technical Talent Alignment',
      keyInitiatives: [
        'Curriculum overhaul in regional ITIs and polytechnics aligned with priority sectors',
        'Incubator partnership with regional universities and STPI',
        'Subsidized entrepreneurship credit linkage for women cooperatives and FPOs'
      ],
      infrastructureMilestones: ['District Co-working Innovation Hub', 'Mini-food processing aggregation center'],
      skillsAndTalentTargets: ['5,000 certified technicians in CNC, cold chain, and cloud tools', '30% female participation'],
      expectedImpact: 'Absorbs graduating youth locally, reducing outbound distress migration.'
    },
    {
      phaseNumber: 3,
      timeframe: '2035 – 2040',
      title: 'Attracting Anchor Enterprises & Supply Chain Ancillaries',
      keyInitiatives: [
        'Offer single-window land allocation incentives for Tier-1 anchor manufacturing plants',
        'Develop vendor park for local MSME precision parts suppliers',
        'Deploy smart logistics container terminal (ICD) with rail freight siding'
      ],
      infrastructureMilestones: ['Rail freight container terminal operational', 'Cleanroom pharmaceutical / electronics park'],
      skillsAndTalentTargets: ['Supervisory manufacturing and quality auditing professionals', '10,000 formal jobs'],
      expectedImpact: 'Triples formal manufacturing output and local tax base.'
    },
    {
      phaseNumber: 4,
      timeframe: '2040 – 2047',
      title: 'Scaled Global Clusters & Net-Zero Industrial Corridors',
      keyInitiatives: [
        'Scale regional cluster output into global export supply chains',
        'Achieve 100% net-zero industrial park power via utility-scale solar-wind integration',
        'Institutionalize permanent R&D centers in advanced materials and biotechnology'
      ],
      infrastructureMilestones: ['Zero Liquid Discharge common industrial water loop', 'Advanced logistics AI dispatch'],
      skillsAndTalentTargets: ['High-skilled research scientists and global export merchandisers', '25,000+ cluster workforce'],
      expectedImpact: 'Transforms the district into a globally competitive, high-wage sustainable economic engine.'
    }
  ]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008C95]" />
            Executive Deliverable
          </div>
          <h2 className="text-2xl font-bold text-[#173B63] mt-1">
            Regional Development & Opportunity Intelligence Report
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1">
            Synthesized empirical report for {region.district}, {region.state} ready for policy review, planning summits, or PDF export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="report-region-select" className="text-xs font-semibold text-[#173B63]">Region:</label>
          <select
            id="report-region-select"
            value={region.id}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#173B63] focus:outline-none focus:border-[#008C95] shadow-xs cursor-pointer"
          >
            {allRegions.map(r => (
              <option key={r.id} value={r.id}>{r.district} ({r.state})</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Document Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[#173B63] pb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#008C95] uppercase tracking-widest font-mono">
              PROJECT BHARAT 2047 · REGIONAL INTELLIGENCE REPORT
            </div>
            <h1 className="text-3xl font-black text-[#173B63] mt-1">
              {region.district} District Development Profile
            </h1>
            <div className="text-xs text-[#5B6B7A] mt-1">
              State of {region.state} · {region.zone} Zone · Classification: {region.tier} · Published October 2026
            </div>
          </div>

          <div className="text-right font-mono tabular-nums">
            <span className="text-3xl font-black text-[#173B63]">{scores.developmentIndex}</span>
            <span className="text-xs text-[#8795A1]">/100</span>
            <div className="text-xs font-bold text-[#008C95] font-sans mt-0.5">
              Prototype Dev Index: {scores.category}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B63] font-mono">
            01. Executive Overview & Baseline Characteristics
          </h3>
          <p className="text-xs sm:text-sm text-[#172B4D] leading-relaxed max-w-4xl">
            {region.district} represents a key {region.zone.toLowerCase()} economic node with an aggregate population of {(region.population / 1000000).toFixed(2)} million, featuring a youthful demographic dividend of {region.youth_population_percentage}% and a baseline literacy rate of {region.literacy_rate}%. The district records an overall Prototype Development Index of <span className="font-bold text-[#173B63]">{scores.developmentIndex}/100</span> ({scores.category}), with particular strengths in {scores.humanCapitalIndex >= 70 ? 'human capital formation' : 'agricultural and environmental endowments'}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono tabular-nums text-xs">
            <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
              <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Human Capital</span>
              <span className="font-bold text-[#173B63] text-sm">{scores.humanCapitalIndex}/100</span>
            </div>
            <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
              <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Infrastructure</span>
              <span className="font-bold text-[#173B63] text-sm">{scores.infrastructureIndex}/100</span>
            </div>
            <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
              <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Economic Activity</span>
              <span className="font-bold text-[#173B63] text-sm">{scores.economicIndex}/100</span>
            </div>
            <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
              <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Sustainability</span>
              <span className="font-bold text-[#173B63] text-sm">{scores.sustainabilityIndex}/100</span>
            </div>
          </div>
        </div>

        {/* Radar Footprint & Structural Gaps */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B63] font-mono">
            02. Multi-Dimensional Footprint & Structural Gap Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 flex justify-center">
              <RadarChart primaryScores={scores} primaryLabel={region.district} size={280} />
            </div>
            <div className="md:col-span-7 space-y-3">
              <div className="text-xs font-semibold text-[#173B63]">
                Key Structural Bottlenecks Requiring Strategic Intervention:
              </div>
              <div className="space-y-2">
                {gaps.slice(0, 3).map((gap) => (
                  <div key={gap.id} className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173B63]">{gap.strengthTitle} vs {gap.bottleneckTitle}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        gap.priority === 'High' ? 'bg-amber-100 text-[#D97706]' : 'bg-slate-200 text-[#5B6B7A]'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-[#5B6B7A] text-[11px] leading-relaxed">{gap.gapSummary}</p>
                    <div className="text-[#172B4D] text-[11px] font-medium pt-0.5">
                      Recommended Action: <span className="font-semibold text-[#008C95]">{gap.intervention}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Ranked Opportunities */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B63] font-mono">
            03. High-Priority Development Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((op) => (
              <div key={op.sectorId} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-xs relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  op.rank === 1 ? 'bg-[#F59E0B]' : op.rank === 2 ? 'bg-[#008C95]' : 'bg-[#173B63]'
                }`} />
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#5B6B7A]">Rank #{op.rank} · {op.category}</span>
                    <div className="font-bold text-[#173B63] text-sm mt-0.5">{op.sectorName}</div>
                  </div>
                  <span className="text-base font-black font-mono tabular-nums text-[#173B63]">{op.score}/100</span>
                </div>
                <div className="space-y-0.5 text-[#5B6B7A]">
                  <div><span className="font-semibold text-[#173B63]">Key Asset: </span>{op.positiveFactors[0]}</div>
                  <div><span className="font-semibold text-[#173B63]">Prerequisite: </span>{op.challenges[0]}</div>
                </div>
                <div className="pt-1.5 text-[11px] text-[#5B6B7A] border-t border-slate-100">
                  Target Roles: <span className="text-[#172B4D] font-medium">{op.jobRoles.slice(0, 2).map(j => j.title).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Phase Strategic Roadmap */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B63] font-mono">
              04. Strategic Development Roadmap (2026–2047)
            </h3>
            <span className="text-[11px] text-[#8795A1] font-sans print:hidden">Editable Planning Horizon</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.map((phase) => (
              <div key={phase.phaseNumber} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#008C95]" />
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="font-mono font-bold text-[#173B63] text-xs">
                    Phase {phase.phaseNumber} · {phase.timeframe}
                  </span>
                </div>
                <h4 className="font-bold text-[#173B63]">{phase.title}</h4>
                <ul className="list-disc pl-4 text-[#5B6B7A] space-y-1 text-[11px] marker:text-[#008C95]">
                  {phase.keyInitiatives.map((init, i) => (
                    <li key={i}>{init}</li>
                  ))}
                </ul>
                <div className="pt-2 text-[11px] text-[#172B4D] bg-[#EEF3F7] p-2 rounded">
                  <span className="font-semibold text-[#173B63]">Projected Impact: </span>
                  {phase.expectedImpact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Sign-off and Disclaimer */}
        <div className="pt-6 border-t-2 border-slate-200 text-xs text-[#5B6B7A] space-y-2">
          <div className="font-semibold text-[#173B63]">Methodology & Governance Disclaimer:</div>
          <p className="leading-relaxed">
            This report is generated by the Bharat 2047 regional opportunity intelligence model. Scores are calculated using standardized multi-criteria analysis of official public statistics (MoSPI, UDISE+, DPIIT, MNRE). These recommendations constitute planning decision-support scenarios and do not replace statutory government approvals, master plans, or private commercial due diligence.
          </p>
        </div>
      </div>
    </div>
  );
};
