import ConfigManager from "../src/ConfigManager.js";
import zod from "zod";
import { Config, ConfigVerificationRolesCustomEnabled, ConfigVerificationRolesCustomRequirement } from "../src/types/config.js";
import {
  PlayerVariableStatsKeyDescriptionMap,
  PlayerVariableStatsKeys,
  PlayerVariableStatsKeysNumbers,
  type PlayerVariableStatsKeysString,
  PlayerVariableStatsKeysStrings
} from "../src/private/constants.js";
import { access } from "node:fs/promises";
import { confirm, input, number, search, select } from "@inquirer/prompts";
import { getMetadata, getObjectShape, saveFile, unwrapSchema } from "./utils.js";
import { titleCaseCamel } from "../src/utils/stringUtils.js";
import type { AskMetadata, SchemaData } from "./types.js";

const context = { shouldUseConfig: false };

async function askString({ configMetadata, nullable, optional }: AskMetadata, required: boolean = false): Promise<string | null | undefined> {
  const response = await input({ message: configMetadata.title, default: configMetadata.default, required });
  if (response.trim() !== "") return response;
  if (nullable) return null;
  if (optional) return undefined;
  return response;
}

async function askNumber({ configMetadata }: AskMetadata): Promise<number> {
  return await number({ message: configMetadata.title, required: true, default: configMetadata.default });
}

async function askBoolean({ configMetadata }: AskMetadata): Promise<boolean> {
  return await confirm({ message: configMetadata.title, default: configMetadata.default });
}

async function askStringArray({ configMetadata, nullable, optional }: AskMetadata): Promise<string[] | null | undefined> {
  const defaultString = Array.isArray(configMetadata.default) ? configMetadata.default.join(", ") : configMetadata.default;
  const response = await input({ message: `${configMetadata.title} (comma-separated)`, default: defaultString });
  if (response.trim() !== "") return response.split(",").map((item) => item.trim());
  if (nullable) return null;
  if (optional) return undefined;
  return [];
}

async function askEnum(unwrappedSchema: zod.ZodEnum<any>, { configMetadata }: AskMetadata): Promise<string> {
  const choices = unwrappedSchema.options.map((option: string) => ({ name: option, value: option }));
  return await select({ message: configMetadata.title, choices, default: configMetadata.default });
}

async function askRequirements({ configMetadata }: AskMetadata): Promise<Record<string, any>> {
  const record: Record<string, any> = {};

  const requirementsChoices = [
    { name: "Exit", value: "exit", description: "Exit" },
    ...PlayerVariableStatsKeysNumbers.map((key) => ({
      name: titleCaseCamel(key),
      value: key,
      description: PlayerVariableStatsKeyDescriptionMap[key] ?? "No Description Provided"
    }))
  ];

  let addKeys = await confirm({ message: `${configMetadata.title.replaceAll(":", "")} - Do you want to add a key`, default: true });

  while (addKeys) {
    const key = await search({
      message: "Select a requirement key:",
      source: (input) => {
        if (!input) return requirementsChoices;
        return [
          ...requirementsChoices.filter((choice) => choice.name.toLowerCase().startsWith(input.toLowerCase())),
          { name: "Exit", value: "exit", description: "Exit" }
        ];
      }
    });

    if (key === "exit") break;

    if (key in record) {
      const overwrite = await confirm({ message: `"${key}" is already configured. Current value: ${record[key]}. Do you want to overwrite it?`, default: false });
      if (!overwrite) continue;
    }

    const value = await number({ message: "Requirement value:", required: true });
    record[key] = value;

    addKeys = await confirm({ message: "Do you want to add another entry?", default: false });
  }

  return record;
}

async function askVerficationRole(schema: any, meta: AskMetadata): Promise<Record<string, any>> {
  const configMetadata = await getMetadata({ schema, path: meta.configMetadata.dotPath.split("."), key: "enabled" }, context.shouldUseConfig);
  const enabled = await askBoolean({ configMetadata, optional: false, nullable: false });
  let roleId: string | null = null;
  if (enabled) {
    const roleConfigMetadata = await getMetadata({ schema, path: meta.configMetadata.dotPath.split("."), key: "roleId" }, context.shouldUseConfig);
    roleId = (await askString({ configMetadata: roleConfigMetadata, optional: false, nullable: false }, true)) ?? "";
  }

  return { enabled, roleId };
}

async function askCustomVerficationRoles(schema: any, { configMetadata }: AskMetadata): Promise<ConfigVerificationRolesCustomEnabled[]> {
  const customRoles: ConfigVerificationRolesCustomEnabled[] = [];
  let addRole = await confirm({ message: `${configMetadata.title.replaceAll(":", "")} - Do you want to add a custom role`, default: true });
  while (addRole) {
    const roleConfigMetadata = await getMetadata({ schema, path: `${configMetadata.dotPath}.${customRoles.length}`.split("."), key: "roleId" }, context.shouldUseConfig);
    const roleId = (await askString({ configMetadata: roleConfigMetadata, optional: false, nullable: false }, true)) ?? "";
    const roleRequireConfigMetadata = await getMetadata(
      { schema, path: `${configMetadata.dotPath}.${customRoles.length}`.split("."), key: "requirements" },
      context.shouldUseConfig
    );
    let addRoleRequirements = await confirm({
      message: `${roleRequireConfigMetadata.title.replaceAll(":", "")} - Do you want to add a custom role requirement`,
      default: true
    });
    const requirementsChoices = [
      { name: "Exit", value: "exit", description: "Exit" },
      ...PlayerVariableStatsKeys.map((key) => ({
        name: titleCaseCamel(key),
        value: key,
        description: PlayerVariableStatsKeyDescriptionMap[key] ?? "No Description Provided"
      }))
    ];

    const requirements: ConfigVerificationRolesCustomRequirement[] = [];
    while (addRoleRequirements) {
      const type = await search({
        message: "Select a requirement key:",
        source: (input) => {
          if (!input) return requirementsChoices;
          return [
            ...requirementsChoices.filter((choice) => choice.name.toLowerCase().startsWith(input.toLowerCase())),
            { name: "Exit", value: "exit", description: "Exit" }
          ];
        }
      });

      if (type === "exit") break;
      const value = PlayerVariableStatsKeysStrings.includes(type as any)
        ? await input({ message: "Requirement value:", required: true })
        : await number({ message: "Requirement value:", required: true });

      requirements.push({ type: type as PlayerVariableStatsKeysString, value: value as string });

      addRoleRequirements = await confirm({
        message: `${roleRequireConfigMetadata.title.replaceAll(":", "")} - Do you want to add a custom role requirement`,
        default: true
      });
    }
    customRoles.push({ enabled: true, roleId, requirements });
    addRole = await confirm({ message: "Do you want to add another entry?", default: false });
  }
  return customRoles;
}

interface SchemaStrategy {
  match: (schema: zod.ZodTypeAny, meta: AskMetadata) => boolean;
  process: (schema: zod.ZodTypeAny, meta: AskMetadata, path: string[], key: string) => Promise<any>;
}

const strategies: SchemaStrategy[] = [
  { match: (s) => s instanceof zod.ZodString || s instanceof zod.ZodURL, process: async (_, meta) => await askString(meta) },
  { match: (s) => s instanceof zod.ZodNumber, process: async (_, meta) => await askNumber(meta) },
  { match: (s) => s instanceof zod.ZodBoolean, process: async (_, meta) => await askBoolean(meta) },
  { match: (s) => s instanceof zod.ZodEnum, process: async (s, meta) => await askEnum(s as zod.ZodEnum<any>, meta) },
  { match: (s) => s instanceof zod.ZodArray && s.element instanceof zod.ZodString, process: async (_, meta) => await askStringArray(meta) },
  {
    match: (s, meta) => s instanceof zod.ZodRecord && meta.configMetadata.dotPath === "minecraft.guild.requirements.requirements",
    process: async (s, meta) => await askRequirements(meta)
  },
  {
    match: (s, meta) => s instanceof zod.ZodDiscriminatedUnion && ["verification.roles.verified", "verification.roles.guildMember"].includes(meta.configMetadata.dotPath),
    process: async (s, meta) => await askVerficationRole(s, meta)
  },
  {
    match: (s, meta) => s instanceof zod.ZodArray && s.element instanceof zod.ZodDiscriminatedUnion && meta.configMetadata.dotPath === "verification.roles.custom",
    process: async (s, meta) => await askCustomVerficationRoles(s, meta)
  },
  // eslint-disable-next-line no-use-before-define
  { match: (s) => s instanceof zod.ZodObject, process: async (s, _, path, key) => await renderSchemaSection(s, [...path, key]) }
];

async function ask({ schema, path, key }: SchemaData): Promise<any> {
  const configMetadata = await getMetadata({ schema, path, key }, context.shouldUseConfig);
  if (configMetadata.skip) return configMetadata.default;
  const { schema: unwrapped, optional, nullable } = unwrapSchema(schema);
  const meta: AskMetadata = { configMetadata, optional, nullable };
  const strategy = strategies.find((strat) => strat.match(unwrapped, meta));
  if (strategy) return await strategy.process(unwrapped, meta, path, key);
  console.warn(`${configMetadata.formattedDotPath} Unsupported or unhandled schema type`);
  return undefined;
}

async function renderSchemaSection(schema: any, path: string[]): Promise<Record<string, unknown>> {
  const entries = Object.entries(getObjectShape(schema));
  if (entries.length === 0) return {};
  const answers: Record<string, unknown> = {};
  for (const [key, fieldSchema] of entries) {
    const value = await ask({ schema: fieldSchema, path, key });
    if (value !== undefined) answers[key] = value;
  }

  return answers;
}

let hasConfig: boolean;
try {
  await access("config.json");
  hasConfig = true;
} catch {
  hasConfig = false;
}

if (hasConfig) {
  console.warn("Current config detected");
  const change = await select({
    message: "An existing configuration was found. What would you like to do?",
    choices: [
      { name: "Update", value: "update", description: "Update the current config fields" },
      { name: "Override", value: "override", description: "Overwrite everything and start fresh" },
      { name: "Exit", value: "exit", description: "Exit the config generator" }
    ]
  });

  if (change === "update") {
    context.shouldUseConfig = true;
    console.other("Updating the current config...");
  } else if (change === "override") {
    context.shouldUseConfig = false;
    console.other("Overriding the current config...");
  } else {
    console.other("Exiting config generator.");
    process.exit(0);
  }

  const currentConfig = await ConfigManager.getConfigFile();
  await ConfigManager.backupConfig(currentConfig, true);
}

const config = await renderSchemaSection(Config, []);
const saveCheck = await confirm({ message: "Do you want to save this config?" });
if (!saveCheck) {
  console.other("Exiting config generator without saving.");
  process.exit(0);
}
await saveFile("config.json", JSON.stringify(config, null, 2));
