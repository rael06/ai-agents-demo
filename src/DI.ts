import { container } from "tsyringe";
import { AiModelFactory } from "./AiModels/AiModelFactory";
import { AiModelToken } from "./AiModels/BaseAiModel";

container.register(AiModelToken, {
  useValue: container
    .resolve(AiModelFactory)
    .createAiModel(process.env.MODEL_PROVIDER!),
});
