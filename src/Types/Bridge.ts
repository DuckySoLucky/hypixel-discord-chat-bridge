import type { ChannelNames } from "./Discord.js";
import type { Message, User } from "discord.js";

export interface BroadcastEvent {
  fullMessage?: string;
  chat?: string;
  chatType?: ChannelNames;
  username?: string;
  rank?: string | null;
  guildRank?: string;
  message?: string;
  color?: number;
  title?: string;
  icon?: string;
  discordUser?: User;
  channelId?: string;
  replyingTo?: string | null;
  discordMessage?: Message;
}
