import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

class SkillsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("skills")
    .setDescription("Skills and Skill Average of specified user.")
    .setAliases(["skill", "sa"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);

    const skills = profile.me.playerData.skills;
    const formattedSkills = Object.entries(skills)
      .filter(([name]) => !["average", "nonCosmeticAverage", "toString"].includes(name))
      .filter(([_, data]) => data.currentXp > 1)
      .map(([name, data]) => ({ name, level: data.levelWithProgress }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((skill) => `${titleCase(skill.name)}: ${formatNumber(skill.level)}`);

    await this.send(`${username}'s Skill Average: ${(skills.average ?? 0).toFixed(2)} (${formattedSkills.join(", ")})`);
  }
}

export default SkillsCommand;
