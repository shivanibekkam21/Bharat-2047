# BHARAT 2047: Machine Learning & Algorithmic Methodology

## 1. Feature Representation & Standardization

Before clustering or similarity ranking, the regional indicator matrix is standardized using standard z-score normalization:

$$z_{ij} = \frac{x_{ij} - \mu_j}{\sigma_j}$$

Where:
- $x_{ij}$ is the raw value of feature $j$ for region $i$.
- $\mu_j$ is the empirical mean of feature $j$ across all regions in the dataset.
- $\sigma_j$ is the standard deviation of feature $j$.

Features included in clustering:
1. `agriculture_index`
2. `manufacturing_index`
3. `services_index`
4. `literacy_rate`
5. `youth_population_percentage`
6. `unemployment_rate`
7. `road_connectivity`
8. `digital_connectivity`
9. `tourism_index`
10. `renewable_energy_potential`

---

## 2. Unsupervised Regional Clustering (K-Means++)

1. **Centroid Initialization (K-Means++)**:
   - First centroid $\mu_1$ is selected deterministically near the dataset median.
   - Subsequent centroids $\mu_2, \dots, \mu_k$ are chosen with probability proportional to the squared Euclidean distance to the nearest existing centroid ($D(x)^2$).
2. **Expectation-Maximization Iteration**:
   - Assign each region vector $x_i$ to the closest centroid:
     $$c^{(i)} = \arg\min_j \|x_i - \mu_j\|^2$$
   - Recompute centroids:
     $$\mu_j = \frac{1}{|S_j|} \sum_{i \in S_j} x_i$$
   - Repeat until convergence or maximum iterations (100).
3. **Inertia Computation**:
   $$I = \sum_{j=1}^k \sum_{i \in S_j} \|x_i - \mu_j\|^2$$
4. **Dynamic Typology Naming**:
   - Avoids hardcoded static cluster labels.
   - For each cluster, features are ranked by positive centroid z-score deviations from the national mean.
   - The top 2 dominant features synthesize the cluster typology title (e.g., *High Agro-Economy & Renewable Clean Energy Region* or *Industrial Manufacturing & Multimodal Freight Corridor*).

---

## 3. Multi-Criteria Opportunity Recommendation (MCDM-AHP)

For each sector $s \in \text{Sectors}$, a requirement profile $R_s$ defines required levels (High, Medium, Low) across 11 key infrastructure and resource dimensions.

1. **Satisfaction Ratio**:
   $$\text{Sat}_{ij} = \min\left(100, \frac{x_{ij}}{\text{Target}_j} \times 100\right)$$
2. **Weighted Compatibility Score**:
   $$\text{Score}(r, s) = \frac{\sum_j w_j \cdot \text{Sat}_{ij}}{\sum_j w_j} + \Delta_{\text{mode}}$$
   Where $\Delta_{\text{mode}}$ modulates scores for *Rural Priority Mode* or *Urban Growth Mode*.

---

## 4. Scenario Sensitivity Simulator

The 2047 simulator models cross-elastic impacts of policy levers:
- Infrastructure investments ($\Delta_{\text{roads}}, \Delta_{\text{digital}}$) apply positive multipliers to local logistics and manufacturing indices.
- Skilling initiatives ($\Delta_{\text{skills}}$) improve human capital, raise workforce participation, and reduce unemployment.
- Environmental stress reflects an equilibrium between industrial growth (marginal increase) and clean energy adoption (significant reduction).
