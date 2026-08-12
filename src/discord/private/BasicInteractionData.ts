import HypixelDiscordChatBridgeError from "../../private/error.js";
import {
  type CommandFlags,
  CommandPermission,
  type DiscordManagerWithClient,
  GuildManagementAction,
  type GuildManagementActionResponse,
  type GuildManagementCommand,
  type GuildManagementRequest
} from "../../types/discord.js";
import { MinecraftRequestTimeoutError } from "../../minecraft/MinecraftRequestBroker.js";
import type DiscordManager from "../DiscordManager.js";

abstract class BasicInteractionData<Manager extends DiscordManager = DiscordManagerWithClient> {
  protected readonly commandTimeout: number = 5_000;
  readonly flags: readonly CommandFlags[] = [];
  readonly permission: CommandPermission = CommandPermission.Anyone;
  constructor(protected readonly discord: Manager) {}

  async handleGuildManagementAction(action: GuildManagementCommand, username: string, argument: string = ""): Promise<GuildManagementActionResponse> {
    const minecraft = this.discord.application.minecraft;
    if (!minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.discord.application.messages.minecraftBotOffline);

    const request: GuildManagementRequest = { action, username, argument };
    const response = minecraft.requestBroker.request({
      description: `Guild management ${action} for ${username}`,
      timeoutMs: this.commandTimeout,
      matches: (message) => this.parseGuildManagementResponse(request, message) !== null,
      map: (message) => {
        const parsed = this.parseGuildManagementResponse(request, message);
        if (!parsed) throw new Error(`Matched guild management response could not be parsed: ${message}`);
        return parsed;
      }
    });
    minecraft.bot.chat(`/g ${action} ${username} ${argument}`.trim());

    try {
      return await response;
    } catch (error: unknown) {
      if (error instanceof MinecraftRequestTimeoutError) return { action: GuildManagementAction.Timeout, message: null };
      throw error;
    }
  }

  private parseGuildManagementResponse(request: GuildManagementRequest, message: string): GuildManagementActionResponse | null {
    const handler = this.discord.application.minecraft.messageHandler;
    const matchesEventUsername = (): boolean => handler.getUsernameFromEventMessage(message).toLowerCase() === request.username.toLowerCase();

    if (handler.isKickMessage(message) && matchesEventUsername()) return { action: GuildManagementAction.Kick, message };
    if (handler.isCannotMuteMoreThanOneMonth(message)) return { action: GuildManagementAction.MuteTooLong, message };
    if (handler.isAlreadyMuted(message)) return { action: GuildManagementAction.AlreadyMuted, message };
    if (handler.isUserMuteMessage(message)) return { action: GuildManagementAction.UserMute, message };
    if (handler.isGuildMuteMessage(message)) return { action: GuildManagementAction.GuildMute, message };
    if (handler.isUserUnmuteMessage(message)) return { action: GuildManagementAction.UserUnmute, message };
    if (handler.isGuildUnmuteMessage(message)) return { action: GuildManagementAction.GuildUnmute, message };
    if (handler.isPromotionMessage(message) && matchesEventUsername()) return { action: GuildManagementAction.Promote, message };
    if (handler.isDemotionMessage(message) && matchesEventUsername()) return { action: GuildManagementAction.Demote, message };
    if (handler.isFailedInvite(message)) return { action: GuildManagementAction.FailedInvite, message };
    if (handler.isNoPermission(message)) return { action: GuildManagementAction.NoPerms, message };

    const cleanParts = message
      .replace(/\[(.*?)\]/g, "")
      .trim()
      .split(/ +/g);
    if (handler.isOnlineInvite(message) && cleanParts[2]?.toLowerCase() === request.username.toLowerCase()) {
      return { action: GuildManagementAction.OnlineInvite, message };
    }
    const offlineUsername = cleanParts[6]?.match(/\w+/u)?.[0];
    if (handler.isOfflineInvite(message) && offlineUsername?.toLowerCase() === request.username.toLowerCase()) {
      return { action: GuildManagementAction.OfflineInvite, message };
    }
    if (handler.isNotInGuild(message) && cleanParts[0]?.toLowerCase() === request.username.toLowerCase()) {
      return { action: GuildManagementAction.NotInGuild, message };
    }
    return null;
  }
}

export default BasicInteractionData;
