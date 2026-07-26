import ExtensionRegistry from "../../extensions/ExtensionRegistry.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import loadExtensionModules from "../../extensions/moduleLoader.js";
import { type ButtonInteraction, MessageFlags } from "discord.js";
import { ButtonResponse } from "../../types/discord.js";
import { toError } from "../../utils/asyncUtils.js";
import type DiscordButton from "../private/buttons/DiscordButton.js";
import type DiscordManager from "../DiscordManager.js";

class ButtonHandler {
  readonly #buttons = new ExtensionRegistry<DiscordButton<DiscordManager>>();
  constructor(private readonly discord: DiscordManager) {}

  async onButton(interaction: ButtonInteraction) {
    const button = this.#buttons.get(interaction.customId);
    if (!button) return;

    try {
      if (button.response !== ButtonResponse.None) {
        if (button.response === ButtonResponse.Update) await interaction.deferUpdate();
        else await interaction.deferReply({ flags: button.response === ButtonResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Button Clicked ${interaction.user.username} (${interaction.user.id}) button ${interaction.customId}`);

      await this.discord.interactionHandler.checkPerms(interaction, button);

      await button.execute(interaction);
    } catch (error: unknown) {
      await this.discord.handleError(toError(error), interaction);
    }
  }

  async loadButtons() {
    this.#buttons.clear();
    const modules = await loadExtensionModules<DiscordButton<DiscordManager>, DiscordManager>(new URL("../buttons/", import.meta.url), this.discord);
    for (const { extension: button, source } of modules) {
      const [id, ...aliases] = button.data.ids;
      if (!id) throw new HypixelDiscordChatBridgeError(`${source}: Button must define at least one identifier.`);
      this.#buttons.register(id, button, aliases, source);
    }
    console.discord(`Successfully loaded ${this.#buttons.size} button(s).`);
  }

  registerButton(button: DiscordButton<DiscordManager>, source: string = "programmatic"): void {
    const [id, ...aliases] = button.data.ids;
    if (!id) throw new HypixelDiscordChatBridgeError(`${source}: Button must define at least one identifier.`);
    this.#buttons.register(id, button, aliases, source);
  }
}

export default ButtonHandler;
