import { BasicInteractionResponse, type DiscordManagerWithPlugin, DiscordModal, DiscordModalData } from "hypixel-discord-chat-bridge/plugin-api";
import { showcaseModalId, showcaseModalInputId } from "./ids.js";
import type ShowcasePlugin from "../index.ts";
import type { ModalSubmitInteraction } from "discord.js";

class ShowcaseModal extends DiscordModal<DiscordManagerWithPlugin<ShowcasePlugin>> {
  override readonly data = new DiscordModalData(showcaseModalId);
  override readonly response = BasicInteractionResponse.Ephemeral;

  override async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const submittedText = interaction.fields.getTextInputValue(showcaseModalInputId);
    await interaction.followUp({ content: `The plugin modal received: ${submittedText}` });
  }
}

export default ShowcaseModal;
