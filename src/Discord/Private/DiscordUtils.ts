import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import config from "../../../config.json" with { type: "json" };
import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, GuildMember, MessageFlags, Role, type SendableChannels, Team } from "discord.js";
import { ErrorEmbed } from "./Embed.js";
import type DiscordManager from "../DiscordManager.js";

class DiscordUtils {
  private discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async getOwners(): Promise<string[]> {
    if (!this.discord.client?.application) return [];
    const app = await this.discord.client.application.fetch();
    if (app.owner instanceof Team) return app.owner.members.map((member) => member.id);
    return app.owner?.id ? [app.owner.id] : [];
  }

  async checkMessagePermissionsInChannel(channel: SendableChannels): Promise<boolean> {
    try {
      await channel.sendTyping();
      return true;
    } catch (error: any) {
      if (error?.code === 50001) return false;
      throw error;
    }
  }

  private getErrorEmbed(error: Error | HypixelDiscordChatBridgeError): ErrorEmbed {
    const errorStack = error instanceof Error ? (error.stack ?? error.message) : String(error ?? "Unknown");
    return new ErrorEmbed().setDescription(`\`\`\`${errorStack}\`\`\``);
  }

  private async logError(error: Error | HypixelDiscordChatBridgeError): Promise<void> {
    if (error instanceof HypixelDiscordChatBridgeError) return;
    if (!this.discord.client?.application) return;

    try {
      const channel = await this.discord.client.channels.fetch(this.discord.app.config.discord.channels.loggingChannel);
      if (!channel || !channel.isSendable()) return;

      const hasPermission = await this.checkMessagePermissionsInChannel(channel);
      if (!hasPermission) return;

      const owners = await this.getOwners();
      await channel.send({ content: owners.map((id) => `<@${id}>`).join(" "), embeds: [this.getErrorEmbed(error)] });
    } catch (e) {
      console.error(e);
    }
  }

  async handleError(
    error: Error | HypixelDiscordChatBridgeError,
    interaction: ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction | null = null
  ): Promise<void> {
    console.error(error);
    await this.logError(error);

    if (!interaction || interaction.isAutocomplete()) return;

    const embed = new ErrorEmbed();
    if (error instanceof HypixelDiscordChatBridgeError) {
      embed.setDescription(`\`\`\`${error.message}\`\`\``);
    } else {
      embed.setDescription("This error has been reported to the owner. Please try again later.");
    }

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }

      if (!(error instanceof HypixelDiscordChatBridgeError)) {
        await interaction.followUp({ embeds: [this.getErrorEmbed(error)], flags: MessageFlags.Ephemeral });
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async getRoles(member: GuildMember): Promise<Role[]> {
    member = await member.fetch();
    return member.roles.cache.map((role) => role);
  }

  static async isGuildMember(member: GuildMember): Promise<boolean> {
    const userRoles = await this.getRoles(member).then((roles) => roles.map((role) => role.id));
    if (
      config.discord.commands.checkPerms === true &&
      !(userRoles.includes(config.verification.roles.guildMember.roleId) || config.discord.commands.users.includes(member.user.id))
    ) {
      return false;
    }

    return true;
  }

  static async isVerifiedMember(member: GuildMember): Promise<boolean> {
    const userRoles = await this.getRoles(member).then((roles) => roles.map((role) => role.id));

    if (
      config.discord.commands.checkPerms === true &&
      !(userRoles.includes(config.verification.roles.verified.roleId) || config.discord.commands.users.includes(member.user.id))
    ) {
      return false;
    }

    return true;
  }
}

export default DiscordUtils;
