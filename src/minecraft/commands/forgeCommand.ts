import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import prettyMilliseconds from "pretty-ms";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot, ParsedForgeSlot } from "../../types/minecraft.js";
import type { SkyBlockMemberMiningHotmForgeItem } from "hypixel-api-reborn";

// CREDITS: by @Kathund (https://github.com/Kathund)
class ForgeCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("forge").setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const slots: ParsedForgeSlot[] = [];
    Object.values(profile.me.mining.hotm.forge)
      .filter((slot: SkyBlockMemberMiningHotmForgeItem | null) => slot !== null)
      .forEach((slot: SkyBlockMemberMiningHotmForgeItem) =>
        slots.push({ item: slot.name, slot: slot.slot, finished: Date.now() > slot.endTime, timeLeft: prettyMilliseconds(slot.endTime - Date.now()) })
      );

    if (slots.length === 0) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.forge", { username: player }));
    this.send(
      translate("minecraft.commands.forge.execute.success.message", {
        username,
        slots: slots
          .map(({ slot, item, finished, timeLeft }) =>
            translate("minecraft.commands.forge.execute.success.format.slot", {
              slot,
              item: translate(`minecraft.commands.forge.execute.success.format.${item}`),
              finished: finished
                ? translate("minecraft.commands.forge.execute.success.format.finished.true")
                : translate("minecraft.commands.forge.execute.success.format.finished.false", { timeLeft })
            })
          )
          .join(translate("minecraft.commands.forge.execute.success.format.join"))
      })
    );
  }
}

export default ForgeCommand;
