import HypixelAPIReborn from "../../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0)
class GuildOfCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("guildof")
      .setDescription("View the player's guild")
      .setAliases(["gof", "guildofplayer", "gop"])
      .setOptions([new MinecraftCommandDataOption().setName("player").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await HypixelAPIReborn.getGuild("player", player).then((data) => {
      if (data === null) throw new HypixelDiscordChatBridgeError("Player is not in a guild");
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player's guild data.");
      return data;
    });
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    this.send(`Guild of ${player} is ${name} | Tag: [${tag}] | Members: ${members.length} | Level: ${level} | Weekly GEXP: ${formatNumber(totalWeeklyGEXP)}`);
  }
}

export default GuildOfCommand;
