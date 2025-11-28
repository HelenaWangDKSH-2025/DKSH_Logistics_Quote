import React from 'react';
import { QuoteResult } from '../types';

interface Props {
  results: QuoteResult[];
}

export const QuoteResults: React.FC<Props> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Carrier Quotes</h2>
      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => (
          <div 
            key={result.carrierName}
            className={`relative rounded-xl border p-5 transition-all ${
              result.isCompatible 
                ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' 
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{result.carrierName}</h3>
                  {!result.isCompatible && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">Incompatible</span>
                  )}
                  {result.isCompatible && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                  )}
                </div>
                
                {result.isCompatible ? (
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 max-w-md">
                        <div className="flex justify-between">
                            <span>Base Freight:</span>
                            <span className="font-medium">{result.breakdown.baseFreight}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pickup Fee:</span>
                            <span className="font-medium">{result.breakdown.pickupFee}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span className="font-medium">{result.breakdown.deliveryFee}</span>
                        </div>
                    </div>
                    {result.breakdown.notes.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded text-xs space-y-1">
                        {result.breakdown.notes.map((note, i) => (
                          <div key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600 mt-1">{result.incompatibilityReason}</p>
                )}
              </div>

              {result.isCompatible && (
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Total Estimated Cost</p>
                  <div className="text-3xl font-extrabold text-blue-600">
                    <span className="text-lg font-normal text-slate-500 mr-1">¥</span>
                    {result.breakdown.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
