import React, { useState, useMemo } from 'react';
import { Region, SimulationParameters, SimulationResult, SavedScenario } from '../types';
import { simulateScenario } from '../services/analyticsEngine';
import { RadarChart } from '../components/RadarChart';
import { BarComparisonChart, ComparisonBarItem } from '../components/BarComparisonChart';
import { DEMO_SCENARIO_PRESETS } from '../data/defaultConfig';
import { Play, RotateCcw, BookmarkPlus, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ScenarioSimulatorViewProps {
  region: Region;
  allRegions: Region[];
  onSelectRegion: (id: string) => void;
}

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({
  region,
  allRegions,
  onSelectRegion
}) => {
  const [params, setParams] = useState<SimulationParameters>({
    roadConnectivityDelta: 16,
    digitalConnectivityDelta: 14,
    industrialInvestmentDelta: 18,
    skillDevelopmentDelta: 20,
    renewableEnergyDelta: 15,
    healthcareAccessDelta: 10,
    msmeClusterFocus: 20,
    tourismPromotion: 8
  });

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [scenarioNameInput, setScenarioNameInput] = useState('');

  // Calculate simulation result
  const simulationResult: SimulationResult = useMemo(() => {
    return simulateScenario(region, params);
  }, [region, params]);

  const handleSliderChange = (key: keyof SimulationParameters, value: number) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyPreset = (presetParams: SimulationParameters) => {
    setParams({ ...presetParams });
  };

  const handleReset = () => {
    setParams({
      roadConnectivityDelta: 0,
      digitalConnectivityDelta: 0,
      industrialInvestmentDelta: 0,
      skillDevelopmentDelta: 0,
      renewableEnergyDelta: 0,
      healthcareAccessDelta: 0,
      msmeClusterFocus: 0,
      tourismPromotion: 0
    });
  };

  const handleSaveCurrentScenario = () => {
    if (savedScenarios.length >= 3) {
      return; // max 3 scenarios
    }
    const name = scenarioNameInput.trim() || `Scenario ${String.fromCharCode(65 + savedScenarios.length)}`;
    const newSaved: SavedScenario = {
      id: `scen_${Date.now()}`,
      name,
      regionId: region.id,
      regionName: `${region.district}, ${region.state}`,
      description: `Modelled under +${params.industrialInvestmentDelta}% industry and +${params.roadConnectivityDelta}% road infrastructure.`,
      parameters: { ...params },
      results: simulationResult,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSavedScenarios([...savedScenarios, newSaved]);
    setScenarioNameInput('');
  };

  const handleDeleteScenario = (id: string) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
  };

  // Prepare Bar chart data comparing baseline and scenarios
  const barChartItems: ComparisonBarItem[] = [
    {
      label: 'Development Index',
      baseline: simulationResult.baseline.developmentIndex,
      scenario: simulationResult.scenario.developmentIndex,
      scenarioB: savedScenarios[0]?.results.scenario.developmentIndex,
      scenarioC: savedScenarios[1]?.results.scenario.developmentIndex
    },
    {
      label: 'Human Capital',
      baseline: simulationResult.baseline.humanCapitalIndex,
      scenario: simulationResult.scenario.humanCapitalIndex,
      scenarioB: savedScenarios[0]?.results.scenario.humanCapitalIndex,
      scenarioC: savedScenarios[1]?.results.scenario.humanCapitalIndex
    },
    {
      label: 'Infrastructure',
      baseline: simulationResult.baseline.infrastructureIndex,
      scenario: simulationResult.scenario.infrastructureIndex,
      scenarioB: savedScenarios[0]?.results.scenario.infrastructureIndex,
      scenarioC: savedScenarios[1]?.results.scenario.infrastructureIndex
    },
    {
      label: 'Economic Activity',
      baseline: simulationResult.baseline.economicIndex,
      scenario: simulationResult.scenario.economicIndex,
      scenarioB: savedScenarios[0]?.results.scenario.economicIndex,
      scenarioC: savedScenarios[1]?.results.scenario.economicIndex
    },
    {
      label: 'Employment Index',
      baseline: simulationResult.baseline.employmentIndex,
      scenario: simulationResult.scenario.employmentIndex,
      scenarioB: savedScenarios[0]?.results.scenario.employmentIndex,
      scenarioC: savedScenarios[1]?.results.scenario.employmentIndex
    },
    {
      label: 'Sustainability',
      baseline: simulationResult.baseline.sustainabilityIndex,
      scenario: simulationResult.scenario.sustainabilityIndex,
      scenarioB: savedScenarios[0]?.results.scenario.sustainabilityIndex,
      scenarioC: savedScenarios[1]?.results.scenario.sustainabilityIndex
    }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header and Region Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008C95]" />
            Predictive Decision Support
          </div>
          <h2 className="text-2xl font-bold text-[#173B63] mt-1">
            2047 Regional Development Scenario Simulator
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
            Adjust policy and infrastructure investment levers to simulate developmental shifts across economic, human capital, and ecological indices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="simulator-region-select" className="text-xs font-semibold text-[#173B63]">Target Region:</label>
          <select
            id="simulator-region-select"
            value={region.id}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#173B63] focus:outline-none focus:border-[#008C95] shadow-xs cursor-pointer"
          >
            {allRegions.map(r => (
              <option key={r.id} value={r.id}>{r.district} ({r.state})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Ethical Notice */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#D97706]">Modelled Scenario — Not a Guaranteed Forecast: </span>
          <span className="text-[#172B4D]">
            These simulations are computational sensitivity models designed for exploratory planning and policy deliberation. They illustrate structural trends under elastic investment assumptions rather than predicting India’s exact 2047 GDP or employment figures.
          </span>
        </div>
      </div>

      {/* Presets Strip */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-semibold text-[#173B63]">Exploratory Presets:</span>
        {DEMO_SCENARIO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleApplyPreset(preset.parameters)}
            className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-[#EEF3F7] text-[#173B63] border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs hover:border-[#008C95]"
          >
            {preset.name}
          </button>
        ))}
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#5B6B7A] hover:text-[#173B63] cursor-pointer ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Main Grid: Control Sliders (Left) vs Real-Time Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Console */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#173B63]">Intervention Levers</h3>
            <span className="text-xs text-[#008C95] font-mono font-semibold">0% to +35% Scale</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Road Connectivity */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Road & Highway Logistics Upgrade</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.roadConnectivityDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.roadConnectivityDelta}
                onChange={(e) => handleSliderChange('roadConnectivityDelta', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* Digital Connectivity */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Digital Gigabit Fiber & 5G Connectivity</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.digitalConnectivityDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.digitalConnectivityDelta}
                onChange={(e) => handleSliderChange('digitalConnectivityDelta', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* Industrial Investment */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Industrial Manufacturing & Parks</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.industrialInvestmentDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.industrialInvestmentDelta}
                onChange={(e) => handleSliderChange('industrialInvestmentDelta', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* Skill Development */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Vocational Skilling & Higher Education Hubs</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.skillDevelopmentDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.skillDevelopmentDelta}
                onChange={(e) => handleSliderChange('skillDevelopmentDelta', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* MSME & Food Clusters */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">MSME / Agro-Processing Cluster Focus</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.msmeClusterFocus}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.msmeClusterFocus}
                onChange={(e) => handleSliderChange('msmeClusterFocus', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* Renewable Energy */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Renewable Solar / Wind Energy Parks</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.renewableEnergyDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.renewableEnergyDelta}
                onChange={(e) => handleSliderChange('renewableEnergyDelta', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* Healthcare Access */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Healthcare Infrastructure Expansion</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.healthcareAccessDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.healthcareAccessDelta}
                onChange={(e) => handleSliderChange('healthcareAccessDelta', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>

            {/* Tourism & Cultural Promotion */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#172B4D]">Cultural & Eco-Tourism Promotion</span>
                <span className="font-bold font-mono text-[#008C95]">+{params.tourismPromotion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={params.tourismPromotion}
                onChange={(e) => handleSliderChange('tourismPromotion', Number(e.target.value))}
                className="w-full accent-[#008C95] cursor-pointer"
              />
            </div>
          </div>

          {/* Save Scenario Box */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-[#173B63] uppercase tracking-wider">
              Save Simulation for Comparison (Max 3)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Scenario label (e.g. Green Corridor)"
                value={scenarioNameInput}
                onChange={(e) => setScenarioNameInput(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#EEF3F7] border border-slate-200 rounded-lg text-[#172B4D] placeholder-[#8795A1] focus:outline-none focus:border-[#008C95]"
              />
              <button
                onClick={handleSaveCurrentScenario}
                disabled={savedScenarios.length >= 3}
                className="inline-flex items-center gap-1 px-3 py-2 bg-[#173B63] hover:bg-[#102A43] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Save</span>
              </button>
            </div>
            {savedScenarios.length >= 3 && (
              <span className="text-[11px] text-[#D97706] block">Maximum of 3 comparison scenarios reached.</span>
            )}
          </div>
        </div>

        {/* Real-Time Scenario Results Panel */}
        <div className="lg:col-span-7 space-y-5">
          {/* Delta Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Development Index Shift */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#008C95]" />
              <div className="text-[11px] font-semibold text-[#5B6B7A]">Development Index</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-mono text-[#8795A1] line-through">
                  {simulationResult.baseline.developmentIndex}
                </span>
                <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">
                  {simulationResult.scenario.developmentIndex}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#2E8B57] mt-1 flex items-center gap-1 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{simulationResult.deltas.developmentIndex} pts ({simulationResult.scenario.category})</span>
              </div>
            </div>

            {/* Employment Shift */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
              <div className="text-[11px] font-semibold text-[#5B6B7A]">Employment Index</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-mono text-[#8795A1] line-through">
                  {simulationResult.baseline.employmentIndex}
                </span>
                <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">
                  {simulationResult.scenario.employmentIndex}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#2E8B57] mt-1 flex items-center gap-1 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{simulationResult.deltas.employmentIndex} pts</span>
              </div>
            </div>

            {/* Sustainability Shift */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E8B57]" />
              <div className="text-[11px] font-semibold text-[#5B6B7A]">Sustainability Index</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-mono text-[#8795A1] line-through">
                  {simulationResult.baseline.sustainabilityIndex}
                </span>
                <span className="text-2xl font-black font-mono tabular-nums text-[#173B63]">
                  {simulationResult.scenario.sustainabilityIndex}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#2E8B57] mt-1 flex items-center gap-1 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{simulationResult.deltas.sustainabilityIndex} pts</span>
              </div>
            </div>
          </div>

          {/* Modelled Macro Projections */}
          <div className="bg-[#EEF3F7] rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[#5B6B7A] block text-[11px] font-medium">Modelled Employment Expansion</span>
              <span className="font-bold text-[#173B63] text-sm font-mono tabular-nums">
                +{simulationResult.projectedEmploymentGrowthPct}% Growth
              </span>
            </div>
            <div>
              <span className="text-[#5B6B7A] block text-[11px] font-medium">Potential Micro-Enterprises</span>
              <span className="font-bold text-[#173B63] text-sm font-mono tabular-nums">
                +{simulationResult.projectedNewEnterprises.toLocaleString()} Units
              </span>
            </div>
            <div>
              <span className="text-[#5B6B7A] block text-[11px] font-medium">Primary Gaining Sector</span>
              <span className="font-bold text-[#008C95] text-sm">
                {simulationResult.topGainerSectors[0]}
              </span>
            </div>
          </div>

          {/* Comparison Bar Visualization */}
          <BarComparisonChart
            items={barChartItems}
            title="Multi-Indicator Shift: Baseline vs Modelled Scenarios"
            labels={{
              baseline: 'Current Baseline',
              scenario: 'Active Simulator',
              scenarioB: savedScenarios[0]?.name,
              scenarioC: savedScenarios[1]?.name
            }}
          />

          {/* Radar Overlay: Baseline vs Active Scenario */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col items-center">
            <h4 className="text-sm font-bold text-[#173B63] w-full pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Dimensional Expansion Profile</span>
              <span className="text-xs text-[#008C95] font-mono">Radar Projection</span>
            </h4>
            <RadarChart
              primaryScores={simulationResult.baseline}
              primaryLabel="Baseline"
              secondaryScores={simulationResult.scenario}
              secondaryLabel="Modelled 2047 Scenario"
              size={320}
            />
          </div>
        </div>
      </div>

      {/* Multi-Scenario Comparison Matrix */}
      {savedScenarios.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#173B63]">Multi-Scenario Trade-off Matrix</h3>
              <p className="text-xs text-[#5B6B7A]">
                Comparative evaluation across saved policy scenarios for {region.district}.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
              <thead>
                <tr className="bg-[#102A43] text-white font-sans font-medium">
                  <th className="py-2.5 px-3 rounded-tl-lg">Indicator / Dimension</th>
                  <th className="py-2.5 px-3">Baseline</th>
                  {savedScenarios.map((s, idx) => (
                    <th key={s.id} className={`py-2.5 px-3 ${idx === savedScenarios.length - 1 ? 'rounded-tr-lg' : ''}`}>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#8EC5CC] font-semibold">{s.name}</span>
                        <button
                          onClick={() => handleDeleteScenario(s.id)}
                          className="text-slate-400 hover:text-white cursor-pointer font-sans"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-[#EEF3F7]/50">
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#173B63]">Development Index</td>
                  <td className="py-2.5 px-3 text-[#5B6B7A]">{simulationResult.baseline.developmentIndex}</td>
                  {savedScenarios.map(s => (
                    <td key={s.id} className="py-2.5 px-3 font-bold text-[#2E8B57]">
                      {s.results.scenario.developmentIndex}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#EEF3F7]/50">
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#173B63]">Employment Index</td>
                  <td className="py-2.5 px-3 text-[#5B6B7A]">{simulationResult.baseline.employmentIndex}</td>
                  {savedScenarios.map(s => (
                    <td key={s.id} className="py-2.5 px-3 text-[#172B4D] font-semibold">
                      {s.results.scenario.employmentIndex}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#EEF3F7]/50">
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#173B63]">Infrastructure Index</td>
                  <td className="py-2.5 px-3 text-[#5B6B7A]">{simulationResult.baseline.infrastructureIndex}</td>
                  {savedScenarios.map(s => (
                    <td key={s.id} className="py-2.5 px-3 text-[#172B4D] font-semibold">
                      {s.results.scenario.infrastructureIndex}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#EEF3F7]/50">
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#173B63]">Economic Index</td>
                  <td className="py-2.5 px-3 text-[#5B6B7A]">{simulationResult.baseline.economicIndex}</td>
                  {savedScenarios.map(s => (
                    <td key={s.id} className="py-2.5 px-3 text-[#172B4D] font-semibold">
                      {s.results.scenario.economicIndex}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#EEF3F7]/50">
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#173B63]">Sustainability Index</td>
                  <td className="py-2.5 px-3 text-[#5B6B7A]">{simulationResult.baseline.sustainabilityIndex}</td>
                  {savedScenarios.map(s => (
                    <td key={s.id} className="py-2.5 px-3 text-[#172B4D] font-semibold">
                      {s.results.scenario.sustainabilityIndex}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Trade-off synthesis comment */}
          <div className="p-3 bg-[#EEF3F7] border border-slate-200 rounded-lg text-xs text-[#172B4D]">
            <span className="font-semibold text-[#173B63]">Trade-Off Synthesis: </span>
            <span className="text-[#5B6B7A]">
              Scenarios emphasizing infrastructure produce rapid gains in logistics and manufacturing, whereas agro-processing and skilling interventions maximize broad-based rural wage distribution and youth retention.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
