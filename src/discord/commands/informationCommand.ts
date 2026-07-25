import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { CommandFlags, type DiscordManagerWithBot, type Information } from "../../types/discord.js";
import { replaceVariables, titleCase } from "../../utils/stringUtils.js";
import type DiscordManager from "../DiscordManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class InformationCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("information").setDescription("Shows information about the bot.");
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
        name: `${titleCase(key)} Channel`,
        value: channel.enabled ? `<#${channel.channel}>` : "Disabled",
        format: false
      })),
      { name: "Command Role", value: `<@&${discord.application.config.discord.commands.staffRole}>`, format: false },
      { name: "Message Format", value: discord.application.config.bridge.discord.format },
      { name: "Message Mode", value: discord.application.config.bridge.discord.mode }
    ];
    const minecraftInformation: Information[] = [
      { name: "Bot username", value: discord.application.minecraft.bot.username },
      {
        name: "Normal Prefix",
        value: discord.application.config.minecraft.commands.normal.enabled ? discord.application.config.minecraft.commands.normal.prefix : "Disabled"
      },
      {
        name: "Soopy Prefix",
        value: discord.application.config.minecraft.commands.soopy.enabled ? discord.application.config.minecraft.commands.soopy.prefix : "Disabled"
      },
      { name: "SkyBlock Events", value: "Disabled" },
      { name: "Message Format", value: discord.application.config.bridge.minecraft.format },
      {
        name: "Auto Accept",
        value: discord.application.config.minecraft.guild.requirements.enabled
          ? discord.application.config.minecraft.guild.requirements.autoAccept
            ? "Enabled"
            : "Disabled"
          : "Disabled"
      }
    ];
    const generalInformation: Information[] = [
      { name: "Filter Messages", value: discord.application.config.bridge.filter.enabled ? "Enabled" : "Disabled" },
      { name: "Version", value: discord.application.package.version },
      { name: "Uptime", value: `<t:${Math.floor((Date.now() - discord.client.uptime) / 1000)}:R>`, format: false }
    ];
    return { discordInformation, minecraftInformation, generalInformation };
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const { discordCommands, minecraftCommands } = InformationCommand.getCommands(this.discord);
    const { discordInformation, minecraftInformation, generalInformation } = InformationCommand.getInformation(this.discord);

    await interaction.followUp({
      embeds: [
        new Embed()
          .setTitle("Hypixel Bridge Bot Commands")
          .addFields(
            { name: "**Discord Commands**: ", value: `${discordCommands}`, inline: true },
            { name: "**Minecraft Commands**: ", value: `${minecraftCommands}`, inline: true },
            { name: "\u200B", value: "\u200B" },
            { name: "**Discord Information**:", value: InformationCommand.FormatInformation(discordInformation), inline: true },
            { name: "**Minecraft Information**:", value: InformationCommand.FormatInformation(minecraftInformation), inline: true },
            { name: "**General Information**:", value: InformationCommand.FormatInformation(generalInformation), inline: true }
          )
      ]
    });
  }
}

export default InformationCommand;
