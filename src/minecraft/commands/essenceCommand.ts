import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";

// CREDITS: by @Kathund (https://github.com/Kathund)
class EssenceCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("essence").setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const essenceString = Object.entries(profile.me.currencies)
      .filter(([key]) => key.endsWith("Essence"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        return translate("minecraft.commands.essence.execute.success.format.format", {
          name: translate(`minecraft.commands.essence.execute.success.format.${key}` as ParseKeys),
          value: formatNumber(value)
        });
      })
      .join(translate("minecraft.commands.essence.execute.success.format.join"));
    this.send(translate("minecraft.commands.essence.execute.success.message", { username, essenceString }));
  }
}

export default EssenceCommand;
