# BHARAT 2047: REST API Specification

Base Endpoint: `http://localhost:3000/api`

---

### 1. Regions

#### `GET /api/regions`
Returns all registered districts with calculated Prototype Development Index.
- **Query Params**:
  - `state` (optional): Filter by State name
  - `zone` (optional): Filter by zone (`North`, `South`, `East`, `West`, `Central`, `North-East`)
  - `tier` (optional): Filter by tier (`Tier 1`, `Tier 2`, `Tier 3`, `Aspirational District`)
  - `search` (optional): Search district/state substring

#### `GET /api/regions/:id`
Returns full profile of a district including calculated multi-dimensional scores and detected structural gaps.

#### `GET /api/regions/:id/development-index`
Returns detailed breakdown of the 7 dimension scores and weights used.

#### `GET /api/regions/:id/opportunities`
Returns ranked development opportunities with explainable AI factors.
- **Query Params**:
  - `mode`: `balanced` | `rural` | `urban`

#### `GET /api/regions/:id/gaps`
Returns structural development bottlenecks and recommended policy interventions.

---

### 2. Sensitivity Simulation

#### `POST /api/regions/:id/simulate`
Executes 2047 scenario simulation under specified policy levers.
- **Body JSON**:
  ```json
  {
    "roadConnectivityDelta": 15,
    "digitalConnectivityDelta": 15,
    "industrialInvestmentDelta": 20,
    "skillDevelopmentDelta": 20,
    "renewableEnergyDelta": 15,
    "healthcareAccessDelta": 10,
    "msmeClusterFocus": 20,
    "tourismPromotion": 10
  }
  ```
- **Returns**: Baseline scores, scenario scores, metric deltas, projected employment growth %, and new enterprises.

---

### 3. Comparison & Clustering

#### `GET /api/regions/compare?ids=reg_up_varanasi,reg_mh_pune`
Benchmarks up to 4 regions side-by-side.

#### `POST /api/ml/cluster`
Executes unsupervised K-Means clustering.
- **Body JSON**: `{ "k": 5 }`
- **Returns**: Number of clusters, inertia, dynamic cluster profiles, and region assignments.

---

### 4. Portals & Matching

#### `POST /api/users/profile/match`
Matches student/youth or entrepreneur profiles against regional opportunity indices.

---

### 5. Administration & Data Ingestion

#### `POST /api/admin/import`
Validates and ingests regional CSV text.
- **Body JSON**: `{ "csvContent": "...", "overwrite": true }`

#### `GET /api/tests/run`
Executes automated test suite and returns assertion pass/fail results.
