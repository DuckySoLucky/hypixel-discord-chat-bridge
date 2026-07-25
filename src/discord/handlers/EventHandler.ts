import type DiscordManager from "../DiscordManager.js";
import type { GuildMember, PartialGuildMember } from "discord.js";

class EventHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onGuildMemberAdd(member: GuildMember | PartialGuildMember) {
    if (!this.discord.application.config.blacklist.enabled || !this.discord.application.config.blacklist.notifications.onUserJoinDiscord) return;
    const blacklistUser = await this.discord.application.data.blacklist.getUserByDiscordId(member.user.id);
    if (blacklistUser === undefined) return;
    const channel = await this.discord.getChannel("Logger-Event");
    if (channel === null || !channel.isSendable()) return;
    const response = await this.discord.application.data.blacklist.getBlacklistDataResponse(blacklistUser);
    await channel.send({ ...response, content: `:warning: Blacklisted User joined the discord\n-# <@&${this.discord.application.config.discord.commands.staffRole}>` });
  }

  async onGuildMemberRemove(member: GuildMember | PartialGuildMember) {
    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(member.user.id);
    if (linkedUser === undefined) return;
    await linkedUser.delete();
  }
}

export default EventHandler;
