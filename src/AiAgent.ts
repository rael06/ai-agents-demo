import { container, inject, injectable } from "tsyringe";
import { z } from "zod";
import { AiModelToken, BaseAiModel } from "./AiModels/BaseAiModel";
import { systemPrompt } from "./prompts";
import { FetchMoviesTool } from "./tools/FetchMoviesTool";

@injectable()
export class AiAgent {
  public constructor(@inject(AiModelToken) private aiModel: BaseAiModel) {}
  public async answer(prompt: string) {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];

    try {
      const aiResponse = await this.aiModel.chat({
        messages,
        options: { stop: ["Observation:"] },
        stream: false,
      });

      const chatAction = await this.aiModel.parseActionResponse(aiResponse);

      // Check if the AI indicates to call the get_movies tool
      if (chatAction.action === "get_movies") {
        const actionArgs = await z
          .object({ query: z.string() })
          .parseAsync(chatAction.action_input);

        const toolResponse = await container
          .resolve(FetchMoviesTool)
          .fetchMovies(actionArgs.query);

        const actionResponse = aiResponse.message.content.trim();
        const observationPrompt = `${actionResponse}\n\nObservation:\n${JSON.stringify(
          toolResponse,
          null,
          2
        )}\n`;

        console.log(observationPrompt);

        messages.push({
          role: "assistant",
          content: observationPrompt,
        });

        const observationResponse = await this.aiModel.chat({
          messages,
          stream: false,
        });

        console.log(observationResponse.message.content);
      } else {
        console.log("No data retrieval triggered.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
