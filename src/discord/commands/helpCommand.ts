import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../private/commands/DiscordCommandDataBuilder.js";
import EmbedHelper from "../private/EmbedHelper.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import InformationCommand from "./informationCommand.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags } from "../../types/discord.js";
import { CommonDevs } from "../../private/constants.js";
import { convertDevDataToName } from "../../utils/miscUtils.js";

class HelpCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("help")
    .setDescription("Shows the help menu.")
    .addStringOption((option) => option.setName("command").setDescription("Bot information about a specific command"));
  override readonly flags = [CommandFlags.RequiresMinecraftBot];

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const commandName = interaction.options.getString("command") || undefined;
    const { discordCommands, minecraftCommands } = InformationCommand.getCommands(this.discord);

    if (commandName === undefined) {
      const helpMenu = new EmbedHelper()
        .setTitle("Hypixel Discord Chat Bridge Commands")
        .setDescription("`()` = **required** argument, `[]` = **optional** argument\n`u` = Minecraft Username")
        .addFields({ name: "**Discord**: ", value: `${discordCommands}`, inline: true }, { name: "**Minecraft**: ", value: `${minecraftCommands}`, inline: true });

      await interaction.followUp({ embeds: [helpMenu] });
      return;
    }

    const minecraftCommand = this.discord.application.minecraft.commandHandler.findNormalCommand(commandName);
    const isMinecraftCommand = Boolean(minecraftCommand);
    const command = this.discord.commandHandler.getCommand(commandName) ?? minecraftCommand ?? undefined;
    if (command === undefined) throw new HypixelDiscordChatBridgeError(`Command ${commandName} not found.`);
    const prefix = isMinecraftCommand ? this.discord.application.config.minecraft.commands.normal.prefix : "/";

    const description: string[] = [
      command.data.description,
      "",
      `**Authors:** ${command.data.authors.map((author) => convertDevDataToName(CommonDevs[author])).join(", ")}`
    ];
    if (isMinecraftCommand && minecraftCommand!.data.aliases.length > 0) {
      description.push(`**Aliases:** ${minecraftCommand!.data.aliases.map((alias) => `\`${prefix}${alias}\``).join(", ")}`);
    }
    description.push(
      ...command.data.options.map((option) => option.toJSON()).map(({ name, required, description }) => `\`${required ? `(${name})` : `[${name}]`}\`: ${description}`)
    );

    const embed = new EmbedHelper()
      .setTitle(`**${prefix}${command.data.name}**`)
      .setDescription(description.join("\n"))
      .setDevFooter(command.data.authors[0] ?? "DuckySoLucky", "() = required, [] = optional");

    await interaction.followUp({ embeds: [embed] });
  }
}

export default HelpCommand;
