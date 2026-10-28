/**
 * Bharat 2047 - Type Definitions
 * Data structures for regional development intelligence, ML clustering,
 * opportunity recommendation, and scenario simulation.
 */

export interface Region {
  id: string;
  country: string;
  state: string;
  district: string;
  coordinates: [number, number]; // [lat, lng] for geospatial mapping
  population: number;
  population_growth: number; // annual percentage
  urban_population_percentage: number;
  rural_population_percentage: number;
  literacy_rate: number;
  higher_education_rate: number;
  youth_population_percentage: number;
  unemployment_rate: number;
  workforce_participation: number;
  women_workforce_participation: number;
  
  // Economic & Sectoral Indices (0-100)
  agriculture_index: number;
  manufacturing_index: number;
  services_index: number;
  tourism_index: number;
  industrial_presence: number;
  msme_presence: number;
  startup_ecosystem: number;
  export_potential: number;

  // Infrastructure & Connectivity (0-100)
  digital_connectivity: number;
  road_connectivity: number;
  railway_connectivity: number;
  logistics_index: number;
  electricity_access: number;

  // Social & Environmental (0-100)
  healthcare_access: number;
  education_access: number;
  water_availability: number;
  renewable_energy_potential: number;
  environmental_stress: number; // lower is better (0=no stress, 100=extreme stress)

  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East';
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Aspirational District';
  updated_at: string;
  notes?: string;
}

export interface DimensionWeights {
  humanCapital: number;    // default 0.20
  infrastructure: number;  // default 0.20
  economicActivity: number;// default 0.20
  employment: number;      // default 0.15
  digitalReadiness: number;// default 0.10
  socialInfrastructure: number; // default 0.10
  sustainability: number;  // default 0.05
}

export interface DevelopmentCategoryConfig {
  emerging: { min: number; max: number; label: string };
  developing: { min: number; max: number; label: string };
  advancing: { min: number; max: number; label: string };
  highPotential: { min: number; max: number; label: string };
  veryHigh: { min: number; max: number; label: string };
}

export interface RegionalScores {
  developmentIndex: number;
  category: string;
  humanCapitalIndex: number;
  infrastructureIndex: number;
  economicIndex: number;
  employmentIndex: number;
  digitalReadinessIndex: number;
  socialIndex: number;
  sustainabilityIndex: number;
  womenEconomicParticipation: number;
}

export interface SectorRequirement {
  agriculture: 'Low' | 'Medium' | 'High';
  manufacturing: 'Low' | 'Medium' | 'High';
  services: 'Low' | 'Medium' | 'High';
  roadConnectivity: 'Low' | 'Medium' | 'High';
  digitalConnectivity: 'Low' | 'Medium' | 'High';
  electricity: 'Low' | 'Medium' | 'High';
  water: 'Low' | 'Medium' | 'High';
  workforce: 'Low' | 'Medium' | 'High';
  higherEducation: 'Low' | 'Medium' | 'High';
  logistics: 'Low' | 'Medium' | 'High';
  renewablePotential: 'Low' | 'Medium' | 'High';
}

export interface JobRole {
  title: string;
  skills: string[];
  education: string;
  training: string;
  careerLevel: 'Entry' | 'Mid-Career' | 'Specialist' | 'Managerial';
  averageSalaryBand: string;
  employmentPotential: 'Moderate' | 'High' | 'Very High';
}

export interface Sector {
  id: string;
  name: string;
  category: 'Primary / Agro' | 'Secondary / Industry' | 'Tertiary / Services' | 'Green & Future Tech';
  description: string;
  requirements: SectorRequirement;
  keySkills: string[];
  jobRoles: JobRole[];
  businessOpportunities: string[];
  requiredInfrastructure: string[];
  developmentPathway: string[];
  beneficiaries: string[];
  ruralRelevance: number; // 0-100
  urbanRelevance: number; // 0-100
  womenInclusionPotential: number; // 0-100
}

export interface OpportunityRecommendation {
  sectorId: string;
  sectorName: string;
  score: number; // 0-100
  rank: number;
  category: string;
  confidence: 'High' | 'Medium' | 'Developing';
  positiveFactors: string[];
  challenges: string[];
  dataPointsUsed: string[];
  modelType: string;
  keySkills: string[];
  jobRoles: JobRole[];
  businessOpportunities: string[];
  requiredInfrastructure: string[];
  developmentPathway: string[];
  beneficiaries: string[];
}

export interface DevelopmentGap {
  id: string;
  strengthTitle: string;
  strengthValue: number;
  bottleneckTitle: string;
  bottleneckValue: number;
  gapSummary: string;
  recommendation: string;
  intervention: string;
  targetOpportunity: string;
  priority: 'Immediate' | 'Medium-term' | 'Strategic';
}

export interface SimulationParameters {
  roadConnectivityDelta: number; // e.g. +15
  digitalConnectivityDelta: number;
  industrialInvestmentDelta: number;
  skillDevelopmentDelta: number;
  renewableEnergyDelta: number;
  healthcareAccessDelta: number;
  msmeClusterFocus: number;
  tourismPromotion: number;
}

export interface SimulationResult {
  baseline: RegionalScores;
  scenario: RegionalScores;
  deltas: {
    developmentIndex: number;
    humanCapitalIndex: number;
    infrastructureIndex: number;
    economicIndex: number;
    employmentIndex: number;
    digitalReadinessIndex: number;
    socialIndex: number;
    sustainabilityIndex: number;
  };
  projectedEmploymentGrowthPct: number;
  projectedNewEnterprises: number;
  topGainerSectors: string[];
  simulationNotes: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  description: string;
  parameters: SimulationParameters;
  results: SimulationResult;
  createdAt: string;
}

export interface ClusterProfile {
  clusterId: number;
  clusterName: string;
  description: string;
  size: number;
  regions: Array<{ id: string; name: string; state: string }>;
  keyStrengths: string[];
  dominantFeatures: Array<{ feature: string; zScore: number; meanVal: number }>;
  recommendedStrategicThemes: string[];
}

export interface MLClusterResult {
  k: number;
  inertia: number;
  clusters: ClusterProfile[];
  regionAssignments: Record<string, number>;
  featureNames: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'public' | 'youth' | 'entrepreneur' | 'planner';
  education?: string;
  skills: string[];
  interests: string[];
  preferredLocation?: string;
  investmentBudgetBand?: string;
  preferredSectorCategory?: string;
}

export interface DataSourceMeta {
  indicator: string;
  sourceName: string;
  sourceUrl: string;
  year: string;
  geographicLevel: string;
  methodologyNote: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  timeframe: string;
  title: string;
  keyInitiatives: string[];
  infrastructureMilestones: string[];
  skillsAndTalentTargets: string[];
  expectedImpact: string;
}
