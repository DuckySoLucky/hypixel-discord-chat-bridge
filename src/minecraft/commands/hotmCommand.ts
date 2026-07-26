import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class HotmCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("hotm")
      .setAliases(["mining"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level } = profile.me.skillTrees.mining;
    const { powder, pickaxeAbility } = profile.me.mining;
    this.send(
      translate("minecraft.commands.hotm.execute.success", {
        username,
        level: level.level,
        mithrilTotal: formatNumber(powder.mithril.total),
        gemstoneTotal: formatNumber(powder.gemstone.total),
        glaciteTotal: formatNumber(powder.glacite.total),
        pickaxeAbility
      })
    );
  }
}

export default HotmCommand;
