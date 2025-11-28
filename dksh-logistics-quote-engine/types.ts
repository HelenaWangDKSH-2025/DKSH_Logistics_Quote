export enum BusinessLine {
  SCI = 'SCI',
  PHI = 'PHI',
  PCI = 'PCI',
  FBI = 'FBI'
}

export enum CargoType {
  DG = 'DG',
  NDG = 'NDG'
}

export enum TransportMode {
  LTL = 'LTL', // Less than Truckload
  FTL = 'FTL'  // Full Truckload
}

export interface QuoteRequest {
  origin: string;
  destination: string;
  businessLine: BusinessLine;
  cargoType: CargoType;
  mode: TransportMode;
  weightKg: number;
  volumeCbm: number;
}

export interface CarrierFeeRules {
  pickup: (weight: number, type: CargoType) => number;
  delivery: (weight: number, type: CargoType) => number;
  insurance: (value: number) => number;
  minCharge?: number;
  description: string;
}

export interface CarrierProfile {
  id: string;
  name: string;
  supportedLines: BusinessLine[];
  supportedTypes: CargoType[];
  supportedModes: TransportMode[];
  baseLocation: string; // Used to match origin (rough approximation for this demo)
  billingBasis: 'Net' | 'Gross';
  splitPointKg: number; // 500 or 499 usually
  rules: CarrierFeeRules;
  notes?: string;
}

export interface CostBreakdown {
  baseFreight: number;
  pickupFee: number;
  deliveryFee: number;
  total: number;
  currency: string;
  notes: string[];
}

export interface QuoteResult {
  carrierName: string;
  breakdown: CostBreakdown;
  isCompatible: boolean;
  incompatibilityReason?: string;
}
