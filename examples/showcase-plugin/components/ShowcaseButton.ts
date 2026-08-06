import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, DiscordButton, DiscordButtonData } from "../../../src/plugin-api.js";
import { showcaseButtonId, showcaseModalId, showcaseModalInputId } from "./ids.js";
import type { ButtonInteraction } from "discord.js";
import type { DiscordManager } from "../../../src/plugin-api.js";

class ShowcaseButton extends DiscordButton<DiscordManager> {
  override readonly data = new DiscordButtonData(showcaseButtonId);

  constructor(discord: DiscordManager) {
    super(discord);
    this.response = ButtonResponse.None;
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const input = new TextInputBuilder()
      .setCustomId(showcaseModalInputId)
      .setLabel("Example text")
      .setPlaceholder("Type anything")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    const modal = new ModalBuilder()
      .setCustomId(showcaseModalId)
      .setTitle("Plugin Showcase")
      .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
  }
}

export default ShowcaseButton;
