import React, { useState } from 'react';

interface DecisionInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
}

export const DecisionInput: React.FC<DecisionInputProps> = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="magi-panel p-6 rounded-lg">
      <h2 className="text-xl font-bold text-eva-green mb-4 tracking-wider">
        DECISION REQUEST INPUT
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the decision request for MAGI system analysis..."
          className="w-full bg-eva-dark border border-eva-green/50 text-gray-100 px-4 py-3 rounded focus:outline-none focus:border-eva-green font-mono min-h-32 resize-y"
          disabled={isProcessing}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="eva-button flex-1"
          >
            {isProcessing ? 'PROCESSING...' : 'SUBMIT TO MAGI'}
          </button>

          <button
            type="button"
            onClick={() => setPrompt('')}
            disabled={isProcessing}
            className="eva-button border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
          >
            CLEAR
          </button>
        </div>
      </form>

      {/* Example Prompts */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-2">Example requests:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Should we deploy the new feature to production?</li>
          <li>Is it safe to proceed with the system upgrade?</li>
          <li>Should we approve the emergency protocol activation?</li>
        </ul>
      </div>
    </div>
  );
};
