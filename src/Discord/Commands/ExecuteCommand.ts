import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { CommandFlags, CommandType, type DiscordManagerWithBot } from "../../Types/Discord.js";
import { SuccessEmbed } from "../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ExecuteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("execute")
      .setDescription("Executes commands as the minecraft bot.")
      .addStringOption((option) => option.setName("command").setDescription("Minecraft Command").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot];
    this.type = CommandType.Staff;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.options.getString("command");
    if (!command) throw new HypixelDiscordChatBridgeError("The \`command\` option is missing?");
    this.discord.app.minecraft.bot.chat(`/${command}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully executed \`/${command}\``)] });
  }
}

export default ExecuteCommand;
