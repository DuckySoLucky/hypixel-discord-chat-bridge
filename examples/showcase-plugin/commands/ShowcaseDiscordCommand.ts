import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { type ChatInputCommandInteractionWithGuild, DiscordCommand, DiscordCommandData, type DiscordManagerWithPlugin } from "hypixel-discord-chat-bridge/plugin-api";
import { showcaseButtonId } from "../components/ids.js";
import type ShowcasePlugin from "../index.ts";

class ShowcaseDiscordCommand extends DiscordCommand<DiscordManagerWithPlugin<ShowcasePlugin>> {
  override readonly data = new DiscordCommandData().setName("showcase").setDescription("Demonstrate a plugin-provided command, button, and modal.");

  override async execute(interaction: ChatInputCommandInteractionWithGuild): Promise<void> {
    // Discord.js has an amazing guide on building buttons
    // Consider checking it out
    // https://discordjs.guide/legacy/interactive-components/buttons#building-buttons
    const button = new ButtonBuilder().setCustomId(showcaseButtonId).setLabel("Open showcase modal").setStyle(ButtonStyle.Primary);
    await interaction.followUp({
      content: "This command was registered by the showcase plugin.",
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)]
    });
  }
}

export default ShowcaseDiscordCommand;
