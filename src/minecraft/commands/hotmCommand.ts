import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class HotmCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("hotm")
      .setDescription("Skyblock Hotm Stats of specified user.")
      .setAliases(["mining"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level } = profile.me.skillTrees.mining;
    const { powder, pickaxeAbility } = profile.me.mining;
    this.send(
      `${username}'s Hotm: ${level.level} | Gemstone Powder: ${formatNumber(powder.gemstone.total)} | Mithril Powder: ${formatNumber(
        powder.mithril.total
      )} | Glacite Powder: ${formatNumber(powder.glacite.total)} | Selected Ability: ${pickaxeAbility}`
    );
  }
}

export default HotmCommand;
