import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class WoolWarsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("woolwars")
      .setAliases(["ww"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { level } = hypixelPlayer.stats.WoolGames;
    const { wins, gamesPlayed, woolsPlaced, blocksBroken, KDRatio } = hypixelPlayer.stats.WoolGames.woolWars;
    this.send(
      translate("minecraft.commands.woolwars.execute.success", {
        username: hypixelPlayer.nickname,
        level,
        wins: formatNumber(wins),
        wlr: (wins / gamesPlayed).toFixed(2),
        KDRatio,
        blocksBroken: formatNumber(blocksBroken),
        woolPlaced: formatNumber(woolsPlaced)
      })
    );
  }
}

export default WoolWarsCommand;
