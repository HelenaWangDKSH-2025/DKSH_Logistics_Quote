import { BusinessLine, CargoType, TransportMode, CarrierProfile } from './types';

// Mock base rates (RMB per kg) between regions to make the calculator functional
// In a real app, this would come from a database matrix
export const MOCK_BASE_RATES: Record<string, number> = {
  'default': 1.5,
  'same_region': 0.8,
  'long_distance': 3.2,
};

export const CITIES = [
  'Shanghai', 'Zhangjiagang', 'Guangzhou', 'Beijing', 'Jinan', 'Chengdu', 'Wuhan', 'Shenzhen'
];

export const CARRIERS: CarrierProfile[] = [
  {
    id: 'kerry_zjg',
    name: 'Zhangjiagang Kerry (张家港嘉里)',
    supportedLines: [BusinessLine.SCI, BusinessLine.PHI],
    supportedTypes: [CargoType.DG, CargoType.NDG],
    supportedModes: [TransportMode.FTL, TransportMode.LTL],
    baseLocation: 'Zhangjiagang',
    billingBasis: 'Net',
    splitPointKg: 500,
    rules: {
      description: "Integrated warehousing/distribution. No separate pickup/delivery fees.",
      pickup: () => 0,
      delivery: () => 0,
      insurance: () => 0,
    },
    notes: "For large weights (8-10t), FTL is suggested."
  },
  {
    id: 'lianqiang',
    name: 'Lianqiang (联强)',
    supportedLines: [BusinessLine.SCI, BusinessLine.PCI, BusinessLine.FBI, BusinessLine.PHI],
    supportedTypes: [CargoType.DG, CargoType.NDG],
    supportedModes: [TransportMode.FTL, TransportMode.LTL],
    baseLocation: 'Shanghai', // Assumed based on context
    billingBasis: 'Gross',
    splitPointKg: 500,
    rules: {
      description: "Separate pickup/delivery fees based on weight tiers.",
      pickup: (weight, type) => {
        const wTon = weight / 1000;
        if (wTon >= 5) return 0;
        return type === CargoType.DG ? 400 : 300;
      },
      delivery: (weight, type) => {
        const wTon = weight / 1000;
        if (wTon >= 5) return 0;
        return type === CargoType.DG ? 350 : 200;
      },
      insurance: () => 0,
    }
  },
  {
    id: 'rongyun',
    name: 'Rongyun (嵘芸)',
    supportedLines: [BusinessLine.SCI],
    supportedTypes: [CargoType.NDG],
    supportedModes: [TransportMode.LTL],
    baseLocation: 'Shanghai',
    billingBasis: 'Net',
    splitPointKg: 500,
    rules: {
      description: "Integrated warehousing. No separate fees.",
      pickup: () => 0,
      delivery: () => 0,
      insurance: () => 0,
    }
  },
  {
    id: 'xinhong_south',
    name: 'Xinhong South China (鑫虹华南)',
    supportedLines: [BusinessLine.SCI],
    supportedTypes: [CargoType.DG, CargoType.NDG],
    supportedModes: [TransportMode.FTL, TransportMode.LTL],
    baseLocation: 'Guangzhou', // Implied "South China"
    billingBasis: 'Net',
    splitPointKg: 499,
    rules: {
      description: "Pickup fee <3t. Delivery fee applies per ticket.",
      pickup: (weight, type) => {
        const wTon = weight / 1000;
        if (wTon >= 3) return 0;
        return type === CargoType.DG ? 400 : 300;
      },
      delivery: () => 150, // Simplified fixed fee for demo
      insurance: () => 0,
    }
  },
  {
    id: 'xinhong_jinan',
    name: 'Xinhong Jinan (鑫虹济南)',
    supportedLines: [BusinessLine.SCI],
    supportedTypes: [CargoType.DG, CargoType.NDG],
    supportedModes: [TransportMode.LTL],
    baseLocation: 'Jinan',
    billingBasis: 'Net',
    splitPointKg: 500,
    rules: {
      description: "Pickup fee <3t. No delivery fee.",
      pickup: (weight, type) => {
        const wTon = weight / 1000;
        if (wTon >= 3) return 0;
        return type === CargoType.DG ? 400 : 300;
      },
      delivery: () => 0,
      insurance: () => 0,
    }
  },
  {
    id: 'sinotrans',
    name: 'Sinotrans (中外运)',
    supportedLines: [BusinessLine.FBI, BusinessLine.PCI],
    supportedTypes: [CargoType.NDG],
    supportedModes: [TransportMode.FTL, TransportMode.LTL],
    baseLocation: 'Shanghai',
    billingBasis: 'Gross',
    splitPointKg: 0, // Not strictly defined by split point in same way
    rules: {
      description: "Fixed delivery fee 200/ticket.",
      pickup: () => 0,
      delivery: () => 200,
      insurance: () => 0, // Actual logic involves insurance fee but simplified here
    }
  },
  {
    id: 'anji',
    name: 'Anji (安吉)',
    supportedLines: [BusinessLine.SCI],
    supportedTypes: [CargoType.NDG],
    supportedModes: [TransportMode.LTL],
    baseLocation: 'Shanghai',
    billingBasis: 'Net',
    splitPointKg: 0,
    rules: {
      description: "Per kg pricing. Pickup fee <5t 150 RMB.",
      pickup: (weight) => {
        const wTon = weight / 1000;
        return wTon < 5 ? 150 : 0;
      },
      delivery: () => 0,
      insurance: () => 0,
    }
  }
];
