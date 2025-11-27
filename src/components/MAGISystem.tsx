import React from 'react';
import { useMAGIContext } from '../context/MAGIContext';
import { useMAGI } from '../hooks/useMAGI';
import { AIPanel } from './AIPanel';
import { DecisionInput } from './DecisionInput';
import { DecisionResult } from './DecisionResult';
import { Settings } from './Settings';

export const MAGISystem: React.FC = () => {
  const { magiInstances, currentDecision, isProcessing } = useMAGIContext();
  const { submitDecision, resetMAGI } = useMAGI();

  return (
    <div className="min-h-screen bg-eva-dark p-4 md:p-8">
      {/* Settings Button */}
      <Settings />

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-eva-green tracking-wider mb-2">
          MAGI SYSTEM
        </h1>
        <p className="text-gray-500 text-sm md:text-base tracking-widest">
          MULTI-PURPOSE AUTONOMOUS GUIDED INTELLIGENCE
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="status-indicator text-eva-green animate-blink"></div>
          <div className="status-indicator text-eva-blue animate-blink" style={{ animationDelay: '0.5s' }}></div>
          <div className="status-indicator text-eva-purple animate-blink" style={{ animationDelay: '1s' }}></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Decision Input */}
        <DecisionInput onSubmit={submitDecision} isProcessing={isProcessing} />

        {/* Three MAGI Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magiInstances.map((instance) => (
            <AIPanel key={instance.name} instance={instance} />
          ))}
        </div>

        {/* Final Decision Result */}
        {currentDecision && (
          <div className="space-y-4">
            <DecisionResult decision={currentDecision} />

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetMAGI}
                className="eva-button border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
              >
                RESET SYSTEM
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-600 text-xs">
        <p>NERV HEADQUARTERS - MAGI DECISION SUPPORT SYSTEM</p>
        <p className="mt-1">Powered by Claude, OpenAI, and Gemini</p>
      </footer>
    </div>
  );
};
