import { DecisionType, MAGIName } from '../types';
import type { AIResponse } from '../types/ai.types';
/**
 * AIBot 抽象基類
 * 所有 AI 服務都必須繼承此類別並實作 query 方法
 */
export abstract class AIBot {
  protected apiKey?: string;
  protected name: MAGIName;
  protected personality: string;
  protected apiEndpoint?: string;
  protected model?: string;

  constructor(
    apiKey: string | undefined,
    name: MAGIName,
    personality: string,
    apiEndpoint?: string,
    model?: string
  ) {
    this.apiKey = apiKey;
    this.name = name;
    this.personality = personality;
    this.apiEndpoint = apiEndpoint;
    this.model = model;
  }

  /**
   * 抽象方法：向 AI 發送請求
   * @param prompt 使用者輸入的決策問題
   * @returns AI 的決策回應
   */
  abstract query(prompt: string): Promise<AIResponse>;

  /**
   * 格式化提示詞
   * 將使用者的問題與 MAGI 人格特徵結合
   */
  protected formatPrompt(userPrompt: string): string {
    return `You are ${this.name}, one of the three MAGI supercomputers from Evangelion.
Your personality: ${this.personality}

Analyze the following request and provide a decision.
You MUST respond in this exact JSON format:
{
  "decision": "APPROVE" | "REJECT" | "NEUTRAL",
  "confidence": <number between 0-100>,
  "reasoning": "<your detailed reasoning>"
}

Request: ${userPrompt}

Remember:
- APPROVE: You support this action
- REJECT: You oppose this action
- NEUTRAL: You have no strong opinion or need more information
- Confidence: How certain you are (0-100%)
- Reasoning: Explain your decision from your personality's perspective`;
  }

  /**
   * 解析 AI 回應並提取決策資訊
   */
  protected parseResponse(content: string): AIResponse {
    try {
      // 嘗試直接解析 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          decision: this.validateDecision(parsed.decision),
          confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
          reasoning: parsed.reasoning || 'No reasoning provided',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // 如果解析失敗，返回預設回應
    return {
      decision: DecisionType.NEUTRAL,
      confidence: 0,
      reasoning: 'Failed to parse response: ' + content.substring(0, 200),
      timestamp: Date.now(),
    };
  }

  /**
   * 驗證決策類型
   */
  private validateDecision(decision: string): DecisionType {
    const upper = decision?.toUpperCase();
    if (upper === 'APPROVE') return DecisionType.APPROVE;
    if (upper === 'REJECT') return DecisionType.REJECT;
    return DecisionType.NEUTRAL;
  }

  /**
   * 取得 AI 名稱
   */
  getName(): MAGIName {
    return this.name;
  }

  /**
   * 取得人格描述
   */
  getPersonality(): string {
    return this.personality;
  }
}
