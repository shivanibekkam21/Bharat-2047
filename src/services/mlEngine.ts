import type { Region, Sector, OpportunityRecommendation, MLClusterResult, ClusterProfile } from '../types/index.ts';
import { SECTORS_CATALOG } from '../data/sectorsData.ts';

export const CLUSTERING_FEATURES = [
  { key: 'agriculture_index', label: 'Agriculture Index' },
  { key: 'manufacturing_index', label: 'Manufacturing Index' },
  { key: 'services_index', label: 'Services Index' },
  { key: 'literacy_rate', label: 'Literacy Rate' },
  { key: 'youth_population_percentage', label: 'Youth Demographic %' },
  { key: 'unemployment_rate', label: 'Unemployment Rate' },
  { key: 'road_connectivity', label: 'Road Infrastructure' },
  { key: 'digital_connectivity', label: 'Digital Connectivity' },
  { key: 'tourism_index', label: 'Tourism Index' },
  { key: 'renewable_energy_potential', label: 'Renewable Potential' }
] as const;

export type FeatureKey = typeof CLUSTERING_FEATURES[number]['key'];

interface ScaledData {
  vectors: number[][];
  means: number[];
  stdDevs: number[];
}

/**
 * Standardizes feature matrix using z-score normalization (mean=0, std=1)
 */
function standardizeFeatures(regions: Region[], featureKeys: readonly FeatureKey[]): ScaledData {
  const n = regions.length;
  const m = featureKeys.length;
  const rawMatrix: number[][] = regions.map(r => featureKeys.map(k => (r[k] as number) || 0));

  const means: number[] = new Array(m).fill(0);
  const stdDevs: number[] = new Array(m).fill(0);

  // Compute means
  for (let j = 0; j < m; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += rawMatrix[i][j];
    }
    means[j] = sum / (n || 1);
  }

  // Compute std devs
  for (let j = 0; j < m; j++) {
    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const diff = rawMatrix[i][j] - means[j];
      sumSq += diff * diff;
    }
    stdDevs[j] = Math.sqrt(sumSq / (n || 1)) || 1; // avoid division by 0
  }

  // Standardize
  const vectors: number[][] = rawMatrix.map(row =>
    row.map((val, j) => (val - means[j]) / stdDevs[j])
  );

  return { vectors, means, stdDevs };
}

/**
 * Euclidean distance between two vectors
 */
function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Executes K-Means clustering with K-Means++ centroid initialization
 */
export function runKMeansClustering(
  regions: Region[],
  k = 5,
  maxIterations = 100
): MLClusterResult {
  const featureKeys = CLUSTERING_FEATURES.map(f => f.key);
  const n = regions.length;
  const m = featureKeys.length;

  if (n === 0) {
    return { k: 0, inertia: 0, clusters: [], regionAssignments: {}, featureNames: [] };
  }

  const effectiveK = Math.min(k, n);
  const { vectors, means, stdDevs } = standardizeFeatures(regions, featureKeys);

  // K-Means++ centroid initialization
  const centroids: number[][] = [];
  
  // Pick first centroid deterministically (point closest to dataset center)
  let bestInitDist = Infinity;
  let firstIdx = 0;
  for (let i = 0; i < n; i++) {
    const distFromOrigin = Math.sqrt(vectors[i].reduce((acc, v) => acc + v * v, 0));
    if (distFromOrigin < bestInitDist) {
      bestInitDist = distFromOrigin;
      firstIdx = i;
    }
  }
  centroids.push([...vectors[firstIdx]]);

  // Pick remaining K-1 centroids using D^2 weighted probability
  for (let c = 1; c < effectiveK; c++) {
    const distances: number[] = [];
    let sumDistSq = 0;

    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        const d = euclideanDistance(vectors[i], centroids[j]);
        if (d < minDist) minDist = d;
      }
      distances[i] = minDist * minDist;
      sumDistSq += distances[i];
    }

    // Pick point with largest distance
    let targetDist = (c * 0.77 * sumDistSq) % sumDistSq;
    let accumulated = 0;
    let selectedIdx = 0;
    for (let i = 0; i < n; i++) {
      accumulated += distances[i];
      if (accumulated >= targetDist) {
        selectedIdx = i;
        break;
      }
    }
    centroids.push([...vectors[selectedIdx]]);
  }

  // Iterative Lloyd's algorithm
  let assignments: number[] = new Array(n).fill(0);
  let iteration = 0;
  let converged = false;

  while (iteration < maxIterations && !converged) {
    iteration++;
    let changed = false;

    // Assignment step
    for (let i = 0; i < n; i++) {
      let bestCluster = 0;
      let minD = Infinity;
      for (let c = 0; c < effectiveK; c++) {
        const d = euclideanDistance(vectors[i], centroids[c]);
        if (d < minD) {
          minD = d;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) {
      converged = true;
      break;
    }

    // Update step
    const counts: number[] = new Array(effectiveK).fill(0);
    const newCentroids: number[][] = Array.from({ length: effectiveK }, () => new Array(m).fill(0));

    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      for (let j = 0; j < m; j++) {
        newCentroids[c][j] += vectors[i][j];
      }
    }

    for (let c = 0; c < effectiveK; c++) {
      if (counts[c] > 0) {
        for (let j = 0; j < m; j++) {
          centroids[c][j] = newCentroids[c][j] / counts[c];
        }
      }
    }
  }

  // Calculate total inertia
  let totalInertia = 0;
  for (let i = 0; i < n; i++) {
    const c = assignments[i];
    const d = euclideanDistance(vectors[i], centroids[c]);
    totalInertia += d * d;
  }

  // Generate dynamic cluster profiles
  const clusterProfiles: ClusterProfile[] = [];
  const regionAssignments: Record<string, number> = {};

  for (let c = 0; c < effectiveK; c++) {
    const clusterRegions: Array<{ id: string; name: string; state: string }> = [];
    for (let i = 0; i < n; i++) {
      if (assignments[i] === c) {
        clusterRegions.push({
          id: regions[i].id,
          name: regions[i].district,
          state: regions[i].state
        });
        regionAssignments[regions[i].id] = c;
      }
    }

    // Rank dominant features in this cluster by centroid z-score
    const featureDeviations = featureKeys.map((k, j) => {
      const zScore = centroids[c][j];
      const meanVal = means[j] + zScore * stdDevs[j];
      return {
        feature: CLUSTERING_FEATURES[j].label,
        key: k,
        zScore: Math.round(zScore * 100) / 100,
        meanVal: Math.round(meanVal * 10) / 10
      };
    });

    featureDeviations.sort((a, b) => b.zScore - a.zScore);

    // Generate descriptive cluster name based on strongest characteristics
    const top1 = featureDeviations[0];
    const top2 = featureDeviations[1];

    let dynamicName = '';
    if (top1.zScore > 0.4 && top2.zScore > 0.3) {
      dynamicName = `${cleanFeatureNoun(top1.key)} & ${cleanFeatureNoun(top2.key)} Region`;
    } else if (top1.zScore > 0.5) {
      dynamicName = `${cleanFeatureNoun(top1.key)} Development Zone`;
    } else {
      dynamicName = 'Balanced Multi-Sector Transition Region';
    }

    // Key strengths (features with zScore >= 0.25)
    const keyStrengths = featureDeviations
      .filter(f => f.zScore >= 0.2)
      .map(f => `${f.feature} (avg: ${f.meanVal})`);

    if (keyStrengths.length === 0) {
      keyStrengths.push(`Average development baseline across ${featureDeviations[0].feature}`);
    }

    // Recommendations
    const strategicThemes: string[] = [];
    if (top1.key === 'agriculture_index' || top2.key === 'agriculture_index') {
      strategicThemes.push('Post-harvest agro-processing hubs and cold chain integration');
    }
    if (top1.key === 'manufacturing_index' || top2.key === 'manufacturing_index') {
      strategicThemes.push('Precision engineering vendor ecosystems and freight logistics');
    }
    if (top1.key === 'services_index' || top2.key === 'services_index' || top1.key === 'digital_connectivity') {
      strategicThemes.push('Tier-2 tech incubators, software export, and high-skilled knowledge services');
    }
    if (top1.key === 'tourism_index' || top2.key === 'tourism_index') {
      strategicThemes.push('Heritage tourism circuits, cultural preservation, and hospitality micro-enterprises');
    }
    if (top1.key === 'renewable_energy_potential' || top2.key === 'renewable_energy_potential') {
      strategicThemes.push('Green energy corridors, solar parks, and decentralized clean power');
    }
    if (strategicThemes.length === 0) {
      strategicThemes.push('Multi-modal infrastructure consolidation and MSME formalization');
    }

    clusterProfiles.push({
      clusterId: c,
      clusterName: dynamicName,
      description: `Cluster of ${clusterRegions.length} districts characterized by high ${top1.feature} (z: +${top1.zScore}) and strong ${top2.feature}.`,
      size: clusterRegions.length,
      regions: clusterRegions,
      keyStrengths,
      dominantFeatures: featureDeviations.slice(0, 5),
      recommendedStrategicThemes: strategicThemes
    });
  }

  return {
    k: effectiveK,
    inertia: Math.round(totalInertia * 10) / 10,
    clusters: clusterProfiles,
    regionAssignments,
    featureNames: featureKeys
  };
}

function cleanFeatureNoun(key: FeatureKey): string {
  switch (key) {
    case 'agriculture_index': return 'Agro-Economy';
    case 'manufacturing_index': return 'Industrial Manufacturing';
    case 'services_index': return 'Urban Knowledge & Services';
    case 'literacy_rate': return 'High Human Capital';
    case 'youth_population_percentage': return 'Youth Demographic Hub';
    case 'road_connectivity': return 'Multimodal Freight';
    case 'digital_connectivity': return 'Digital Technology';
    case 'tourism_index': return 'Heritage & Cultural Tourism';
    case 'renewable_energy_potential': return 'Renewable Clean Energy';
    default: return 'Economic Growth';
  }
}

/**
 * Opportunity Recommendation Engine
 * Calculates normalized multi-criteria compatibility scores between
 * regional characteristics and development sectors.
 */
export function rankOpportunities(
  region: Region,
  mode: 'balanced' | 'rural' | 'urban' = 'balanced',
  sectors: Sector[] = SECTORS_CATALOG
): OpportunityRecommendation[] {
  const scoredSectors = sectors.map((sector) => {
    const req = sector.requirements;

    // Weight converter: High=1.0, Medium=0.6, Low=0.25
    const getReqWeight = (level: 'High' | 'Medium' | 'Low') =>
      level === 'High' ? 1.0 : level === 'Medium' ? 0.6 : 0.25;

    // Evaluate factor matches
    const factorMatches = [
      { name: 'Agriculture Base', value: region.agriculture_index, req: req.agriculture },
      { name: 'Manufacturing Base', value: region.manufacturing_index, req: req.manufacturing },
      { name: 'Services Base', value: region.services_index, req: req.services },
      { name: 'Road Infrastructure', value: region.road_connectivity, req: req.roadConnectivity },
      { name: 'Digital Connectivity', value: region.digital_connectivity, req: req.digitalConnectivity },
      { name: 'Power Availability', value: region.electricity_access, req: req.electricity },
      { name: 'Water Resources', value: region.water_availability, req: req.water },
      { name: 'Workforce Size', value: region.workforce_participation * 1.5, req: req.workforce },
      { name: 'Higher Education Access', value: region.higher_education_rate * 2, req: req.higherEducation },
      { name: 'Logistics Access', value: region.logistics_index, req: req.logistics },
      { name: 'Renewable Potential', value: region.renewable_energy_potential, req: req.renewablePotential }
    ];

    let totalWeight = 0;
    let earnedScore = 0;
    const positiveFactors: string[] = [];
    const challenges: string[] = [];
    const dataPointsUsed: string[] = [];

    factorMatches.forEach(item => {
      const weight = getReqWeight(item.req);
      totalWeight += weight;
      
      // Calculate satisfaction percentage (target: High >= 70, Medium >= 50, Low >= 30)
      const target = item.req === 'High' ? 70 : item.req === 'Medium' ? 50 : 30;
      const satisfaction = Math.min(100, (item.value / target) * 100);
      earnedScore += satisfaction * weight;

      // Track positive vs challenges
      if (item.req === 'High') {
        dataPointsUsed.push(`${item.name}: ${Math.round(item.value)}/100`);
        if (item.value >= 65) {
          positiveFactors.push(`Strong ${item.name.toLowerCase()} (${Math.round(item.value)}/100 exceeds critical threshold)`);
        } else {
          challenges.push(`${item.name} (${Math.round(item.value)}/100) is below target requirements`);
        }
      } else if (item.req === 'Medium' && item.value < 45) {
        challenges.push(`Moderate constraint in ${item.name.toLowerCase()} (${Math.round(item.value)}/100)`);
      }
    });

    let rawScore = Math.min(98, Math.max(25, earnedScore / (totalWeight || 1)));

    // Mode modifier
    if (mode === 'rural') {
      const modifier = (sector.ruralRelevance - 50) * 0.15;
      rawScore += modifier;
    } else if (mode === 'urban') {
      const modifier = (sector.urbanRelevance - 50) * 0.15;
      rawScore += modifier;
    }

    const finalScore = Math.min(97, Math.max(30, Math.round(rawScore)));

    // Confidence estimation
    let confidence: 'High' | 'Medium' | 'Developing' = 'Medium';
    if (challenges.length <= 1 && positiveFactors.length >= 2) {
      confidence = 'High';
    } else if (challenges.length >= 3) {
      confidence = 'Developing';
    }

    return {
      sectorId: sector.id,
      sectorName: sector.name,
      score: finalScore,
      rank: 0, // set below
      category: sector.category,
      confidence,
      positiveFactors: positiveFactors.slice(0, 4),
      challenges: challenges.length > 0 ? challenges.slice(0, 3) : ['Standard capital & licensing prerequisites'],
      dataPointsUsed: dataPointsUsed.slice(0, 5),
      modelType: 'Normalized Multi-Criteria Vector Compatibility (MCDM) & Factor Elasticity Matching',
      keySkills: sector.keySkills,
      jobRoles: sector.jobRoles,
      businessOpportunities: sector.businessOpportunities,
      requiredInfrastructure: sector.requiredInfrastructure,
      developmentPathway: sector.developmentPathway,
      beneficiaries: sector.beneficiaries
    };
  });

  // Sort descending by score
  scoredSectors.sort((a, b) => b.score - a.score);

  // Assign ranks
  scoredSectors.forEach((sec, idx) => {
    sec.rank = idx + 1;
  });

  return scoredSectors;
}
