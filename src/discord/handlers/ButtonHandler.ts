import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type ButtonInteraction, Collection, MessageFlags } from "discord.js";
import { ButtonResponse } from "../../types/discord.js";
import { readdir } from "node:fs/promises";
import type DiscordButton from "../private/buttons/DiscordButton.js";
import type DiscordManager from "../DiscordManager.js";

class ButtonHandler {
  readonly buttons: Collection<string, DiscordButton> = new Collection<string, DiscordButton>();
  constructor(private readonly discord: DiscordManager) {}

  async onButton(interaction: ButtonInteraction) {
    const button = this.buttons.get(interaction.customId);
    if (!button) return;

    try {
      if (button.response !== ButtonResponse.None) {
        if (button.response === ButtonResponse.Update) await interaction.deferUpdate();
        else await interaction.deferReply({ flags: button.response === ButtonResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Button Clicked ${interaction.user.username} (${interaction.user.id}) button ${interaction.customId}`);

      await this.discord.interactionHandler.checkPerms(interaction, button);

      await button.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async loadButtons() {
    this.buttons.clear();
    const buttonFiles = await readdir("./src/discord/buttons/", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));
    for (const file of buttonFiles) {
      const button: DiscordButton = new (await import(`../buttons/${file}`)).default(this.discord);
      button.data.ids.forEach((id) => this.buttons.set(id, button));
    }
    console.discord(`Successfully loaded ${this.buttons.size} button(s).`);
  }
}

export default ButtonHandler;
