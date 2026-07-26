import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ExecuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("execute").addStringOption((option) => option.setName("command").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.AdminOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const command = interaction.options.getString("command", true);
    this.discord.application.minecraft.bot.chat(`/${command}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("discord.commands.execute.execute.success", { command }))] });
  }
}

export default ExecuteCommand;
