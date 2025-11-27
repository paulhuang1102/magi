import { AIBot } from './AIBot';
import { MAGIName } from '../types';
import type { AIResponse } from '../types';

/**
 * ClaudeBot - 使用 Anthropic Claude API
 */
export class ClaudeBot extends AIBot {
  private readonly defaultApiUrl = 'https://api.anthropic.com/v1/messages';
  private readonly defaultModel = 'claude-3-5-sonnet-20241022';

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
        'anthropic-version': '2023-06-01',
      };

      // 只在有 API key 時添加認證 header
      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.getModel(),
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: formattedPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || '';

      return this.parseResponse(content);
    } catch (error) {
      console.error('ClaudeBot query failed:', error);
      throw error;
    }
  }
}
