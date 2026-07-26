import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";

class EightBallCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("megawalls")
      .setAliases(["mw"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { selectedClass, finalKills, FKDR, wins, WLR, kills, KDR, assists } = hypixelPlayer.stats.MegaWalls;
    this.send(
      translate("minecraft.commands.megawalls.execute.success.message", {
        username: player,
        selectedClass: translate(`minecraft.commands.megawalls.execute.success.format.${selectedClass}` as ParseKeys),
        finalKills: formatNumber(finalKills),
        FKDR,
        wins: formatNumber(wins),
        WLR,
        kills: formatNumber(kills),
        KDR,
        assists: formatNumber(assists)
      })
    );
  }
}

export default EightBallCommand;
