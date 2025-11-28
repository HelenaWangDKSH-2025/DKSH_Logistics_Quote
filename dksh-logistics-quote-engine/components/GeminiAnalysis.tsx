import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { QuoteResult, QuoteRequest } from '../types';

interface Props {
  results: QuoteResult[];
  request: QuoteRequest;
}

export const GeminiAnalysis: React.FC<Props> = ({ results, request }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!process.env.API_KEY) {
        setError("API Key is missing from environment variables.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a logistics expert for DKSH China. Analyze the following transport quotes.
        
        Shipment Details:
        - Origin: ${request.origin}
        - Destination: ${request.destination}
        - Weight: ${request.weightKg} kg
        - Type: ${request.cargoType}
        - Business Line: ${request.businessLine}

        Quotes Generated:
        ${JSON.stringify(results.filter(r => r.isCompatible).slice(0, 4), null, 2)}

        Please provide a concise recommendation.
        1. Identify the most cost-effective option.
        2. Highlight any specific risks or notes (e.g. specialized DG carriers vs General).
        3. Mention if the price difference is significant.
        Keep it under 150 words. Format as Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text || "No analysis generated.");
    } catch (err) {
      console.error(err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!results.some(r => r.isCompatible)) return null;

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Smart Analysis
        </h3>
        {!analysis && !loading && (
          <button 
            onClick={handleAnalyze}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Generate Insights
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-indigo-600 animate-pulse">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Analyzing carrier rules and pricing...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {analysis && (
        <div className="prose prose-sm prose-indigo max-w-none text-slate-700 bg-white p-4 rounded-lg border border-indigo-50 shadow-inner">
             {/* Simple markdown rendering by replacing newlines - for full markdown utilize a library like react-markdown in production */}
            {analysis.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
            ))}
        </div>
      )}
    </div>
  );
};
