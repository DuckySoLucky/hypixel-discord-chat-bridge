import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type CommandFlags, type DiscordManagerWithClient, GuildManagementAction, type GuildManagementActionResponse } from "../../types/discord.js";
import type DiscordManager from "../DiscordManager.js";

class BasicInteractionData<Manager extends DiscordManager = DiscordManagerWithClient> {
  protected readonly commandTimeout: number = 5_000;
  flags: CommandFlags[];
  constructor(protected readonly discord: Manager) {
    this.flags = [];
  }

  handleGuildManagementAction(action: string, username: string, argument: string = ""): Promise<GuildManagementActionResponse> {
    return new Promise<GuildManagementActionResponse>((resolve) => {
      if (!this.discord.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.discord.application.messages.minecraftBotOffline);
      const listener = (data: { positionId: number; formattedMessage: string }) => {
        const rawMessage = this.discord.application.minecraft.prismarineChat.fromNotch(data.formattedMessage);
        const message = rawMessage.toString();
        if (this.discord.application.minecraft.messageHandler.isKickMessage(message)) {
          const actionUsername = this.discord.application.minecraft.messageHandler.getUsernameFromEventMessage(message);
          if (username === actionUsername) resolve({ action: GuildManagementAction.Kick, message });
        } else if (this.discord.application.minecraft.messageHandler.isCannotMuteMoreThanOneMonth(message)) {
          resolve({ action: GuildManagementAction.MuteTooLong, message });
        } else if (this.discord.application.minecraft.messageHandler.isAlreadyMuted(message)) {
          resolve({ action: GuildManagementAction.AlreadyMuted, message });
        } else if (this.discord.application.minecraft.messageHandler.isUserMuteMessage(message)) {
          resolve({ action: GuildManagementAction.UserMute, message });
        } else if (this.discord.application.minecraft.messageHandler.isGuildMuteMessage(message)) {
          resolve({ action: GuildManagementAction.GuildMute, message });
        } else if (this.discord.application.minecraft.messageHandler.isUserUnmuteMessage(message)) {
          resolve({ action: GuildManagementAction.UserUnmute, message });
        } else if (this.discord.application.minecraft.messageHandler.isGuildUnmuteMessage(message)) {
          resolve({ action: GuildManagementAction.GuildUnmute, message });
        } else if (this.discord.application.minecraft.messageHandler.isPromotionMessage(message)) {
          const actionUsername = this.discord.application.minecraft.messageHandler.getUsernameFromEventMessage(message);
          if (username === actionUsername) resolve({ action: GuildManagementAction.Promote, message });
        } else if (this.discord.application.minecraft.messageHandler.isOnlineInvite(message)) {
          const actionUsername = message
            .replace(/\[(.*?)\]/g, "")
            .trim()
            .split(/ +/g)[2];
          if (username === actionUsername) resolve({ action: GuildManagementAction.OnlineInvite, message });
        } else if (this.discord.application.minecraft.messageHandler.isOfflineInvite(message)) {
          const actionUsername = message
            .replace(/\[(.*?)\]/g, "")
            .trim()
            .split(/ +/g)[6]!
            .match(/\w+/g)![0];
          if (username === actionUsername) resolve({ action: GuildManagementAction.OfflineInvite, message });
        } else if (this.discord.application.minecraft.messageHandler.isFailedInvite(message)) {
          resolve({ action: GuildManagementAction.FailedInvite, message });
        } else if (this.discord.application.minecraft.messageHandler.isDemotionMessage(message)) {
          const actionUsername = this.discord.application.minecraft.messageHandler.getUsernameFromEventMessage(message);
          if (username === actionUsername) resolve({ action: GuildManagementAction.Demote, message });
        } else if (this.discord.application.minecraft.messageHandler.isNotInGuild(message)) {
          const actionUsername = message
            .replace(/\[(.*?)\]/g, "")
            .trim()
            .split(" ")[0];
          if (username === actionUsername) resolve({ action: GuildManagementAction.NotInGuild, message });
        } else if (this.discord.application.minecraft.messageHandler.isNoPermission(message)) {
          resolve({ action: GuildManagementAction.NoPerms, message });
        }
      };

      this.discord.application.minecraft.bot.on("systemChat", listener);
      this.discord.application.minecraft.bot.chat(`/g ${action} ${username} ${argument}`);

      setTimeout(() => {
        if (!this.discord.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.discord.application.messages.minecraftBotOffline);
        this.discord.application.minecraft.bot.removeListener("systemChat", listener);
        resolve({ action: GuildManagementAction.Timeout, message: null });
      }, this.commandTimeout);
    });
  }
}

export default BasicInteractionData;
