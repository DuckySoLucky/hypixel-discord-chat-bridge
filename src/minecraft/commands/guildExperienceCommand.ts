import HypixelAPIReborn from "../../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class GuildExperienceCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("guildexp")
      .setAliases(["gexp"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await HypixelAPIReborn.getGuild("player", player).then((data) => {
      if (data === null) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.guild.not.in", { username: player }));
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.parse"));
      return data;
    });
    if (guild.me === null) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.guild.not.in", { username: player }));
    const { weeklyExperience } = guild.me;
    this.send(translate("minecraft.commands.guildexp.execute.success", { player, weeklyExperience: weeklyExperience.toLocaleString() }));
  }
}

export default GuildExperienceCommand;
