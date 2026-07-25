import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ButtonInteraction, MessageFlags } from "discord.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { delay } from "../../../utils/miscUtils.js";

class GexpCheckGenerateKickExecuteButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("gexpCheckGenerateKickExecute");
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand, CommandFlags.RequiresMinecraftBot];
  }

  override async execute(interaction: ButtonInteraction) {
    if (!interaction.message) return;
    const attachment = interaction.message.attachments.first();
    if (!attachment) throw new HypixelDiscordChatBridgeError("No commands file found on the message?");

    const res = await fetch(attachment.url);
    if (!res.ok) throw new HypixelDiscordChatBridgeError(`Failed to fetch attachment: ${res.status}`);
    const text = await res.text();
    const commands = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!commands.length) throw new HypixelDiscordChatBridgeError("The commands file is empty?");

    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Found ${commands.length} kick command(s)`).setDevFooter("Kathund")] });

    for (const command of commands) {
      this.discord.application.minecraft.bot.chat(command);
      await delay(500);
    }

    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(`Executed ${commands.length} kick command(s)`).setDevFooter("Kathund")],
      flags: MessageFlags.Ephemeral
    });
  }
}

export default GexpCheckGenerateKickExecuteButton;
