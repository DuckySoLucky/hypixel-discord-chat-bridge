import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { BasicInteractionResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import type { GexpDisplay } from "../../../types/inactivity.js";
import type { ModalSubmitInteraction } from "discord.js";

class GexpCheckFiltersModal extends DiscordModal {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordModalData("gexpCheckFilters");
    this.response = BasicInteractionResponse.Ephemeral;
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    if (!interaction.message) return;
    const gexpCheckCommand = new GexpCheckCommand(this.discord);
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    const requirement = interaction.fields.getTextInputValue("gexpCheckFiltersAmount");
    const type = interaction.fields.getRadioGroup("gexpCheckFiltersPage");
    const hiddenRanks = interaction.fields.getCheckboxGroup("gexpCheckFiltersRank");
    options.requirement = requirement.length > 0 ? Number(requirement) : options.requirement;
    options.type = (type ?? options.type) as GexpDisplay;
    options.hiddenRanks = [...(hiddenRanks ?? options.hiddenRanks)];
    const response = await gexpCheckCommand.getResponse(options);
    await interaction.message.edit(response);
    await interaction.deleteReply();
  }
}

export default GexpCheckFiltersModal;
