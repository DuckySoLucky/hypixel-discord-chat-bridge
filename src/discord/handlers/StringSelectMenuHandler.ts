import ExtensionRegistry from "../../extensions/ExtensionRegistry.js";
import loadExtensionModules from "../../extensions/moduleLoader.js";
import { ButtonResponse, type StringSelectMenuInteractionWithGuild } from "../../types/discord.js";
import { MessageFlags } from "discord.js";
import { toError } from "../../utils/asyncUtils.js";
import type DiscordManager from "../DiscordManager.js";
import type DiscordStringSelectMenu from "../private/stringSelectMenu/DiscordStringSelectMenu.js";

class StringSelectMenuHandler {
  readonly #stringSelectMenus = new ExtensionRegistry<DiscordStringSelectMenu<DiscordManager>>();
  constructor(private readonly discord: DiscordManager) {}

  async onSubmit(interaction: StringSelectMenuInteractionWithGuild) {
    const stringSelectMenu = this.#stringSelectMenus.get(interaction.customId);
    if (!stringSelectMenu) return;

    try {
      if (stringSelectMenu.response !== ButtonResponse.None) {
        if (stringSelectMenu.response === ButtonResponse.Update) await interaction.deferUpdate();
        else await interaction.deferReply({ flags: stringSelectMenu.response === ButtonResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`String select men submitted ${interaction.user.username} (${interaction.user.id}) modal ${interaction.customId}`);

      await this.discord.interactionHandler.checkPerms(interaction.member, stringSelectMenu);

      await stringSelectMenu.execute(interaction);
    } catch (error: unknown) {
      await this.discord.handleError(toError(error), interaction);
    }
  }

  async loadStringSelectMenus() {
    this.#stringSelectMenus.clear();
    const modules = await loadExtensionModules<DiscordStringSelectMenu<DiscordManager>, DiscordManager>(new URL("../stringSelectMenus/", import.meta.url), this.discord);
    for (const { extension: stringSelectMenu, source } of modules) {
      this.#stringSelectMenus.register(stringSelectMenu.data.id, stringSelectMenu, [], source);
    }
    console.discord(`Successfully loaded ${this.#stringSelectMenus.size} string select menu(s).`);
  }

  registerStringSelectMenu(stringSelectMenu: DiscordStringSelectMenu<DiscordManager>, source: string = "programmatic"): void {
    this.#stringSelectMenus.register(stringSelectMenu.data.id, stringSelectMenu, [], source);
  }
}

export default StringSelectMenuHandler;
