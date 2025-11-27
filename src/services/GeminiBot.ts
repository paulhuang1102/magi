import { AIBot } from './AIBot';
import { MAGIName } from '../types';
import type { AIResponse } from '../types';

/**
 * GeminiBot - 使用 Google Gemini API
 */
export class GeminiBot extends AIBot {
  private readonly defaultBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly defaultModel = 'gemini-2.0-flash-exp';

  constructor(
    apiKey: string | undefined,
    name: MAGIName,
    personality: string,
    apiEndpoint?: string,
    model?: string
  ) {
    super(apiKey, name, personality, apiEndpoint, model);
  }

  private getBaseUrl(): string {
    return this.apiEndpoint || this.defaultBaseUrl;
  }

  private getModel(): string {
    return this.model || this.defaultModel;
  }

  private buildApiUrl(): string {
    const baseUrl = this.getBaseUrl();
    const model = this.getModel();
    const url = `${baseUrl}/${model}:generateContent`;

    // 如果有 API key，添加到 URL 參數中
    if (this.apiKey) {
      return `${url}?key=${this.apiKey}`;
    }

    return url;
  }

  async query(prompt: string): Promise<AIResponse> {
    try {
      const formattedPrompt = this.formatPrompt(prompt);
      const apiUrl = this.buildApiUrl();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: formattedPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return this.parseResponse(content);
    } catch (error) {
      console.error('GeminiBot query failed:', error);
      throw error;
    }
  }
}
