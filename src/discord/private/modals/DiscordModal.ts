import BasicInteractionData from "../BasicInteractionData.js";
import { BasicInteractionResponse, type DiscordManagerWithClient, type ModalSubmitInteractionWithGuild } from "../../../types/discord.js";
import type DiscordManager from "../../DiscordManager.js";
import type DiscordModalData from "./DiscordModalData.js";

abstract class DiscordModal<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordModalData;
  response: BasicInteractionResponse = BasicInteractionResponse.Ephemeral;

  abstract execute(interaction: ModalSubmitInteractionWithGuild): Promise<void>;
}

export default DiscordModal;
