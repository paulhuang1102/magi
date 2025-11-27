import React, { useState } from 'react';
import { useMAGIContext } from '../context/MAGIContext';
import { AIProvider, MAGIName } from '../types';
import type { MAGIInstance } from '../types';

// 預設的 API endpoints
const DEFAULT_ENDPOINTS: Record<AIProvider, string> = {
  [AIProvider.CLAUDE]: 'https://api.anthropic.com/v1/messages',
  [AIProvider.OPENAI]: 'https://api.openai.com/v1/chat/completions',
  [AIProvider.GEMINI]: 'https://generativelanguage.googleapis.com/v1beta/models',
  [AIProvider.CUSTOM]: '',
};

// Provider 顯示名稱
const PROVIDER_NAMES: Record<AIProvider, string> = {
  [AIProvider.CLAUDE]: 'Claude (Anthropic)',
  [AIProvider.OPENAI]: 'OpenAI GPT',
  [AIProvider.GEMINI]: 'Google Gemini',
  [AIProvider.CUSTOM]: 'Custom API',
};

// MAGI 顯示顏色
const MAGI_COLORS: Record<MAGIName, string> = {
  [MAGIName.MELCHIOR]: 'eva-green',
  [MAGIName.BALTHASAR]: 'eva-blue',
  [MAGIName.CASPER]: 'eva-purple',
};

export const Settings: React.FC = () => {
  const { magiInstances, updateMAGIConfig } = useMAGIContext();
  const [showSettings, setShowSettings] = useState(false);
  const [tempConfigs, setTempConfigs] = useState<MAGIInstance[]>(magiInstances);
  const [expandedSections, setExpandedSections] = useState<Record<MAGIName, boolean>>({
    [MAGIName.MELCHIOR]: true,
    [MAGIName.BALTHASAR]: false,
    [MAGIName.CASPER]: false,
  });

  const handleSave = () => {
    tempConfigs.forEach((config) => {
      updateMAGIConfig(config.name, {
        provider: config.provider,
        providerConfig: config.providerConfig,
      });
    });
    setShowSettings(false);
  };

  const handleCancel = () => {
    setTempConfigs(magiInstances);
    setShowSettings(false);
  };

  const toggleSection = (name: MAGIName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const updateProviderConfig = (
    name: MAGIName,
    field: keyof MAGIInstance['providerConfig'],
    value: string
  ) => {
    setTempConfigs((prev) =>
      prev.map((config) =>
        config.name === name
          ? {
              ...config,
              providerConfig: {
                ...config.providerConfig,
                [field]: value,
              },
            }
          : config
      )
    );
  };

  const handleProviderChange = (name: MAGIName, provider: AIProvider) => {
    const defaultEndpoint = DEFAULT_ENDPOINTS[provider];
    setTempConfigs((prev) =>
      prev.map((config) =>
        config.name === name
          ? {
              ...config,
              provider,
              providerConfig: {
                ...config.providerConfig,
                provider,
                apiEndpoint: defaultEndpoint,
              },
            }
          : config
      )
    );
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="eva-button text-sm"
      >
        {showSettings ? '✕ CLOSE' : '⚙ SETTINGS'}
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="magi-panel max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-eva-green mb-6 tracking-wider">
              MAGI SYSTEM CONFIGURATION
            </h2>

            <div className="space-y-4">
              {tempConfigs.map((config) => {
                const color = MAGI_COLORS[config.name];
                const isExpanded = expandedSections[config.name];
                return (
                  <div
                    key={config.name}
                    className={`border border-${color}/30 rounded-lg bg-${color}/5`}
                  >
                    {/* 可點擊的標題區域 */}
                    <button
                      onClick={() => toggleSection(config.name)}
                      className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-${color}/10 transition-colors rounded-lg`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-${color} text-lg`}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                        <h3 className={`text-xl font-bold text-${color}`}>
                          {config.name}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-400">
                        {PROVIDER_NAMES[config.provider]}
                      </div>
                    </button>

                    {/* 展開的配置內容 */}
                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-4">
                        {/* AI Provider 選擇 */}
                        <div className="mb-4">
                      <label className={`block text-${color} mb-2 font-bold text-sm`}>
                        AI PROVIDER
                      </label>
                      <select
                        value={config.provider}
                        onChange={(e) =>
                          handleProviderChange(config.name, e.target.value as AIProvider)
                        }
                        className={`w-full bg-eva-dark border border-${color}/50 text-gray-100 px-4 py-3 rounded focus:outline-none focus:border-${color}`}
                      >
                        {Object.entries(PROVIDER_NAMES).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* API Endpoint */}
                    <div className="mb-4">
                      <label className={`block text-${color} mb-2 font-bold text-sm`}>
                        API ENDPOINT
                      </label>
                      <input
                        type="text"
                        placeholder="https://api.example.com/v1/..."
                        value={config.providerConfig.apiEndpoint || ''}
                        onChange={(e) =>
                          updateProviderConfig(config.name, 'apiEndpoint', e.target.value)
                        }
                        className={`w-full bg-eva-dark border border-${color}/50 text-gray-100 px-4 py-3 rounded focus:outline-none focus:border-${color} font-mono text-sm`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Default: {DEFAULT_ENDPOINTS[config.provider] || 'Not set'}
                      </p>
                    </div>

                    {/* API Key (可選) */}
                    <div className="mb-4">
                      <label className={`block text-${color} mb-2 font-bold text-sm`}>
                        API KEY <span className="text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Enter API key if required..."
                        value={config.providerConfig.apiKey || ''}
                        onChange={(e) =>
                          updateProviderConfig(config.name, 'apiKey', e.target.value)
                        }
                        className={`w-full bg-eva-dark border border-${color}/50 text-gray-100 px-4 py-3 rounded focus:outline-none focus:border-${color} font-mono text-sm`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Some AI services don't require an API key
                      </p>
                    </div>

                    {/* Model (可選) */}
                    <div>
                      <label className={`block text-${color} mb-2 font-bold text-sm`}>
                        MODEL <span className="text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., gpt-4, claude-3-5-sonnet..."
                        value={config.providerConfig.model || ''}
                        onChange={(e) =>
                          updateProviderConfig(config.name, 'model', e.target.value)
                        }
                        className={`w-full bg-eva-dark border border-${color}/50 text-gray-100 px-4 py-3 rounded focus:outline-none focus:border-${color} font-mono text-sm`}
                      />
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty to use default model
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Security Warning */}
              <div className="bg-eva-orange/10 border border-eva-orange/30 p-4 rounded">
                <p className="text-eva-orange text-sm">
                  ⚠ WARNING: Configuration is stored in your browser's localStorage.
                  Never share sensitive information or use this on public computers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} className="eva-button flex-1">
                  SAVE CONFIGURATION
                </button>
                <button
                  onClick={handleCancel}
                  className="eva-button flex-1 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
