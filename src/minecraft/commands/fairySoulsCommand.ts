import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class FairySoulsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("fairysouls")
      .setAliases(["fs", "fairysoul"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { collected } = profile.me.fairySouls;
    const total = profile.gameMode === "island" ? 5 : 266;
    this.send(translate("minecraft.commands.fairysouls.execute.success", { username, collected, total, progress: ((collected / total) * 100).toFixed(2) }));
  }
}

export default FairySoulsCommand;
