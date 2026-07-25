import BasicScript from "../BasicScript.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { formatNumber, replaceVariables } from "../../utils/stringUtils.js";
import type ScriptManager from "../ScriptsManager.js";
import type { ChannelVariableStats } from "../../private/constants.js";

class UpdateStatChannelsScript extends BasicScript {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      id: "updateStatChannels",
      enabled: scripts.application.config.statsChannels.autoUpdater.enabled,
      interval: scripts.application.config.statsChannels.autoUpdater.interval
    });
  }

  async getStats(): Promise<ChannelVariableStats> {
    if (!this.scripts.application.discord.isGuildReady()) {
      this.scripts.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    const [hypixelGuild, channels, roles] = await Promise.all([
      this.scripts.application.discord.application.getBotGuild(),
      this.scripts.application.discord.guild.channels.fetch(),
      this.scripts.application.discord.guild.roles.fetch()
    ]);

    return {
      guildName: hypixelGuild.name,
      guildLevel: Number(Math.floor(hypixelGuild.level).toFixed(0)),
      guildLevelWithProgress: hypixelGuild.level,
      guildXP: hypixelGuild.experience,
      formattedGuildXP: formatNumber(hypixelGuild.experience),
      guildWeeklyXP: hypixelGuild.totalWeeklyGEXP,
      formattedGuildWeeklyXP: formatNumber(hypixelGuild.totalWeeklyGEXP),
      guildMembers: hypixelGuild.members.length,
      discordMembers: this.scripts.application.discord.guild.memberCount,
      formattedDiscordMembers: formatNumber(this.scripts.application.discord.guild.memberCount),
      discordChannels: channels.size,
      discordRoles: roles.size
    };
  }

  override async execute() {
    if (!this.scripts.application.discord.isGuildReady()) {
      this.scripts.application.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }
    const stats = await this.getStats();
    for (const channelInfo of this.scripts.application.discord.application.config.statsChannels.channels) {
      const channel = await this.scripts.application.discord.guild.channels.fetch(channelInfo.id);
      await channel?.setName(replaceVariables(channelInfo.name, stats), "Updated Channels");
    }
  }
}

export default UpdateStatChannelsScript;
