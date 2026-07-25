import ConfigManager from "../src/ConfigManager.js";
import zod from "zod";
import { access, readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { getNestedValue } from "../src/utils/miscUtils.js";
import { markdownTable } from "markdown-table";
import { replaceVariables } from "../src/utils/stringUtils.js";
import type { ConfigMetadata, ConfigMetadataDescription, ConfigMetadataDotPathDescription, SchemaData, UnwrappedSchema } from "./types.js";

export function addLines(content: string, lines: string[]): string[] {
  lines.push(...content.split("\n").map((line) => line.trim()));
  return lines;
}

export async function addFile(path: string, lines: string[]): Promise<string[]> {
  const content = await readFile(path, "utf-8");
  return addLines(content, lines);
}

export function addTable(table: string[][], lines: string[]): string[] {
  return addLines(markdownTable(table), lines);
}

export async function saveFile(path: string, data: string) {
  const prettierFile = await readFile("./.prettierrc", "utf-8");
  const prettierConfig = JSON.parse(prettierFile);
  const formatted = await format(data, { ...prettierConfig, filepath: path });
  await writeFile(path, formatted, "utf-8");
  console.other(`File Saved - ${path}`);
}

export async function initMarkdownFile(path: string): Promise<string[]> {
  const id = path.replaceAll(".md", "").split("/")[1];
  if (!id) throw new Error("Something went wrong with getting the id");
  const headerPath = `./scripts/templates/${id}/Header.md`;
  let lines: string[] = [];

  try {
    await access(headerPath);
    lines = await addFile(headerPath, lines);
  } catch {
    // Do nothing
  }

  return lines;
}

export async function saveMarkdownFile(path: string, lines: string[]) {
  const id = path.replaceAll(".md", "").split("/")[1];
  if (!id) throw new Error("Something went wrong with getting the id");
  const footerPath = `./scripts/templates/${id}/Footer.md`;

  try {
    await access(footerPath);
    lines = await addFile(footerPath, lines);
  } catch {
    // Do nothing
  }

  const utilsFooter = await readFile("./scripts/templates/Utils/Footer.md", "utf-8");
  lines = addLines(replaceVariables(utilsFooter, { id }), lines);

  const globalUtilsFooter = await readFile("./scripts/templates/Utils/GlobalFooter.md", "utf-8");
  lines = addLines(replaceVariables(globalUtilsFooter, { id }), lines);

  await saveFile(path, lines.join("\n"));
}

export function unwrapSchema(schema: any): UnwrappedSchema {
  let optional = false;
  let nullable = false;

  while (true) {
    if (schema instanceof zod.ZodOptional) {
      optional = true;
      schema = schema.unwrap();
      continue;
    }

    if (schema instanceof zod.ZodNullable) {
      nullable = true;
      schema = schema.unwrap();
      continue;
    }

    if (schema instanceof zod.ZodDefault) {
      schema = schema.unwrap();
      continue;
    }

    break;
  }

  return { schema, optional, nullable };
}

export function getObjectShape(schema: any): Record<string, any> {
  return schema instanceof zod.ZodObject ? schema.shape : {};
}

export function getDotPath(path: string[], key: string): string {
  return [...path, key].join(".");
}

export function getMetadataDescription(schema: any): ConfigMetadataDescription {
  const meta = schema.meta();
  if (!meta) return { description: "", rawDescription: undefined };
  return { description: (meta.description ?? "").replace(/\n/g, " "), rawDescription: meta.description };
}

export function getTitle({ formattedDotPath, description, rawDescription }: ConfigMetadataDotPathDescription): string {
  return `${formattedDotPath}${rawDescription ? ` ${description}` : ""}:`;
}

export async function getMetadata({ schema, path, key }: SchemaData, shouldUseConfig: boolean = false): Promise<ConfigMetadata> {
  const { description, rawDescription } = getMetadataDescription(schema);
  const dotPath = getDotPath(path, key);
  const config = shouldUseConfig ? await ConfigManager.getConfigFile() : await ConfigManager.getExampleConfigFile();
  const value = getNestedValue(config, dotPath);
  const smallMetadata: ConfigMetadataDotPathDescription = { dotPath, formattedDotPath: `[${dotPath}]`, description, rawDescription };
  const metadata: ConfigMetadata = {
    dotPath,
    formattedDotPath: `[${dotPath}]`,
    description,
    rawDescription,
    title: getTitle(smallMetadata),
    skip: false,
    default: value
  };

  const meta = schema.meta();
  if (!meta) return metadata;
  metadata.skip = meta.skip ?? false;
  return metadata;
}
