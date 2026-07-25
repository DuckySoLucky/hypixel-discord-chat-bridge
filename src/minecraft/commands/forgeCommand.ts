import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import prettyMilliseconds from "pretty-ms";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot, ParsedForgeSlot } from "../../types/minecraft.js";
import type { SkyBlockMemberMiningHotmForgeItem } from "hypixel-api-reborn";

// CREDITS: by @Kathund (https://github.com/Kathund)
class ForgeCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("forge")
      .setDescription("Skyblock Forge Info Stats of specified user.")
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
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

    if (slots.length === 0) throw new HypixelDiscordChatBridgeError(`${username} has no items in their forge.`);
    this.send(`${username}'s Forge: ${slots.map((slot) => `${slot.slot}: ${slot.item} ${slot.finished ? "Finished" : `(${slot.timeLeft})`}`).join(" | ")}`);
  }
}

export default ForgeCommand;
