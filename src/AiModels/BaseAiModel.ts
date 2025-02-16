import { z } from "zod";

export abstract class BaseAiModel {
  abstract chat(args: {
    messages: ChatMessage[];
    stream: boolean;
    options?: ChatOptions;
  }): Promise<ChatResponse>;
  public async parseActionResponse(
    response: ChatResponse
  ): Promise<ChatAction> {
    // Step 1: Extract the JSON substring
    const jsonMatch = response.message.content.match(
      /Action:\s*```(?:json)?\s*([\s\S]*?)\s*```/
    );
    if (jsonMatch && jsonMatch[1]) {
      const jsonString = jsonMatch[1];

      // Step 2: Parse the JSON string
      try {
        const jsonObject = JSON.parse(jsonString);
        return await z
          .object({
            action: z.string(),
            action_input: z.record(z.string(), z.unknown()),
          })
          .parseAsync(jsonObject);
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("No JSON object found after 'Action:'");
    }
  }
}

export type ChatMessage = {
  role: string;
  content: string;
};

export type ChatResponse = {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done_reason: string;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

export type ChatOptions = {
  stop?: string[];
};

export type ChatAction = {
  action: string;
  action_input: Record<string, unknown>;
};
