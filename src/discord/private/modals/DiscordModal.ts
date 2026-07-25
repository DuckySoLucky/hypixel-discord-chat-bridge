import BasicInteractionData from "../BasicInteractionData.js";
import { BasicInteractionResponse, type DiscordManagerWithClient } from "../../../types/discord.js";
import type DiscordManager from "../../DiscordManager.js";
import type DiscordModalData from "./DiscordModalData.js";
import type { ModalSubmitInteraction } from "discord.js";

class DiscordModal<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  data!: DiscordModalData;
  response: BasicInteractionResponse;
  constructor(discord: Manager) {
    super(discord);
    this.response = BasicInteractionResponse.Ephemeral;
  }

  // eslint-disable-next-line require-await
  async execute(interaction: ModalSubmitInteraction): Promise<unknown> {
    throw new Error("Execute Method not implemented!");
  }
}

export default DiscordModal;
