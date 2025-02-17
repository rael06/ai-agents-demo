import "reflect-metadata";
import "dotenv/config";
import "./DI";

import { container } from "tsyringe";
import { AiAgent } from "./AiAgent";

class Program {
  public static async main() {
    const agent = container.resolve(AiAgent);
    await agent.answer(
      "What is the next Disney movie and when it will be released."
    );
  }
}

Program.main();
