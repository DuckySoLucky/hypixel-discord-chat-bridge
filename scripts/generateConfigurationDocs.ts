import zod from "zod";
import { Config } from "../src/types/config.js";
import { addTable, getMetadataDescription, getObjectShape, initMarkdownFile, saveMarkdownFile, unwrapSchema } from "./utils.js";

// TODO: One day I want to remove the use of `any` but i'm not smart enough to do this at the moment

const lines = await initMarkdownFile("docs/Configuration.md");

function isOptionalSchema(schema: any): boolean {
  return unwrapSchema(schema).optional;
}

function getTypeLabel(schema: any): string {
  const { schema: unwrapped, optional, nullable } = unwrapSchema(schema);

  let type: string;

  if (unwrapped instanceof zod.ZodString || unwrapped instanceof zod.ZodURL) {
    type = "string";
  } else if (unwrapped instanceof zod.ZodNumber) {
    type = "number";
  } else if (unwrapped instanceof zod.ZodBoolean) {
    type = "boolean";
  } else if (unwrapped instanceof zod.ZodEnum) {
    type = `enum(${Object.values(unwrapped.enum).join(", ")})`;
  } else if (unwrapped instanceof zod.ZodLiteral) {
    type = `literal(${JSON.stringify(unwrapped.value)})`;
  } else if (unwrapped instanceof zod.ZodArray) {
    type = `array<${getTypeLabel(unwrapped.element)}>`;
  } else if (unwrapped instanceof zod.ZodRecord) {
    type = `record<string, ${getTypeLabel(unwrapped.valueType)}>`;
  } else if (unwrapped instanceof zod.ZodUnion) {
    type = unwrapped.options.map(getTypeLabel).join(" OR ");
  } else if (unwrapped instanceof zod.ZodObject) {
    type = "object";
  } else if (unwrapped instanceof zod.ZodAny) {
    type = "any";
  } else if (unwrapped instanceof zod.ZodUnknown) {
    type = "UNKNOWN";
  } else {
    type = "UNKNOWN";
  }

  if (nullable) type += " OR null";
  if (optional) type += " OR undefined";
  return type;
}

function getSectionHeading(path: string[]): string {
  if (path.length === 0) return "# <Root>";
  const headingLevel = Math.min(path.length + 1, 6);
  return `${"#".repeat(headingLevel)} ${path[path.length - 1]}`;
}

function renderSchemaSection(schema: any, path: string[], lines: string[]): void {
  const entries = Object.entries(getObjectShape(schema));
  if (entries.length === 0) return;

  lines.push(getSectionHeading(path));
  lines.push("");
  addTable(
    [
      ["Key", "Type", "Required", "Description"],
      ...entries.map(([key, fieldSchema]) => [
        `\`${key}\``,
        `\`${getTypeLabel(fieldSchema)}\``,
        isOptionalSchema(fieldSchema) ? "No" : "Yes",
        getMetadataDescription(fieldSchema).description
      ])
    ],
    lines
  );
  lines.push("");

  for (const [key, fieldSchema] of entries) {
    const { schema: unwrapped } = unwrapSchema(fieldSchema);
    if (unwrapped instanceof zod.ZodObject) renderSchemaSection(unwrapped, [...path, key], lines);
  }
}

renderSchemaSection(Config, [], lines);

await saveMarkdownFile("docs/Configuration.md", lines);
