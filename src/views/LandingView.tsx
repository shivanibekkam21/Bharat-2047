import React from 'react';
import { ArrowRight, Compass, Cpu, TrendingUp, Users, ShieldCheck, Sparkles, Layers, Activity } from 'lucide-react';
import { Region, RegionalScores } from '../types';

interface LandingViewProps {
  onExploreIndia: () => void;
  onAnalyzeRegion: () => void;
  onRunSimulator: () => void;
  onLaunchDemo: () => void;
  regions: Region[];
  scoresMap: Record<string, RegionalScores>;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onExploreIndia,
  onAnalyzeRegion,
  onRunSimulator,
  onLaunchDemo,
  regions,
  scoresMap
}) => {
  const totalDistricts = regions.length;
  const avgDevelopmentIndex = Math.round(
    Object.values(scoresMap).reduce((acc, s) => acc + s.developmentIndex, 0) / (totalDistricts || 1)
  );
  const totalPopulationMillion = Math.round(
    regions.reduce((acc, r) => acc + r.population, 0) / 1000000
  );

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section with Sophisticated Navy/Teal Architectural Framing */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] p-8 md:p-12 shadow-sm">
        {/* Subtle background network pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#173B63_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Soft top gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#173B63] via-[#008C95] to-[#F59E0B]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          <div className="lg:col-span-7 space-y-6">
            {/* National Initiative Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#173B63] bg-[#EEF3F7] border border-[#CBD5E1] px-3 py-1.5 rounded-lg shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#008C95]" />
              <span>National Regional Development & Opportunity Intelligence</span>
              <span className="text-[#8795A1]" aria-hidden="true">·</span>
              <span className="font-mono text-[#008C95] tabular-nums">Mission 2047</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black text-[#173B63] tracking-tight text-balance leading-tight">
                Bharat <span className="text-[#008C95]">2047</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-[#172B4D]">
                Find the Potential. Build the Opportunity. Develop India.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#5B6B7A] leading-relaxed max-w-2xl text-balance">
              An AI-powered regional development intelligence platform for exploring India's development potential, identifying opportunities, creating employment pathways, and modelling possible futures.
            </p>

            {/* CTAs with strict button hierarchy */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary button: Deep Navy #173B63 */}
              <button
                onClick={onExploreIndia}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <Compass className="w-4 h-4 text-[#8EC5CC]" />
                <span>Explore India</span>
              </button>

              {/* Secondary button: White with Navy border */}
              <button
                onClick={onAnalyzeRegion}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#EEF3F7] text-[#173B63] border border-[#173B63]/40 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <span>Analyze a Region</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#008C95]" />
              </button>

              {/* Secondary / AI button: Teal #008C95 */}
              <button
                onClick={onRunSimulator}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#008C95] hover:bg-[#00767E] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <TrendingUp className="w-4 h-4 text-white" />
                <span>Run 2047 Simulation</span>
              </button>
            </div>

            {/* Micro proof strip */}
            <div className="pt-4 border-t border-[#EEF3F7] flex flex-wrap items-center gap-6 text-xs text-[#5B6B7A] font-mono tabular-nums">
              <div>
                <span className="font-extrabold text-[#173B63] text-base block">{totalDistricts}</span>
                <span className="font-sans text-[11px] text-[#5B6B7A]">Calibrated Districts</span>
              </div>
              <div className="h-6 w-px bg-[#CBD5E1]" />
              <div>
                <span className="font-extrabold text-[#008C95] text-base block">{avgDevelopmentIndex}/100</span>
                <span className="font-sans text-[11px] text-[#5B6B7A]">Average Development Index</span>
              </div>
              <div className="h-6 w-px bg-[#CBD5E1]" />
              <div>
                <span className="font-extrabold text-[#173B63] text-base block">{totalPopulationMillion}M+</span>
                <span className="font-sans text-[11px] text-[#5B6B7A]">Population Represented</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-xl overflow-hidden border border-[#CBD5E1] shadow-md aspect-video lg:aspect-4/3 bg-[#EEF3F7]">
              <img
                src="/src/assets/images/bharat_hero_landscape_1792904548668.jpg"
                alt="Panoramic view of sustainable Indian regional development infrastructure"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-[11px] text-[#5B6B7A] font-medium">
                Multimodal freight, agro-processing, and clean energy transition corridor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Four Major Pillars Section */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#173B63]">Core Foundations</span>
          </div>
          <h2 className="text-2xl font-black text-[#173B63] mt-1">Four Strategic Pillars of Regional Transformation</h2>
          <p className="text-xs text-[#5B6B7A] mt-1 leading-relaxed">
            Every district recommendation synthesizes empirical indicators across four balanced dimensions to avoid GDP-only development blindspots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Human Capital */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3 card-hover-lift border-t-3 border-t-[#173B63]">
            <div className="w-10 h-10 rounded-lg bg-[#EEF3F7] text-[#173B63] flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-[#173B63]" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">Human Capital</h3>
            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Literacy, higher education access, youth demographic dividend, and women's formal workforce participation.
            </p>
            <div className="pt-2 text-[11px] text-[#8795A1] border-t border-[#EEF3F7] font-medium">
              Source: PLFS & UDISE+
            </div>
          </div>

          {/* Pillar 2: Economic Development */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3 card-hover-lift border-t-3 border-t-[#008C95]">
            <div className="w-10 h-10 rounded-lg bg-[#DCEAF2] text-[#008C95] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-[#008C95]" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">Economic Development</h3>
            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Manufacturing complexity, MSME cluster density, services diversification, and export competitiveness.
            </p>
            <div className="pt-2 text-[11px] text-[#8795A1] border-t border-[#EEF3F7] font-medium">
              Source: DPIIT & Udyam
            </div>
          </div>

          {/* Pillar 3: Infrastructure */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3 card-hover-lift border-t-3 border-t-[#173B63]">
            <div className="w-10 h-10 rounded-lg bg-[#EEF3F7] text-[#173B63] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-[#173B63]" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">Infrastructure</h3>
            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              PM GatiShakti multi-modal highways, railway freight corridors, 24/7 industrial power, and gigabit digital connectivity.
            </p>
            <div className="pt-2 text-[11px] text-[#8795A1] border-t border-[#EEF3F7] font-medium">
              Source: MoRTH & CEA
            </div>
          </div>

          {/* Pillar 4: Sustainability */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3 card-hover-lift border-t-3 border-t-[#2E8B57]">
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#2E8B57] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#2E8B57]" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">Sustainability</h3>
            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Renewable solar/wind potential, groundwater security, circular economy, and low environmental ecological stress.
            </p>
            <div className="pt-2 text-[11px] text-[#8795A1] border-t border-[#EEF3F7] font-medium">
              Source: MNRE & CGWB
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section: End-to-End Decision Support Pipeline (#102A43) */}
      <section className="bg-[#102A43] text-white rounded-2xl p-8 md:p-10 border border-[#1E3E5F] shadow-lg relative overflow-hidden">
        <div className="max-w-2xl mb-8 relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">Rigorous Methodology</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">End-to-End Decision Support Pipeline</h2>
          <p className="text-xs text-[#8EC5CC] mt-1 leading-relaxed">
            Every recommendation is calculated from underlying empirical data. No predetermined static AI responses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs relative">
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#F59E0B] font-mono text-[11px] font-bold">01 · Data Ingestion</div>
            <div className="font-bold text-white">Validation & Normalization</div>
            <p className="text-[#8EC5CC] text-[11px]">Range checks (0–100), missing value auditing, z-score standardization.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#F59E0B] font-mono text-[11px] font-bold">02 · Index Scoring</div>
            <div className="font-bold text-white">Multi-Dimension Index</div>
            <p className="text-[#8EC5CC] text-[11px]">Weighted scoring across 7 dimensions with configurable policy weights.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#008C95] font-mono text-[11px] font-bold">03 · ML Clustering</div>
            <div className="font-bold text-white">K-Means Typology</div>
            <p className="text-[#8EC5CC] text-[11px]">Unsupervised classification into distinct regional economic typologies.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#008C95] font-mono text-[11px] font-bold">04 · AI Opportunity Engine</div>
            <div className="font-bold text-white">Explainable Matching</div>
            <p className="text-[#8EC5CC] text-[11px]">Ranks 16 sectors with explicit positive factors and infrastructure gaps.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#2E8B57] font-mono text-[11px] font-bold">05 · Skills & Jobs</div>
            <div className="font-bold text-white">Labor Market Mapping</div>
            <p className="text-[#8EC5CC] text-[11px]">Maps required skills, certifications, and entrepreneurship models.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#008C95] font-mono text-[11px] font-bold">06 · 2047 Simulator</div>
            <div className="font-bold text-white">Scenario Modeling</div>
            <p className="text-[#8EC5CC] text-[11px]">Evaluates cross-elastic impacts of policy interventions before vs after.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#008C95] font-mono text-[11px] font-bold">07 · Multi-Scenario Compare</div>
            <div className="font-bold text-white">Impact Trade-offs</div>
            <p className="text-[#8EC5CC] text-[11px]">Compares Scenario A, B, and C side-by-side across sustainability and jobs.</p>
          </div>
          <div className="p-4 bg-[#173B63]/90 rounded-xl border border-[#2A527A] space-y-1.5">
            <div className="text-[#F59E0B] font-mono text-[11px] font-bold">08 · Action Roadmap</div>
            <div className="font-bold text-white">4-Phase 2026–2047 Plan</div>
            <p className="text-[#8EC5CC] text-[11px]">Generates an editable strategic timeline and downloadable PDF report.</p>
          </div>
        </div>
      </section>

      {/* Expo Demo Invitation Card with Saffron Highlight */}
      <section className="bg-white border-2 border-[#F59E0B]/30 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-base font-bold text-[#173B63]">
              Interactive Innovation-Expo Walkthrough
            </h3>
          </div>
          <p className="text-xs text-[#5B6B7A] max-w-2xl leading-relaxed">
            Experience the complete Bharat 2047 analytical pipeline in a guided 3–5 minute evaluation tour: select a district, inspect ML clusters, examine explainable recommendations, run 2047 policy simulations, and generate the final report.
          </p>
        </div>
        <button
          onClick={onLaunchDemo}
          className="px-5 py-3 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm hover:shadow-md border-b-2 border-[#F59E0B]"
        >
          Launch 3-Minute Demo Tour
        </button>
      </section>
    </div>
  );
};
