import ConfigManager from "./src/ConfigManager.js";
import { mkdir } from "node:fs/promises";
import "./src/private/logger.js";

await mkdir("./data/", { recursive: true });

const configManager = new ConfigManager();
const config = await configManager.init();

const { default: Application } = await import("./src/Application.js");
const application = new Application(config);
await application.connect();
