import {
  ChatMessage,
  ChatOptions,
  ChatResponse,
  BaseAiModel,
} from "./BaseAiModel";

export class OpenAiModel extends BaseAiModel {
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
      Authorization: `Bearer ${process.env.MODEL_SECRET!}`,
    };

    try {
      const response = await fetch(process.env.MODEL_API_URL!, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: process.env.MODEL_NAME!,
          messages,
          stream: false, // Set to `true` for streaming responses
          ...options,
        }),
      });

      if (!response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";
        while (true) {
          if (!reader) break;
          const { value, done } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
        }
        console.error(result);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const jsonResponse = await response.json();

      return jsonResponse.choices[0] satisfies ChatResponse;
    } catch (error) {
      throw Error(`Chat with Model API Error: ${error}`);
    }
  }
}
