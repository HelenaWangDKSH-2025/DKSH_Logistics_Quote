import { QuoteRequest, CarrierProfile, QuoteResult } from '../types';
import { CARRIERS, MOCK_BASE_RATES } from '../constants';

export const calculateQuotes = (request: QuoteRequest): QuoteResult[] => {
  return CARRIERS.map(carrier => {
    // 1. Compatibility Check
    const errors: string[] = [];
    
    if (!carrier.supportedLines.includes(request.businessLine)) {
      errors.push(`Does not support business line ${request.businessLine}`);
    }
    if (!carrier.supportedTypes.includes(request.cargoType)) {
      errors.push(`Does not support cargo type ${request.cargoType}`);
    }
    if (!carrier.supportedModes.includes(request.mode)) {
      errors.push(`Does not support mode ${request.mode}`);
    }

    // Basic geolocation check (very simplified for demo)
    // If carrier is specific to a city (like Zhangjiagang), we prioritize it if origin matches,
    // otherwise we might exclude it or mark it as "Pickup fees may be high".
    // For strictness, if the carrier name implies a location and origin doesn't match, we assume incompatibility for this specialized demo.
    const cityBasedCarriers = ['Zhangjiagang', 'Jinan', 'South China'];
    const isCitySpecific = cityBasedCarriers.some(c => carrier.name.includes(c));
    if (isCitySpecific) {
        // Simple string matching for demo purposes
        if (carrier.name.includes('Zhangjiagang') && !request.origin.includes('Zhangjiagang')) {
             errors.push('Carrier operates primarily from Zhangjiagang');
        }
        if (carrier.name.includes('Jinan') && !request.origin.includes('Jinan')) {
             errors.push('Carrier operates primarily from Jinan');
        }
         if (carrier.name.includes('South China') && !['Guangzhou', 'Shenzhen'].includes(request.origin)) {
             errors.push('Carrier operates primarily from South China (Guangzhou/Shenzhen)');
        }
    }

    if (errors.length > 0) {
      return {
        carrierName: carrier.name,
        isCompatible: false,
        incompatibilityReason: errors.join(', '),
        breakdown: { baseFreight: 0, pickupFee: 0, deliveryFee: 0, total: 0, currency: 'CNY', notes: [] }
      };
    }

    // 2. Calculation Logic
    
    // Weight Rule: Max(Actual, Volume * 333.33)
    // 1:3 ratio means 1 ton = 3 CBM => 1 CBM = 333.33kg
    const volumetricWeight = request.volumeCbm * 333.33;
    const chargeableWeight = Math.max(request.weightKg, volumetricWeight);

    // Determine Base Rate
    // If request.origin == carrier.baseLocation, cheaper rate.
    let ratePerKg = MOCK_BASE_RATES['default'];
    if (request.origin === request.destination) ratePerKg = MOCK_BASE_RATES['same_region'];
    else if (request.origin !== carrier.baseLocation && carrier.baseLocation !== 'Shanghai') ratePerKg = MOCK_BASE_RATES['long_distance'];

    // Specific logic for Small vs LTL
    const isSmallShipment = chargeableWeight <= carrier.splitPointKg;
    
    let baseFreight = 0;
    const notes: string[] = [];

    if (isSmallShipment) {
        // "One Price" logic simulation
        baseFreight = 150 + (chargeableWeight * 0.5); // Mock formula for "Small Ticket" fixed price
        notes.push("Applied 'Small Shipment' fixed pricing structure.");
    } else {
        baseFreight = chargeableWeight * ratePerKg;
        notes.push(`LTL pricing: ${chargeableWeight.toFixed(2)}kg @ ${ratePerKg} RMB/kg`);
    }

    // Fees
    const pickupFee = carrier.rules.pickup(chargeableWeight, request.cargoType);
    const deliveryFee = carrier.rules.delivery(chargeableWeight, request.cargoType);

    if (pickupFee > 0) notes.push(`Pickup Fee: ${pickupFee}`);
    if (deliveryFee > 0) notes.push(`Delivery Fee: ${deliveryFee}`);
    if (carrier.notes) notes.push(`Note: ${carrier.notes}`);

    return {
      carrierName: carrier.name,
      isCompatible: true,
      breakdown: {
        baseFreight: parseFloat(baseFreight.toFixed(2)),
        pickupFee,
        deliveryFee,
        total: parseFloat((baseFreight + pickupFee + deliveryFee).toFixed(2)),
        currency: 'CNY',
        notes
      }
    };
  }).sort((a, b) => {
      // Sort compatible first, then by price
      if (a.isCompatible && !b.isCompatible) return -1;
      if (!a.isCompatible && b.isCompatible) return 1;
      return a.breakdown.total - b.breakdown.total;
  });
};