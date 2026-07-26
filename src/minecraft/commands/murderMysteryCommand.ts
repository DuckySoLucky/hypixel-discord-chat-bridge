import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class MurderMysteryCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("murdermystery")
      .setAliases(["mm"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, games, kills, deaths } = hypixelPlayer.stats.MurderMystery;
    const wlr = (wins / games).toFixed(2);
    const kdr = (kills / deaths).toFixed(2);
    this.send(
      translate("minecraft.commands.murdermystery.execute.success", { username: hypixelPlayer.nickname, wins: formatNumber(wins), wlr, kills: formatNumber(kills), kdr })
    );
  }
}

export default MurderMysteryCommand;
