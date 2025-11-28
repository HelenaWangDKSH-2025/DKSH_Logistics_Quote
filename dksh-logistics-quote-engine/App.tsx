import React, { useState } from 'react';
import { QuoteForm } from './components/QuoteForm';
import { QuoteResults } from './components/QuoteResults';
import { GeminiAnalysis } from './components/GeminiAnalysis';
import { QuoteRequest, QuoteResult, BusinessLine, CargoType, TransportMode } from './types';
import { calculateQuotes } from './utils/calculator';
import { CITIES } from './constants';

const App: React.FC = () => {
  const [request, setRequest] = useState<QuoteRequest>({
    origin: CITIES[0],
    destination: CITIES[2],
    businessLine: BusinessLine.SCI,
    cargoType: CargoType.DG,
    mode: TransportMode.LTL,
    weightKg: 600,
    volumeCbm: 1.5,
  });

  const [results, setResults] = useState<QuoteResult[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const calculatedResults = calculateQuotes(request);
    setResults(calculatedResults);
    setHasCalculated(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                D
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">DKSH Quote Engine</h1>
                <p className="text-xs text-slate-500 font-medium">Logistics Cost Estimator</p>
             </div>
          </div>
          <div className="hidden sm:block text-sm text-slate-400">
             Internal Use Only
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        <QuoteForm 
          request={request} 
          onChange={setRequest} 
          onCalculate={handleCalculate} 
        />

        {hasCalculated && (
            <div className="animate-fade-in-up">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <QuoteResults results={results} />
                    </div>
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <GeminiAnalysis results={results} request={request} />
                            
                            <div className="mt-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-semibold text-slate-800 mb-2">Quote Logic Summary</h4>
                                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                                    <li>Volumetric Ratio applied: 1:333 (1m³ = 333kg).</li>
                                    <li>Prices prioritize lower cost if duplicates exist.</li>
                                    <li>Contract expiry dates are monitored.</li>
                                    <li>Extra fees (insurance, wait time) may apply upon actual booking.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
