import { type BaseInteraction } from "discord.js";
import type DiscordManager from "../DiscordManager.js";

class InteractionHandler {
  private readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.discord.commandHandler.onCommand(interaction);
    if (interaction.isAutocomplete()) this.discord.commandHandler.onAutoComplete(interaction);
  }
}

export default InteractionHandler;
