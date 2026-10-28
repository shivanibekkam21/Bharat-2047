import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_REGIONS, DATA_SOURCES } from './src/data/sampleRegions.ts';
import { SECTORS_CATALOG } from './src/data/sectorsData.ts';
import { DEFAULT_DIMENSION_WEIGHTS, DEFAULT_CATEGORIES } from './src/data/defaultConfig.ts';
import { calculateDimensionScores, detectDevelopmentGaps, simulateScenario } from './src/services/analyticsEngine.ts';
import { runKMeansClustering, rankOpportunities } from './src/services/mlEngine.ts';
import { validateAndParseRegionalCSV } from './src/services/csvValidator.ts';
import { runBharatTestSuite } from './src/services/testSuite.ts';
import type { Region, DimensionWeights, SimulationParameters } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent regional store initialized with calibrated sample data
let currentRegions: Region[] = [...SAMPLE_REGIONS];
let currentWeights: DimensionWeights = { ...DEFAULT_DIMENSION_WEIGHTS };

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: List all regions with calculated index
  app.get('/api/regions', (req: Request, res: Response) => {
    const { state, zone, tier, search } = req.query;
    let list = currentRegions;

    if (state && typeof state === 'string') {
      list = list.filter(r => r.state.toLowerCase() === state.toLowerCase());
    }
    if (zone && typeof zone === 'string') {
      list = list.filter(r => r.zone.toLowerCase() === zone.toLowerCase());
    }
    if (tier && typeof tier === 'string') {
      list = list.filter(r => r.tier.toLowerCase() === tier.toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(r => r.district.toLowerCase().includes(q) || r.state.toLowerCase().includes(q));
    }

    const payload = list.map(r => {
      const scores = calculateDimensionScores(r, currentWeights);
      return {
        ...r,
        scores
      };
    });

    res.json({
      success: true,
      count: payload.length,
      data: payload
    });
  });

  // API Route: Single region detail
  app.get('/api/regions/:id', (req: Request, res: Response) => {
    const region = currentRegions.find(r => r.id === req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    const scores = calculateDimensionScores(region, currentWeights);
    const gaps = detectDevelopmentGaps(region, scores);
    res.json({
      success: true,
      data: {
        ...region,
        scores,
        gaps
      }
    });
  });

  // API Route: Development index details
  app.get('/api/regions/:id/development-index', (req: Request, res: Response) => {
    const region = currentRegions.find(r => r.id === req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    const scores = calculateDimensionScores(region, currentWeights);
    res.json({
      success: true,
      region: `${region.district}, ${region.state}`,
      scores,
      weightsUsed: currentWeights
    });
  });

  // API Route: Opportunity recommendations with Explainability
  app.get('/api/regions/:id/opportunities', (req: Request, res: Response) => {
    const region = currentRegions.find(r => r.id === req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    const mode = (req.query.mode as 'balanced' | 'rural' | 'urban') || 'balanced';
    const opportunities = rankOpportunities(region, mode, SECTORS_CATALOG);
    res.json({
      success: true,
      regionId: region.id,
      regionName: `${region.district}, ${region.state}`,
      mode,
      opportunities
    });
  });

  // API Route: Development Gaps
  app.get('/api/regions/:id/gaps', (req: Request, res: Response) => {
    const region = currentRegions.find(r => r.id === req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    const scores = calculateDimensionScores(region, currentWeights);
    const gaps = detectDevelopmentGaps(region, scores);
    res.json({
      success: true,
      regionId: region.id,
      gaps
    });
  });

  // API Route: 2047 Scenario Simulation
  app.post('/api/regions/:id/simulate', (req: Request, res: Response) => {
    const region = currentRegions.find(r => r.id === req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    const params: SimulationParameters = req.body || {
      roadConnectivityDelta: 15,
      digitalConnectivityDelta: 15,
      industrialInvestmentDelta: 15,
      skillDevelopmentDelta: 15,
      renewableEnergyDelta: 15,
      healthcareAccessDelta: 10,
      msmeClusterFocus: 15,
      tourismPromotion: 10
    };
    const result = simulateScenario(region, params, currentWeights);
    res.json({
      success: true,
      regionId: region.id,
      regionName: `${region.district}, ${region.state}`,
      params,
      result
    });
  });

  // API Route: Regional Multi-Comparison
  app.get('/api/regions/compare', (req: Request, res: Response) => {
    const ids = typeof req.query.ids === 'string' ? req.query.ids.split(',') : [];
    const selected = currentRegions.filter(r => ids.includes(r.id)).slice(0, 4);

    if (selected.length === 0) {
      return res.status(400).json({ success: false, error: 'Provide at least one valid region ID in ?ids=' });
    }

    const comparisonData = selected.map(r => {
      const scores = calculateDimensionScores(r, currentWeights);
      const topOps = rankOpportunities(r, 'balanced', SECTORS_CATALOG).slice(0, 3);
      return {
        id: r.id,
        district: r.district,
        state: r.state,
        tier: r.tier,
        population: r.population,
        scores,
        topOpportunities: topOps.map(o => ({ name: o.sectorName, score: o.score }))
      };
    });

    res.json({
      success: true,
      regions: comparisonData
    });
  });

  // API Route: ML Clustering
  app.post('/api/ml/cluster', (req: Request, res: Response) => {
    const k = Number(req.body.k) || 5;
    const clusterResult = runKMeansClustering(currentRegions, k);
    res.json({
      success: true,
      result: clusterResult
    });
  });

  // API Route: Sectors Catalog
  app.get('/api/sectors', (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: SECTORS_CATALOG.length,
      data: SECTORS_CATALOG
    });
  });

  app.get('/api/sectors/:id', (req: Request, res: Response) => {
    const sector = SECTORS_CATALOG.find(s => s.id === req.params.id);
    if (!sector) {
      return res.status(404).json({ success: false, error: 'Sector not found' });
    }
    res.json({ success: true, data: sector });
  });

  // API Route: Match Youth or Entrepreneur profile
  app.post('/api/users/profile/match', (req: Request, res: Response) => {
    const { role, skills, interests, sectorId, preferredState, investmentCapacity } = req.body;

    if (role === 'entrepreneur') {
      // Find regions that rank highest for the requested sector
      const sector = SECTORS_CATALOG.find(s => s.id === sectorId) || SECTORS_CATALOG[0];
      const rankedRegions = currentRegions.map(r => {
        const ops = rankOpportunities(r, 'balanced', [sector]);
        const op = ops[0];
        return {
          regionId: r.id,
          district: r.district,
          state: r.state,
          compatibilityScore: op.score,
          confidence: op.confidence,
          strengths: op.positiveFactors,
          challenges: op.challenges,
          infrastructureGaps: op.challenges.filter(c => c.toLowerCase().includes('infrastructure') || c.toLowerCase().includes('road') || c.toLowerCase().includes('power'))
        };
      });

      rankedRegions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      return res.json({
        success: true,
        role: 'entrepreneur',
        targetSector: sector.name,
        recommendations: rankedRegions.slice(0, 8),
        disclaimer: 'Potential matches based on available regional opportunity data. Does not replace commercial due diligence.'
      });
    }

    // Role: Student / Youth
    // Match based on user skills & interests to job roles across sectors and regions
    const userSkills = Array.isArray(skills) ? skills.map((s: string) => s.toLowerCase()) : [];
    const userInterests = Array.isArray(interests) ? interests.map((i: string) => i.toLowerCase()) : [];

    const matchedSectors = SECTORS_CATALOG.map(sector => {
      let skillMatchCount = 0;
      sector.keySkills.forEach(ks => {
        if (userSkills.some(us => ks.toLowerCase().includes(us) || us.includes(ks.toLowerCase()))) {
          skillMatchCount++;
        }
      });

      let interestMatchCount = 0;
      if (userInterests.some(ui => sector.name.toLowerCase().includes(ui) || sector.category.toLowerCase().includes(ui))) {
        interestMatchCount += 2;
      }

      const matchScore = Math.min(100, Math.round(40 + skillMatchCount * 20 + interestMatchCount * 15));
      return {
        sector,
        matchScore
      };
    });

    matchedSectors.sort((a, b) => b.matchScore - a.matchScore);
    const topSectors = matchedSectors.slice(0, 3);

    // Identify top regions for these sectors
    const regionalOpportunities = topSectors.map(ts => {
      const bestRegions = currentRegions
        .map(r => {
          const ops = rankOpportunities(r, 'balanced', [ts.sector]);
          return {
            regionId: r.id,
            district: r.district,
            state: r.state,
            score: ops[0]?.score || 50
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      return {
        sectorId: ts.sector.id,
        sectorName: ts.sector.name,
        matchScore: ts.matchScore,
        relevantJobs: ts.sector.jobRoles.slice(0, 3),
        topHubs: bestRegions
      };
    });

    res.json({
      success: true,
      role: 'youth',
      matchedOpportunities: regionalOpportunities,
      disclaimer: 'Potential matches based on available regional opportunity data. Explore career pathways with local universities and skilling agencies.'
    });
  });

  // API Route: Admin CSV upload & data ingestion
  app.post('/api/admin/import', (req: Request, res: Response) => {
    const { csvContent, overwrite } = req.body;
    if (!csvContent || typeof csvContent !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing csvContent in request body' });
    }

    const validation = validateAndParseRegionalCSV(csvContent);
    if (validation.validCount > 0 && overwrite) {
      // Append or replace
      const newRegions = validation.validRegions as Region[];
      currentRegions = [...currentRegions, ...newRegions];
    }

    res.json({
      success: true,
      validation,
      currentTotalRegions: currentRegions.length
    });
  });

  // API Route: Dimension weights management
  app.get('/api/config/weights', (_req: Request, res: Response) => {
    res.json({ success: true, weights: currentWeights, categories: DEFAULT_CATEGORIES });
  });

  app.post('/api/config/weights', (req: Request, res: Response) => {
    const { weights } = req.body;
    if (weights) {
      currentWeights = { ...currentWeights, ...weights };
    }
    res.json({ success: true, weights: currentWeights });
  });

  // API Route: Reset dataset to default sample
  app.post('/api/admin/reset-data', (_req: Request, res: Response) => {
    currentRegions = [...SAMPLE_REGIONS];
    currentWeights = { ...DEFAULT_DIMENSION_WEIGHTS };
    res.json({ success: true, message: 'Dataset reset to calibrated demo baseline', count: currentRegions.length });
  });

  // API Route: Run automated test suite
  app.get('/api/tests/run', (_req: Request, res: Response) => {
    const testReport = runBharatTestSuite(currentRegions);
    res.json({ success: true, testReport });
  });

  // API Route: Data sources metadata
  app.get('/api/sources', (_req: Request, res: Response) => {
    res.json({ success: true, data: DATA_SOURCES });
  });

  // Mount Vite development middlewares in dev mode, or serve static dist in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bharat 2047 platform server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
