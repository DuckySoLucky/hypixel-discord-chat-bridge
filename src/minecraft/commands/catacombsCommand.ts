import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class CatacombsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("catacombs")
      .setAliases(["cata", "dungeons"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level, classes, secrets } = profile.me.dungeons;
    this.send(
      translate("minecraft.commands.catacombs.execute.success.message", {
        username,
        level: formatNumber(level.level),
        selectedClass: translate(`minecraft.commands.catacombs.execute.success.format.${classes.selected}`),
        classAverage: formatNumber(classes.average),
        secrets: formatNumber(secrets),
        tank: formatNumber(classes.tank.level),
        archer: formatNumber(classes.archer.level),
        healer: formatNumber(classes.healer.level),
        mage: formatNumber(classes.mage.level),
        berserk: formatNumber(classes.berserk.level)
      })
    );
  }
}

export default CatacombsCommand;
