import BasicInteractionData from "../BasicInteractionData.js";
import { BasicInteractionResponse, type DiscordManagerWithClient } from "../../../types/discord.js";
import type DiscordManager from "../../DiscordManager.js";
import type DiscordModalData from "./DiscordModalData.js";
import type { ModalSubmitInteraction } from "discord.js";

abstract class DiscordModal<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordModalData;
  response: BasicInteractionResponse;
  constructor(discord: Manager) {
    super(discord);
    this.response = BasicInteractionResponse.Ephemeral;
  }

  abstract execute(interaction: ModalSubmitInteraction): Promise<void>;
}

export default DiscordModal;
