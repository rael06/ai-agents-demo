import { BaseAiModel } from "./BaseAiModel";
import { OllamaModel } from "./OllamaModel";
import { OpenAiModel } from "./OpenAiModel";

export class AiModelFactory {
  public createAiModel(modelProvider: string): BaseAiModel {
    const aiModel: BaseAiModel | undefined = {
      openai: new OpenAiModel(),
      ollama: new OllamaModel(),
    }[modelProvider];

    if (!aiModel) {
      throw new Error(`Unknown model provider: ${modelProvider}`);
    }

    return aiModel;
  }
}
