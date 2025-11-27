import React from 'react';
import { AIStatus, DecisionType } from '../types';
import type { MAGIInstance } from '../types';

interface AIPanelProps {
  instance: MAGIInstance;
}

const getStatusColor = (status: AIStatus): string => {
  switch (status) {
    case AIStatus.IDLE:
      return 'text-gray-500';
    case AIStatus.THINKING:
      return 'text-eva-orange animate-pulse';
    case AIStatus.COMPLETED:
      return 'text-eva-green';
    case AIStatus.ERROR:
      return 'text-eva-red';
    default:
      return 'text-gray-500';
  }
};

const getDecisionColor = (decision: DecisionType): string => {
  switch (decision) {
    case DecisionType.APPROVE:
      return 'text-eva-green';
    case DecisionType.REJECT:
      return 'text-eva-red';
    case DecisionType.NEUTRAL:
      return 'text-eva-orange';
    default:
      return 'text-gray-500';
  }
};

const getPanelBorderColor = (instance: MAGIInstance): string => {
  if (instance.provider === 'claude') return 'border-eva-green';
  if (instance.provider === 'openai') return 'border-eva-blue';
  if (instance.provider === 'gemini') return 'border-eva-purple';
  return 'border-gray-500';
};

export const AIPanel: React.FC<AIPanelProps> = ({ instance }) => {
  const borderColor = getPanelBorderColor(instance);
  const statusColor = getStatusColor(instance.status);

  return (
    <div className={`magi-panel p-6 rounded-lg ${borderColor} h-full flex flex-col scanline`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold tracking-wider mb-2">{instance.name}</h3>
        <div className="flex items-center gap-2">
          <div className={`status-indicator ${statusColor}`}></div>
          <span className={`text-sm font-bold ${statusColor}`}>
            {instance.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 uppercase">{instance.provider}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {instance.status === AIStatus.IDLE && (
          <div className="text-gray-600 text-center py-8">
            <p>STANDBY</p>
            <p className="text-xs mt-2">Waiting for decision request...</p>
          </div>
        )}

        {instance.status === AIStatus.THINKING && (
          <div className="text-eva-orange">
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin">◉</div>
              <p className="font-bold">ANALYZING REQUEST...</p>
            </div>
            <div className="space-y-1 text-xs opacity-60">
              <p>&gt; Initializing decision matrix...</p>
              <p>&gt; Loading personality parameters...</p>
              <p>&gt; Processing request data...</p>
            </div>
          </div>
        )}

        {instance.status === AIStatus.COMPLETED && instance.response && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">DECISION:</p>
              <p className={`text-2xl font-bold ${getDecisionColor(instance.response.decision)}`}>
                {instance.response.decision}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">CONFIDENCE:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      instance.response.confidence > 70
                        ? 'bg-eva-green'
                        : instance.response.confidence > 40
                        ? 'bg-eva-orange'
                        : 'bg-eva-red'
                    }`}
                    style={{ width: `${instance.response.confidence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold">{instance.response.confidence}%</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">REASONING:</p>
              <p className="text-sm leading-relaxed">{instance.response.reasoning}</p>
            </div>
          </div>
        )}

        {instance.status === AIStatus.ERROR && (
          <div className="text-eva-red">
            <p className="font-bold mb-2">ERROR DETECTED</p>
            <p className="text-sm">{instance.error || 'Unknown error occurred'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
