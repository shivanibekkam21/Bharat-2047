import React from 'react';
import { DATA_SOURCES } from '../data/sampleRegions';
import { ShieldCheck, Database, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#008C95]" />
          Methodological Transparency
        </div>
        <h2 className="text-2xl font-bold text-[#173B63] mt-1">
          About Bharat 2047 & Data Source Integrity
        </h2>
        <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
          Open architectural documentation, mathematical formulation, and official public data citations grounding regional indicators.
        </p>
      </div>

      {/* Ethical Statement & Boundary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#173B63]" />
        <div className="flex items-center gap-2 text-[#173B63] font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-[#008C95]" />
          <span>Core Ethical Charter & Responsible AI Guardrails</span>
        </div>
        <p className="text-xs text-[#5B6B7A] leading-relaxed">
          Bharat 2047 is designed as an <span className="font-semibold text-[#173B63]">AI-powered decision-support prototype</span> for researchers, regional planners, students, and entrepreneurs.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#172B4D] pt-1">
          <li className="p-2.5 bg-[#EEF3F7] rounded-lg border border-slate-200 flex items-start gap-2">
            <span className="text-[#008C95] font-bold">•</span>
            <span>Does not claim to perfectly predict India’s exact 2047 macroeconomic GDP.</span>
          </li>
          <li className="p-2.5 bg-[#EEF3F7] rounded-lg border border-slate-200 flex items-start gap-2">
            <span className="text-[#008C95] font-bold">•</span>
            <span>Does not replace elected government planners or statutory master-planning processes.</span>
          </li>
          <li className="p-2.5 bg-[#EEF3F7] rounded-lg border border-slate-200 flex items-start gap-2">
            <span className="text-[#008C95] font-bold">•</span>
            <span>All recommendations explicitly present both positive factors and structural bottlenecks.</span>
          </li>
          <li className="p-2.5 bg-[#EEF3F7] rounded-lg border border-slate-200 flex items-start gap-2">
            <span className="text-[#008C95] font-bold">•</span>
            <span>All indicators are normalized against empirical public statistical publications.</span>
          </li>
        </ul>
      </div>

      {/* Data Sources Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#173B63]">Authoritative Public Data Sources</h3>
            <p className="text-xs text-[#5B6B7A]">
              Grounding indicators in official Government of India and ministerial datasets.
            </p>
          </div>
          <span className="text-xs text-[#008C95] font-mono font-semibold">
            {DATA_SOURCES.length} Primary Datasets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#102A43] text-white font-medium">
                <th className="py-3 px-4">Indicator Dimension</th>
                <th className="py-3 px-3">Publishing Agency</th>
                <th className="py-3 px-3">Reference Period</th>
                <th className="py-3 px-3">Geographic Granularity</th>
                <th className="py-3 px-4">Methodology Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {DATA_SOURCES.map((src) => (
                <tr key={src.indicator} className="hover:bg-[#EEF3F7]/50">
                  <td className="py-3 px-4 font-sans font-semibold text-[#173B63]">
                    {src.indicator}
                  </td>
                  <td className="py-3 px-3 font-sans text-[#172B4D]">
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-[#008C95] hover:text-[#173B63] hover:underline"
                    >
                      <span>{src.sourceName}</span>
                      <ExternalLink className="w-3 h-3 text-[#8795A1]" />
                    </a>
                  </td>
                  <td className="py-3 px-3 text-[#5B6B7A]">
                    {src.year}
                  </td>
                  <td className="py-3 px-3 font-sans text-[#5B6B7A]">
                    {src.geographicLevel}
                  </td>
                  <td className="py-3 px-4 font-sans text-[#5B6B7A] max-w-xs leading-relaxed">
                    {src.methodologyNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
