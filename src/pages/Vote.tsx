import React, { useState } from 'react';
import { useMAGIContext } from '../context/MAGIContext';
import { useMAGI } from '../hooks/useMAGI';
import { DecisionType, AIStatus } from '../types';

export const Vote: React.FC = () => {
  const { magiInstances, currentDecision, isProcessing } = useMAGIContext();
  const { submitDecision } = useMAGI();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      await submitDecision(prompt.trim());
    }
  };

  // Get individual MAGI status
  const melchior = magiInstances.find((m) => m.name === 'MELCHIOR');
  const balthasar = magiInstances.find((m) => m.name === 'BALTHASAR');
  const casper = magiInstances.find((m) => m.name === 'CASPER');

  const getMAGIColor = (instance: typeof melchior) => {
    if (!instance) return 'bg-gray-700';
    if (instance.status === AIStatus.THINKING) return 'bg-eva-orange animate-pulse';
    if (instance.status === AIStatus.ERROR) return 'bg-eva-red';
    if (instance.response?.decision === DecisionType.APPROVE) return 'bg-eva-green';
    if (instance.response?.decision === DecisionType.REJECT) return 'bg-eva-red';
    if (instance.response?.decision === DecisionType.NEUTRAL) return 'bg-eva-orange';
    return 'bg-cyan-400';
  };

  const getDecisionText = (instance: typeof melchior) => {
    if (!instance) return '';
    if (instance.status === AIStatus.THINKING) return '処理中';
    if (instance.status === AIStatus.ERROR) return 'ERROR';
    if (instance.response?.decision === DecisionType.APPROVE) return '承認';
    if (instance.response?.decision === DecisionType.REJECT) return '否定';
    if (instance.response?.decision === DecisionType.NEUTRAL) return '保留';
    return 'STANDBY';
  };

  return (
    <div className="min-h-screen bg-black text-eva-green p-8">
      {/* Header */}
      <div className="mb-8 border-b-2 border-eva-orange pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-wider mb-2">MAGI SYSTEM</h1>
            <p className="text-sm text-gray-500 uppercase">
              Multi-Purpose Humanoid Decisive Weapon - Artificial Intelligence
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-eva-orange">TOKYO-3</div>
            <div className="text-xs text-gray-500">NERV HEADQUARTERS</div>
          </div>
        </div>
      </div>

      {/* Main MAGI Layout */}
      <div className="relative h-[600px] mb-8">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <line x1="50%" y1="20%" x2="30%" y2="50%" stroke="#ff6b00" strokeWidth="2" />
          <line x1="50%" y1="20%" x2="70%" y2="50%" stroke="#ff6b00" strokeWidth="2" />
          <line x1="30%" y1="50%" x2="50%" y2="80%" stroke="#ff6b00" strokeWidth="2" />
          <line x1="70%" y1="50%" x2="50%" y2="80%" stroke="#ff6b00" strokeWidth="2" />
        </svg>

        {/* BALTHASAR-2 (Top) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64">
          <div className="relative">
            <div
              className={`${getMAGIColor(balthasar)} text-black font-bold text-center py-8 px-4 transform rotate-45 border-4 border-eva-orange transition-all duration-500`}
              style={{ width: '180px', height: '180px', margin: '0 auto' }}
            >
              <div className="transform -rotate-45 flex flex-col items-center justify-center h-full">
                <div className="text-lg mb-2">BALTHASAR-2</div>
                <div className="text-3xl font-black">{getDecisionText(balthasar)}</div>
                {balthasar?.response && (
                  <div className="text-xs mt-1">{balthasar.response.confidence}%</div>
                )}
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">
              LOCATION: CHINA/BEIJING
            </div>
          </div>
        </div>

        {/* MELCHIOR-1 (Right) */}
        <div className="absolute top-1/2 right-20 -translate-y-1/2 w-64">
          <div className="relative">
            <div
              className={`${getMAGIColor(melchior)} text-black font-bold text-center py-8 px-4 transform rotate-45 border-4 border-eva-orange transition-all duration-500`}
              style={{ width: '180px', height: '180px', margin: '0 auto' }}
            >
              <div className="transform -rotate-45 flex flex-col items-center justify-center h-full">
                <div className="text-lg mb-2">MELCHIOR-1</div>
                <div className="text-3xl font-black">{getDecisionText(melchior)}</div>
                {melchior?.response && (
                  <div className="text-xs mt-1">{melchior.response.confidence}%</div>
                )}
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">
              LOCATION: GERMANY/BERLIN
            </div>
          </div>
        </div>

        {/* CASPER-3 (Left) */}
        <div className="absolute top-1/2 left-20 -translate-y-1/2 w-64">
          <div className="relative">
            <div
              className={`${getMAGIColor(casper)} text-black font-bold text-center py-8 px-4 transform rotate-45 border-4 border-eva-orange transition-all duration-500`}
              style={{ width: '180px', height: '180px', margin: '0 auto' }}
            >
              <div className="transform -rotate-45 flex flex-col items-center justify-center h-full">
                <div className="text-lg mb-2">CASPER-3</div>
                <div className="text-3xl font-black">{getDecisionText(casper)}</div>
                {casper?.response && (
                  <div className="text-xs mt-1">{casper.response.confidence}%</div>
                )}
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">
              LOCATION: U.S.A/MASSACHUSETTS
            </div>
          </div>
        </div>

        {/* Center Control Panel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 z-10">
          <div className="bg-black border-4 border-eva-orange p-6 shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-xs text-gray-500">FINAL DEFENCE ZONE</div>
              <div className="text-2xl font-bold text-white mt-1">MAGI</div>
              <div className="text-xs text-eva-orange">承認システム</div>
            </div>

            {/* Vote Count Display */}
            {currentDecision && (
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-eva-green/20 p-2 border border-eva-green">
                  <div className="text-3xl font-bold text-white">
                    {currentDecision.approveCount}
                  </div>
                  <div className="text-xs text-eva-green">承認</div>
                </div>
                <div className="bg-eva-orange/20 p-2 border border-eva-orange">
                  <div className="text-3xl font-bold text-white">
                    {currentDecision.neutralCount}
                  </div>
                  <div className="text-xs text-eva-orange">保留</div>
                </div>
                <div className="bg-eva-red/20 p-2 border border-eva-red">
                  <div className="text-3xl font-bold text-white">
                    {currentDecision.rejectCount}
                  </div>
                  <div className="text-xs text-eva-red">否定</div>
                </div>
              </div>
            )}

            {/* Final Decision */}
            {currentDecision && (
              <div className="text-center mb-4">
                <div className="text-xs text-gray-500 mb-1">FINAL DECISION</div>
                <div
                  className={`text-4xl font-bold py-2 ${
                    currentDecision.result === DecisionType.APPROVE
                      ? 'text-eva-green'
                      : currentDecision.result === DecisionType.REJECT
                      ? 'text-eva-red'
                      : 'text-eva-orange'
                  }`}
                >
                  {currentDecision.result}
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div className="text-center">
              {isProcessing ? (
                <div className="text-eva-orange animate-pulse">
                  <div className="text-sm font-bold">PROCESSING...</div>
                  <div className="text-xs">システム処理中</div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="text-sm">SYSTEM READY</div>
                  <div className="text-xs">待機中</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-eva-dark/50 border-2 border-eva-orange p-6">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-eva-orange">
              DECISION REQUEST / 決議要求
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black border-2 border-gray-700 text-eva-green p-4 h-32 font-mono focus:border-eva-orange focus:outline-none resize-none"
              placeholder="Enter decision request for MAGI system analysis..."
              disabled={isProcessing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {isProcessing ? (
                <span className="text-eva-orange animate-pulse">
                  ▶ PROCESSING REQUEST...
                </span>
              ) : (
                <span>▶ SYSTEM READY FOR INPUT</span>
              )}
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isProcessing}
              className="bg-eva-orange text-black font-bold px-8 py-3 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 transition-colors border-2 border-black"
            >
              SUBMIT TO MAGI
            </button>
          </div>
        </form>

        {/* Status Info */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {magiInstances.map((instance) => (
            <div
              key={instance.name}
              className="bg-black border border-gray-700 p-3 text-xs"
            >
              <div className="font-bold text-eva-orange mb-1">{instance.name}</div>
              <div className="text-gray-500">Provider: {instance.provider.toUpperCase()}</div>
              <div
                className={`mt-1 ${
                  instance.status === AIStatus.THINKING
                    ? 'text-eva-orange'
                    : instance.status === AIStatus.ERROR
                    ? 'text-eva-red'
                    : instance.status === AIStatus.COMPLETED
                    ? 'text-eva-green'
                    : 'text-gray-500'
                }`}
              >
                Status: {instance.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
