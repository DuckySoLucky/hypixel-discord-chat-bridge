import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, DiscordButton, DiscordButtonData, type DiscordManagerWithPlugin } from "hypixel-discord-chat-bridge/plugin-api";
import { showcaseButtonId, showcaseModalId, showcaseModalInputId } from "./ids.js";
import type ShowcasePlugin from "../index.ts";

class ShowcaseButton extends DiscordButton<DiscordManagerWithPlugin<ShowcasePlugin>> {
  override readonly data = new DiscordButtonData(showcaseButtonId);
  override readonly response = ButtonResponse.None;

  override async execute(interaction: ButtonInteraction): Promise<void> {
    // Discord.js has an amazing guide on building modals
    // Consider checking it out
    // https://discordjs.guide/legacy/interactions/modals#building-and-responding-with-modals
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(showcaseModalId)
        .setTitle("Plugin Showcase")
        .setLabelComponents(
          new LabelBuilder()
            .setLabel("Example text")
            .setTextInputComponent(
              new TextInputBuilder().setCustomId(showcaseModalInputId).setPlaceholder("Type anything").setStyle(TextInputStyle.Short).setRequired(true)
            )
        )
    );
  }
}

export default ShowcaseButton;
