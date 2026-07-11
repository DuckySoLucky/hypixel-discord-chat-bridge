import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";

// CREDITS: by @Kathund (https://github.com/Kathund)
class GardenCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("garden").setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player, { garden: true });
    if (profile.garden === null) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.garden", { username: player }));

    const milestones = Object.entries(profile.garden.cropMilestones)
      .filter(([key]) => key !== "toString")
      .sort(([a], [b]) => {
        if (a === "average") return -1;
        if (b === "average") return 1;
        return a.localeCompare(b);
      })
      .map(([key, value]) => {
        return translate("minecraft.commands.garden.execute.success.format.format", {
          name: translate(`minecraft.commands.garden.execute.success.format.${key}` as ParseKeys),
          level: key === "average" ? formatNumber(value, 2) : value.level
        });
      })
      .join(translate("minecraft.commands.garden.execute.success.format.join"));
    this.send(translate("minecraft.commands.garden.execute.success.message", { username, level: profile.garden.level.level, milestones }));
  }
}

export default GardenCommand;
