import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class BuildBattleCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("buildbattle")
      .setAliases(["bb"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { title, tokens, score, wins, winsSpeedBuilders, winsGuessTheBuild } = hypixelPlayer.stats.BuildBattle;
    this.send(
      translate("minecraft.commands.buildbattle.execute.success", {
        title,
        username: hypixelPlayer.nickname,
        wins: formatNumber(wins),
        winsSpeedBuilders: formatNumber(winsSpeedBuilders),
        winsGuessTheBuild: formatNumber(winsGuessTheBuild),
        score: formatNumber(score),
        tokens: formatNumber(tokens)
      })
    );
  }
}

export default BuildBattleCommand;
