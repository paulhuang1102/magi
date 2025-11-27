import { useMAGIContext } from '../context/MAGIContext';
import { ClaudeBot } from '../services/ClaudeBot';
import { OpenAIBot } from '../services/OpenAIBot';
import { GeminiBot } from '../services/GeminiBot';
import {
  MAGIName,
  AIProvider,
  AIStatus,
  DecisionType,
} from '../types';
import type { FinalDecision, MAGIInstance } from '../types';


// MAGI 人格定義
const PERSONALITIES: Record<MAGIName, string> = {
  [MAGIName.MELCHIOR]: 'A scientist personality. You analyze problems through logic, data, and scientific methodology. You prioritize empirical evidence and rational thinking.',
  [MAGIName.BALTHASAR]: 'A mother personality. You consider the human impact, emotional consequences, and protective instincts. You prioritize safety and wellbeing.',
  [MAGIName.CASPER]: 'A woman personality. You balance intuition with practical concerns, considering both immediate and long-term implications. You value harmony and sustainable solutions.',
};

export const useMAGI = () => {
  const { magiInstances, setMagiInstances, setCurrentDecision, setIsProcessing } =
    useMAGIContext();

  /**
   * 建立 AI Bot 實例
   */
  const createBot = (instance: MAGIInstance) => {
    const personality = PERSONALITIES[instance.name];
    const { provider, providerConfig } = instance;
    const { apiKey, apiEndpoint, model } = providerConfig;

    switch (provider) {
      case AIProvider.CLAUDE:
        return new ClaudeBot(
          apiKey || '',
          instance.name,
          personality,
          apiEndpoint,
          model
        );

      case AIProvider.OPENAI:
        return new OpenAIBot(
          apiKey || '',
          instance.name,
          personality,
          apiEndpoint,
          model
        );

      case AIProvider.GEMINI:
        return new GeminiBot(
          apiKey || '',
          instance.name,
          personality,
          apiEndpoint,
          model
        );

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  };

  /**
   * 執行單一 AI 的決策查詢
   */
  const queryAI = async (instance: MAGIInstance, prompt: string) => {
    try {
      // 更新狀態為 THINKING
      setMagiInstances((prev) =>
        prev.map((inst) =>
          inst.name === instance.name
            ? { ...inst, status: AIStatus.THINKING, response: null, error: null }
            : inst
        )
      );

      const bot = createBot(instance);
      const response = await bot.query(prompt);

      // 更新狀態為 COMPLETED
      setMagiInstances((prev) =>
        prev.map((inst) =>
          inst.name === instance.name ? { ...inst, status: AIStatus.COMPLETED, response } : inst
        )
      );

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // 更新狀態為 ERROR
      setMagiInstances((prev) =>
        prev.map((inst) =>
          inst.name === instance.name
            ? { ...inst, status: AIStatus.ERROR, error: errorMessage }
            : inst
        )
      );

      throw error;
    }
  };

  /**
   * 提交決策請求給所有三個 MAGI
   */
  const submitDecision = async (prompt: string) => {
    setIsProcessing(true);
    setCurrentDecision(null);

    try {
      // 並行查詢所有三個 AI
      const queries = magiInstances.map((instance) =>
        queryAI(instance, prompt).catch((error) => {
          console.error(`${instance.name} failed:`, error);
          return null;
        })
      );

      await Promise.all(queries);

      // 計算最終決策
      const finalDecision = calculateFinalDecision();
      setCurrentDecision(finalDecision);
    } catch (error) {
      console.error('Decision submission failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 計算最終決策（多數決）
   */
  const calculateFinalDecision = (): FinalDecision => {
    let approveCount = 0;
    let rejectCount = 0;
    let neutralCount = 0;

    magiInstances.forEach((instance) => {
      if (instance.response) {
        switch (instance.response.decision) {
          case DecisionType.APPROVE:
            approveCount++;
            break;
          case DecisionType.REJECT:
            rejectCount++;
            break;
          case DecisionType.NEUTRAL:
            neutralCount++;
            break;
        }
      }
    });

    // 決定最終結果（多數決）
    let result: DecisionType;
    if (approveCount >= 2) {
      result = DecisionType.APPROVE;
    } else if (rejectCount >= 2) {
      result = DecisionType.REJECT;
    } else {
      result = DecisionType.NEUTRAL;
    }

    return {
      result,
      approveCount,
      rejectCount,
      neutralCount,
      responses: [...magiInstances],
      timestamp: Date.now(),
    };
  };

  /**
   * 重置所有 MAGI 狀態
   */
  const resetMAGI = () => {
    setMagiInstances((prev) =>
      prev.map((instance) => ({
        ...instance,
        status: AIStatus.IDLE,
        response: null,
        error: null,
      }))
    );
    setCurrentDecision(null);
  };

  return {
    submitDecision,
    resetMAGI,
  };
};
