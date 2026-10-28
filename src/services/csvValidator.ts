import type { Region } from '../types/index.ts';

export interface CSVValidationError {
  row: number;
  district?: string;
  field: string;
  value: string;
  message: string;
}

export interface CSVValidationResult {
  totalRows: number;
  validCount: number;
  errorCount: number;
  validRegions: Partial<Region>[];
  errors: CSVValidationError[];
  summaryMessage: string;
}

/**
 * Standard CSV Template string that users or admins can download
 */
export const CSV_TEMPLATE_HEADER = [
  'district',
  'state',
  'country',
  'population',
  'population_growth',
  'urban_population_percentage',
  'rural_population_percentage',
  'literacy_rate',
  'higher_education_rate',
  'youth_population_percentage',
  'unemployment_rate',
  'workforce_participation',
  'women_workforce_participation',
  'agriculture_index',
  'manufacturing_index',
  'services_index',
  'tourism_index',
  'industrial_presence',
  'msme_presence',
  'startup_ecosystem',
  'export_potential',
  'digital_connectivity',
  'road_connectivity',
  'railway_connectivity',
  'logistics_index',
  'electricity_access',
  'healthcare_access',
  'education_access',
  'water_availability',
  'renewable_energy_potential',
  'environmental_stress',
  'zone',
  'tier'
].join(',');

export const CSV_SAMPLE_ROWS = `district,state,country,population,population_growth,urban_population_percentage,rural_population_percentage,literacy_rate,higher_education_rate,youth_population_percentage,unemployment_rate,workforce_participation,women_workforce_participation,agriculture_index,manufacturing_index,services_index,tourism_index,industrial_presence,msme_presence,startup_ecosystem,export_potential,digital_connectivity,road_connectivity,railway_connectivity,logistics_index,electricity_access,healthcare_access,education_access,water_availability,renewable_energy_potential,environmental_stress,zone,tier
Meerut,Uttar Pradesh,India,3443689,1.82,51.4,48.6,72.8,29.4,34.1,7.2,51.8,24.5,74,78,71,58,76,82,49,76,79,88,86,84,91,78,81,72,64,52,North,Tier 2
Kollam,Kerala,India,2635375,0.48,45.1,54.9,94.1,38.2,28.4,8.5,50.2,33.1,65,58,74,76,54,72,48,79,89,84,86,81,96,92,94,84,72,36,South,Tier 2`;

/**
 * Validates and parses uploaded CSV text
 */
export function validateAndParseRegionalCSV(csvText: string): CSVValidationResult {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length < 2) {
    return {
      totalRows: 0,
      validCount: 0,
      errorCount: 1,
      validRegions: [],
      errors: [{ row: 1, field: 'file', value: '', message: 'CSV file is empty or missing headers.' }],
      summaryMessage: 'Uploaded file is empty or invalid.'
    };
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const requiredHeaders = ['district', 'state'];
  const missingRequired = requiredHeaders.filter(h => !headers.includes(h));

  if (missingRequired.length > 0) {
    return {
      totalRows: lines.length - 1,
      validCount: 0,
      errorCount: 1,
      validRegions: [],
      errors: [{
        row: 1,
        field: 'headers',
        value: headers.join(', '),
        message: `Missing mandatory columns: ${missingRequired.join(', ')}`
      }],
      summaryMessage: `Invalid CSV format: Missing columns ${missingRequired.join(', ')}`
    };
  }

  const validRegions: Partial<Region>[] = [];
  const errors: CSVValidationError[] = [];

  // 0-100 range validation fields
  const range0to100Fields = [
    'literacy_rate',
    'higher_education_rate',
    'youth_population_percentage',
    'unemployment_rate',
    'workforce_participation',
    'women_workforce_participation',
    'urban_population_percentage',
    'rural_population_percentage',
    'agriculture_index',
    'manufacturing_index',
    'services_index',
    'tourism_index',
    'industrial_presence',
    'msme_presence',
    'startup_ecosystem',
    'export_potential',
    'digital_connectivity',
    'road_connectivity',
    'railway_connectivity',
    'logistics_index',
    'electricity_access',
    'healthcare_access',
    'education_access',
    'water_availability',
    'renewable_energy_potential',
    'environmental_stress'
  ];

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cols = parseCSVRow(lines[i]);
    const rowObj: Record<string, string> = {};

    headers.forEach((h, idx) => {
      rowObj[h] = cols[idx] !== undefined ? cols[idx].trim() : '';
    });

    const district = rowObj['district'] || '';
    const state = rowObj['state'] || '';
    let rowHasError = false;

    if (!district) {
      errors.push({
        row: rowNum,
        district,
        field: 'district',
        value: '',
        message: `Row ${rowNum}: 'district' name cannot be empty.`
      });
      rowHasError = true;
    }

    if (!state) {
      errors.push({
        row: rowNum,
        district,
        field: 'state',
        value: '',
        message: `Row ${rowNum}: 'state' name cannot be empty.`
      });
      rowHasError = true;
    }

    // Population >= 0
    if (rowObj['population']) {
      const pop = Number(rowObj['population']);
      if (isNaN(pop) || pop < 0) {
        errors.push({
          row: rowNum,
          district,
          field: 'population',
          value: rowObj['population'],
          message: `Row ${rowNum}: population = ${rowObj['population']}. Invalid value. Expected non-negative integer >= 0.`
        });
        rowHasError = true;
      }
    }

    // Check 0-100 fields
    for (const field of range0to100Fields) {
      if (rowObj[field] !== undefined && rowObj[field] !== '') {
        const val = Number(rowObj[field]);
        if (isNaN(val) || val < 0 || val > 100) {
          errors.push({
            row: rowNum,
            district,
            field,
            value: rowObj[field],
            message: `Row ${rowNum} (${district || 'District'}): ${field} = ${rowObj[field]}. Invalid value. Expected 0–100.`
          });
          rowHasError = true;
        }
      }
    }

    if (!rowHasError) {
      const parsedRegion: Partial<Region> = {
        id: `reg_${state.toLowerCase().slice(0, 2)}_${district.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`,
        country: rowObj['country'] || 'India',
        state,
        district,
        population: Number(rowObj['population']) || 1500000,
        population_growth: Number(rowObj['population_growth']) || 1.5,
        urban_population_percentage: Number(rowObj['urban_population_percentage']) || 35,
        rural_population_percentage: Number(rowObj['rural_population_percentage']) || 65,
        literacy_rate: Number(rowObj['literacy_rate']) || 75,
        higher_education_rate: Number(rowObj['higher_education_rate']) || 28,
        youth_population_percentage: Number(rowObj['youth_population_percentage']) || 32,
        unemployment_rate: Number(rowObj['unemployment_rate']) || 6.5,
        workforce_participation: Number(rowObj['workforce_participation']) || 52,
        women_workforce_participation: Number(rowObj['women_workforce_participation']) || 28,
        agriculture_index: Number(rowObj['agriculture_index']) || 65,
        manufacturing_index: Number(rowObj['manufacturing_index']) || 60,
        services_index: Number(rowObj['services_index']) || 65,
        tourism_index: Number(rowObj['tourism_index']) || 60,
        industrial_presence: Number(rowObj['industrial_presence']) || 55,
        msme_presence: Number(rowObj['msme_presence']) || 65,
        startup_ecosystem: Number(rowObj['startup_ecosystem']) || 45,
        export_potential: Number(rowObj['export_potential']) || 60,
        digital_connectivity: Number(rowObj['digital_connectivity']) || 75,
        road_connectivity: Number(rowObj['road_connectivity']) || 75,
        railway_connectivity: Number(rowObj['railway_connectivity']) || 70,
        logistics_index: Number(rowObj['logistics_index']) || 70,
        electricity_access: Number(rowObj['electricity_access']) || 90,
        healthcare_access: Number(rowObj['healthcare_access']) || 75,
        education_access: Number(rowObj['education_access']) || 80,
        water_availability: Number(rowObj['water_availability']) || 70,
        renewable_energy_potential: Number(rowObj['renewable_energy_potential']) || 70,
        environmental_stress: Number(rowObj['environmental_stress']) || 40,
        zone: (rowObj['zone'] as Region['zone']) || 'North',
        tier: (rowObj['tier'] as Region['tier']) || 'Tier 2',
        updated_at: new Date().toISOString().split('T')[0]
      };
      validRegions.push(parsedRegion);
    }
  }

  const validCount = validRegions.length;
  const errorCount = errors.length;
  const totalRows = lines.length - 1;

  let summaryMessage = `Uploaded ${totalRows} districts: ${validCount} valid`;
  if (errorCount > 0) {
    summaryMessage += `, ${errorCount} require correction`;
  } else {
    summaryMessage += ', 0 errors found';
  }

  return {
    totalRows,
    validCount,
    errorCount,
    validRegions,
    errors,
    summaryMessage
  };
}

/**
 * Parses a single CSV row handling quotes and commas
 */
function parseCSVRow(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.replace(/^"|"$/g, ''));
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.replace(/^"|"$/g, ''));
  return result;
}
