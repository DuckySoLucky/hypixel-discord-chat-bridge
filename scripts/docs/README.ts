import { initMarkdownFile, saveMarkdownFile } from "../utils.js";
import { readdir } from "node:fs/promises";
import { titleCaseCamel } from "../../src/utils/stringUtils.ts";

async function generateReadme(dir: string): Promise<void> {
  const entries = await readdir(dir, { encoding: "utf-8", withFileTypes: true });
  const lines: string[] = await initMarkdownFile(`${dir}/README.md`, "README", { path: dir === "docs" ? "" : `${dir}/` });

  entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md")
    .map((entry) => entry.name.replace(/\.md$/, ""))
    .sort((a, b) => a.localeCompare(b))
    .forEach((file) => lines.push(`- [${titleCaseCamel(file)}](/docs/${file}.md)`));

  const folders = entries.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
  for (const folder of folders) {
    lines.push(`- [${titleCaseCamel(folder.name)}](/docs/${folder.name}/README.md)`);
    await generateReadme(`${dir}/${folder.name}`);
  }

  await saveMarkdownFile(`${dir}/README.md`, lines, "README");
}

await generateReadme("docs");
