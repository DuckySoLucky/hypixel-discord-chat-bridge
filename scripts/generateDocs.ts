import { readdir } from "node:fs/promises";
import "../src/private/logger.js";

process.env.UNIX_TIMESTAMP ||= Date.now().toString();
const scripts = await readdir("./scripts/docs", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));
console.other(`Found ${scripts.length} script(s). Running them all`);

for (const file of scripts) {
  console.other(`Running ${file}`);
  await import(`./docs/${file}`);
}

process.env.UNIX_TIMESTAMP = "";
process.exit(0);
