import ConfigManager from "../src/ConfigManager.js";
import zod from "zod";
import { type TemplatePrimitive, replaceVariables } from "../src/utils/stringUtils.js";
import { access, readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { getNestedValue } from "../src/utils/miscUtils.js";
import { markdownTable } from "markdown-table";
import type { ConfigMetadata, ConfigMetadataDescription, ConfigMetadataDotPathDescription, SchemaData, UnwrappedSchema } from "./types.js";

import "../src/private/logger.js";

export function addLines(content: string, lines: string[], variables: Readonly<Record<string, TemplatePrimitive>> = {}): string[] {
  lines.push(...content.split("\n").map((line) => replaceVariables(line.trim(), variables)));
  return lines;
}

export async function addFile(path: string, lines: string[], variables?: Readonly<Record<string, TemplatePrimitive>>): Promise<string[]> {
  const content = await readFile(path, "utf-8");
  return addLines(content, lines, variables);
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

export function getMarkdownFileId(path: string): string {
  return path.replaceAll("docs/", "").replaceAll(".md", "");
}

export async function initMarkdownFile(path: string, id: string = getMarkdownFileId(path), variables?: Readonly<Record<string, TemplatePrimitive>>): Promise<string[]> {
  const headerPath = `./scripts/templates/${id}/Header.md`;
  let lines: string[] = [];

  try {
    await access(headerPath);
    lines = await addFile(headerPath, lines, variables);
  } catch {
    // Do nothing
  }

  return lines;
}

export async function saveMarkdownFile(path: string, lines: string[], id: string = getMarkdownFileId(path)) {
  const footerPath = `./scripts/templates/${id}/Footer.md`;

  try {
    await access(footerPath);
    lines = await addFile(footerPath, lines);
  } catch {
    // Do nothing
  }

  process.env.UNIX_TIMESTAMP ||= Date.now().toString();
  const variables: Readonly<Record<string, TemplatePrimitive>> = {
    id,
    timestamp: new Date(Number(process.env.UNIX_TIMESTAMP)).toUTCString(),
    unix: process.env.UNIX_TIMESTAMP
  };

  const generatedFooter = await readFile("./scripts/templates/Utils/GeneratedFooter.md", "utf-8");
  lines = addLines(generatedFooter, lines, variables);

  const globalFooter = await readFile("./scripts/templates/Utils/GlobalFooter.md", "utf-8");
  lines = addLines(globalFooter, lines, variables);

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
