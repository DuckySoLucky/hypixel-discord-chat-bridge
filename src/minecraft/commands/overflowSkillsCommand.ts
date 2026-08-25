import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { CalculateAverage, type SkillLevelData } from "hypixel-api-reborn";
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

    const skillData: { name: string; level: number }[] = [];
    const skills = profile.me.playerData.skills;
    Object.keys(skills)
      .filter((skill) => !["average", "nonCosmeticAverage", "toString"].includes(skill))
      .filter((skill) => {
        const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
        return data.currentXp > 1;
      })
      .forEach((skill) => {
        const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
        skillData.push({ name: skill, level: data.overflowLevel?.level ?? data.level });
      });

    if (skillData.length === 0) throw new HypixelDiscordChatBridgeError(`${username} has no skills.`);

    const skillSummary = skillData.map((skill) => `${titleCase(skill.name)}: ${formatNumber(skill.level)}`).join(", ");
    await this.send(`${username}'s Skill Average: ${CalculateAverage(skillData.map((skill) => skill.level)).toFixed(2)} (${skillSummary})`);
  }
}

export default OverflowSkillsCommand;
