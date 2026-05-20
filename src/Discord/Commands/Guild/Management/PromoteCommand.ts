import Command from "../../../Private/Commands/Command.js";
import CommandData from "../../../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../../../Private/Error.js";
import { CommandFlags, CommandType, type DiscordManagerWithBot } from "../../../../Types/Discord.js";
import { SuccessEmbed } from "../../../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class PromoteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("promote")
      .setDescription("Promote the given user by one guild rank.")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot];
    this.type = CommandType.Staff;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("username");
    if (!username) throw new HypixelDiscordChatBridgeError("The \`username\` option is missing?");
    this.discord.app.minecraft.bot.chat(`/g promote ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully promoted **${username}** by one guild rank.`)] });
  }
}

export default PromoteCommand;
