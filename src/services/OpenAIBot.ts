import { AIBot } from './AIBot';
import { MAGIName } from '../types';
import type { AIResponse } from '../types';

/**
 * OpenAIBot - 使用 OpenAI GPT API
 */
export class OpenAIBot extends AIBot {
  private readonly defaultApiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly defaultModel = 'gpt-4o';

  constructor(
    apiKey: string | undefined,
    name: MAGIName,
    personality: string,
    apiEndpoint?: string,
    model?: string
  ) {
    super(apiKey, name, personality, apiEndpoint, model);
  }

  private getApiUrl(): string {
    return this.apiEndpoint || this.defaultApiUrl;
  }

  private getModel(): string {
    return this.model || this.defaultModel;
  }

  async query(prompt: string): Promise<AIResponse> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // 只在有 API key 時添加認證 header
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.getModel(),
          messages: [
            {
              role: 'system',
              content: 'You are a MAGI supercomputer. Always respond with valid JSON.',
            },
            {
              role: 'user',
              content: formattedPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return this.parseResponse(content);
    } catch (error) {
      console.error('OpenAIBot query failed:', error);
      throw error;
    }
  }
}
