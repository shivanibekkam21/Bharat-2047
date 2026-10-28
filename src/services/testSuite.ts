import type { Region, DimensionWeights } from '../types/index.ts';
import { calculateDimensionScores, simulateScenario, detectDevelopmentGaps } from './analyticsEngine.ts';
import { runKMeansClustering, rankOpportunities } from './mlEngine.ts';
import { validateAndParseRegionalCSV } from './csvValidator.ts';
import { SAMPLE_REGIONS } from '../data/sampleRegions.ts';

export interface TestCaseResult {
  suite: string;
  name: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  results: TestCaseResult[];
  timestamp: string;
}

/**
 * Runs complete test suite covering all critical algorithmic pipelines
 */
export function runBharatTestSuite(customRegions: Region[] = SAMPLE_REGIONS): TestSuiteSummary {
  const results: TestCaseResult[] = [];
  const startTime = Date.now();

  function test(suite: string, name: string, fn: () => void) {
    const t0 = performance.now();
    try {
      fn();
      results.push({
        suite,
        name,
        passed: true,
        message: 'Assertion passed successfully',
        durationMs: Math.round((performance.now() - t0) * 100) / 100
      });
    } catch (err: any) {
      results.push({
        suite,
        name,
        passed: false,
        message: err.message || 'Assertion failed',
        durationMs: Math.round((performance.now() - t0) * 100) / 100
      });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // Suite 1: Data Validation & Normalization
  test('Data Validation', 'Rejects literacy rate exceeding 100 in CSV', () => {
    const invalidCSV = `district,state,population,literacy_rate\nTestDistrict,Uttar Pradesh,1000000,124`;
    const res = validateAndParseRegionalCSV(invalidCSV);
    assert(res.errorCount === 1, 'Expected 1 error for literacy_rate = 124');
    assert(res.errors[0].message.includes('Expected 0–100'), 'Error message must specify expected 0-100');
  });

  test('Data Validation', 'Rejects negative population values', () => {
    const invalidCSV = `district,state,population,literacy_rate\nTestDistrict,Rajasthan,-50000,75`;
    const res = validateAndParseRegionalCSV(invalidCSV);
    assert(res.errorCount === 1, 'Expected error for negative population');
    assert(res.errors[0].field === 'population', 'Field identified must be population');
  });

  test('Data Validation', 'Successfully ingests valid CSV records', () => {
    const validCSV = `district,state,population,literacy_rate,agriculture_index,manufacturing_index\nValidDistA,Punjab,2000000,82,75,65\nValidDistB,Kerala,1500000,94,60,50`;
    const res = validateAndParseRegionalCSV(validCSV);
    assert(res.validCount === 2, 'Expected 2 valid parsed regions');
    assert(res.errorCount === 0, 'Expected 0 errors');
  });

  // Suite 2: Development Index Calculation
  test('Development Scoring', 'Calculates Prototype Development Index strictly within 0-100', () => {
    const sample = customRegions[0];
    const scores = calculateDimensionScores(sample);
    assert(scores.developmentIndex >= 0 && scores.developmentIndex <= 100, 'Score must be between 0 and 100');
    assert(scores.humanCapitalIndex >= 0 && scores.humanCapitalIndex <= 100, 'Human capital must be between 0 and 100');
    assert(scores.infrastructureIndex >= 0 && scores.infrastructureIndex <= 100, 'Infrastructure must be between 0 and 100');
    assert(typeof scores.category === 'string', 'Category must be assigned');
  });

  test('Development Scoring', 'Dynamic dimension weights re-weight scores proportionally', () => {
    const sample = customRegions[0];
    const infraBiasedWeights: DimensionWeights = {
      humanCapital: 0.05,
      infrastructure: 0.70,
      economicActivity: 0.05,
      employment: 0.05,
      digitalReadiness: 0.05,
      socialInfrastructure: 0.05,
      sustainability: 0.05
    };
    const regularScores = calculateDimensionScores(sample);
    const infraBiasedScores = calculateDimensionScores(sample, infraBiasedWeights);
    // If region has high infrastructure index, biased score will reflect that
    assert(infraBiasedScores.developmentIndex > 0, 'Biased score calculated');
    assert(infraBiasedScores.developmentIndex !== regularScores.developmentIndex, 'Weighted score should adapt to weights');
  });

  // Suite 3: ML Clustering
  test('ML Clustering', 'K-Means partitions dataset into requested K clusters with non-empty profiles', () => {
    const k = 4;
    const clusterResult = runKMeansClustering(customRegions, k);
    assert(clusterResult.k === k, `Expected ${k} clusters`);
    assert(clusterResult.clusters.length === k, 'Must return profiles for each cluster');
    assert(clusterResult.inertia > 0, 'Inertia must be non-zero positive number');
    // Ensure automatic descriptive names exist
    assert(clusterResult.clusters[0].clusterName.length > 5, 'Must generate descriptive name');
    assert(!clusterResult.clusters[0].clusterName.includes('Cluster 1'), 'Must not use hardcoded static names');
  });

  // Suite 4: Opportunity Recommendation & Explainability
  test('AI Opportunity Engine', 'Generates ranked sector opportunities with explainable factors', () => {
    const sample = customRegions[0]; // Varanasi (High Agri + High Tourism)
    const opportunities = rankOpportunities(sample);
    assert(opportunities.length > 0, 'Must recommend development sectors');
    assert(opportunities[0].rank === 1, 'Top opportunity has rank 1');
    assert(opportunities[0].score >= opportunities[1].score, 'Opportunities must be sorted descending by score');
    assert(opportunities[0].positiveFactors.length > 0, 'Explainability: positive factors must be listed');
    assert(opportunities[0].dataPointsUsed.length > 0, 'Explainability: data points used must be listed');
    assert(opportunities[0].modelType.length > 0, 'Explainability: model type must be documented');
  });

  // Suite 5: Gap Analysis
  test('Gap Analysis', 'Detects asymmetric structural bottlenecks', () => {
    // Nalanda has high agriculture (86) and lower manufacturing (34)
    const nalanda = customRegions.find(r => r.district === 'Nalanda') || customRegions[0];
    const scores = calculateDimensionScores(nalanda);
    const gaps = detectDevelopmentGaps(nalanda, scores);
    assert(gaps.length > 0, 'Should detect structural development gaps');
    assert(gaps.some(g => g.targetOpportunity === 'Food Processing & Cold Storage'), 'Should recommend Food Processing for agri-dominant district');
  });

  // Suite 6: 2047 Scenario Simulator
  test('Scenario Simulator', 'Simulation accurately projects positive index deltas on infrastructure push', () => {
    const sample = customRegions[0];
    const simulation = simulateScenario(sample, {
      roadConnectivityDelta: 15,
      digitalConnectivityDelta: 15,
      industrialInvestmentDelta: 20,
      skillDevelopmentDelta: 20,
      renewableEnergyDelta: 15,
      healthcareAccessDelta: 10,
      msmeClusterFocus: 20,
      tourismPromotion: 10
    });
    assert(simulation.scenario.developmentIndex > simulation.baseline.developmentIndex, 'Scenario index must improve with investments');
    assert(simulation.deltas.developmentIndex > 0, 'Delta must be positive');
    assert(simulation.projectedEmploymentGrowthPct > 0, 'Projected employment growth must be calculated');
    assert(simulation.topGainerSectors.length > 0, 'Must identify top gaining sectors');
  });

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    results,
    timestamp: new Date().toISOString()
  };
}
