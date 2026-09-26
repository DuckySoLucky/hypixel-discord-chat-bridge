import BasicInteractionData from "../BasicInteractionData.js";
import { ButtonResponse, type DiscordManagerWithClient, type StringSelectMenuInteractionWithGuild } from "../../../types/discord.js";
import type DiscordManager from "../../DiscordManager.js";
import type DiscordStringSelectMenuData from "./DiscordStringSelectMenuData.ts";

abstract class DiscordStringSelectMenu<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordStringSelectMenuData;
  response: ButtonResponse = ButtonResponse.Ephemeral;

  abstract execute(interaction: StringSelectMenuInteractionWithGuild): Promise<void>;
}

export default DiscordStringSelectMenu;
