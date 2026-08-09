import { BasicInteractionResponse, type DiscordManager, DiscordModal, DiscordModalData } from "hypixel-discord-chat-bridge/plugin-api";
import { showcaseModalId, showcaseModalInputId } from "./ids.js";
import type { ModalSubmitInteraction } from "discord.js";

class ShowcaseModal extends DiscordModal<DiscordManager> {
  override readonly data = new DiscordModalData(showcaseModalId);
  override response = BasicInteractionResponse.Ephemeral;

  override async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const submittedText = interaction.fields.getTextInputValue(showcaseModalInputId);
    await interaction.editReply({ content: `The plugin modal received: ${submittedText}` });
  }
}

export default ShowcaseModal;
