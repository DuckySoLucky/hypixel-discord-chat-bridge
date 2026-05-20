import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../../Private/Error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../Types/Discord.js";
import { SuccessEmbed } from "../../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class UnverifyCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName("unverify").setDescription("Remove your linked Minecraft account");
    this.flags = [CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const linkedUser = this.discord.app.linked.getUserByDiscordId(interaction.user.id);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError("User is not verified");
    await linkedUser.reset();
    linkedUser.delete();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("Unverify").setDevFooter("Kathund")] });
  }
}

export default UnverifyCommand;
