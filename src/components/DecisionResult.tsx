import React from 'react';
import { DecisionType } from '../types';
import type { FinalDecision } from '../types';

interface DecisionResultProps {
  decision: FinalDecision | null;
}

const getResultColor = (result: DecisionType): string => {
  switch (result) {
    case DecisionType.APPROVE:
      return 'text-eva-green border-eva-green';
    case DecisionType.REJECT:
      return 'text-eva-red border-eva-red';
    case DecisionType.NEUTRAL:
      return 'text-eva-orange border-eva-orange';
    default:
      return 'text-gray-500 border-gray-500';
  }
};

export const DecisionResult: React.FC<DecisionResultProps> = ({ decision }) => {
  if (!decision) {
    return null;
  }

  const resultColor = getResultColor(decision.result);

  return (
    <div className={`magi-panel p-8 rounded-lg border-2 ${resultColor}`}>
      <div className="text-center">
        <h2 className="text-sm font-bold text-gray-500 mb-4 tracking-wider">
          MAGI SYSTEM FINAL DECISION
        </h2>

        <div className={`text-6xl font-bold mb-6 ${resultColor} animate-pulse-slow`}>
          {decision.result}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-eva-dark/50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">APPROVE</p>
            <p className="text-3xl font-bold text-eva-green">{decision.approveCount}</p>
          </div>
          <div className="bg-eva-dark/50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">REJECT</p>
            <p className="text-3xl font-bold text-eva-red">{decision.rejectCount}</p>
          </div>
          <div className="bg-eva-dark/50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">NEUTRAL</p>
            <p className="text-3xl font-bold text-eva-orange">{decision.neutralCount}</p>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Decision reached at: {new Date(decision.timestamp).toLocaleString()}</p>
        </div>

        {/* Visual indicator */}
        {decision.result === DecisionType.APPROVE && (
          <div className="mt-6 text-eva-green">
            <svg
              className="w-16 h-16 mx-auto animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {decision.result === DecisionType.REJECT && (
          <div className="mt-6 text-eva-red">
            <svg
              className="w-16 h-16 mx-auto animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
