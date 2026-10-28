# BHARAT 2047: System Architecture Documentation

## 1. High-Level Architectural Topology

Bharat 2047 operates as a unified full-stack decision-support system. It marries an Express.js API backend running on Node with a high-performance React 19 frontend compiled via Vite.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT VIEWPORT (React 19)                      │
│  - National Overview (SVG Map)           - 2047 Simulator & Multi-Compare   │
│  - District Dashboard (7D Radar)         - Student & Youth Career Portal    │
│  - AI Opportunity Engine (Explainability)- Entrepreneur Siting Portal       │
│  - ML Cluster Scatter Plot (K-Means)     - Executive Report PDF Generator   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ JSON RPC / REST Fetch
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                             EXPRESS REST API SERVER                         │
│  GET  /api/regions                        POST /api/regions/:id/simulate    │
│  GET  /api/regions/:id                    GET  /api/regions/compare         │
│  GET  /api/regions/:id/opportunities      POST /api/ml/cluster              │
│  GET  /api/regions/:id/gaps               POST /api/admin/import            │
│  GET  /api/sectors                        GET  /api/tests/run               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ In-Memory Store & Algorithmic Engines
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                               SERVICE ENGINES                               │
│  1. Analytics Engine: Multi-dimensional weighted index & gap diagnostics    │
│  2. ML Clustering Engine: K-Means++, z-score matrix, dynamic naming         │
│  3. Opportunity Matching Engine: MCDM vector similarity & factor weights    │
│  4. Ingestion Engine: Schema validation, integer/float range constraints    │
│  5. Automated Test Runner: 6 comprehensive test suites with live asserts    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Component Design & State Management

- **Predictable Data Flow**: The application root (`src/App.tsx`) holds the state of `regions` (extensible by CSV upload) and `weights`.
- **Dynamic Memoization**: All scores (`scoresMap`), cluster typologies, and ranked opportunities update reactively whenever regional data or policy weights change.
- **Visual Cartography**: Uses a normalized mathematical projection `(lat, lng) -> (SVG x, y)` mapped over India's bounding coordinates (8°N–37°N, 68°E–97°E) with intensity fill computed dynamically from `developmentIndex`.

## 3. Storage and Persistence

- **Baseline Seed**: Seeded with 30+ calibrated district profiles representing diverse tiers (Tier 1 metros, Tier 2 hubs, Tier 3 industrial towns, and Aspirational Districts).
- **Admin Ingestion**: The CSV validator supports schema parsing, data sanitization, duplicate checks, and live addition to the active dataset without requiring server reboots.
