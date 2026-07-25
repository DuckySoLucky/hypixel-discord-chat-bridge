import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import InformationCommand from "./informationCommand.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class HelpCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("help")
      .setDescription("Shows the help menu.")
      .addStringOption((option) => option.setName("command").setDescription("Bot information about a specific command"));
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const commandName = interaction.options.getString("command") || undefined;
    const { discordCommands, minecraftCommands } = InformationCommand.getCommands(this.discord);

    if (commandName === undefined) {
      const helpMenu = new Embed()
        .setTitle("Hypixel Discord Chat Bridge Commands")
        .setDescription("`()` = **required** argument, `[]` = **optional** argument\n`u` = Minecraft Username")
        .addFields({ name: "**Discord**: ", value: `${discordCommands}`, inline: true }, { name: "**Minecraft**: ", value: `${minecraftCommands}`, inline: true });

      return await interaction.followUp({ embeds: [helpMenu] });
    }

    const minecraftCommand = this.discord.application.minecraft.commandHandler.findNormalCommand(commandName);
    const isMinecraftCommand = Boolean(minecraftCommand);
    const command = this.discord.commandHandler.commands.get(commandName) ?? minecraftCommand ?? undefined;
    if (command === undefined) throw new HypixelDiscordChatBridgeError(`Command ${commandName} not found.`);
    const prefix = isMinecraftCommand ? this.discord.application.config.minecraft.commands.normal.prefix : "/";

    const aliasesString =
      isMinecraftCommand && minecraftCommand!.data.aliases.length > 0
        ? `Aliases: ${minecraftCommand!.data.aliases.map((alias) => `\`${prefix}${alias}\``).join(", ")}\n`
        : "";

    const description = `${aliasesString}${command.data.description}\n${command.data.options
      .map((option) => option.toJSON())
      .map(({ name, required, description }) => {
        const optionString = required ? `(${name})` : `[${name}]`;
        return `\`${optionString}\`: ${description}\n`;
      })
      .join("")}`;

    const embed = new Embed()
      .setTitle(`**${prefix}${command.data.name}**`)
      .setDescription(description)
      .setFooter({ text: "by @duckysolucky | () = required, [] = optional", iconURL: "https://imgur.com/tgwQJTX.png" });

    await interaction.followUp({ embeds: [embed] });
  }
}

export default HelpCommand;
