import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class CrimsonIsleCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("crimsonisle")
      .setAliases(["crimson", "nether", "isle"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { faction, barbariansReputation, magesReputation } = profile.me.crimsonIsle;
    this.send(
      translate("minecraft.commands.crimsonisle.execute.success.message", {
        username,
        faction: translate(`minecraft.commands.crimsonisle.execute.success.format.${faction}`),
        barbariansReputation: formatNumber(barbariansReputation),
        magesReputation: formatNumber(magesReputation)
      })
    );
  }
}

export default CrimsonIsleCommand;
