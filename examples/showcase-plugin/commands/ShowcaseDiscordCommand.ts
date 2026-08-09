import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ChatInputCommandInteraction } from "discord.js";
import { DiscordCommand, DiscordCommandData, type DiscordManager } from "hypixel-discord-chat-bridge/plugin-api";
import { showcaseButtonId } from "../components/ids.js";

class ShowcaseDiscordCommand extends DiscordCommand<DiscordManager> {
  override readonly data = new DiscordCommandData().setName("showcase").setDescription("Demonstrate a plugin-provided command, button, and modal.");

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // Discord.js has an amazing guide on building buttons
    // Consider checking it out
    // https://discordjs.guide/legacy/interactive-components/buttons#building-buttons
    const button = new ButtonBuilder().setCustomId(showcaseButtonId).setLabel("Open showcase modal").setStyle(ButtonStyle.Primary);
    await interaction.editReply({
      content: "This command was registered by the showcase plugin.",
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)]
    });
  }
}

export default ShowcaseDiscordCommand;
