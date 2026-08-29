import ConfigManager from "./src/ConfigManager.js";
import { mkdir } from "node:fs/promises";
import "./src/private/logger.js";

await mkdir("./data/", { recursive: true });

const configManager = new ConfigManager();
const config = await configManager.init();

const { default: Application } = await import("./src/Application.js");
const application = new Application(config);
let stopping = false;
const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (stopping) return;
  stopping = true;
  console.info(`Received ${signal}; shutting down.`);
  try {
    await application.stop();
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
};

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

await application.start();
