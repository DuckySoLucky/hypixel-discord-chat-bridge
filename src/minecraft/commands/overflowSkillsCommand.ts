import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { CalculateAverage } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0)
class OverflowSkillsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("overflowskills")
    .setDescription("Overflow Skills and Skill Average of specified user.")
    .setAliases(["oskills", "oskill", "osk"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);

    const skills = profile.me.playerData.skills;
    const parsedSkills = Object.entries(skills)
      .filter(([name]) => !["average", "nonCosmeticAverage", "toString"].includes(name))
      .filter(([_, data]) => data.currentXp > 1)
      .map(([name, data]) => ({ name, level: data.overflowLevel?.levelWithProgress ?? data.levelWithProgress }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const formattedSkills = parsedSkills.map((skill) => `${titleCase(skill.name)}: ${formatNumber(skill.level)}`);
    await this.send(`${username}'s Skill Average: ${CalculateAverage(parsedSkills.map((skill) => skill.level)).toFixed(2)} (${formattedSkills.join(", ")})`);
  }
}

export default OverflowSkillsCommand;
