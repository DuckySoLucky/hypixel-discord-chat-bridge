import HypixelAPIReborn from "../../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @MattyHD0 (https://github.com/MattyHD0)
class GuildOfCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("guildof")
      .setAliases(["gof", "guildofplayer", "gop"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await HypixelAPIReborn.getGuild("player", player).then((data) => {
      if (data === null) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.guild.not.in", { username: player }));
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.parse"));
      return data;
    });
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    this.send(translate("minecraft.commands.guildof.execute.success", { player, name, tag, members: members.length, level, weeklyGexp: formatNumber(totalWeeklyGEXP) }));
  }
}

export default GuildOfCommand;
