import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class SheepWarsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("sheepwars")
      .setAliases(["sheep"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { level } = hypixelPlayer.stats.WoolGames;
    const { wins, KDRatio, WLRatio } = hypixelPlayer.stats.WoolGames.sheepWars;
    this.send(translate("minecraft.commands.sheepwars.execute.success", { username: hypixelPlayer.nickname, level, wins: formatNumber(wins), wlr: WLRatio, KDRatio }));
  }
}

export default SheepWarsCommand;
