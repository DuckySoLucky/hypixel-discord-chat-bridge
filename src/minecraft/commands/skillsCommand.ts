import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";
import type { SkillLevelData } from "hypixel-api-reborn";

class SkillsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("skills")
      .setAliases(["skill", "sa"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);

    const skills = profile.me.playerData.skills;
    const parsedSkills = Object.keys(skills)
      .filter((skill) => !["average", "nonCosmeticAverage", "toString"].includes(skill))
      .filter((skill) => {
        const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
        return data.currentXp > 1;
      })
      .map((skill) => {
        const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
        return translate("minecraft.commands.skills.execute.success.format.base", {
          name: translate(`minecraft.commands.skills.execute.success.format.${skill}` as ParseKeys),
          level: data.level,
          xp: formatNumber(data.xp)
        });
      });

    if (parsedSkills.length === 0) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.skills", { username }));

    this.send(
      translate("minecraft.commands.skills.execute.success.message", {
        username,
        average: formatNumber(skills.average, 2),
        skills: parsedSkills.join(translate("minecraft.commands.skills.execute.success.format.join"))
      })
    );
  }
}

export default SkillsCommand;
