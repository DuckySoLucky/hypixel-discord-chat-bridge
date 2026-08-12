import { initMarkdownFile, saveMarkdownFile } from "../utils.js";
import { readdir } from "node:fs/promises";
import { titleCaseCamel } from "../../src/utils/stringUtils.ts";

const lines: string[] = await initMarkdownFile("docs/README.md");

const docs = await readdir("./docs/", { recursive: true, encoding: "utf-8" }).then((files) =>
  files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replaceAll(".md", ""))
    .filter((file) => !["README"].includes(file))
);

docs.forEach((doc) => lines.push(`- [${titleCaseCamel(doc)}](/docs/${doc}.md)`));

await saveMarkdownFile("docs/README.md", lines);
