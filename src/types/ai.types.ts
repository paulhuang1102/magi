// MAGI 系統型別定義

/**
 * AI 決策類型
 */
export enum DecisionType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  NEUTRAL = 'NEUTRAL',
}

/**
 * AI 狀態
 */
export enum AIStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

/**
 * MAGI 系統名稱
 */
export enum MAGIName {
  MELCHIOR = 'MELCHIOR',
  BALTHASAR = 'BALTHASAR',
  CASPER = 'CASPER',
}

/**
 * AI 提供者類型
 */
export enum AIProvider {
  CLAUDE = 'claude',
  OPENAI = 'openai',
  GEMINI = 'gemini',
  CUSTOM = 'custom', // 自訂 AI provider
}

/**
 * AI Provider 配置
 */
export interface ProviderConfig {
  provider: AIProvider;
  apiEndpoint?: string; // 可選的自訂 API 端點
  apiKey?: string; // 可選的 API Key
  model?: string; // 可選的模型名稱
}

/**
 * AI 回應介面
 */
export interface AIResponse {
  decision: DecisionType;
  confidence: number; // 0-100
  reasoning: string;
  timestamp: number;
}

/**
 * AI 配置
 */
export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  name: MAGIName;
  personality: string;
}

/**
 * MAGI 實例狀態
 */
export interface MAGIInstance {
  name: MAGIName;
  provider: AIProvider;
  providerConfig: ProviderConfig; // 完整的 provider 配置
  status: AIStatus;
  response: AIResponse | null;
  error: string | null;
}

/**
 * 決策請求
 */
export interface DecisionRequest {
  prompt: string;
  timestamp: number;
}

/**
 * 最終決策結果
 */
export interface FinalDecision {
  result: DecisionType;
  approveCount: number;
  rejectCount: number;
  neutralCount: number;
  responses: MAGIInstance[];
  timestamp: number;
}

/**
 * API Key 設定
 */
export interface APIKeys {
  claude?: string;
  openai?: string;
  gemini?: string;
}

/**
 * 決策歷史記錄
 */
export interface DecisionHistory {
  id: string;
  request: DecisionRequest;
  decision: FinalDecision;
}
