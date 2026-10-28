import React, { useState } from 'react';
import { Region, RegionalScores, DevelopmentGap } from '../types';
import { calculateDimensionScores, detectDevelopmentGaps, simulateScenario } from '../services/analyticsEngine';
import { runKMeansClustering, rankOpportunities } from '../services/mlEngine';
import { RadarChart } from '../components/RadarChart';
import { BarComparisonChart } from '../components/BarComparisonChart';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, FileText, TrendingUp, Layers } from 'lucide-react';

interface ExpoDemoViewProps {
  allRegions: Region[];
  onExitDemo: () => void;
  onOpenFullReport: (id: string) => void;
}

export const ExpoDemoView: React.FC<ExpoDemoViewProps> = ({
  allRegions,
  onExitDemo,
  onOpenFullReport
}) => {
  // Step in the 3-5 minute expo demo: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRegionId, setSelectedRegionId] = useState('reg_up_varanasi');

  const region = allRegions.find(r => r.id === selectedRegionId) || allRegions[0];
  const scores = calculateDimensionScores(region);
  const gaps = detectDevelopmentGaps(region, scores);
  const clusterResult = runKMeansClustering(allRegions, 5);
  const clusterId = clusterResult.regionAssignments[region.id] ?? 0;
  const cluster = clusterResult.clusters[clusterId] || clusterResult.clusters[0];
  const opportunities = rankOpportunities(region).slice(0, 3);
  const topOp = opportunities[0];

  // Demo simulation state
  const demoSimulation = simulateScenario(region, {
    roadConnectivityDelta: 18,
    digitalConnectivityDelta: 16,
    industrialInvestmentDelta: 22,
    skillDevelopmentDelta: 24,
    renewableEnergyDelta: 15,
    healthcareAccessDelta: 12,
    msmeClusterFocus: 25,
    tourismPromotion: 10
  });

  const steps = [
    { num: 1, title: 'Select District & Baseline' },
    { num: 2, title: 'Diagnostic Gap Detection' },
    { num: 3, title: 'ML Economic Typology' },
    { num: 4, title: 'AI Opportunity Engine' },
    { num: 5, title: 'Skills & Job Mapping' },
    { num: 6, title: '2047 Scenario Simulation' },
    { num: 7, title: 'Report Generation' }
  ];

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#102A43] text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4 border border-[#173B63]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F59E0B]">
            <Sparkles className="w-4 h-4" />
            <span>INNOVATION EXPO DEMO MODE · 3-MINUTE EVALUATION WALKTHROUGH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Bharat 2047 Intelligence Pipeline Tour
          </h2>
          <p className="text-xs text-[#8EC5CC] mt-1">
            Step-by-step verification of real calculated analytics, clustering, explainable matching, and simulation.
          </p>
        </div>

        <button
          onClick={onExitDemo}
          className="px-3.5 py-1.5 bg-[#173B63] hover:bg-[#1a4473] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#8EC5CC]/20"
        >
          Exit Demo Mode
        </button>
      </div>

      {/* Progress Steps Navigator */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((st) => (
            <button
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                currentStep === st.num
                  ? 'bg-[#173B63] text-white shadow-xs'
                  : currentStep > st.num
                  ? 'bg-[#EEF3F7] text-[#008C95]'
                  : 'text-[#5B6B7A] hover:bg-[#EEF3F7]'
              }`}
            >
              <span>{st.num}. {st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Viewport */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs min-h-[420px] flex flex-col justify-between space-y-6">
        {/* Step 1: Baseline */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#008C95] uppercase font-mono">Step 01 / 07</span>
                <h3 className="text-xl font-bold text-[#173B63] mt-0.5">
                  Select Regional Node & Inspect Stored Empirical Baseline
                </h3>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="demo-region-select" className="text-xs font-medium text-[#172B4D]">Region:</label>
                <select
                  id="demo-region-select"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="text-xs font-semibold bg-[#EEF3F7] border border-slate-300 rounded-lg px-3 py-1.5 text-[#173B63] focus:outline-none focus:border-[#008C95]"
                >
                  {allRegions.map(r => (
                    <option key={r.id} value={r.id}>{r.district} ({r.state})</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Every district in Bharat 2047 contains 30+ empirical indicators spanning demographics, economic activity, infrastructure connectivity, and sustainability.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
              <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
                <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Prototype Dev Index</span>
                <span className="text-2xl font-black text-[#173B63]">{scores.developmentIndex}/100</span>
                <span className="text-[10px] text-[#008C95] font-sans font-semibold block">{scores.category}</span>
              </div>
              <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
                <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Population & Youth</span>
                <span className="text-lg font-bold text-[#173B63]">{(region.population / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-[#5B6B7A] font-sans block">{region.youth_population_percentage}% youth cohort</span>
              </div>
              <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
                <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Human Capital</span>
                <span className="text-lg font-bold text-[#173B63]">{scores.humanCapitalIndex}/100</span>
                <span className="text-[10px] text-[#5B6B7A] font-sans block">{region.literacy_rate}% literacy</span>
              </div>
              <div className="p-3 bg-[#EEF3F7] rounded-lg border border-slate-200">
                <span className="text-[#5B6B7A] block text-[11px] font-sans font-medium">Infrastructure</span>
                <span className="text-lg font-bold text-[#173B63]">{scores.infrastructureIndex}/100</span>
                <span className="text-[10px] text-[#5B6B7A] font-sans block">Roads: {region.road_connectivity}/100</span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <RadarChart primaryScores={scores} primaryLabel={region.district} size={240} />
            </div>
          </div>
        )}

        {/* Step 2: Gap Detection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Step 02 / 07</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Automated Structural Development Gap Detection
              </h3>
            </div>

            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              The engine analyzes asymmetries between natural strengths and infrastructure bottlenecks to identify actionable policy interventions.
            </p>

            <div className="space-y-3">
              {gaps.map((gap) => (
                <div key={gap.id} className="p-4 bg-[#EEF3F7] rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#173B63] text-sm">
                      {gap.strengthTitle} vs {gap.bottleneckTitle}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      gap.priority === 'High' ? 'bg-amber-100 text-[#D97706]' : 'bg-slate-200 text-[#5B6B7A]'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-[#5B6B7A]">{gap.gapSummary}</p>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[#172B4D]">
                    <span className="font-semibold text-[#173B63]">Recommended Intervention: </span>
                    <span className="text-[#008C95] font-medium">{gap.intervention}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: ML Clustering */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#008C95] uppercase font-mono">Step 03 / 07</span>
              <h3 className="text-xl font-bold text-[#173B63] mt-0.5">
                K-Means Machine Learning Clustering
              </h3>
            </div>

            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Standardized 10-feature matrix partitioned by K-Means algorithm. Cluster names and descriptions are dynamically generated from centroid feature deviations.
            </p>

            <div className="p-5 bg-[#EEF3F7] rounded-xl border border-[#8EC5CC] space-y-2 text-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#008C95]" />
              <span className="font-mono text-[#008C95] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#008C95]" />
                Assigned Cluster Typology
              </span>
              <h4 className="text-lg font-black text-[#173B63]">{cluster.clusterName}</h4>
              <p className="text-[#5B6B7A] leading-relaxed">{cluster.description}</p>
              <div className="pt-2 text-[#173B63] font-semibold border-t border-slate-200">
                Key Strategic Theme: <span className="text-[#008C95] font-normal">{cluster.recommendedStrategicThemes[0]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Opportunities */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#008C95] uppercase font-mono">Step 04 / 07</span>
              <h3 className="text-xl font-bold text-[#173B63] mt-0.5">
                AI Opportunity Recommendation Engine
              </h3>
            </div>

            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Ranked compatibility scores with explicit explainable AI factors (positive drivers and prerequisites).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {opportunities.map((op) => (
                <div key={op.sectorId} className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2 shadow-xs relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    op.rank === 1 ? 'bg-[#F59E0B]' : op.rank === 2 ? 'bg-[#008C95]' : 'bg-[#173B63]'
                  }`} />
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#5B6B7A]">Rank #{op.rank}</span>
                      <h4 className="font-bold text-[#173B63] mt-0.5">{op.sectorName}</h4>
                    </div>
                    <span className="text-xl font-black font-mono text-[#173B63]">{op.score}</span>
                  </div>
                  <div className="text-[11px] text-[#5B6B7A]">
                    <span className="font-semibold text-[#173B63]">Key Driver: </span>{op.positiveFactors[0]}
                  </div>
                  <div className="text-[11px] text-[#5B6B7A]">
                    <span className="font-semibold text-[#173B63]">Prerequisite: </span>{op.challenges[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Skills & Jobs */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#008C95] uppercase font-mono">Step 05 / 07</span>
              <h3 className="text-xl font-bold text-[#173B63] mt-0.5">
                Skills, Jobs & Micro-Enterprise Mapping: {topOp.sectorName}
              </h3>
            </div>

            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Translating sector prioritization into workforce readiness, vocational training, and local entrepreneurship.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
                <span className="font-bold text-[#173B63] uppercase tracking-wider text-[11px] block">
                  High-Growth Job Roles:
                </span>
                {topOp.jobRoles.slice(0, 2).map(job => (
                  <div key={job.title} className="p-2.5 bg-[#EEF3F7] rounded-lg border border-slate-200">
                    <div className="font-semibold text-[#173B63]">{job.title}</div>
                    <div className="text-[11px] text-[#5B6B7A]">{job.training}</div>
                    <div className="text-[11px] font-mono font-bold text-[#2E8B57] mt-0.5">{job.averageSalaryBand}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
                <span className="font-bold text-[#173B63] uppercase tracking-wider text-[11px] block">
                  Local Enterprise Opportunities:
                </span>
                {topOp.businessOpportunities.slice(0, 3).map((biz, i) => (
                  <div key={i} className="p-2.5 bg-[#EEF3F7] rounded-lg border border-slate-200 text-[#172B4D] font-medium flex items-center gap-1.5">
                    <span className="text-[#008C95] font-bold">✓</span>
                    <span>{biz}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: 2047 Simulation */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#008C95] uppercase font-mono">Step 06 / 07</span>
              <h3 className="text-xl font-bold text-[#173B63] mt-0.5">
                2047 Scenario Simulation Engine
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono tabular-nums text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#008C95]" />
                <span className="text-[#5B6B7A] font-sans block text-[11px] font-medium">Development Index</span>
                <span className="text-[#8795A1] line-through text-xs mr-2">{demoSimulation.baseline.developmentIndex}</span>
                <span className="text-2xl font-black text-[#173B63]">{demoSimulation.scenario.developmentIndex}</span>
                <span className="text-[#2E8B57] font-semibold block font-sans">+{demoSimulation.deltas.developmentIndex} pts</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
                <span className="text-[#5B6B7A] font-sans block text-[11px] font-medium">Employment Expansion</span>
                <span className="text-2xl font-black text-[#173B63]">+{demoSimulation.projectedEmploymentGrowthPct}%</span>
                <span className="text-[#5B6B7A] font-sans block">Modelled growth</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 col-span-2 sm:col-span-1 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E8B57]" />
                <span className="text-[#5B6B7A] font-sans block text-[11px] font-medium">New Enterprises</span>
                <span className="text-2xl font-black text-[#173B63]">+{demoSimulation.projectedNewEnterprises.toLocaleString()}</span>
                <span className="text-[#5B6B7A] font-sans block">Units projected</span>
              </div>
            </div>

            <div className="flex justify-center">
              <RadarChart
                primaryScores={demoSimulation.baseline}
                primaryLabel="Baseline"
                secondaryScores={demoSimulation.scenario}
                secondaryLabel="Modelled 2047 Scenario"
                size={260}
              />
            </div>
          </div>
        )}

        {/* Step 7: Report Deliverable */}
        {currentStep === 7 && (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E8B57] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#173B63]">
                Regional Intelligence Pipeline Tour Complete
              </h3>
              <p className="text-xs text-[#5B6B7A] mt-1 max-w-lg mx-auto leading-relaxed">
                You have verified data validation, multi-dimensional scoring, unsupervised clustering, explainable opportunity rankings, and policy scenario simulations.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenFullReport(region.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#F59E0B]" />
                <span>Open Full Regional Report</span>
              </button>
              <button
                onClick={onExitDemo}
                className="px-5 py-2.5 bg-[#EEF3F7] hover:bg-slate-200 text-[#173B63] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#EEF3F7] hover:bg-slate-200 disabled:opacity-40 text-[#173B63] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-[#5B6B7A] font-mono">
            Step {currentStep} of {steps.length}
          </span>

          <button
            onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
            disabled={currentStep === 7}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#173B63] hover:bg-[#102A43] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
