import {
  PlayerVariableStatsKeyDescriptionMap,
  PlayerVariableStatsKeysBedWars,
  PlayerVariableStatsKeysDuels,
  PlayerVariableStatsKeysGeneral,
  PlayerVariableStatsKeysSkyBlock,
  PlayerVariableStatsKeysSkyWars
} from "../src/private/constants.js";
import { initMarkdownFile, saveMarkdownFile } from "./utils.js";

const variableGroups = {
  General: PlayerVariableStatsKeysGeneral,
  BedWars: PlayerVariableStatsKeysBedWars,
  SkyWars: PlayerVariableStatsKeysSkyWars,
  Duels: PlayerVariableStatsKeysDuels,
  SkyBlock: PlayerVariableStatsKeysSkyBlock
};

const lines: string[] = await initMarkdownFile("docs/PlayerStatVariables.md");

Object.entries(variableGroups).forEach(([title, items]) => {
  lines.push(`## ${title}`);
  lines.push("");
  items.forEach((item) => {
    lines.push(`\`{${item}}\` - ${PlayerVariableStatsKeyDescriptionMap[item] ?? "No Description Provided"}`);
    lines.push("");
  });
});

await saveMarkdownFile("docs/PlayerStatVariables.md", lines);
