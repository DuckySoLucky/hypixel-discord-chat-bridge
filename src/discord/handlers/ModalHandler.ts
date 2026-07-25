import HypixelDiscordChatBridgeError from "../../private/error.js";
import { BasicInteractionResponse } from "../../types/discord.js";
import { Collection, MessageFlags, type ModalSubmitInteraction } from "discord.js";
import { readdir } from "node:fs/promises";
import type DiscordManager from "../DiscordManager.js";
import type DiscordModal from "../private/modals/DiscordModal.js";

class ModalHandler {
  readonly modals: Collection<string, DiscordModal> = new Collection<string, DiscordModal>();
  constructor(private readonly discord: DiscordManager) {}

  async onSubmit(interaction: ModalSubmitInteraction) {
    const modal = this.modals.get(interaction.customId);
    if (!modal) return;

    try {
      if (modal.response !== BasicInteractionResponse.None) {
        await interaction.deferReply({ flags: modal.response === BasicInteractionResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Modal submitted ${interaction.user.username} (${interaction.user.id}) modal ${interaction.customId}`);

      await this.discord.interactionHandler.checkPerms(interaction, modal);

      await modal.execute(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async loadModals() {
    this.modals.clear();
    const modalFiles = await readdir("./src/discord/modals/", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));
    for (const file of modalFiles) {
      const modal: DiscordModal = new (await import(`../modals/${file}`)).default(this.discord);
      this.modals.set(modal.data.id, modal);
    }
    console.discord(`Successfully loaded ${this.modals.size} modal(s).`);
  }
}

export default ModalHandler;
