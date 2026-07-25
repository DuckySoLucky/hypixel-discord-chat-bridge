import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class CrimsonIsleCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("crimsonisle")
      .setDescription("Crimson Isle Stats of specified user.")
      .setAliases(["crimson", "nether", "isle"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { faction, barbariansReputation, magesReputation } = profile.me.crimsonIsle;
    this.send(
      `${username}'s Faction: ${titleCase(faction)} | Barbarian Reputation: ${formatNumber(barbariansReputation)} | Mage Reputation: ${formatNumber(magesReputation)}`
    );
  }
}

export default CrimsonIsleCommand;
