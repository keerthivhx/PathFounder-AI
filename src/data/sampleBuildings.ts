import { BuildingGraph } from '../types';

export const APEX_UNIVERSITY: BuildingGraph = {
  id: 'apex-univ-tech',
  name: 'Apex University - Technology Block',
  category: 'university',
  description: 'Main Academic & Administrative Building featuring Dean, Accounts, Labs, and Student Services.',
  address: 'Campus West Road, Tech City',
  floors: [
    { floorNumber: 0, floorName: 'Ground Floor', gridWidth: 1000, gridHeight: 600 },
    { floorNumber: 1, floorName: 'First Floor', gridWidth: 1000, gridHeight: 600 }
  ],
  nodes: [
    // Ground Floor
    {
      id: 'univ-main-gate',
      name: 'Main Entrance & Gate',
      category: 'entrance',
      floor: 0,
      x: 10,
      y: 50,
      description: 'North Main Gate with digital directory kiosk',
      landmarkHint: 'Beside the glass security turnstiles',
      qrCodeId: 'QR-UNIV-ENTRANCE-01',
      isAccessible: true,
      aliases: ['gate', 'entry', 'main door', 'outside']
    },
    {
      id: 'univ-info-desk',
      name: 'Help & Information Desk',
      category: 'office',
      floor: 0,
      x: 25,
      y: 50,
      description: 'Central help desk for visitor passes and campus inquiries',
      landmarkHint: 'Bright blue circular counter in central atrium',
      qrCodeId: 'QR-UNIV-INFO-02',
      isAccessible: true,
      aliases: ['help desk', 'reception', 'enquiry', 'visitor desk']
    },
    {
      id: 'univ-accounts-office',
      name: 'Accounts & Fee Section',
      category: 'counter',
      floor: 0,
      x: 45,
      y: 25,
      description: 'Tuition fee payments, clearance certificates, and scholarship counters',
      landmarkHint: 'Next to HDFC ATM Machine',
      qrCodeId: 'QR-UNIV-ACCOUNTS-03',
      isAccessible: true,
      aliases: ['accounts', 'fee counter', 'pay fee', 'finance', 'billing', 'dues']
    },
    {
      id: 'univ-principal-office',
      name: 'Principal Office',
      category: 'office',
      floor: 0,
      x: 75,
      y: 25,
      description: 'Office of the College Principal and Administrative Boardroom',
      landmarkHint: 'Past the teakwood corridor door',
      qrCodeId: 'QR-UNIV-PRINCIPAL-04',
      isAccessible: true,
      aliases: ['principal', 'head of college', 'director', 'admin office']
    },
    {
      id: 'univ-canteen',
      name: 'Central Cafeteria',
      category: 'cafeteria',
      floor: 0,
      x: 85,
      y: 75,
      description: 'Food court, coffee lounge, and seating arena',
      landmarkHint: 'Glass wall overlooking sports courtyard',
      qrCodeId: 'QR-UNIV-CANTEEN-05',
      isAccessible: true,
      aliases: ['canteen', 'food court', 'cafeteria', 'coffee', 'snacks', 'eat']
    },
    {
      id: 'univ-washroom-gf',
      name: 'Ground Floor Restrooms',
      category: 'washroom',
      floor: 0,
      x: 45,
      y: 75,
      description: 'Wheelchair accessible restrooms & baby care station',
      landmarkHint: 'Opposite to water dispenser kiosk',
      qrCodeId: 'QR-UNIV-WASHROOM-06',
      isAccessible: true,
      aliases: ['washroom', 'toilet', 'restroom', 'bathroom', 'wc', 'accessible washroom']
    },
    {
      id: 'univ-elevator-gf',
      name: 'Central Elevator (GF)',
      category: 'elevator',
      floor: 0,
      x: 50,
      y: 50,
      description: 'High speed accessible lift connecting Floor 0 and Floor 1',
      landmarkHint: 'Stainless steel double doors near atrium pillar 3',
      qrCodeId: 'QR-UNIV-LIFT-07',
      isAccessible: true,
      aliases: ['lift', 'elevator', 'go up']
    },
    {
      id: 'univ-stairs-gf',
      name: 'Main Staircase (GF)',
      category: 'stairs',
      floor: 0,
      x: 60,
      y: 50,
      description: 'Grand staircase to upper academic departments',
      landmarkHint: 'Under the hanging brass clock',
      qrCodeId: 'QR-UNIV-STAIRS-08',
      isAccessible: false,
      aliases: ['stairs', 'staircase', 'steps']
    },
    {
      id: 'univ-emergency-exit-gf1',
      name: 'North Emergency Exit (GF)',
      category: 'emergency_exit',
      floor: 0,
      x: 10,
      y: 90,
      description: 'Direct push-bar fire door leading to outdoor assembly area A',
      landmarkHint: 'Green illuminated EXIT sign near West wing',
      qrCodeId: 'QR-UNIV-EMERGENCY-09',
      isAccessible: true,
      aliases: ['fire exit', 'emergency exit', 'sos exit', 'evacuation point']
    },
    {
      id: 'univ-emergency-exit-gf2',
      name: 'East Emergency Exit (GF)',
      category: 'emergency_exit',
      floor: 0,
      x: 95,
      y: 25,
      description: 'East wing exit door to parking lot',
      landmarkHint: 'Beside Principal office secondary corridor',
      qrCodeId: 'QR-UNIV-EMERGENCY-10',
      isAccessible: true,
      aliases: ['east exit', 'fire door']
    },

    // First Floor
    {
      id: 'univ-elevator-ff',
      name: 'Central Elevator (1st Floor)',
      category: 'elevator',
      floor: 1,
      x: 50,
      y: 50,
      description: 'Accessible lift exit on 1st Floor',
      landmarkHint: 'Near the AI Robotics Wall Banner',
      qrCodeId: 'QR-UNIV-LIFT-1st',
      isAccessible: true,
      aliases: ['lift 1st floor', 'elevator top']
    },
    {
      id: 'univ-stairs-ff',
      name: 'Main Staircase (1st Floor)',
      category: 'stairs',
      floor: 1,
      x: 60,
      y: 50,
      description: 'Upper landing of main staircase',
      landmarkHint: 'Beside digital notice board',
      qrCodeId: 'QR-UNIV-STAIRS-1st',
      isAccessible: false,
      aliases: ['stairs landing']
    },
    {
      id: 'univ-dean-office',
      name: 'Dean of Academics Office',
      category: 'office',
      floor: 1,
      x: 30,
      y: 30,
      description: 'Dean office for academic approvals, branch change & course credits',
      landmarkHint: 'Room 104 with wooden nameplate',
      qrCodeId: 'QR-UNIV-DEAN-11',
      isAccessible: true,
      aliases: ['dean', 'dean academics', 'academic office', 'approvals']
    },
    {
      id: 'univ-cs-lab',
      name: 'AI & Data Science Computer Lab',
      category: 'landmark',
      floor: 1,
      x: 80,
      y: 30,
      description: 'High performance computer lab with 120 GPU workstations',
      landmarkHint: 'Glass door with blue neon glowing logo',
      qrCodeId: 'QR-UNIV-LAB-12',
      isAccessible: true,
      aliases: ['computer lab', 'ai lab', 'lab', 'coding lab', 'cs lab']
    },
    {
      id: 'univ-library',
      name: 'Central Digital Library',
      category: 'landmark',
      floor: 1,
      x: 75,
      y: 75,
      description: 'Quiet study zones, research archives, and book lending desk',
      landmarkHint: 'Double glass door opposite seminar hall',
      qrCodeId: 'QR-UNIV-LIBRARY-13',
      isAccessible: true,
      aliases: ['library', 'books', 'study room', 'reading room', 'quiet zone']
    },
    {
      id: 'univ-washroom-ff',
      name: 'First Floor Restrooms',
      category: 'washroom',
      floor: 1,
      x: 25,
      y: 75,
      description: 'Gender-neutral accessible washrooms',
      landmarkHint: 'Beside water cooler near Dean office hallway',
      qrCodeId: 'QR-UNIV-WASHROOM-14',
      isAccessible: true,
      aliases: ['washroom 1st floor', 'toilet upstairs']
    },
    {
      id: 'univ-emergency-exit-ff',
      name: 'First Floor Fire Stairs Exit',
      category: 'emergency_exit',
      floor: 1,
      x: 95,
      y: 80,
      description: 'External reinforced steel escape staircase',
      landmarkHint: 'Red exit sign near Library back gate',
      qrCodeId: 'QR-UNIV-EMERGENCY-15',
      isAccessible: false,
      aliases: ['fire escape', 'emergency exit 1st floor']
    }
  ],
  edges: [
    // Ground Floor Connections
    { id: 'e1', fromNodeId: 'univ-main-gate', toNodeId: 'univ-info-desk', distanceMeters: 15, isAccessible: true },
    { id: 'e2', fromNodeId: 'univ-info-desk', toNodeId: 'univ-elevator-gf', distanceMeters: 25, isAccessible: true },
    { id: 'e3', fromNodeId: 'univ-info-desk', toNodeId: 'univ-accounts-office', distanceMeters: 20, isAccessible: true },
    { id: 'e4', fromNodeId: 'univ-accounts-office', toNodeId: 'univ-principal-office', distanceMeters: 30, isAccessible: true },
    { id: 'e5', fromNodeId: 'univ-principal-office', toNodeId: 'univ-emergency-exit-gf2', distanceMeters: 18, isAccessible: true },
    { id: 'e6', fromNodeId: 'univ-elevator-gf', toNodeId: 'univ-stairs-gf', distanceMeters: 10, isAccessible: true },
    { id: 'e7', fromNodeId: 'univ-elevator-gf', toNodeId: 'univ-washroom-gf', distanceMeters: 15, isAccessible: true },
    { id: 'e8', fromNodeId: 'univ-washroom-gf', toNodeId: 'univ-canteen', distanceMeters: 35, isAccessible: true },
    { id: 'e9', fromNodeId: 'univ-info-desk', toNodeId: 'univ-emergency-exit-gf1', distanceMeters: 22, isAccessible: true },

    // Inter-Floor Connections (Elevator & Stairs)
    { id: 'e-lift', fromNodeId: 'univ-elevator-gf', toNodeId: 'univ-elevator-ff', distanceMeters: 8, isAccessible: true },
    { id: 'e-stairs', fromNodeId: 'univ-stairs-gf', toNodeId: 'univ-stairs-ff', distanceMeters: 12, isAccessible: false, isStairs: true },

    // First Floor Connections
    { id: 'e10', fromNodeId: 'univ-elevator-ff', toNodeId: 'univ-stairs-ff', distanceMeters: 10, isAccessible: true },
    { id: 'e11', fromNodeId: 'univ-elevator-ff', toNodeId: 'univ-dean-office', distanceMeters: 20, isAccessible: true },
    { id: 'e12', fromNodeId: 'univ-dean-office', toNodeId: 'univ-cs-lab', distanceMeters: 45, isAccessible: true },
    { id: 'e13', fromNodeId: 'univ-elevator-ff', toNodeId: 'univ-washroom-ff', distanceMeters: 25, isAccessible: true },
    { id: 'e14', fromNodeId: 'univ-stairs-ff', toNodeId: 'univ-library', distanceMeters: 30, isAccessible: true },
    { id: 'e15', fromNodeId: 'univ-library', toNodeId: 'univ-emergency-exit-ff', distanceMeters: 15, isAccessible: false, isStairs: true }
  ]
};

export const ST_JUDE_HOSPITAL: BuildingGraph = {
  id: 'st-jude-hospital',
  name: 'St. Jude Super Specialty Hospital',
  category: 'hospital',
  description: 'Emergency & Multi-Specialty Medical Block with 24/7 Trauma Center and Pharmacy.',
  address: '104 Healthcare Boulevard',
  floors: [
    { floorNumber: 0, floorName: 'Ground Floor (Emergency & OPD)', gridWidth: 1000, gridHeight: 600 },
    { floorNumber: 1, floorName: 'First Floor (Inpatient & Surgery)', gridWidth: 1000, gridHeight: 600 }
  ],
  nodes: [
    // Ground Floor Hospital Nodes
    {
      id: 'hosp-er-gate',
      name: 'Emergency Room (ER) Ambulance Gate',
      category: 'emergency_exit',
      floor: 0,
      x: 10,
      y: 20,
      description: '24/7 Emergency Trauma entrance for ambulances and critical patients',
      landmarkHint: 'Red glowing ER sign over sliding automatic doors',
      qrCodeId: 'QR-HOSP-ER-01',
      isAccessible: true,
      aliases: ['er', 'emergency', 'casualty', 'trauma', 'ambulance']
    },
    {
      id: 'hosp-main-reception',
      name: 'Hospital Main Reception & Triage Desk',
      category: 'office',
      floor: 0,
      x: 20,
      y: 60,
      description: 'General patient registration, doctor appointments & inquiry counter',
      landmarkHint: 'Under the big digital screen in main foyer',
      qrCodeId: 'QR-HOSP-RECEPT-02',
      isAccessible: true,
      aliases: ['reception', 'triage', 'appointment', 'opd registration']
    },
    {
      id: 'hosp-radiology',
      name: 'Radiology & Imaging Center (X-Ray / MRI / CT)',
      category: 'medical',
      floor: 0,
      x: 45,
      y: 25,
      description: 'Diagnostic imaging department for Ultrasound, CT Scan, X-Ray and MRI',
      landmarkHint: 'Yellow lead-shielded heavy doors room 012',
      qrCodeId: 'QR-HOSP-RADIO-03',
      isAccessible: true,
      aliases: ['radiology', 'xray', 'x-ray', 'mri', 'ct scan', 'ultrasound', 'scan']
    },
    {
      id: 'hosp-billing',
      name: 'Cashier & Billing Counter',
      category: 'counter',
      floor: 0,
      x: 50,
      y: 75,
      description: 'Hospital bill settlement, insurance claim desk, and discharge clearance',
      landmarkHint: 'Glass windows numbered 1 to 6 near pharmacy',
      qrCodeId: 'QR-HOSP-BILLING-04',
      isAccessible: true,
      aliases: ['billing', 'cashier', 'pay bill', 'insurance', 'discharge', 'fees']
    },
    {
      id: 'hosp-pharmacy',
      name: '24/7 Central Pharmacy',
      category: 'medical',
      floor: 0,
      x: 75,
      y: 75,
      description: '24-hour prescription medication & medical supplies store',
      landmarkHint: 'Illuminated green cross sign opposite billing counters',
      qrCodeId: 'QR-HOSP-PHARM-05',
      isAccessible: true,
      aliases: ['pharmacy', 'chemist', 'medicine', 'drugs', 'prescriptions']
    },
    {
      id: 'hosp-lift-gf',
      name: 'Stretcher & Patient Elevator (GF)',
      category: 'elevator',
      floor: 0,
      x: 60,
      y: 50,
      description: 'Extra wide hospital bed/wheelchair compatible elevator',
      landmarkHint: 'Near central nursing station',
      qrCodeId: 'QR-HOSP-LIFT-06',
      isAccessible: true,
      aliases: ['lift', 'elevator', 'patient lift']
    },
    {
      id: 'hosp-washroom-gf',
      name: 'Ground Floor Accessible Restrooms',
      category: 'washroom',
      floor: 0,
      x: 35,
      y: 75,
      description: 'Disabled friendly emergency pull-cord restrooms',
      landmarkHint: 'Beside OPD Waiting Hall A',
      qrCodeId: 'QR-HOSP-WASH-07',
      isAccessible: true,
      aliases: ['washroom', 'toilet', 'wheelchair restroom']
    },
    {
      id: 'hosp-emergency-exit-gf',
      name: 'South Emergency Fire Exit (GF)',
      category: 'emergency_exit',
      floor: 0,
      x: 90,
      y: 90,
      description: 'Push bar fire exit to hospital courtyard',
      landmarkHint: 'Bright green exit banner near Pharmacy corner',
      qrCodeId: 'QR-HOSP-EXIT-08',
      isAccessible: true,
      aliases: ['fire exit', 'emergency exit']
    },

    // 1st Floor Hospital Nodes
    {
      id: 'hosp-lift-ff',
      name: 'Stretcher & Patient Elevator (1st Floor)',
      category: 'elevator',
      floor: 1,
      x: 60,
      y: 50,
      description: '1st Floor elevator lobby for ICU & OT access',
      landmarkHint: 'Beside ICU sterile barrier zone',
      qrCodeId: 'QR-HOSP-LIFT-1st',
      isAccessible: true,
      aliases: ['lift 1st floor']
    },
    {
      id: 'hosp-icu',
      name: 'Intensive Care Unit (ICU)',
      category: 'medical',
      floor: 1,
      x: 30,
      y: 30,
      description: 'Restricted critical care cardiac & surgical ICU ward',
      landmarkHint: 'Biometric glass doors marked ICU-1',
      qrCodeId: 'QR-HOSP-ICU-09',
      isAccessible: true,
      aliases: ['icu', 'intensive care', 'critical care', 'cardiac icu']
    },
    {
      id: 'hosp-operation-theater',
      name: 'Modular Operation Theaters (OT 1 - 4)',
      category: 'medical',
      floor: 1,
      x: 80,
      y: 30,
      description: 'Surgeon prep area and sterile surgical suites',
      landmarkHint: 'Red light above OT entrance door',
      qrCodeId: 'QR-HOSP-OT-10',
      isAccessible: true,
      aliases: ['operation theater', 'ot', 'surgery', 'operation room']
    }
  ],
  edges: [
    { id: 'he1', fromNodeId: 'hosp-er-gate', toNodeId: 'hosp-main-reception', distanceMeters: 15, isAccessible: true },
    { id: 'he2', fromNodeId: 'hosp-main-reception', toNodeId: 'hosp-radiology', distanceMeters: 25, isAccessible: true },
    { id: 'he3', fromNodeId: 'hosp-main-reception', toNodeId: 'hosp-washroom-gf', distanceMeters: 15, isAccessible: true },
    { id: 'he4', fromNodeId: 'hosp-radiology', toNodeId: 'hosp-lift-gf', distanceMeters: 20, isAccessible: true },
    { id: 'he5', fromNodeId: 'hosp-lift-gf', toNodeId: 'hosp-billing', distanceMeters: 18, isAccessible: true },
    { id: 'he6', fromNodeId: 'hosp-billing', toNodeId: 'hosp-pharmacy', distanceMeters: 22, isAccessible: true },
    { id: 'he7', fromNodeId: 'hosp-pharmacy', toNodeId: 'hosp-emergency-exit-gf', distanceMeters: 12, isAccessible: true },
    { id: 'he-lift', fromNodeId: 'hosp-lift-gf', toNodeId: 'hosp-lift-ff', distanceMeters: 8, isAccessible: true },
    { id: 'he8', fromNodeId: 'hosp-lift-ff', toNodeId: 'hosp-icu', distanceMeters: 30, isAccessible: true },
    { id: 'he9', fromNodeId: 'hosp-lift-ff', toNodeId: 'hosp-operation-theater', distanceMeters: 25, isAccessible: true }
  ]
};

export const INDIRA_AIRPORT: BuildingGraph = {
  id: 'indira-airport-t2',
  name: 'Indira International Airport - Terminal 2',
  category: 'airport',
  description: 'International departures & arrivals terminal with boarding gates 1 to 12.',
  address: 'Terminal 2, Airport Expressway',
  floors: [
    { floorNumber: 0, floorName: 'Departures Hall', gridWidth: 1000, gridHeight: 600 }
  ],
  nodes: [
    {
      id: 'air-gate-entry',
      name: 'Terminal Departure Gate 4 Entry',
      category: 'entrance',
      floor: 0,
      x: 10,
      y: 50,
      description: 'CISF Security document check entrance for passengers',
      landmarkHint: 'Under the large LED departure flight schedule board',
      qrCodeId: 'QR-AIR-ENTRY-01',
      isAccessible: true,
      aliases: ['airport entrance', 'gate 4', 'departure entry', 'terminal entrance']
    },
    {
      id: 'air-checkin',
      name: 'Airline Check-In & Bag Drop Counters (A1 - A20)',
      category: 'counter',
      floor: 0,
      x: 30,
      y: 50,
      description: 'Boarding pass issuance and checked baggage drop desks',
      landmarkHint: 'IndiGo & Air India Check-in island A',
      qrCodeId: 'QR-AIR-CHECKIN-02',
      isAccessible: true,
      aliases: ['checkin', 'check-in', 'bag drop', 'boarding pass', 'ticket counter']
    },
    {
      id: 'air-security',
      name: 'Security Screening Checkpoint',
      category: 'counter',
      floor: 0,
      x: 55,
      y: 50,
      description: 'X-ray baggage scanner & body scanner gates',
      landmarkHint: 'Past document verification turnstile',
      qrCodeId: 'QR-AIR-SECURITY-03',
      isAccessible: true,
      aliases: ['security', 'security check', 'frisking', 'metal detector']
    },
    {
      id: 'air-lounge',
      name: 'Executive CIP Flight Lounge',
      category: 'cafeteria',
      floor: 0,
      x: 70,
      y: 20,
      description: 'Premium passenger lounge with dining buffet and quiet pods',
      landmarkHint: 'Glass escalator next to Rolex Duty Free store',
      qrCodeId: 'QR-AIR-LOUNGE-04',
      isAccessible: true,
      aliases: ['lounge', 'vip lounge', 'premium lounge', 'food', 'relax']
    },
    {
      id: 'air-gate-6',
      name: 'Boarding Gate 6',
      category: 'transit',
      floor: 0,
      x: 85,
      y: 40,
      description: 'Boarding bridge gate 6 for flight departures',
      landmarkHint: 'Opposite Starbucks coffee outlet',
      qrCodeId: 'QR-AIR-GATE6-05',
      isAccessible: true,
      aliases: ['gate 6', 'platform 6', 'boarding gate 6', 'flight 6']
    },
    {
      id: 'air-gate-12',
      name: 'Boarding Gate 12',
      category: 'transit',
      floor: 0,
      x: 90,
      y: 80,
      description: 'End of pier boarding gate 12',
      landmarkHint: 'Near duty free perfumes gallery',
      qrCodeId: 'QR-AIR-GATE12-06',
      isAccessible: true,
      aliases: ['gate 12', 'boarding gate 12']
    },
    {
      id: 'air-washroom',
      name: 'Terminal Central Restrooms',
      category: 'washroom',
      floor: 0,
      x: 60,
      y: 80,
      description: 'Large family restrooms & accessible facilities',
      landmarkHint: 'Beside currency exchange counter',
      qrCodeId: 'QR-AIR-WASH-07',
      isAccessible: true,
      aliases: ['washroom', 'toilet', 'restroom']
    },
    {
      id: 'air-emergency-exit',
      name: 'T2 Runway Airside Emergency Exit',
      category: 'emergency_exit',
      floor: 0,
      x: 98,
      y: 50,
      description: 'Pressurized crash exit door to tarmac assembly zone',
      landmarkHint: 'Illuminated red emergency exit alarm door',
      qrCodeId: 'QR-AIR-EXIT-08',
      isAccessible: true,
      aliases: ['emergency exit', 'fire exit']
    }
  ],
  edges: [
    { id: 'ae1', fromNodeId: 'air-gate-entry', toNodeId: 'air-checkin', distanceMeters: 30, isAccessible: true },
    { id: 'ae2', fromNodeId: 'air-checkin', toNodeId: 'air-security', distanceMeters: 40, isAccessible: true },
    { id: 'ae3', fromNodeId: 'air-security', toNodeId: 'air-lounge', distanceMeters: 25, isAccessible: true },
    { id: 'ae4', fromNodeId: 'air-security', toNodeId: 'air-washroom', distanceMeters: 20, isAccessible: true },
    { id: 'ae5', fromNodeId: 'air-security', toNodeId: 'air-gate-6', distanceMeters: 50, isAccessible: true },
    { id: 'ae6', fromNodeId: 'air-gate-6', toNodeId: 'air-gate-12', distanceMeters: 45, isAccessible: true },
    { id: 'ae7', fromNodeId: 'air-gate-12', toNodeId: 'air-emergency-exit', distanceMeters: 15, isAccessible: true }
  ]
};

export const SAMPLE_BUILDINGS: BuildingGraph[] = [
  APEX_UNIVERSITY,
  ST_JUDE_HOSPITAL,
  INDIRA_AIRPORT
];
