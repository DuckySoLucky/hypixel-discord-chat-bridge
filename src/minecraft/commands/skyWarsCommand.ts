import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class SkyWarsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("skywars")
      .setAliases(["sw"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, kills, level, WLRatio, coins } = hypixelPlayer.stats.SkyWars;
    this.send(
      translate("minecraft.commands.skywars.execute.success", {
        level,
        username: player,
        kills: formatNumber(kills.total.kills),
        kdr: kills.total.ratio,
        wins: formatNumber(wins),
        WLRatio,
        coins: formatNumber(coins)
      })
    );
  }
}

export default SkyWarsCommand;
