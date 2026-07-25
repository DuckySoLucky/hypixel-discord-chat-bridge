import { ChannelVariableStatsKeyDescriptionMap, ChannelVariableStatsKeys } from "../src/private/constants.js";
import { initMarkdownFile, saveMarkdownFile } from "./utils.js";

const variableGroups = { General: ChannelVariableStatsKeys };

const lines: string[] = await initMarkdownFile("docs/ChannelStatVariables.md");

Object.entries(variableGroups).forEach(([title, items]) => {
  lines.push(`## ${title}`);
  lines.push("");
  items.forEach((item) => {
    lines.push(`\`{${item}}\` - ${ChannelVariableStatsKeyDescriptionMap[item] ?? "No Description Provided"}`);
    lines.push("");
  });
});

await saveMarkdownFile("docs/ChannelStatVariables.md", lines);
