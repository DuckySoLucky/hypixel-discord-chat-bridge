import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { CommandFlags, type DiscordManagerWithBot, type Information } from "../../types/discord.js";
import { replaceVariables, titleCase } from "../../utils/stringUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type DiscordManager from "../DiscordManager.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { ParseKeys } from "i18next";

class InformationCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("information");
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  static FormatCommandOptions(name: string, required?: boolean): string {
    return replaceVariables(required ? ` ({${name}})` : ` [{${name}}]`, { username: "u" })
      .replaceAll("{", "")
      .replaceAll("}", "")
      .replaceAll("guild-member-username", "u")
      .replaceAll("guild-rank", "rank");
  }

  static getCommands(discord: DiscordManager) {
    const discordCommands = discord.commandHandler.commands
      .map(({ data }) => {
        const { name, options } = data.toJSON();
        const optionsString = options?.map(({ name, required }) => this.FormatCommandOptions(name, required)).join("");
        return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
      })
      .join("");

    const minecraftCommands = discord.application.minecraft.commandHandler.commands
      .map((command) => {
        const optionsString = command.data.options.map((option) => this.FormatCommandOptions(option.name, option.required)).join("");
        return `- \`${command.data.name}${optionsString}\`\n`;
      })
      .join("");

    return { discordCommands, minecraftCommands };
  }

  static FormatInformation(information: Information[]): string {
    return information.map(({ name, value, format }) => `${titleCase(name)}: ${format !== false ? `\`${value}\`` : value}`).join("\n");
  }

  static getInformation(discord: DiscordManagerWithBot): { discordInformation: Information[]; minecraftInformation: Information[]; generalInformation: Information[] } {
    const discordInformation: Information[] = [
      ...Object.entries(discord.application.config.bridge.channels).map(([key, channel]) => ({
        name: translate("discord.commands.information.execute.success.information.channel", { type: translate(`discord.channels.${key}` as ParseKeys) }),
        value: translate(channel.enabled ? "discord.format.channel" : "disabled", { id: channel.channel }),
        format: false
      })),
      {
        name: translate("discord.commands.information.execute.success.information.command"),
        value: translate("discord.format.role", { id: discord.application.config.discord.commands.staffRole }),
        format: false
      },
      { name: translate("discord.commands.information.execute.success.information.message.format"), value: discord.application.config.bridge.discord.format },
      { name: translate("discord.commands.information.execute.success.information.message.mode"), value: discord.application.config.bridge.discord.mode }
    ];
    const minecraftInformation: Information[] = [
      { name: translate("discord.commands.information.execute.success.information.username"), value: discord.application.minecraft.bot.username },
      {
        name: translate("discord.commands.information.execute.success.information.prefix.normal"),
        value: discord.application.config.minecraft.commands.normal.enabled ? discord.application.config.minecraft.commands.normal.prefix : translate("disabled")
      },
      {
        name: translate("discord.commands.information.execute.success.information.prefix.soopy"),
        value: discord.application.config.minecraft.commands.soopy.enabled ? discord.application.config.minecraft.commands.soopy.prefix : translate("disabled")
      },
      { name: translate("discord.commands.information.execute.success.information.events"), value: translate("disabled") },
      { name: translate("discord.commands.information.execute.success.information.message.format"), value: discord.application.config.bridge.minecraft.format },
      {
        name: translate("discord.commands.information.execute.success.information.accept"),
        value: discord.application.config.minecraft.guild.requirements.enabled
          ? translate(discord.application.config.minecraft.guild.requirements.autoAccept ? "enabled" : "disabled")
          : translate("disabled")
      }
    ];
    const generalInformation: Information[] = [
      {
        name: translate("discord.commands.information.execute.success.information.filter"),
        value: translate(discord.application.config.bridge.filter.enabled ? "enabled" : "disabled")
      },
      { name: translate("discord.commands.information.execute.success.information.version"), value: discord.application.package.version },
      {
        name: translate("discord.commands.information.execute.success.information.uptime"),
        value: translate("discord.format.timestamp", { timestamp: Math.floor((Date.now() - discord.client.uptime) / 1000) }),
        format: false
      }
    ];
    return { discordInformation, minecraftInformation, generalInformation };
  }

  static getCommandsEmbed(discord: DiscordManager): Embed {
    const { discordCommands, minecraftCommands } = InformationCommand.getCommands(discord);
    return new Embed()
      .setTitle(translate("discord.commands.information.execute.success.embed.title", { title: translate("name") }))
      .setDescription(translate("discord.commands.information.execute.success.embed.description"))
      .addFields(
        {
          name: translate("discord.commands.information.execute.success.embed.fields.commands.title", { type: translate("discord.name") }),
          value: discordCommands,
          inline: true
        },
        {
          name: translate("discord.commands.information.execute.success.embed.fields.commands.title", { type: translate("minecraft.name") }),
          value: minecraftCommands,
          inline: true
        }
      );
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const { discordInformation, minecraftInformation, generalInformation } = InformationCommand.getInformation(this.discord);

    await interaction.followUp({
      embeds: [
        InformationCommand.getCommandsEmbed(this.discord).addFields(
          { name: "\u200B", value: "\u200B" },
          {
            name: translate("discord.commands.information.execute.success.embed.fields.information.title", { type: translate("discord.name") }),
            value: InformationCommand.FormatInformation(discordInformation),
            inline: true
          },
          {
            name: translate("discord.commands.information.execute.success.embed.fields.information.title", { type: translate("minecraft.name") }),
            value: InformationCommand.FormatInformation(minecraftInformation),
            inline: true
          },
          {
            name: translate("discord.commands.information.execute.success.embed.fields.information.title", {
              type: translate("discord.commands.information.execute.success.embed.fields.information.type.general")
            }),
            value: InformationCommand.FormatInformation(generalInformation),
            inline: true
          }
        )
      ]
    });
  }
}

export default InformationCommand;
