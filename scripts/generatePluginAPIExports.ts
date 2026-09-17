import { readFile, readdir } from "node:fs/promises";
import { saveFile } from "./utils.js";

const types = await readdir("./src/types", { encoding: "utf-8" }).then((files) =>
  files
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
    .map((file) => file.replaceAll(".ts", ".js"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => `export * from "./types/${file}";`)
);

const utils = await readdir("./src/utils", { encoding: "utf-8" }).then((files) =>
  files
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
    .map((file) => file.replaceAll(".ts", ".js"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => `export * from "./utils/${file}";`)
);

const regex = /export \* from \"\.\/(?<folder>[[a-zA-Z]+)\/(?<name>[[a-zA-Z]+)\.js\";/;
const currentLines = await readFile("./src/plugin-api.ts", "utf-8").then((data) =>
  data.split("\n").filter((line) => {
    const match = regex.exec(line);
    if (!match) return true;
    if (!match.groups) return true;
    if (!match.groups.folder) return true;
    return !["types", "utils"].includes(match.groups.folder);
  })
);

await saveFile("./src/plugin-api.ts", [...types, "", ...utils, "", ...currentLines].join("\n"));
process.exit(0);
