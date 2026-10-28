import React, { useState, useMemo } from 'react';
import { SAMPLE_REGIONS } from './data/sampleRegions';
import { DEFAULT_DIMENSION_WEIGHTS } from './data/defaultConfig';
import { Region, DimensionWeights, RegionalScores } from './types';
import { calculateDimensionScores, detectDevelopmentGaps } from './services/analyticsEngine';
import { rankOpportunities } from './services/mlEngine';
import { Navbar } from './components/Navbar';
import { LandingView } from './views/LandingView';
import { IndiaOverviewView } from './views/IndiaOverviewView';
import { DistrictDashboardView } from './views/DistrictDashboardView';
import { OpportunityEngineView } from './views/OpportunityEngineView';
import { ScenarioSimulatorView } from './views/ScenarioSimulatorView';
import { ClusteringView } from './views/ClusteringView';
import { RegionComparisonView } from './views/RegionComparisonView';
import { YouthPortalView } from './views/YouthPortalView';
import { EntrepreneurPortalView } from './views/EntrepreneurPortalView';
import { ReportGeneratorView } from './views/ReportGeneratorView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ExpoDemoView } from './views/ExpoDemoView';
import { AboutView } from './views/AboutView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeRole, setActiveRole] = useState<'public' | 'youth' | 'entrepreneur' | 'planner'>('public');
  const [regions, setRegions] = useState<Region[]>(() => [...SAMPLE_REGIONS]);
  const [weights, setWeights] = useState<DimensionWeights>(() => ({ ...DEFAULT_DIMENSION_WEIGHTS }));
  const [selectedRegionId, setSelectedRegionId] = useState<string>('reg_up_varanasi');
  const [opportunityMode, setOpportunityMode] = useState<'balanced' | 'rural' | 'urban'>('balanced');
  const [portalTab, setPortalTab] = useState<'youth' | 'entrepreneur'>('youth');

  // Compute multi-dimensional scores for all regions dynamically
  const scoresMap = useMemo(() => {
    const map: Record<string, RegionalScores> = {};
    regions.forEach(r => {
      map[r.id] = calculateDimensionScores(r, weights);
    });
    return map;
  }, [regions, weights]);

  // Active selected region
  const selectedRegion = useMemo(() => {
    return regions.find(r => r.id === selectedRegionId) || regions[0];
  }, [regions, selectedRegionId]);

  const selectedScores = useMemo(() => {
    return scoresMap[selectedRegion.id] || calculateDimensionScores(selectedRegion, weights);
  }, [selectedRegion, scoresMap, weights]);

  const selectedGaps = useMemo(() => {
    return detectDevelopmentGaps(selectedRegion, selectedScores);
  }, [selectedRegion, selectedScores]);

  const selectedOpportunities = useMemo(() => {
    return rankOpportunities(selectedRegion, opportunityMode);
  }, [selectedRegion, opportunityMode]);

  const handleSelectRegion = (id: string) => {
    setSelectedRegionId(id);
  };

  const handleOpenDashboard = (id: string) => {
    setSelectedRegionId(id);
    setCurrentTab('district');
  };

  const handleOpenSimulator = (id: string) => {
    setSelectedRegionId(id);
    setCurrentTab('simulator');
  };

  const handleImportRegions = (newRegions: Region[]) => {
    setRegions(prev => [...prev, ...newRegions]);
  };

  const handleResetData = () => {
    setRegions([...SAMPLE_REGIONS]);
    setWeights({ ...DEFAULT_DIMENSION_WEIGHTS });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col selection:bg-[#173B63] selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={(role) => {
          setActiveRole(role);
          if (role === 'youth') {
            setPortalTab('youth');
            setCurrentTab('portals');
          } else if (role === 'entrepreneur') {
            setPortalTab('entrepreneur');
            setCurrentTab('portals');
          } else if (role === 'planner') {
            setCurrentTab('admin');
          }
        }}
        onLaunchDemo={() => setCurrentTab('demo')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {currentTab === 'landing' && (
          <LandingView
            regions={regions}
            scoresMap={scoresMap}
            onExploreIndia={() => setCurrentTab('overview')}
            onAnalyzeRegion={() => setCurrentTab('district')}
            onRunSimulator={() => setCurrentTab('simulator')}
            onLaunchDemo={() => setCurrentTab('demo')}
          />
        )}

        {currentTab === 'overview' && (
          <IndiaOverviewView
            regions={regions}
            scoresMap={scoresMap}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
            onOpenDashboard={handleOpenDashboard}
            onOpenSimulator={handleOpenSimulator}
          />
        )}

        {currentTab === 'district' && (
          <DistrictDashboardView
            region={selectedRegion}
            scores={selectedScores}
            gaps={selectedGaps}
            allRegions={regions}
            onSelectRegion={handleSelectRegion}
            onNavigateToOpportunities={() => setCurrentTab('opportunities')}
            onNavigateToSimulator={() => setCurrentTab('simulator')}
            onNavigateToReport={() => setCurrentTab('reports')}
            onNavigateToCompare={() => setCurrentTab('compare')}
          />
        )}

        {currentTab === 'opportunities' && (
          <OpportunityEngineView
            region={selectedRegion}
            opportunities={selectedOpportunities}
            mode={opportunityMode}
            onChangeMode={setOpportunityMode}
            onOpenSimulator={() => setCurrentTab('simulator')}
          />
        )}

        {currentTab === 'simulator' && (
          <ScenarioSimulatorView
            region={selectedRegion}
            allRegions={regions}
            onSelectRegion={handleSelectRegion}
          />
        )}

        {currentTab === 'clustering' && (
          <ClusteringView
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
          />
        )}

        {currentTab === 'compare' && (
          <RegionComparisonView
            regions={regions}
            scoresMap={scoresMap}
            onSelectRegion={handleOpenDashboard}
          />
        )}

        {currentTab === 'portals' && (
          <div className="space-y-6">
            <div className="flex items-center gap-1.5 p-1 bg-[#EEF3F7] rounded-xl max-w-sm border border-[#8EC5CC]/40">
              <button
                onClick={() => setPortalTab('youth')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  portalTab === 'youth'
                    ? 'bg-[#173B63] text-white shadow-xs'
                    : 'text-[#5B6B7A] hover:text-[#172B4D] hover:bg-white/60'
                }`}
              >
                Student & Youth Portal
              </button>
              <button
                onClick={() => setPortalTab('entrepreneur')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  portalTab === 'entrepreneur'
                    ? 'bg-[#173B63] text-white shadow-xs'
                    : 'text-[#5B6B7A] hover:text-[#172B4D] hover:bg-white/60'
                }`}
              >
                Entrepreneur Portal
              </button>
            </div>

            {portalTab === 'youth' ? (
              <YouthPortalView regions={regions} onSelectRegion={handleOpenDashboard} />
            ) : (
              <EntrepreneurPortalView regions={regions} onSelectRegion={handleOpenDashboard} />
            )}
          </div>
        )}

        {currentTab === 'reports' && (
          <ReportGeneratorView
            region={selectedRegion}
            scores={selectedScores}
            gaps={selectedGaps}
            allRegions={regions}
            onSelectRegion={handleSelectRegion}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            regions={regions}
            weights={weights}
            onUpdateWeights={setWeights}
            onImportRegions={handleImportRegions}
            onResetData={handleResetData}
          />
        )}

        {currentTab === 'demo' && (
          <ExpoDemoView
            allRegions={regions}
            onExitDemo={() => setCurrentTab('overview')}
            onOpenFullReport={(id) => {
              setSelectedRegionId(id);
              setCurrentTab('reports');
            }}
          />
        )}

        {currentTab === 'about' && <AboutView />}
      </main>

      {/* Subtle Domain Footer */}
      <footer className="border-t border-[#8EC5CC]/40 bg-white py-6 mt-12 text-xs text-[#5B6B7A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[#173B63] text-sm tracking-tight">Bharat 2047</span>
            <span className="text-[#8EC5CC]">|</span>
            <span className="text-[#5B6B7A]">Regional Opportunity Intelligence & Decision-Support System</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentTab('about')} className="hover:text-[#008C95] transition-colors cursor-pointer">
              About & Data Sources
            </button>
            <button onClick={() => setCurrentTab('admin')} className="hover:text-[#008C95] transition-colors cursor-pointer">
              Data Management
            </button>
            <button onClick={() => setCurrentTab('demo')} className="hover:text-[#F59E0B] font-semibold transition-colors cursor-pointer flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
              Expo Demo Tour
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
