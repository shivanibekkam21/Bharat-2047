# BHARAT 2047: Regional Data Dictionary

| Indicator Field | Type | Expected Range | Description & Source Citation |
|:---|:---|:---|:---|
| `id` | String | Unique slug | Primary key (e.g., `reg_up_varanasi`) |
| `country` | String | 'India' | Sovereign geographic entity |
| `state` | String | Text | State or Union Territory name |
| `district` | String | Text | District name |
| `coordinates` | Array[2] | Lat/Lng | Geographic latitude and longitude for cartography |
| `population` | Integer | $\ge 0$ | Total district population (Census projected) |
| `population_growth` | Float | -5% to +10% | Annual decadal growth rate |
| `urban_population_percentage` | Float | 0–100% | Percentage living in urban municipal areas |
| `rural_population_percentage` | Float | 0–100% | Percentage living in rural panchayat areas |
| `literacy_rate` | Float | 0–100% | Percentage of population capable of reading & writing (UDISE+) |
| `higher_education_rate` | Float | 0–100% | Gross Enrolment Ratio in tertiary education (AISHE) |
| `youth_population_percentage` | Float | 0–100% | Demographic percentage aged 15–29 years |
| `unemployment_rate` | Float | 0–100% | Usual Status unemployment percentage (PLFS) |
| `workforce_participation` | Float | 0–100% | Labor force participation rate (PLFS) |
| `women_workforce_participation`| Float | 0–100% | Female labor force participation rate (PLFS) |
| `agriculture_index` | Float | 0–100 | Gross cropped area, cropping intensity, irrigation (DES) |
| `manufacturing_index` | Float | 0–100 | Industrial output, registered factories (ASI / Udyam) |
| `services_index` | Float | 0–100 | Tertiary sector output, IT, financial services (MoSPI) |
| `tourism_index` | Float | 0–100 | Heritage footfall, hotel keys, pilgrimage circuits (MoT) |
| `industrial_presence` | Float | 0–100 | Active industrial estates, defense corridors, SEZs |
| `msme_presence` | Float | 0–100 | Udyam registered MSME density per 10k population |
| `startup_ecosystem` | Float | 0–100 | DPIIT recognized startups, incubators, seed funds |
| `export_potential` | Float | 0–100 | Merchandise & services export readiness (DGFT) |
| `digital_connectivity` | Float | 0–100 | Broadband fiber penetration, 4G/5G tower density (DoT) |
| `road_connectivity` | Float | 0–100 | National Highway & expressway road density (MoRTH) |
| `railway_connectivity` | Float | 0–100 | Rail network density, freight siding availability |
| `logistics_index` | Float | 0–100 | Multi-modal connectivity, dry ports, ICDs (DPIIT) |
| `electricity_access` | Float | 0–100 | 24/7 reliability, industrial feeder availability (CEA) |
| `healthcare_access` | Float | 0–100 | Hospital beds per 1,000, primary health centers (HMIS) |
| `education_access` | Float | 0–100 | Secondary schools & vocational institutions density |
| `water_availability` | Float | 0–100 | Surface water basins & groundwater stage (CGWB) |
| `renewable_energy_potential` | Float | 0–100 | Solar GHI and wind power density (NISE / NIWE) |
| `environmental_stress` | Float | 0–100 | Air AQI, groundwater depletion, industrial effluent risk |
| `zone` | Enum | North/South/East/West/Central/North-East | Geographic macro zone |
| `tier` | Enum | Tier 1/Tier 2/Tier 3/Aspirational District | Administrative development classification |
