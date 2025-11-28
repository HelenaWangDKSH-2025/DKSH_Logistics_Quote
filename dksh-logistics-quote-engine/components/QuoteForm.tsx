import React from 'react';
import { BusinessLine, CargoType, TransportMode, QuoteRequest } from '../types';
import { CITIES } from '../constants';

interface Props {
  request: QuoteRequest;
  onChange: (req: QuoteRequest) => void;
  onCalculate: () => void;
}

export const QuoteForm: React.FC<Props> = ({ request, onChange, onCalculate }) => {
  
  const handleChange = (field: keyof QuoteRequest, value: string | number) => {
    onChange({ ...request, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Shipment Details</h2>
        <p className="text-sm text-slate-500">Enter cargo details to retrieve carrier rates</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Route */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Origin</label>
          <select 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={request.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</label>
          <select 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={request.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Business Logic */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Line</label>
          <select 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={request.businessLine}
            onChange={(e) => handleChange('businessLine', e.target.value)}
          >
            {Object.values(BusinessLine).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cargo Type</label>
          <div className="flex gap-2">
            {Object.values(CargoType).map(type => (
              <button
                key={type}
                onClick={() => handleChange('cargoType', type)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  request.cargoType === type 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

         <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transport Mode</label>
          <select 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={request.mode}
            onChange={(e) => handleChange('mode', e.target.value)}
          >
            {Object.values(TransportMode).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Dimensions */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight (KG)</label>
          <input 
            type="number" 
            min="1"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={request.weightKg}
            onChange={(e) => handleChange('weightKg', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume (CBM)</label>
          <input 
            type="number" 
            min="0"
            step="0.1"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={request.volumeCbm}
            onChange={(e) => handleChange('volumeCbm', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={onCalculate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Calculate Quote
        </button>
      </div>
    </div>
  );
};
