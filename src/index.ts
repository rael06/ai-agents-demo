import "reflect-metadata";
import "dotenv/config";

import { z } from "zod";
import { container } from "tsyringe";
import { AiModelFactory } from "./AiModels/AiModelFactory";
import { systemPrompt } from "./prompts";

const aiModel = container
  .resolve(AiModelFactory)
  .createAiModel(process.env.MODEL_PROVIDER!);

// Tool function to fetch movie data
async function fetchMovies(query: string) {
  // Simulated data retrieval
  const data = {
    movies: [
      { title: "Mickey mouse", releaseDate: "2025-02-10" },
      { title: "The Avengers", releaseDate: "2025-05-04" },
      { title: "Iron Man and the madman", releaseDate: "2026-05-02" },
    ],
  };

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return data;
}

async function callModel(prompt: string) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  try {
    const aiResponse = await aiModel.chat({
      messages,
      options: { stop: ["Observation:"] },
      stream: false,
    });

    const chatAction = await aiModel.parseActionResponse(aiResponse);

    // Check if the AI indicates to call the get_movies tool
    if (chatAction.action === "get_movies") {
      const actionArgs = await z
        .object({ query: z.string() })
        .parseAsync(chatAction.action_input);

      const toolResponse = await fetchMovies(actionArgs.query);

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

      const observationResponse = await aiModel.chat({
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

// Main function to initiate the process
async function main() {
  await callModel(
    "What is the next Disney movie and when it will be released."
  );
}

main();
