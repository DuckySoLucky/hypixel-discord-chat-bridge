import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class WoolWarsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("woolwars")
      .setDescription("WoolWars stats of specified user.")
      .setAliases(["ww"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { level } = hypixelPlayer.stats.WoolGames;
    const { wins, gamesPlayed, woolsPlaced, blocksBroken, KDRatio } = hypixelPlayer.stats.WoolGames.woolWars;
    this.send(
      `[${Math.floor(level)}✫] ${player}: W: ${formatNumber(wins)} | WLR: ${(wins / gamesPlayed).toFixed(2)} | KDR: ${KDRatio} | BB: ${formatNumber(
        blocksBroken
      )} | WP: ${formatNumber(woolsPlaced)} | WPP: ${formatNumber(woolsPlaced / gamesPlayed)} | WPG: ${(woolsPlaced / blocksBroken).toFixed(2)}`
    );
  }
}

export default WoolWarsCommand;
