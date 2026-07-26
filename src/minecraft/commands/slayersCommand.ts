import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";
import type { SkyBlockMemberSlayer } from "hypixel-api-reborn";

class SlayersCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("slayer")
      .setAliases(["slayers"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const slayers = profile.me.slayers;

    const slayer = Object.keys(slayers)
      .filter((slayer) => !["activeSlayer"].includes(slayer))
      .filter((key) => key !== "activeSlayer")
      .map((slayer) => {
        const data: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
        return translate("minecraft.commands.slayer.execute.success.format.base", {
          name: translate(`minecraft.commands.slayer.execute.success.format.${slayer}` as ParseKeys),
          level: data.level.level,
          xp: formatNumber(data.level.xp)
        });
      });
    this.send(
      translate("minecraft.commands.slayer.execute.success.message", {
        username,
        slayers: slayer.join(translate("minecraft.commands.slayer.execute.success.format.join"))
      })
    );
  }
}

export default SlayersCommand;
