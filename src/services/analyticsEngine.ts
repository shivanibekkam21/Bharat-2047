import type { Region, DimensionWeights, DevelopmentCategoryConfig, RegionalScores, DevelopmentGap, SimulationParameters, SimulationResult } from '../types/index.ts';
import { DEFAULT_DIMENSION_WEIGHTS, DEFAULT_CATEGORIES } from '../data/defaultConfig.ts';

/**
 * Utility clamp function between min and max
 */
export function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val * 10) / 10));
}

/**
 * Calculates all multi-dimensional development scores for a given region.
 * Uses normalized indicators and configurable weighted dimensions.
 */
export function calculateDimensionScores(
  region: Region,
  weights: DimensionWeights = DEFAULT_DIMENSION_WEIGHTS,
  categories: DevelopmentCategoryConfig = DEFAULT_CATEGORIES
): RegionalScores {
  // 1. Human Capital Index
  // Combines literacy (35%), higher education (25%), youth demographic dividend (20%), workforce participation (20%)
  const higherEduNorm = clamp((region.higher_education_rate / 50) * 100);
  const youthNorm = clamp(((region.youth_population_percentage - 20) / 25) * 100);
  const humanCapitalIndex = clamp(
    region.literacy_rate * 0.35 +
    higherEduNorm * 0.25 +
    youthNorm * 0.20 +
    region.workforce_participation * 0.20
  );

  // 2. Infrastructure Index
  // Roads (25%), Railway (20%), Electricity (20%), Digital (20%), Logistics (15%)
  const infrastructureIndex = clamp(
    region.road_connectivity * 0.25 +
    region.railway_connectivity * 0.20 +
    region.electricity_access * 0.20 +
    region.digital_connectivity * 0.20 +
    region.logistics_index * 0.15
  );

  // 3. Economic Activity Index
  // Manufacturing (25%), Services (25%), Agriculture (20%), MSME (15%), Export/Startup (15%)
  const economicIndex = clamp(
    region.manufacturing_index * 0.25 +
    region.services_index * 0.25 +
    region.agriculture_index * 0.20 +
    region.msme_presence * 0.15 +
    ((region.export_potential + region.startup_ecosystem) / 2) * 0.15
  );

  // 4. Employment Index
  // Based on low unemployment, workforce participation, and industrial/MSME absorptive capacity
  const employmentSafety = clamp(100 - (region.unemployment_rate * 6.5));
  const employmentIndex = clamp(
    region.workforce_participation * 0.40 +
    employmentSafety * 0.35 +
    region.msme_presence * 0.25
  );

  // 5. Digital Readiness Index
  const digitalReadinessIndex = clamp(
    region.digital_connectivity * 0.55 +
    higherEduNorm * 0.25 +
    region.startup_ecosystem * 0.20
  );

  // 6. Social Infrastructure Index
  // Healthcare (40%), Education access (40%), Water availability (20%)
  const socialIndex = clamp(
    region.healthcare_access * 0.40 +
    region.education_access * 0.40 +
    region.water_availability * 0.20
  );

  // 7. Sustainability Index
  // Renewable energy potential (45%), Water security (35%), Low environmental stress (20%)
  const envSafety = clamp(100 - region.environmental_stress);
  const sustainabilityIndex = clamp(
    region.renewable_energy_potential * 0.45 +
    region.water_availability * 0.35 +
    envSafety * 0.20
  );

  // 8. Overall Prototype Development Index
  // Calculated using configurable weighted dimensions
  const totalWeight =
    weights.humanCapital +
    weights.infrastructure +
    weights.economicActivity +
    weights.employment +
    weights.digitalReadiness +
    weights.socialInfrastructure +
    weights.sustainability;

  const normalizedDevelopmentScore = clamp(
    (humanCapitalIndex * weights.humanCapital +
     infrastructureIndex * weights.infrastructure +
     economicIndex * weights.economicActivity +
     employmentIndex * weights.employment +
     digitalReadinessIndex * weights.digitalReadiness +
     socialIndex * weights.socialInfrastructure +
     sustainabilityIndex * weights.sustainability) /
    (totalWeight || 1)
  );

  // Determine category based on configured thresholds
  let categoryLabel = categories.developing.label;
  if (normalizedDevelopmentScore < categories.emerging.max) {
    categoryLabel = categories.emerging.label;
  } else if (normalizedDevelopmentScore <= categories.developing.max) {
    categoryLabel = categories.developing.label;
  } else if (normalizedDevelopmentScore <= categories.advancing.max) {
    categoryLabel = categories.advancing.label;
  } else if (normalizedDevelopmentScore <= categories.highPotential.max) {
    categoryLabel = categories.highPotential.label;
  } else {
    categoryLabel = categories.veryHigh.label;
  }

  return {
    developmentIndex: normalizedDevelopmentScore,
    category: categoryLabel,
    humanCapitalIndex,
    infrastructureIndex,
    economicIndex,
    employmentIndex,
    digitalReadinessIndex,
    socialIndex,
    sustainabilityIndex,
    womenEconomicParticipation: region.women_workforce_participation
  };
}

/**
 * Detects structural development gaps by analyzing asymmetric strengths vs bottlenecks.
 */
export function detectDevelopmentGaps(region: Region, scores: RegionalScores): DevelopmentGap[] {
  const gaps: DevelopmentGap[] = [];

  // Gap 1: High Agriculture vs Low Industrial Processing / Cold Chain
  if (region.agriculture_index >= 65 && region.manufacturing_index < 60) {
    gaps.push({
      id: 'gap_agri_processing',
      strengthTitle: 'Agricultural Crop & Horticulture Volume',
      strengthValue: region.agriculture_index,
      bottleneckTitle: 'Local Value-Addition & Processing Units',
      bottleneckValue: region.manufacturing_index,
      gapSummary: `High agricultural baseline (${region.agriculture_index}/100) paired with limited local processing (${region.manufacturing_index}/100) leads to raw crop distress sales and post-harvest transport losses.`,
      recommendation: 'Establish an integrated Mini Food Park with cold storage and FSSAI certified sorting/grading packhouses.',
      intervention: 'Sanction Agri-Infrastructure Fund (AIF) subsidized loans for farmer producer organizations (FPOs) and private cold storage.',
      targetOpportunity: 'Food Processing & Cold Storage',
      priority: 'Immediate'
    });
  }

  // Gap 2: High Education & Youth Demographic vs Low Local Formal Services / Startups
  if (region.literacy_rate >= 75 && region.startup_ecosystem < 50 && region.unemployment_rate >= 6.5) {
    gaps.push({
      id: 'gap_youth_braindrain',
      strengthTitle: 'Literacy & Youth Demographic Capital',
      strengthValue: region.literacy_rate,
      bottleneckTitle: 'Tech Incubators & Startup Absorptive Capacity',
      bottleneckValue: region.startup_ecosystem,
      gapSummary: `Educated youth cohort (${region.literacy_rate}% literacy, ${region.youth_population_percentage}% youth) faces high unemployment (${region.unemployment_rate}%) due to absence of local knowledge enterprises.`,
      recommendation: 'Deploy a District Co-working Innovation Hub with gigabit broadband to attract remote work and SaaS startups.',
      intervention: 'Partner with STPI and regional universities to provide seed grants and subsidized commercial rent for tech ventures.',
      targetOpportunity: 'IT Services & Digital Economy',
      priority: 'Immediate'
    });
  }

  // Gap 3: High Renewable Energy Potential vs Transmission / Grid Integration
  if (region.renewable_energy_potential >= 75 && region.electricity_access < 92) {
    gaps.push({
      id: 'gap_renewable_evacuation',
      strengthTitle: 'Solar & Wind Generation Potential',
      strengthValue: region.renewable_energy_potential,
      bottleneckTitle: 'High-Voltage Grid Evacuation Sub-stations',
      bottleneckValue: region.electricity_access,
      gapSummary: `Abundant natural solar/wind irradiation (${region.renewable_energy_potential}/100) cannot be fully evacuated due to grid feeder constraints (${region.electricity_access}/100).`,
      recommendation: 'Construct dedicated 220kV Green Energy Corridor sub-stations and facilitate rooftop agricultural feeder solarization.',
      intervention: 'State transmission utility investment paired with PM-KUSUM feeder solarization tenders.',
      targetOpportunity: 'Renewable Energy & Solar Parks',
      priority: 'Strategic'
    });
  }

  // Gap 4: Industrial Presence vs Freight & Multi-modal Logistics Gaps
  if (region.manufacturing_index >= 70 && region.logistics_index < 75) {
    gaps.push({
      id: 'gap_logistics_friction',
      strengthTitle: 'Manufacturing Output & Factory Base',
      strengthValue: region.manufacturing_index,
      bottleneckTitle: 'Multimodal Warehousing & Freight Siding',
      bottleneckValue: region.logistics_index,
      gapSummary: `Robust industrial manufacturing (${region.manufacturing_index}/100) suffers higher turnaround times and shipping costs due to logistics bottlenecks (${region.logistics_index}/100).`,
      recommendation: 'Develop an Inland Container Depot (ICD) and direct 4-lane bypass connecting industrial estates to national expressways.',
      intervention: 'Integrate the district node into PM GatiShakti National Master Plan freight terminal projects.',
      targetOpportunity: 'Multimodal Logistics & Warehousing',
      priority: 'Medium-term'
    });
  }

  // Gap 5: High Tourism Potential vs Digital Booking & Civic Infrastructure
  if (region.tourism_index >= 70 && (region.digital_connectivity < 75 || region.healthcare_access < 75)) {
    gaps.push({
      id: 'gap_tourism_civic',
      strengthTitle: 'Heritage & Natural Tourism Footfall',
      strengthValue: region.tourism_index,
      bottleneckTitle: 'Digital Connectivity & Tourist Amenities',
      bottleneckValue: Math.min(region.digital_connectivity, region.healthcare_access),
      gapSummary: `High cultural attraction (${region.tourism_index}/100) under-monetizes tourist duration of stay due to deficits in digital amenities and emergency healthcare.`,
      recommendation: 'Deploy smart tourist circuits with unified digital passes, verified homestays, and upgraded emergency medical units.',
      intervention: 'Tourism development board grant for homestay standardization, guide certification, and public Wi-Fi zones.',
      targetOpportunity: 'Cultural Tourism & Eco-Hospitality',
      priority: 'Medium-term'
    });
  }

  // Gap 6: Low Women Economic Participation
  if (region.women_workforce_participation < 30) {
    gaps.push({
      id: 'gap_women_participation',
      strengthTitle: 'Total Population & Human Resource Pool',
      strengthValue: 70,
      bottleneckTitle: "Women's Formal Economic Participation",
      bottleneckValue: region.women_workforce_participation,
      gapSummary: `Female labor force participation (${region.women_workforce_participation}%) is significantly below national potential, indicating untapped economic output.`,
      recommendation: 'Promote decentralized apparel stitching clusters, food packaging cooperatives, and digital micro-work hubs for women.',
      intervention: 'Scale Deendayal Antyodaya Yojana - NRLM bank linkage and establish safe shared transport to employment clusters.',
      targetOpportunity: 'Textiles, Handlooms & Apparel',
      priority: 'Strategic'
    });
  }

  return gaps;
}

/**
 * Simulates the 2047 Scenario based on intervention levers.
 * Calculates modified regional parameters and recalculated indices.
 */
export function simulateScenario(
  baselineRegion: Region,
  params: SimulationParameters,
  weights: DimensionWeights = DEFAULT_DIMENSION_WEIGHTS
): SimulationResult {
  const baselineScores = calculateDimensionScores(baselineRegion, weights);

  // Model realistic cross-elasticities
  const modifiedRegion: Region = {
    ...baselineRegion,
    road_connectivity: clamp(baselineRegion.road_connectivity + params.roadConnectivityDelta),
    digital_connectivity: clamp(baselineRegion.digital_connectivity + params.digitalConnectivityDelta),
    electricity_access: clamp(baselineRegion.electricity_access + params.renewableEnergyDelta * 0.4 + params.industrialInvestmentDelta * 0.2),
    logistics_index: clamp(baselineRegion.logistics_index + params.roadConnectivityDelta * 0.65 + params.digitalConnectivityDelta * 0.25),
    
    // Skill development elevates human capital & reduces unemployment
    higher_education_rate: clamp(baselineRegion.higher_education_rate + params.skillDevelopmentDelta * 0.35),
    workforce_participation: clamp(baselineRegion.workforce_participation + params.skillDevelopmentDelta * 0.25 + params.industrialInvestmentDelta * 0.15),
    unemployment_rate: Math.max(2.5, Math.round((baselineRegion.unemployment_rate - (params.skillDevelopmentDelta * 0.12 + params.industrialInvestmentDelta * 0.15)) * 10) / 10),
    women_workforce_participation: clamp(baselineRegion.women_workforce_participation + params.skillDevelopmentDelta * 0.30 + params.msmeClusterFocus * 0.25),

    // Industrial investments and MSME clusters
    manufacturing_index: clamp(baselineRegion.manufacturing_index + params.industrialInvestmentDelta * 0.55 + params.msmeClusterFocus * 0.20),
    services_index: clamp(baselineRegion.services_index + params.digitalConnectivityDelta * 0.45 + params.tourismPromotion * 0.30),
    msme_presence: clamp(baselineRegion.msme_presence + params.msmeClusterFocus * 0.65 + params.digitalConnectivityDelta * 0.20),
    startup_ecosystem: clamp(baselineRegion.startup_ecosystem + params.digitalConnectivityDelta * 0.50 + params.skillDevelopmentDelta * 0.30),
    export_potential: clamp(baselineRegion.export_potential + params.industrialInvestmentDelta * 0.35 + params.roadConnectivityDelta * 0.30),

    // Healthcare & Sustainability
    healthcare_access: clamp(baselineRegion.healthcare_access + params.healthcareAccessDelta),
    education_access: clamp(baselineRegion.education_access + params.skillDevelopmentDelta * 0.40 + params.digitalConnectivityDelta * 0.20),
    renewable_energy_potential: clamp(baselineRegion.renewable_energy_potential + params.renewableEnergyDelta * 0.30),
    environmental_stress: clamp(baselineRegion.environmental_stress - (params.renewableEnergyDelta * 0.25) + (params.industrialInvestmentDelta * 0.10)), // industrial growth adds slight stress, renewables reduce it

    tourism_index: clamp(baselineRegion.tourism_index + params.tourismPromotion * 0.60 + params.roadConnectivityDelta * 0.20)
  };

  const scenarioScores = calculateDimensionScores(modifiedRegion, weights);

  const deltas = {
    developmentIndex: Math.round((scenarioScores.developmentIndex - baselineScores.developmentIndex) * 10) / 10,
    humanCapitalIndex: Math.round((scenarioScores.humanCapitalIndex - baselineScores.humanCapitalIndex) * 10) / 10,
    infrastructureIndex: Math.round((scenarioScores.infrastructureIndex - baselineScores.infrastructureIndex) * 10) / 10,
    economicIndex: Math.round((scenarioScores.economicIndex - baselineScores.economicIndex) * 10) / 10,
    employmentIndex: Math.round((scenarioScores.employmentIndex - baselineScores.employmentIndex) * 10) / 10,
    digitalReadinessIndex: Math.round((scenarioScores.digitalReadinessIndex - baselineScores.digitalReadinessIndex) * 10) / 10,
    socialIndex: Math.round((scenarioScores.socialIndex - baselineScores.socialIndex) * 10) / 10,
    sustainabilityIndex: Math.round((scenarioScores.sustainabilityIndex - baselineScores.sustainabilityIndex) * 10) / 10
  };

  // Projected regional macro estimates (modelled prototype estimates)
  const projectedEmploymentGrowthPct = Math.round((deltas.employmentIndex * 1.45 + deltas.economicIndex * 0.85) * 10) / 10;
  const projectedNewEnterprises = Math.round(
    (baselineRegion.population / 100000) *
    (params.msmeClusterFocus * 45 + params.industrialInvestmentDelta * 30 + params.digitalConnectivityDelta * 25)
  );

  const topGainerSectors: string[] = [];
  if (params.industrialInvestmentDelta > 15 || params.msmeClusterFocus > 15) {
    topGainerSectors.push('Precision Engineering & Auto Components');
  }
  if (params.roadConnectivityDelta > 12 && baselineRegion.agriculture_index > 60) {
    topGainerSectors.push('Food Processing & Cold Storage');
  }
  if (params.digitalConnectivityDelta > 18) {
    topGainerSectors.push('IT Services & Digital Economy');
  }
  if (params.renewableEnergyDelta > 20) {
    topGainerSectors.push('Renewable Energy & Solar Parks');
  }
  if (params.tourismPromotion > 12) {
    topGainerSectors.push('Cultural Tourism & Eco-Hospitality');
  }
  if (topGainerSectors.length === 0) {
    topGainerSectors.push('Multimodal Logistics & Warehousing');
  }

  return {
    baseline: baselineScores,
    scenario: scenarioScores,
    deltas,
    projectedEmploymentGrowthPct,
    projectedNewEnterprises,
    topGainerSectors,
    simulationNotes: `Modelled Scenario under +${params.industrialInvestmentDelta}% industrial push, +${params.roadConnectivityDelta}% road upgrade, and +${params.skillDevelopmentDelta}% skill expansion. Reflects structural shift toward higher formalization.`
  };
}
