import { lowerFirst } from "../src/utils/stringUtils.js";
import { readFile, readdir } from "node:fs/promises";
import { saveFile } from "./utils.js";
import "../src/private/logger.js";

const packageJson = JSON.parse(await readFile("package.json", "utf-8"));
const fixedScripts = Object.fromEntries(
  Object.entries(packageJson.scripts as Record<string, string>)
    .filter(([name]) => !name.startsWith("docgen"))
    .filter(([name]) => !name.startsWith("validate"))
);

function getScriptName(name: string): string {
  return name
    .replaceAll(".", "/")
    .replaceAll(":", "/")
    .split("/")
    .map((item) => lowerFirst(item))
    .join(":");
}

const docgen: string[] = [];
fixedScripts.docgen = "a";
const docGenScripts = await readdir("./scripts/", { encoding: "utf-8" }).then((files) =>
  files
    .filter((file) => file.startsWith("generate") && file.endsWith(".ts"))
    .filter((file) => !["generateConfig.ts"].includes(file))
    .map((file) => file.replaceAll(".ts", "").replaceAll("generate", ""))
);
for (const file of docGenScripts) {
  fixedScripts[`docgen:${getScriptName(file)}`] = `pnpm exec tsx scripts/generate${file}.ts`;
  docgen.push(lowerFirst(file));
}

const docsScripts = await readdir("./scripts/docs", { recursive: true, encoding: "utf-8" }).then((files) =>
  files.filter((file) => file.endsWith(".ts")).map((file) => file.replaceAll(".ts", ""))
);
for (const file of docsScripts) {
  fixedScripts[`docgen:docs:${getScriptName(file)}`] = `pnpm exec tsx scripts/docs/${file}.ts`;
}

fixedScripts.docgen = docgen.map((script) => `pnpm docgen:${script}`).join(" && ");

const validate: string[] = [];
fixedScripts.validate = "a";
const validateScripts = await readdir("./scripts/validate", { encoding: "utf-8" }).then((files) =>
  files.filter((file) => file.endsWith(".ts")).map((file) => file.replaceAll(".ts", ""))
);
for (const file of validateScripts) {
  fixedScripts[`validate:${getScriptName(file)}`] = `pnpm exec tsx scripts/validate/${file}.ts`;
  validate.push(lowerFirst(file));
}
fixedScripts.validate = validate.map((script) => `pnpm validate:${script}`).join(" && ");

packageJson.scripts = fixedScripts;
await saveFile("package.json", JSON.stringify(packageJson));

process.exit(0);
