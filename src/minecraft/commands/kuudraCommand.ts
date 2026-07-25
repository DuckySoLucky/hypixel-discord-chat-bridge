import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class KuudraCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("kuudra")
      .setDescription("Kuudra Stats of specified user.")
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { basicCompletions, hotCompletions, burningCompletions, fieryCompletions, infernalCompletions } = profile.me.crimsonIsle.kuudra;
    this.send(
      `${username}'s Basic: ${formatNumber(basicCompletions)} | Hot: ${formatNumber(hotCompletions)} | Burning: ${formatNumber(
        burningCompletions
      )} | Fiery: ${formatNumber(fieryCompletions)} | Infernal: ${formatNumber(infernalCompletions)}`
    );
  }
}

export default KuudraCommand;
