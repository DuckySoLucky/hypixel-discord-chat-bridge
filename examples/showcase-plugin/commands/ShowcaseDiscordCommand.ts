import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { DiscordCommand, DiscordCommandData } from "../../../src/plugin-api.js";
import { showcaseButtonId } from "../components/ids.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManager } from "../../../src/plugin-api.js";

class ShowcaseDiscordCommand extends DiscordCommand<DiscordManager> {
  override readonly data = new DiscordCommandData().setName("showcase").setDescription("Demonstrate a plugin-provided command, button, and modal.");

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const button = new ButtonBuilder().setCustomId(showcaseButtonId).setLabel("Open showcase modal").setStyle(ButtonStyle.Primary);
    await interaction.editReply({
      content: "This command was registered by the showcase plugin.",
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)]
    });
  }
}

export default ShowcaseDiscordCommand;
