import ExtensionRegistry from "../../extensions/ExtensionRegistry.js";
import loadExtensionModules from "../../extensions/moduleLoader.js";
import { BasicInteractionResponse } from "../../types/discord.js";
import { MessageFlags, type ModalSubmitInteraction } from "discord.js";
import { toError } from "../../utils/asyncUtils.js";
import type DiscordManager from "../DiscordManager.js";
import type DiscordModal from "../private/modals/DiscordModal.js";

class ModalHandler {
  readonly #modals = new ExtensionRegistry<DiscordModal<DiscordManager>>();
  constructor(private readonly discord: DiscordManager) {}

  async onSubmit(interaction: ModalSubmitInteraction) {
    const modal = this.#modals.get(interaction.customId);
    if (!modal) return;

    try {
      if (modal.response !== BasicInteractionResponse.None) {
        await interaction.deferReply({ flags: modal.response === BasicInteractionResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Modal submitted ${interaction.user.username} (${interaction.user.id}) modal ${interaction.customId}`);

      await this.discord.interactionHandler.checkPerms(interaction, modal);

      await modal.execute(interaction);
    } catch (error: unknown) {
      await this.discord.handleError(toError(error), interaction);
    }
  }

  async loadModals() {
    this.#modals.clear();
    const modules = await loadExtensionModules<DiscordModal<DiscordManager>, DiscordManager>(new URL("../modals/", import.meta.url), this.discord);
    for (const { extension: modal, source } of modules) {
      this.#modals.register(modal.data.id, modal, [], source);
    }
    console.discord(`Successfully loaded ${this.#modals.size} modal(s).`);
  }

  registerModal(modal: DiscordModal<DiscordManager>, source: string = "programmatic"): void {
    this.#modals.register(modal.data.id, modal, [], source);
  }
}

export default ModalHandler;
