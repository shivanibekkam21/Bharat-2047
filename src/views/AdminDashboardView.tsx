import React, { useState } from 'react';
import { Region, DimensionWeights } from '../types';
import { CSV_TEMPLATE_HEADER, CSV_SAMPLE_ROWS, validateAndParseRegionalCSV, CSVValidationResult } from '../services/csvValidator';
import { runBharatTestSuite, TestSuiteSummary } from '../services/testSuite';
import { Upload, Download, CheckCircle2, AlertTriangle, Play, RefreshCw, Sliders, Trash2 } from 'lucide-react';

interface AdminDashboardViewProps {
  regions: Region[];
  weights: DimensionWeights;
  onUpdateWeights: (newWeights: DimensionWeights) => void;
  onImportRegions: (newRegions: Region[]) => void;
  onResetData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  regions,
  weights,
  onUpdateWeights,
  onImportRegions,
  onResetData
}) => {
  const [csvInput, setCsvInput] = useState('');
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null);
  const [testSummary, setTestSummary] = useState<TestSuiteSummary | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [localWeights, setLocalWeights] = useState<DimensionWeights>({ ...weights });
  const [successMessage, setSuccessMessage] = useState('');

  const handleValidateCSV = () => {
    if (!csvInput.trim()) return;
    const res = validateAndParseRegionalCSV(csvInput);
    setValidationResult(res);
  };

  const handleApplyCSV = () => {
    if (!validationResult || validationResult.validCount === 0) return;
    onImportRegions(validationResult.validRegions as Region[]);
    setSuccessMessage(`Successfully ingested ${validationResult.validCount} valid district records!`);
    setCsvInput('');
    setValidationResult(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleLoadSampleCSV = () => {
    setCsvInput(CSV_SAMPLE_ROWS);
    const res = validateAndParseRegionalCSV(CSV_SAMPLE_ROWS);
    setValidationResult(res);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE_HEADER + '\n' + CSV_SAMPLE_ROWS], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bharat_2047_regional_data_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const summary = runBharatTestSuite(regions);
      setTestSummary(summary);
      setIsTesting(false);
    }, 200);
  };

  const handleSaveWeights = () => {
    onUpdateWeights(localWeights);
    setSuccessMessage('Updated multi-dimensional policy weights successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008C95]" />
            System Administration & Policy Parameters
          </div>
          <h2 className="text-2xl font-bold text-[#173B63] mt-1">
            Data Ingestion & Model Calibration Console
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
            Upload regional datasets via CSV with automatic schema and range validation, configure multi-dimensional index weights, and execute automated regression tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#EEF3F7] text-[#173B63] border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#2E8B57] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* CSV Ingestion Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#173B63]">Regional Data Import (CSV)</h3>
            <p className="text-xs text-[#5B6B7A]">
              Paste or upload CSV text. Validates mandatory columns, population integers, and 0–100 index constraints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSampleCSV}
              className="px-3 py-1.5 bg-[#EEF3F7] hover:bg-slate-200 text-[#173B63] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Load Sample CSV
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EEF3F7] text-[#173B63] border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#008C95]" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="space-y-2">
          <textarea
            rows={5}
            placeholder={`Paste CSV data here...\nExample:\ndistrict,state,population,literacy_rate,agriculture_index,manufacturing_index,digital_connectivity\nMeerut,Uttar Pradesh,3443689,72.8,74,78,79`}
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full p-3 bg-[#EEF3F7] border border-slate-200 rounded-lg text-xs font-mono text-[#172B4D] placeholder-[#8795A1] focus:outline-none focus:border-[#008C95]"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleValidateCSV}
              disabled={!csvInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173B63] hover:bg-[#102A43] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Validate Dataset</span>
            </button>
            {validationResult && validationResult.validCount > 0 && (
              <button
                onClick={handleApplyCSV}
                className="px-4 py-2 bg-[#2E8B57] hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Ingest {validationResult.validCount} Valid Districts
              </button>
            )}
          </div>
        </div>

        {/* Validation Result Inspection Card */}
        {validationResult && (
          <div className="p-4 rounded-xl border border-slate-200 bg-[#EEF3F7] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#173B63]">{validationResult.summaryMessage}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                validationResult.errorCount === 0 ? 'bg-emerald-100 text-[#2E8B57]' : 'bg-amber-100 text-[#D97706]'
              }`}>
                {validationResult.errorCount === 0 ? 'Validation Passed' : 'Corrections Required'}
              </span>
            </div>

            {/* Error List with Line Numbers */}
            {validationResult.errors.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                <span className="font-semibold text-[#DC4C4C] block text-[11px] uppercase tracking-wider">
                  Validation Errors Pinpointed:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1 font-mono text-[11px]">
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="p-2 bg-rose-50 border border-rose-200 rounded text-[#DC4C4C]">
                      {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configurable Development Index Weights Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#173B63]">Configurable Policy Dimension Weights</h3>
            <p className="text-xs text-[#5B6B7A]">
              Adjust policy priority weights used to calculate the Prototype Development Index across all regions.
            </p>
          </div>
          <button
            onClick={handleSaveWeights}
            className="px-4 py-1.5 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Apply New Weights
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Human Capital</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.humanCapital * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={localWeights.humanCapital}
              onChange={(e) => setLocalWeights({ ...localWeights, humanCapital: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Infrastructure</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.infrastructure * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={localWeights.infrastructure}
              onChange={(e) => setLocalWeights({ ...localWeights, infrastructure: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Economic Activity</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.economicActivity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={localWeights.economicActivity}
              onChange={(e) => setLocalWeights({ ...localWeights, economicActivity: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Employment</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.employment * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={localWeights.employment}
              onChange={(e) => setLocalWeights({ ...localWeights, employment: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Digital Readiness</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.digitalReadiness * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={localWeights.digitalReadiness}
              onChange={(e) => setLocalWeights({ ...localWeights, digitalReadiness: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Social Infrastructure</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.socialInfrastructure * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={localWeights.socialInfrastructure}
              onChange={(e) => setLocalWeights({ ...localWeights, socialInfrastructure: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#172B4D]">Sustainability</span>
              <span className="font-mono font-bold text-[#008C95]">{(localWeights.sustainability * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={localWeights.sustainability}
              onChange={(e) => setLocalWeights({ ...localWeights, sustainability: Number(e.target.value) })}
              className="w-full accent-[#008C95] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Automated Test Suite Execution Console */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#173B63]">Automated Pipeline Regression Suite</h3>
            <p className="text-xs text-[#5B6B7A]">
              Executes automated test cases for data validation, development index scoring, ML clustering, and scenario simulation.
            </p>
          </div>
          <button
            onClick={handleRunTests}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#008C95] hover:bg-[#00747b] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTesting ? 'Running Asserts...' : 'Run Automated Tests'}</span>
          </button>
        </div>

        {testSummary && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-4 p-3 bg-[#EEF3F7] rounded-lg border border-slate-200 font-mono tabular-nums">
              <div>
                <span className="text-[#5B6B7A] font-sans block text-[11px] font-medium">Total Tests</span>
                <span className="font-bold text-[#173B63] text-sm">{testSummary.total}</span>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-[#5B6B7A] font-sans block text-[11px] font-medium">Passed</span>
                <span className="font-bold text-[#2E8B57] text-sm">{testSummary.passed}</span>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-[#5B6B7A] font-sans block text-[11px] font-medium">Failed</span>
                <span className="font-bold text-[#DC4C4C] text-sm">{testSummary.failed}</span>
              </div>
              <div className="ml-auto text-[11px] text-[#5B6B7A] font-sans">
                Status: <span className="font-semibold text-[#2E8B57]">{testSummary.failed === 0 ? 'All Test Suites Green' : 'Failures Detected'}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 font-mono text-[11px] border border-slate-200 rounded-lg overflow-hidden">
              {testSummary.results.map((res, i) => (
                <div key={i} className="p-2.5 flex items-center justify-between bg-white hover:bg-[#EEF3F7]/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${res.passed ? 'bg-[#2E8B57]' : 'bg-[#DC4C4C]'}`} />
                    <span className="text-[#5B6B7A] font-sans font-medium">[{res.suite}]</span>
                    <span className="font-semibold text-[#172B4D]">{res.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5B6B7A]">
                    <span>{res.durationMs}ms</span>
                    <span className={res.passed ? 'text-[#2E8B57] font-semibold font-sans' : 'text-[#DC4C4C] font-sans'}>
                      {res.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
