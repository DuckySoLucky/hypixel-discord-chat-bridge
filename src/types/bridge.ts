import type { ChannelName } from "./discord.js";
import type { ColorResolvable, Message } from "discord.js";
import type { ConfigOtherColors } from "./config.js";

export interface DiscordToMinecraftMessage {
  readonly channelId: string;
  readonly username: string;
  readonly message: string;
  readonly replyingTo: string | null;
  readonly sourceMessage: Message;
}

export interface MinecraftDebugMessage {
  readonly chatType: "Debug";
  readonly fullMessage: string;
  readonly message: string;
}

export interface MinecraftChatMessage {
  readonly chatType: "Guild" | "Officer";
  readonly fullMessage: string;
  readonly username: string;
  readonly rank: string | null;
  readonly guildRank: string;
  readonly message: string;
  readonly color?: ConfigOtherColors | ColorResolvable;
}

export type MinecraftToDiscordMessage = MinecraftDebugMessage | MinecraftChatMessage;

export interface PlayerToggleEvent {
  readonly fullMessage: string;
  readonly username: string;
  readonly message: string;
  readonly color: ConfigOtherColors | ColorResolvable;
  readonly chatType: "Guild";
}

export interface CleanEmbedEvent {
  readonly chatType: ChannelName;
  readonly message: string;
  readonly color: ConfigOtherColors | ColorResolvable;
}

export interface HeadedEmbedEvent extends CleanEmbedEvent {
  readonly title?: string;
  readonly icon?: string;
}

export interface BridgeEventMap {
  readonly "discord-message": DiscordToMinecraftMessage;
  readonly "minecraft-message": MinecraftToDiscordMessage;
  readonly "player-toggle": PlayerToggleEvent;
  readonly "clean-embed": CleanEmbedEvent;
  readonly "headed-embed": HeadedEmbedEvent;
}
