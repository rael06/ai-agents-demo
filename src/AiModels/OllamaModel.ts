import {
  ChatMessage,
  ChatOptions,
  ChatResponse,
  BaseAiModel,
} from "./BaseAiModel";

export class OllamaModel extends BaseAiModel {
  public async chat({
    messages,
    options,
    stream,
  }: {
    messages: ChatMessage[];
    options?: ChatOptions;
    stream: boolean;
  }): Promise<ChatResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(process.env.MODEL_API_URL!, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: process.env.MODEL_NAME!,
          messages,
          stream: false, // Set to `true` for streaming responses
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const jsonResponse = await response.json();

      return jsonResponse satisfies ChatResponse;
    } catch (error) {
      throw Error(`Chat with Model API Error: ${error}`);
    }
  }
}
