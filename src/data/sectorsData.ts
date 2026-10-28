import type { Sector } from '../types/index.ts';

export const SECTORS_CATALOG: Sector[] = [
  {
    id: 'sec_food_processing',
    name: 'Food Processing & Cold Storage',
    category: 'Primary / Agro',
    description: 'Value-addition to horticulture, grain, dairy, and spices through cold chain, food packaging, quality testing, and food manufacturing units.',
    requirements: {
      agriculture: 'High',
      manufacturing: 'Medium',
      services: 'Low',
      roadConnectivity: 'High',
      digitalConnectivity: 'Medium',
      electricity: 'High',
      water: 'High',
      workforce: 'High',
      higherEducation: 'Medium',
      logistics: 'High',
      renewablePotential: 'Medium'
    },
    keySkills: [
      'Food Safety & Quality Assurance (FSSAI)',
      'Cold Chain Fleet Operations',
      'Post-Harvest Management',
      'Food Processing Machinery Operation',
      'Sanitary Packaging Automation',
      'Agro-Supply Chain Coordination'
    ],
    jobRoles: [
      {
        title: 'Food Quality Assurance Specialist',
        skills: ['Microbiology testing', 'FSSAI standards', 'Hazard analysis', 'HACCP compliance'],
        education: 'B.Sc / B.Tech in Food Technology or Chemistry',
        training: 'FSSAI FoSTaC Master Certification',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹4.5L - ₹8.0L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Cold Storage Operations Supervisor',
        skills: ['Ammonia refrigeration systems', 'Inventory temperature logging', 'Warehouse management systems'],
        education: 'Diploma in Mechanical / Refrigeration & Air Conditioning',
        training: 'National Skill Development Corp (NSDC) Cold Storage Course',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹3.6L - ₹6.5L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Agro-Processing Plant Technician',
        skills: ['Sorting grading machinery', 'Extrusion operation', 'Preventative maintenance'],
        education: 'ITI in Mechanical / Electrical or 12th Vocational',
        training: 'PMKVY Agro Processing Plant Operator',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.4L - ₹4.0L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Packaging & Shelf-life Engineer',
        skills: ['Modified atmosphere packaging', 'Bio-degradable polymer seals', 'Barcode tagging'],
        education: 'B.Tech in Packaging / Chemical / Material Science',
        training: 'Indian Institute of Packaging (IIP) Diploma',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹5.0L - ₹9.5L PA',
        employmentPotential: 'Moderate'
      }
    ],
    businessOpportunities: [
      'Mini Mega-Food Park processing units',
      'Solar-powered packhouses and precooling chambers',
      'Organic pulp, juice, and fruit dehydration facilities',
      'Reefer truck fleet logistics for perishable farm produce',
      'GI-tagged local specialty product branding and export'
    ],
    requiredInfrastructure: [
      'Farm-gate aggregation collection centers',
      'Controlled atmosphere (CA) and deep-freeze cold storage',
      'Testing laboratories accredited by NABL',
      'Dedicated industrial water and uninterrupted power feeder lines',
      'Access to expressway or National Highway freight routes'
    ],
    developmentPathway: [
      'Raw crop harvest & regional collection',
      'Farm-gate grading, sorting & pre-cooling',
      'Value-added processing (dehydration, canning, pureeing)',
      'Nutritional testing & FSSAI certified packaging',
      'Cold-chain transport to urban retail and export ports',
      'Local farmer income appreciation & skilled rural employment'
    ],
    beneficiaries: [
      'Small and marginal farmers (reduced post-harvest spoilage)',
      'Rural youth seeking technical manufacturing wages',
      'Women Self-Help Groups (SHGs) engaged in micro-processing',
      'Local transport and cold-chain truck operators'
    ],
    ruralRelevance: 95,
    urbanRelevance: 45,
    womenInclusionPotential: 78
  },
  {
    id: 'sec_renewable_energy',
    name: 'Renewable Energy & Solar Parks',
    category: 'Green & Future Tech',
    description: 'Utility-scale and distributed solar photovoltaic, wind farms, green hydrogen generation, and battery energy storage integration.',
    requirements: {
      agriculture: 'Low',
      manufacturing: 'Medium',
      services: 'Medium',
      roadConnectivity: 'Medium',
      digitalConnectivity: 'Medium',
      electricity: 'High',
      water: 'Low',
      workforce: 'Medium',
      higherEducation: 'Medium',
      logistics: 'High',
      renewablePotential: 'High'
    },
    keySkills: [
      'Solar PV Array Design & Yield Simulation',
      'Grid Substation Synchronization',
      'Inverter Telemetry & SCADA Maintenance',
      'Drone-based Thermographic Inspection',
      'Battery Energy Storage Management'
    ],
    jobRoles: [
      {
        title: 'Solar Plant SCADA & Systems Engineer',
        skills: ['Inverter telemetry', 'Power distribution modeling', 'PLC programming'],
        education: 'B.Tech Electrical & Electronics Engineering',
        training: 'Surya Mitra Advanced Certification',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹5.5L - ₹10.0L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Solar PV Installation & Maintenance Technician',
        skills: ['String cabling', 'Module mounting', 'Earthing testing', 'Inverter maintenance'],
        education: 'ITI Electrical / Wireman or 10th + Technical Certificate',
        training: 'Skill Council for Green Jobs (SCGJ) Surya Mitra',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.8L - ₹4.5L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Wind Turbine Field Service Specialist',
        skills: ['Hydraulic systems', 'Nacelle mechanical checks', 'High-altitude rope access'],
        education: 'Diploma in Mechanical or Electrical',
        training: 'Global Wind Organisation (GWO) Safety Certification',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹4.8L - ₹8.5L PA',
        employmentPotential: 'Moderate'
      }
    ],
    businessOpportunities: [
      'Rooftop solar engineering, procurement & construction (EPC)',
      'Solar panel robotic waterless cleaning services',
      'Decentralized agricultural solar feeder installations (KUSUM)',
      'EV charging infrastructure along highways and commercial nodes'
    ],
    requiredInfrastructure: [
      'High-voltage green energy corridor substation connectivity',
      'Non-agricultural barren or semi-arid land parcels',
      'Heavy equipment transport roads for windmill blades and transformers',
      'Fiber-optic high-reliability telemetry communication links'
    ],
    developmentPathway: [
      'Solar/wind geospatial resource mapping & land lease',
      'Grid evacuation connectivity & substation commissioning',
      'Module procurement, mounting & stringing',
      'Smart SCADA monitoring & automated dispatch to national grid',
      'Clean energy monetization, green hydrogen feedstocks & carbon credits'
    ],
    beneficiaries: [
      'Farmers leasing non-cultivable land for passive rental income',
      'Rural diploma engineers trained in clean-tech maintenance',
      'Local industries seeking competitive green power tariffs'
    ],
    ruralRelevance: 88,
    urbanRelevance: 62,
    womenInclusionPotential: 48
  },
  {
    id: 'sec_it_digital',
    name: 'IT Services & Digital Economy',
    category: 'Tertiary / Services',
    description: 'Enterprise software development, data analytics, cloud infrastructure, AI model operations, and digital engineering services.',
    requirements: {
      agriculture: 'Low',
      manufacturing: 'Low',
      services: 'High',
      roadConnectivity: 'Medium',
      digitalConnectivity: 'High',
      electricity: 'High',
      water: 'Low',
      workforce: 'High',
      higherEducation: 'High',
      logistics: 'Low',
      renewablePotential: 'Medium'
    },
    keySkills: [
      'Full-Stack Software Engineering',
      'Cloud Architecture (AWS / GCP / Azure)',
      'Data Engineering & SQL Analytics',
      'Cybersecurity & Network Defense',
      'Machine Learning Model Deployment',
      'Business Process Automation'
    ],
    jobRoles: [
      {
        title: 'Cloud Application Developer',
        skills: ['TypeScript', 'Python', 'Docker', 'Kubernetes', 'REST/GraphQL APIs'],
        education: 'B.Tech / B.E / MCA / BCA in Computer Science',
        training: 'Certified Cloud Practitioner / Associate Developer',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹6.5L - ₹14.0L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Data Analyst & BI Specialist',
        skills: ['Power BI / Tableau', 'SQL', 'Python Pandas', 'Statistical Modeling'],
        education: 'B.Sc / B.Tech / B.Com with Analytics',
        training: 'NASSCOM FutureSkills Prime Big Data Certification',
        careerLevel: 'Entry',
        averageSalaryBand: '₹4.0L - ₹7.5L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Digital Customer Experience & QA Analyst',
        skills: ['Automated test scripting', 'Manual usability testing', 'Bug tracking tools'],
        education: 'Any Graduate with diploma in computing',
        training: 'ISTQB Certified Tester Foundation Level',
        careerLevel: 'Entry',
        averageSalaryBand: '₹3.2L - ₹5.5L PA',
        employmentPotential: 'High'
      }
    ],
    businessOpportunities: [
      'Tier 2/3 town IT delivery center and nearshore software agencies',
      'Localized GovTech solutions and civic digitisation services',
      'SaaS products for regional MSMEs and retailer supply chains',
      'Cybersecurity auditing and compliance consultancies'
    ],
    requiredInfrastructure: [
      'High-bandwidth dual-redundant fiber internet backbones',
      'Uninterrupted 24/7 power supply with commercial backup',
      'Grade-A commercial workspace or STPI technology parks',
      'Proximity to engineering colleges and universities'
    ],
    developmentPathway: [
      'University tech curriculum alignment with industry demands',
      'Incubation center establishment with subsidized bandwidth',
      'Local software development & offshore contracting units',
      'High-value intellectual property and product startups',
      'Youth brain drain prevention & high disposable income local growth'
    ],
    beneficiaries: [
      'College graduates from regional universities',
      'Women professionals benefiting from remote/hybrid work setups',
      'Local commercial hospitality and retail ecosystem'
    ],
    ruralRelevance: 32,
    urbanRelevance: 96,
    womenInclusionPotential: 82
  },
  {
    id: 'sec_textiles',
    name: 'Textiles, Handlooms & Apparel',
    category: 'Secondary / Industry',
    description: 'Yarn spinning, automated weaving, traditional handlooms, garment manufacturing, technical textiles, and fashion apparel export.',
    requirements: {
      agriculture: 'Medium',
      manufacturing: 'High',
      services: 'Low',
      roadConnectivity: 'High',
      digitalConnectivity: 'Medium',
      electricity: 'High',
      water: 'High',
      workforce: 'High',
      higherEducation: 'Low',
      logistics: 'High',
      renewablePotential: 'Low'
    },
    keySkills: [
      'Industrial Loom Operation & Maintenance',
      'CAD Apparel Pattern Making',
      'Textile Dyeing & Zero Liquid Discharge (ZLD)',
      'Quality Auditing for Export Standards',
      'Artisanal Weaving & Natural Dyeing'
    ],
    jobRoles: [
      {
        title: 'Garment Production Merchandiser',
        skills: ['Costing', 'Fabric sourcing', 'Export compliance', 'Order tracking'],
        education: 'Diploma / Degree in Textile Engineering or Fashion Tech',
        training: 'Apparel Training & Design Centre (ATDC) Diploma',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹4.0L - ₹7.0L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Industrial Sewing Machine Technician',
        skills: ['Specialized needlework', 'Automated overlock stitching', 'Pattern alignment'],
        education: '8th - 10th Standard',
        training: 'PMKVY Sewing Machine Operator Course',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.0L - ₹3.6L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Effluent Treatment & ZLD Plant Supervisor',
        skills: ['Reverse osmosis operation', 'Chemical doser adjustment', 'BOD/COD monitoring'],
        education: 'Diploma / B.Sc in Environmental Science / Chemical',
        training: 'State Pollution Control Board Certified Operator',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹3.8L - ₹6.5L PA',
        employmentPotential: 'Moderate'
      }
    ],
    businessOpportunities: [
      'Export-oriented knitwear and garment stitching unit',
      'Artisanal GI-tagged handloom cooperative brand for e-commerce',
      'Technical textile production for medical and agricultural use',
      'Common eco-friendly dyeing facility with solar power'
    ],
    requiredInfrastructure: [
      'Textile park with integrated Zero Liquid Discharge effluent plant',
      'Proximity to cotton/silk production hubs and ginning mills',
      'Container freight station (CFS) for rapid port connectivity',
      'Skilled worker hostels and industrial training centers'
    ],
    developmentPathway: [
      'Raw cotton/silk sourcing and yarn spinning',
      'Fabric weaving and certified eco-friendly processing',
      'High-precision garment cut, stitch and quality grading',
      'Global retail distribution and e-commerce platform sales',
      'Massive formal employment especially for women workforce'
    ],
    beneficiaries: [
      'Rural and semi-urban women seeking formal industrial wages',
      'Traditional handloom weaving communities preservation',
      'Local cotton and mulberry silk growers'
    ],
    ruralRelevance: 75,
    urbanRelevance: 70,
    womenInclusionPotential: 92
  },
  {
    id: 'sec_tourism_heritage',
    name: 'Cultural Tourism & Eco-Hospitality',
    category: 'Tertiary / Services',
    description: 'Heritage tourism, pilgrimage circuits, wildlife eco-resorts, wellness homestays, and culinary travel experiences.',
    requirements: {
      agriculture: 'Low',
      manufacturing: 'Low',
      services: 'High',
      roadConnectivity: 'High',
      digitalConnectivity: 'High',
      electricity: 'Medium',
      water: 'Medium',
      workforce: 'High',
      higherEducation: 'Medium',
      logistics: 'Medium',
      renewablePotential: 'Medium'
    },
    keySkills: [
      'Hospitality Front Office & Food Operations',
      'Multi-lingual Heritage Interpretation & Storytelling',
      'Eco-lodge Sustainable Operations',
      'Digital Marketing & Online Booking Management',
      'Safety, First Aid & Cultural Etiquette'
    ],
    jobRoles: [
      {
        title: 'Certified Heritage Storyteller / Tour Guide',
        skills: ['Historical research', 'Public speaking', 'Foreign languages', 'First-aid'],
        education: 'Degree in History / Tourism or Any Graduate',
        training: 'Ministry of Tourism Regional Level Guide (RLG) Certification',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹3.0L - ₹6.5L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Boutique Homestay General Manager',
        skills: ['Guest relations', 'Inventory management', 'Culinary curation', 'Local sourcing'],
        education: 'Degree / Diploma in Hotel Management',
        training: 'Federation of Hotel & Restaurant Associations Certification',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹4.5L - ₹8.0L PA',
        employmentPotential: 'Moderate'
      },
      {
        title: 'Hospitality Operations Associate',
        skills: ['Housekeeping standards', 'Food & beverage service', 'POS billing'],
        education: '10th / 12th Standard',
        training: 'Hunar Se Rozgar Tak (HSRT) Skill Scheme',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.2L - ₹3.8L PA',
        employmentPotential: 'Very High'
      }
    ],
    businessOpportunities: [
      'Experiential heritage homestay network',
      'Curated experiential tourism and adventure trails',
      'Ethnic culinary restaurants and farm-to-table dining',
      'Souvenir and authentic local crafts marketplace'
    ],
    requiredInfrastructure: [
      'All-weather road connectivity to heritage monuments & natural sites',
      'High-speed public Wi-Fi and digital payment infrastructure',
      'Clean sanitation facilities and tourist interpretation centers',
      'Tourist security and emergency medical response facilities'
    ],
    developmentPathway: [
      'Heritage preservation & tourist convenience civic upgrades',
      'Homestay policy incentives and host hospitality training',
      'Multi-channel global marketing & festival curation',
      'High tourist footfall and diversified spending in local shops',
      'Preservation of living traditions and broad-based services employment'
    ],
    beneficiaries: [
      'Local youth in hospitality, transport, and guiding',
      'Artisans and folk performers directly monetizing cultural skills',
      'Small family-run restaurants and homestay owners'
    ],
    ruralRelevance: 82,
    urbanRelevance: 85,
    womenInclusionPotential: 76
  },
  {
    id: 'sec_precision_mfg',
    name: 'Precision Engineering & Auto Components',
    category: 'Secondary / Industry',
    description: 'CNC machining, metal forging, automotive subsystems, defense hardware, pump manufacturing, and industrial tooling.',
    requirements: {
      agriculture: 'Low',
      manufacturing: 'High',
      services: 'Medium',
      roadConnectivity: 'High',
      digitalConnectivity: 'Medium',
      electricity: 'High',
      water: 'Medium',
      workforce: 'High',
      higherEducation: 'Medium',
      logistics: 'High',
      renewablePotential: 'Medium'
    },
    keySkills: [
      'CNC Machine Programming (Fanuc / Siemens)',
      'Geometric Dimensioning & Tolerancing (GD&T)',
      'Foundry Metallurgy & Die Casting',
      'Quality Control with CMM Inspection',
      'Lean Manufacturing & Six Sigma'
    ],
    jobRoles: [
      {
        title: 'CNC Programmer & Machinist',
        skills: ['G-Code/M-Code', 'CAD/CAM modeling', 'Tool offset calibration', 'Micrometer verification'],
        education: 'Diploma / ITI Machinist or Tool & Die',
        training: 'Advanced Training Institute (ATI) CNC Certification',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹3.6L - ₹6.8L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Quality Assurance Inspector (Metrology)',
        skills: ['Coordinate Measuring Machine (CMM)', 'Surface roughness testing', 'Calibration records'],
        education: 'Diploma / B.Tech in Mechanical',
        training: 'Six Sigma Green Belt & Metrology Training',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹4.2L - ₹7.5L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Industrial Robot Operator & Welder',
        skills: ['MIG/TIG welding', 'Robotic arm pendant programming', 'Safety interlocking'],
        education: 'ITI Welder / Fitter',
        training: 'Automotive Skills Development Council (ASDC) Certified',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.8L - ₹4.5L PA',
        employmentPotential: 'High'
      }
    ],
    businessOpportunities: [
      'Tier-2 specialized component machining workshop',
      'Die casting and precision aluminum tooling facility',
      'Component finishing, powder coating and electroplating services',
      'Industrial spares warehouse and maintenance contracting'
    ],
    requiredInfrastructure: [
      'Industrial park with high-capacity electrical sub-station',
      'Access to testing labs with Coordinate Measuring Machines',
      'Proximity to steel and aluminum raw material suppliers',
      'Freight expressway connectivity for just-in-time delivery'
    ],
    developmentPathway: [
      'Tool room establishment & supplier vendor enlistment',
      'Trial runs, ISO/IATF 16949 automotive certification',
      'High-volume component supply to national OEMs',
      'Expansion into defense components and aerospace parts',
      'Creation of durable technical jobs and export capabilities'
    ],
    beneficiaries: [
      'Polytechnic and ITI graduates',
      'Engineering entrepreneurs launching ancillaries',
      'Local metal and raw material transport operators'
    ],
    ruralRelevance: 35,
    urbanRelevance: 90,
    womenInclusionPotential: 44
  },
  {
    id: 'sec_logistics_multimodal',
    name: 'Multimodal Logistics & Warehousing',
    category: 'Tertiary / Services',
    description: 'Inland container depots, automated sorting hubs, freight forwarding, cold storage transport, and highway logistics corridors.',
    requirements: {
      agriculture: 'Low',
      manufacturing: 'Medium',
      services: 'High',
      roadConnectivity: 'High',
      digitalConnectivity: 'High',
      electricity: 'High',
      water: 'Low',
      workforce: 'High',
      higherEducation: 'Low',
      logistics: 'High',
      renewablePotential: 'Medium'
    },
    keySkills: [
      'Warehouse Management Systems (WMS)',
      'Forklift & Automated Guided Vehicle Operation',
      'Freight Forwarding & Customs Clearance',
      'Fleet Route Optimization',
      'Inventory Barcode & RFID Auditing'
    ],
    jobRoles: [
      {
        title: 'Logistics Operations Dispatcher',
        skills: ['Transport ERP', 'GPS fleet tracking', 'Driver roster scheduling', 'E-Way bill verification'],
        education: 'Graduate / Diploma in Supply Chain',
        training: 'Logistics Sector Skill Council (LSSC) Certification',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹3.8L - ₹6.2L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Certified Forklift & Heavy Equipment Operator',
        skills: ['Counterbalance forklift', 'High-reach stacker', 'Safety inspection', 'Load balancing'],
        education: '10th Standard + Commercial Driving License',
        training: 'LSSC Heavy Equipment Driving Certificate',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.6L - ₹4.2L PA',
        employmentPotential: 'Very High'
      },
      {
        title: 'Warehouse Inventory Controller',
        skills: ['Cycle counting', 'WMS software', 'Reorder point algorithms', 'Barcode scanners'],
        education: 'B.Com / B.Sc or Diploma',
        training: 'Certified Supply Chain Professional Training',
        careerLevel: 'Mid-Career',
        averageSalaryBand: '₹3.5L - ₹5.8L PA',
        employmentPotential: 'High'
      }
    ],
    businessOpportunities: [
      'Modern pre-engineered building (PEB) Grade-A warehouse leasing',
      'Inter-district last-mile delivery franchise network',
      'Fleet aggregator platform for rural freight consolidation',
      'Pallet repair and wooden/plastic packing services'
    ],
    requiredInfrastructure: [
      'Direct access to 4-lane or 6-lane National Highway or expressway',
      'Dedicated railway freight siding or ICD connectivity',
      'Uninterrupted 24/7 power supply and solar-ready roofing',
      'Truck driver resting plazas and repair facilities'
    ],
    developmentPathway: [
      'Land consolidation along strategic transport freight nodes',
      'Construction of high-bay Grade-A logistics warehouses',
      'Attracting national e-commerce and retail FMCG distribution hubs',
      'Integration with inland water or rail container terminals',
      'Massive reduction in regional logistics friction & abundant local jobs'
    ],
    beneficiaries: [
      'Regional farmers and manufacturers gaining lower transit costs',
      'Local youth employed in inventory management and transport',
      'Highway roadside commerce and services ecosystem'
    ],
    ruralRelevance: 65,
    urbanRelevance: 88,
    womenInclusionPotential: 42
  },
  {
    id: 'sec_pharma_biotech',
    name: 'Pharmaceuticals & Medical Devices',
    category: 'Secondary / Industry',
    description: 'Active Pharmaceutical Ingredients (API), generic formulations, diagnostic equipment, herbal medicine, and biomedical manufacturing.',
    requirements: {
      agriculture: 'Low',
      manufacturing: 'High',
      services: 'Medium',
      roadConnectivity: 'High',
      digitalConnectivity: 'High',
      electricity: 'High',
      water: 'High',
      workforce: 'Medium',
      higherEducation: 'High',
      logistics: 'High',
      renewablePotential: 'Medium'
    },
    keySkills: [
      'Good Manufacturing Practices (cGMP)',
      'HPLC & Chemical Chromatography',
      'Formulation Development',
      'Sterile Cleanroom Operations',
      'Regulatory Drug Dossier Filing'
    ],
    jobRoles: [
      {
        title: 'Analytical Quality Control Chemist',
        skills: ['HPLC', 'Gas Chromatography', 'Dissolution testing', 'Pharmacopeial standards'],
        education: 'B.Pharm / M.Pharm / M.Sc Chemistry',
        training: 'Life Sciences Sector Skill Council (LSSSDC) Certification',
        careerLevel: 'Specialist',
        averageSalaryBand: '₹4.5L - ₹8.5L PA',
        employmentPotential: 'High'
      },
      {
        title: 'Cleanroom Production Operator',
        skills: ['Autoclave operation', 'Blister packaging machine', 'Gowning protocols'],
        education: 'D.Pharm / B.Sc / Diploma',
        training: 'cGMP Cleanroom Protocols Course',
        careerLevel: 'Entry',
        averageSalaryBand: '₹2.8L - ₹4.5L PA',
        employmentPotential: 'Very High'
      }
    ],
    businessOpportunities: [
      'Contract manufacturing organization (CMO) for generics',
      'Herbal extraction and AYUSH wellness product manufacturing',
      'Medical disposables (syringes, IV sets, bandages) production',
      'Pharma analytical testing and stability chamber laboratory'
    ],
    requiredInfrastructure: [
      'Pharma park with dedicated common effluent treatment plant (CETP)',
      'Reliable purified water generation systems',
      'Cold-chain transport to international cargo airports',
      'Continuous power supply without voltage fluctuations'
    ],
    developmentPathway: [
      'Zoned pharmaceutical park allocation with environmental clearance',
      'Cleanroom construction and state drug authority licensing',
      'Manufacturing validation batches and WHO-GMP audits',
      'Domestic distribution and generic exports to global markets',
      'Creation of high-technology science careers and resilient healthcare supply'
    ],
    beneficiaries: [
      'Science and pharmacy graduates from regional universities',
      'Domestic population benefiting from affordable accessible medicine',
      'Chemical and packaging suppliers'
    ],
    ruralRelevance: 30,
    urbanRelevance: 85,
    womenInclusionPotential: 65
  }
];
