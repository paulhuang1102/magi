import React, { createContext, useContext, useState } from 'react';
import { AIStatus, MAGIName, AIProvider } from '../types';
import type { ReactNode } from 'react';

import type { APIKeys,  MAGIInstance, FinalDecision, } from '../types';

interface MAGIContextType {
  apiKeys: APIKeys;
  setApiKeys: (keys: APIKeys) => void;
  magiInstances: MAGIInstance[];
  setMagiInstances: React.Dispatch<React.SetStateAction<MAGIInstance[]>>;
  updateMAGIConfig: (name: MAGIName, config: Partial<MAGIInstance>) => void;
  currentDecision: FinalDecision | null;
  setCurrentDecision: (decision: FinalDecision | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const MAGIContext = createContext<MAGIContextType | undefined>(undefined);

const STORAGE_KEY = 'magi_api_keys';
const MAGI_CONFIG_STORAGE_KEY = 'magi_configs';

/**
 * 從 localStorage 載入 API Keys
 */
const loadApiKeys = (): APIKeys => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load API keys:', error);
    return {};
  }
};

/**
 * 儲存 API Keys 到 localStorage
 */
const saveApiKeys = (keys: APIKeys): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error('Failed to save API keys:', error);
  }
};

/**
 * 從 localStorage 載入 MAGI 配置
 */
const loadMAGIConfigs = (): MAGIInstance[] | null => {
  try {
    const stored = localStorage.getItem(MAGI_CONFIG_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load MAGI configs:', error);
    return null;
  }
};

/**
 * 儲存 MAGI 配置到 localStorage
 */
const saveMAGIConfigs = (configs: MAGIInstance[]): void => {
  try {
    localStorage.setItem(MAGI_CONFIG_STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error('Failed to save MAGI configs:', error);
  }
};

/**
 * 初始化三個 MAGI 實例
 */
const initializeMAGIInstances = (): MAGIInstance[] => {
  // 嘗試從 localStorage 載入配置
  const savedConfigs = loadMAGIConfigs();

  // 如果有儲存的配置，使用它們（但重置狀態）
  if (savedConfigs && savedConfigs.length === 3) {
    return savedConfigs.map(config => ({
      ...config,
      status: AIStatus.IDLE,
      response: null,
      error: null,
    }));
  }

  // 否則返回預設配置
  return [
    {
      name: MAGIName.MELCHIOR,
      provider: AIProvider.CLAUDE,
      providerConfig: {
        provider: AIProvider.CLAUDE,
      },
      status: AIStatus.IDLE,
      response: null,
      error: null,
    },
    {
      name: MAGIName.BALTHASAR,
      provider: AIProvider.OPENAI,
      providerConfig: {
        provider: AIProvider.OPENAI,
      },
      status: AIStatus.IDLE,
      response: null,
      error: null,
    },
    {
      name: MAGIName.CASPER,
      provider: AIProvider.GEMINI,
      providerConfig: {
        provider: AIProvider.GEMINI,
      },
      status: AIStatus.IDLE,
      response: null,
      error: null,
    },
  ];
};

export const MAGIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeysState] = useState<APIKeys>(loadApiKeys);
  const [magiInstances, setMagiInstancesState] = useState<MAGIInstance[]>(initializeMAGIInstances);
  const [currentDecision, setCurrentDecision] = useState<FinalDecision | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const setApiKeys = (keys: APIKeys) => {
    setApiKeysState(keys);
    saveApiKeys(keys);
  };

  const setMagiInstances: React.Dispatch<React.SetStateAction<MAGIInstance[]>> = (value) => {
    setMagiInstancesState((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      // 儲存配置（但不儲存狀態、回應和錯誤）
      const configsToSave = newValue.map(({ name, provider, providerConfig }) => ({
        name,
        provider,
        providerConfig,
        status: AIStatus.IDLE,
        response: null,
        error: null,
      }));
      saveMAGIConfigs(configsToSave);
      return newValue;
    });
  };

  const updateMAGIConfig = (name: MAGIName, config: Partial<MAGIInstance>) => {
    setMagiInstances((prev) =>
      prev.map((instance) =>
        instance.name === name ? { ...instance, ...config } : instance
      )
    );
  };

  const value: MAGIContextType = {
    apiKeys,
    setApiKeys,
    magiInstances,
    setMagiInstances,
    updateMAGIConfig,
    currentDecision,
    setCurrentDecision,
    isProcessing,
    setIsProcessing,
  };

  return <MAGIContext.Provider value={value}>{children}</MAGIContext.Provider>;
};

/**
 * Hook 來使用 MAGI Context
 */
export const useMAGIContext = (): MAGIContextType => {
  const context = useContext(MAGIContext);
  if (!context) {
    throw new Error('useMAGIContext must be used within MAGIProvider');
  }
  return context;
};
