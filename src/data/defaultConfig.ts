import type { DimensionWeights, DevelopmentCategoryConfig, SimulationParameters } from '../types/index.ts';

export const DEFAULT_DIMENSION_WEIGHTS: DimensionWeights = {
  humanCapital: 0.20,
  infrastructure: 0.20,
  economicActivity: 0.20,
  employment: 0.15,
  digitalReadiness: 0.10,
  socialInfrastructure: 0.10,
  sustainability: 0.05
};

export const DEFAULT_CATEGORIES: DevelopmentCategoryConfig = {
  emerging: { min: 0, max: 39, label: 'Emerging' },
  developing: { min: 40, max: 59, label: 'Developing' },
  advancing: { min: 60, max: 74, label: 'Advancing' },
  highPotential: { min: 75, max: 89, label: 'High Potential' },
  veryHigh: { min: 90, max: 100, label: 'Very High Development Readiness' }
};

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  parameters: SimulationParameters;
}

export const DEMO_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'preset_agro_processing',
    name: 'Food Processing & Rural Value Chain',
    tagline: 'Farm-to-fork industrialization',
    description: 'Invests heavily in cold-chain logistics, agro-processing parks, rural roads, and packaging skill programs.',
    parameters: {
      roadConnectivityDelta: 16,
      digitalConnectivityDelta: 12,
      industrialInvestmentDelta: 18,
      skillDevelopmentDelta: 22,
      renewableEnergyDelta: 10,
      healthcareAccessDelta: 8,
      msmeClusterFocus: 25,
      tourismPromotion: 5
    }
  },
  {
    id: 'preset_green_energy',
    name: 'Renewable Power & Sustainable Tech',
    tagline: 'Net-zero regional energy transition',
    description: 'Deploys mega solar/wind hybrid parks, battery storage, clean water access, and green vocational training.',
    parameters: {
      roadConnectivityDelta: 10,
      digitalConnectivityDelta: 15,
      industrialInvestmentDelta: 15,
      skillDevelopmentDelta: 18,
      renewableEnergyDelta: 32,
      healthcareAccessDelta: 12,
      msmeClusterFocus: 12,
      tourismPromotion: 14
    }
  },
  {
    id: 'preset_digital_tech',
    name: 'High-Tech & IT Services Hub',
    tagline: 'Tier-2 digital economy acceleration',
    description: 'Focuses on fiber gigabit connectivity, engineering innovation incubators, electronics assembly, and urban infrastructure.',
    parameters: {
      roadConnectivityDelta: 14,
      digitalConnectivityDelta: 28,
      industrialInvestmentDelta: 22,
      skillDevelopmentDelta: 26,
      renewableEnergyDelta: 12,
      healthcareAccessDelta: 10,
      msmeClusterFocus: 20,
      tourismPromotion: 10
    }
  }
];
