import HypixelAPIReborn from "../../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class GuildCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("guild")
      .setAliases(["g"])
      .setOptions([new MinecraftCommandDataOption().setName("name").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    const guildName = this.getArgs(message).join(" ").trim();
    const searchParameter = guildName.length > 0 ? "name" : "player";
    const query = guildName.length > 0 ? guildName : player;
    const guild = await HypixelAPIReborn.getGuild(searchParameter, query).then((data) => {
      if (!data) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.no.exist.guild"));
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.parse"));
      return data;
    });
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    const guildMaster = members.find((member) => member.rank === "Guild Master" || member.rank === "GUILDMASTER");
    let username: string | null = null;
    if (guildMaster?.uuid) {
      username = await MowojangAPI.getUsername(guildMaster.uuid);
      if (!username) throw new HypixelDiscordChatBridgeError(translate("api.mowojang.errors.failed.player"));
    }
    this.send(
      translate("minecraft.commands.guild.execute.success", {
        name,
        tag,
        members: members.length,
        level,
        weeklyGexp: formatNumber(totalWeeklyGEXP),
        owner: username ?? translate("UNKNOWN")
      })
    );
  }
}

export default GuildCommand;
