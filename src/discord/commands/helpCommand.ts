import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import InformationCommand from "./informationCommand.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import { CommonDevs } from "../../private/constants.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class HelpCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("help").addStringOption((option) => option.setName("command"));
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const commandName = interaction.options.getString("command") || undefined;
    if (commandName === undefined) return await interaction.followUp({ embeds: [InformationCommand.getCommandsEmbed(this.discord)] });

    const minecraftCommand = this.discord.application.minecraft.commandHandler.findNormalCommand(commandName);
    const isMinecraftCommand = Boolean(minecraftCommand);
    const command = this.discord.commandHandler.commands.get(commandName) ?? minecraftCommand ?? undefined;
    if (command === undefined) throw new HypixelDiscordChatBridgeError(translate("discord.commands.help.execute.errors.failed.command.find", { commandName }));
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
      .setFooter({ text: translate("discord.embed.generic.footer.command", CommonDevs.DuckySoLucky) })
      .setTitle(`**${prefix}${command.data.name}**`)
      .setDescription(description);

    await interaction.followUp({ embeds: [embed] });
  }
}

export default HelpCommand;
