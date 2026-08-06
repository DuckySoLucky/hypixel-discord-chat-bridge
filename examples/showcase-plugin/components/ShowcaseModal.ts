import { BasicInteractionResponse, DiscordModal, DiscordModalData } from "../../../src/plugin-api.js";
import { showcaseModalId, showcaseModalInputId } from "./ids.js";
import type { DiscordManager } from "../../../src/plugin-api.js";
import type { ModalSubmitInteraction } from "discord.js";

class ShowcaseModal extends DiscordModal<DiscordManager> {
  override readonly data = new DiscordModalData(showcaseModalId);

  constructor(discord: DiscordManager) {
    super(discord);
    this.response = BasicInteractionResponse.Ephemeral;
  }

  override async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const submittedText = interaction.fields.getTextInputValue(showcaseModalInputId);
    await interaction.editReply({ content: `The plugin modal received: ${submittedText}` });
  }
}

export default ShowcaseModal;
