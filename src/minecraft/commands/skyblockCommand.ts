import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";
import type { SkyBlockMemberSlayer } from "hypixel-api-reborn";

class SkyblockCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("skyblock")
      .setAliases(["stats", "sb"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { dungeons, slayers, playerData, leveling, inventory, skillTrees } = profile.me;
    const decodedTalismans = await inventory.bags.talisman.decodeData();
    if (!decodedTalismans) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.profile.any", { username }));

    const slayer = Object.keys(slayers)
      .filter((slayer) => slayer !== "activeSlayer")
      .map((slayer) => {
        const data: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
        return translate("minecraft.commands.skyblock.execute.success.slayers.format.base", {
          name: translate(`minecraft.commands.skyblock.execute.success.slayers.format.${slayer}` as ParseKeys),
          level: data.level.level,
          xp: formatNumber(data.level.xp)
        });
      })
      .join(translate("minecraft.commands.skyblock.execute.success.slayers.format.join"));

    this.send(
      translate("minecraft.commands.skyblock.execute.success.message", {
        username,
        level: leveling.level,
        skillAverage: formatNumber(playerData.skills.average, 2),
        slayer,
        cata: formatNumber(dungeons.level.level, 2),
        classAverage: formatNumber(dungeons.classes.average, 2),
        magicalPower: formatNumber(decodedTalismans.magicalPower, 2),
        hotm: formatNumber(skillTrees.mining.level.level, 2)
      })
    );
  }
}

export default SkyblockCommand;
