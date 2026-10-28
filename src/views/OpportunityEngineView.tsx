import React, { useState } from 'react';
import { Region, OpportunityRecommendation } from '../types';
import { ArrowRight, CheckCircle2, AlertTriangle, Layers, Briefcase, Building, ChevronRight, X } from 'lucide-react';

interface OpportunityEngineViewProps {
  region: Region;
  opportunities: OpportunityRecommendation[];
  mode: 'balanced' | 'rural' | 'urban';
  onChangeMode: (mode: 'balanced' | 'rural' | 'urban') => void;
  onOpenSimulator: () => void;
}

export const OpportunityEngineView: React.FC<OpportunityEngineViewProps> = ({
  region,
  opportunities,
  mode,
  onChangeMode,
  onOpenSimulator
}) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityRecommendation | null>(null);

  return (
    <div className="space-y-8 py-4">
      {/* Header and Mode Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008C95]" />
            Decision-Support Intelligence
          </div>
          <h2 className="text-2xl font-bold text-[#173B63] mt-1">
            Ranked Development Opportunities for {region.district}
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
            Multi-criteria algorithm evaluating 16 development sectors against the region’s natural resource endowments, workforce size, and infrastructure connectivity.
          </p>
        </div>

        {/* Development Mode Toggle (Segmented control) */}
        <div className="flex items-center gap-1 p-1 bg-[#EEF3F7] rounded-lg border border-slate-200">
          <button
            onClick={() => onChangeMode('balanced')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'balanced' ? 'bg-[#173B63] text-white shadow-xs' : 'text-[#5B6B7A] hover:text-[#173B63]'
            }`}
          >
            Balanced Mode
          </button>
          <button
            onClick={() => onChangeMode('rural')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'rural' ? 'bg-[#173B63] text-white shadow-xs' : 'text-[#5B6B7A] hover:text-[#173B63]'
            }`}
          >
            Rural Priority Mode
          </button>
          <button
            onClick={() => onChangeMode('urban')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'urban' ? 'bg-[#173B63] text-white shadow-xs' : 'text-[#5B6B7A] hover:text-[#173B63]'
            }`}
          >
            Urban Growth Mode
          </button>
        </div>
      </div>

      {/* Mode Advisory Banner */}
      <div className="p-3 bg-[#EEF3F7] border border-slate-200 rounded-xl text-xs text-[#172B4D] flex items-center justify-between">
        <div>
          <span className="font-semibold text-[#173B63]">Active Priority Mode: </span>
          {mode === 'rural'
            ? 'Prioritizing agro-processing, cold chain, rural logistics, decentralised solar, and handlooms.'
            : mode === 'urban'
            ? 'Prioritizing IT services, precision engineering, high-tech manufacturing, and urban digital services.'
            : 'Standard neutral weighting across agricultural, industrial, services, and green-tech sectors.'}
        </div>
        <span className="text-[11px] text-[#5B6B7A] font-mono">
          Model: MCDM-AHP Vector Matching
        </span>
      </div>

      {/* Ranked Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {opportunities.map((op) => {
          return (
            <div
              key={op.sectorId}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#008C95] hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Top Accent Line for top rank */}
              {op.rank === 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
              )}
              {op.rank === 2 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#008C95]" />
              )}
              {op.rank === 3 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#173B63]" />
              )}

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#5B6B7A]">
                      <span className="font-mono font-bold text-[#173B63] bg-[#EEF3F7] px-2 py-0.5 rounded">
                        Rank #{op.rank}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{op.category}</span>
                      <span className="text-[10px] bg-[#DCEAF2] text-[#008C95] font-semibold px-2 py-0.5 rounded-full">
                        AI Recommended
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#173B63] mt-1.5">{op.sectorName}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">
                      {op.score}
                    </span>
                    <span className="text-xs text-[#8795A1]">/100</span>
                    <div className={`text-[10px] font-semibold mt-0.5 ${
                      op.confidence === 'High' ? 'text-[#2E8B57]' :
                      op.confidence === 'Medium' ? 'text-[#008C95]' : 'text-[#D97706]'
                    }`}>
                      {op.confidence} Confidence
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full bg-[#EEF3F7] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      op.score >= 80 ? 'bg-[#2E8B57]' :
                      op.score >= 65 ? 'bg-[#008C95]' : 'bg-[#D97706]'
                    }`}
                    style={{ width: `${op.score}%` }}
                  />
                </div>

                {/* Explainable AI: Positive Factors */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-[#173B63] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                    Key Supporting Factors
                  </span>
                  <ul className="space-y-1 text-[#5B6B7A] pl-4 list-disc marker:text-[#2E8B57]">
                    {op.positiveFactors.map((pf, i) => (
                      <li key={i} className="leading-relaxed">{pf}</li>
                    ))}
                  </ul>
                </div>

                {/* Explainable AI: Challenges */}
                <div className="space-y-1.5 text-xs pt-1">
                  <span className="font-bold text-[#173B63] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                    Prerequisites & Constraints
                  </span>
                  <ul className="space-y-1 text-[#5B6B7A] pl-4 list-disc marker:text-[#D97706]">
                    {op.challenges.map((ch, i) => (
                      <li key={i} className="leading-relaxed">{ch}</li>
                    ))}
                  </ul>
                </div>

                {/* Data Points Used */}
                <div className="pt-2 text-[11px] text-[#8795A1] font-mono">
                  Data grounding: {op.dataPointsUsed.join(' · ')}
                </div>
              </div>

              {/* Action Button to Open Deep-Dive */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-[#5B6B7A]">
                  {op.jobRoles.length} target job roles · {op.businessOpportunities.length} enterprise models
                </span>
                <button
                  onClick={() => setSelectedOpportunity(op)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#173B63] hover:text-[#008C95] transition-colors cursor-pointer"
                >
                  <span>Opportunity Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#5B6B7A]">
                <span>{region.district}, {region.state}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedOpportunity.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#173B63] font-mono bg-[#EEF3F7] px-2 py-0.5 rounded">
                  Rank #{selectedOpportunity.rank}
                </span>
                <span className="text-[10px] bg-[#DCEAF2] text-[#008C95] font-semibold px-2 py-0.5 rounded-full">
                  AI Recommended
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#173B63] mt-1.5">{selectedOpportunity.sectorName}</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-bold text-[#173B63] font-mono">
                  Compatibility Score: <span className="text-[#008C95]">{selectedOpportunity.score}</span>/100
                </span>
                <span className="text-xs text-[#5B6B7A]">
                  Confidence: <span className="font-semibold text-[#2E8B57]">{selectedOpportunity.confidence}</span>
                </span>
              </div>
            </div>

            {/* Why This Sector? */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B63]">Why Prioritize This Sector?</h4>
              <div className="bg-[#EEF3F7] p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-[#172B4D] leading-relaxed">
                <div className="font-semibold text-[#173B63] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                  Supported by Empirical Regional Assets:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#5B6B7A] marker:text-[#2E8B57]">
                  {selectedOpportunity.positiveFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="font-semibold text-[#173B63] pt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                  Addressing Key Bottlenecks:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#5B6B7A] marker:text-[#D97706]">
                  {selectedOpportunity.challenges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Development Pathway */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B63]">Regional Development Pathway</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {selectedOpportunity.developmentPathway.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="p-2.5 bg-[#DCEAF2] border border-[#8EC5CC] rounded-lg text-[#173B63] font-medium text-[11px]">
                      <span className="text-[#008C95] font-mono font-bold mr-1">0{idx + 1}.</span>
                      {step}
                    </div>
                    {idx < selectedOpportunity.developmentPathway.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#8795A1] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Required Infrastructure & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h4 className="font-bold text-[#173B63] flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#008C95]" />
                  Required Infrastructure
                </h4>
                <ul className="space-y-1 pl-4 list-disc text-[#5B6B7A] marker:text-[#008C95]">
                  {selectedOpportunity.requiredInfrastructure.map((inf, i) => (
                    <li key={i}>{inf}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h4 className="font-bold text-[#173B63] flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#008C95]" />
                  Priority Skills & Curricula
                </h4>
                <ul className="space-y-1 pl-4 list-disc text-[#5B6B7A] marker:text-[#008C95]">
                  {selectedOpportunity.keySkills.map((sk, i) => (
                    <li key={i}>{sk}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Target Job Roles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B63]">High-Potential Job Roles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {selectedOpportunity.jobRoles.map((job) => (
                  <div key={job.title} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 hover:border-[#008C95] transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173B63]">{job.title}</span>
                      <span className="text-[10px] bg-[#EEF3F7] text-[#173B63] font-semibold px-2 py-0.5 rounded">
                        {job.careerLevel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5B6B7A]">{job.education} · {job.training}</div>
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 font-mono">
                      <span className="text-[#2E8B57] font-semibold">{job.averageSalaryBand}</span>
                      <span className="text-[#5B6B7A] font-sans font-medium">{job.employmentPotential} Potential</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entrepreneurship Models */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B63]">Local Enterprise Opportunities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedOpportunity.businessOpportunities.map((biz, i) => (
                  <div key={i} className="p-2.5 bg-[#EEF3F7] border border-[#8EC5CC] rounded-lg text-[#172B4D] font-medium flex items-center gap-2">
                    <span className="text-[#008C95] font-bold">✓</span>
                    <span>{biz}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-[#8795A1] max-w-sm">
                Prototype decision-support recommendation based on regional cross-sector similarity index.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOpportunity(null);
                    onOpenSimulator();
                  }}
                  className="px-4 py-2 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Simulate Sector Impact
                </button>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-4 py-2 bg-[#EEF3F7] hover:bg-slate-200 text-[#172B4D] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
