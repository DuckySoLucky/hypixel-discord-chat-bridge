import type { ChannelName } from "./discord.js";
import type { ColorResolvable, Message, User } from "discord.js";
import type { ConfigOtherColors } from "./config.js";

export interface BroadcastEvent {
  fullMessage?: string;
  chat?: string;
  chatType?: ChannelName;
  username?: string;
  rank?: string | null;
  guildRank?: string;
  message?: string;
  color?: ConfigOtherColors | ColorResolvable;
  title?: string;
  icon?: string;
  discordUser?: User;
  channelId?: string;
  replyingTo?: string | null;
  discordMessage?: Message;
}
