import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../private/commands/DiscordCommandDataBuilder.ts";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../types/discord.js";
import { SuccessEmbed } from "../private/Embed.js";

class ExecuteCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("execute")
    .setDescription("Executes commands as the minecraft bot.")
    .addStringOption((option) => option.setName("command").setDescription("Minecraft Command").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.AdminOnly;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const command = interaction.options.getString("command", true);
    this.discord.application.minecraft.bot.chat(`/${command}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully executed \`/${command}\``)] });
  }
}

export default ExecuteCommand;
