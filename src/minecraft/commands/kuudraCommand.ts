import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class KuudraCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("kuudra").setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { basicCompletions, hotCompletions, burningCompletions, fieryCompletions, infernalCompletions } = profile.me.crimsonIsle.kuudra;
    this.send(
      translate("minecraft.commands.kuudra.execute.success", {
        username,
        basicCompletions: formatNumber(basicCompletions),
        hotCompletions: formatNumber(hotCompletions),
        burningCompletions: formatNumber(burningCompletions),
        fieryCompletions: formatNumber(fieryCompletions),
        infernalCompletions: formatNumber(infernalCompletions)
      })
    );
  }
}

export default KuudraCommand;
