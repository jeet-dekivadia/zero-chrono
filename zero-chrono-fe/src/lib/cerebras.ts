interface CerebrasConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CerebrasResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  model: string;
}

export class CerebrasClient {
  private config: CerebrasConfig;

  constructor(config: CerebrasConfig) {
    this.config = config;
  }

  async generateCompletion(
    messages: CerebrasMessage[],
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<{ content: string; model: string }> {
    const { temperature = 0.7, maxTokens = 4096 } = options;

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cerebras API error: ${response.status} ${response.statusText}`);
      }

      const data: CerebrasResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Cerebras API');
      }

      return {
        content: data.choices[0].message.content,
        model: data.model,
      };
    } catch (error) {
      console.error('Cerebras API error:', error);
      throw error;
    }
  }

  async generateSingleCompletion(
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    } = {}
  ): Promise<{ content: string; model: string }> {
    const { systemPrompt, ...completionOptions } = options;
    
    const messages: CerebrasMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    return this.generateCompletion(messages, completionOptions);
  }
}

// Default client instance
export function createCerebrasClient(): CerebrasClient {
  const apiKey = process.env.CEREBRAS_API_KEY;
  const baseUrl = process.env.CEREBRAS_BASE_URL || 'https://api.cerebras.ai/v1';
  const model = process.env.CEREBRAS_MODEL || 'llama3.1-8b';

  if (!apiKey) {
    throw new Error('CEREBRAS_API_KEY environment variable is required');
  }

  return new CerebrasClient({
    apiKey,
    baseUrl,
    model,
  });
}
