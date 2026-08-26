import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { BasicInteractionResponse, CommandFlags, CommandPermission, type ModalSubmitInteractionWithGuild } from "../../../types/discord.js";
import { type GexpCheckOptionsDisplays, GexpDisplays } from "../../../types/inactivity.js";

class GexpCheckFiltersModal extends DiscordModal {
  override readonly data = new DiscordModalData("gexpCheckFilters");
  override readonly response = BasicInteractionResponse.Ephemeral;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    if (!interaction.message) return;
    const gexpCheckCommand = new GexpCheckCommand(this.discord);
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    const requirement = interaction.fields.getTextInputValue("gexpCheckFiltersAmount");
    options.requirement = requirement.length > 0 ? Number(requirement) : options.requirement;
    const filters = interaction.fields.getCheckboxGroup("gexpCheckFiltersMain");
    GexpDisplays.forEach((filter) => (options[filter.replaceAll("gexpcheck_", "") as keyof GexpCheckOptionsDisplays] = filters.includes(filter)));
    const hiddenRanks = interaction.fields.getCheckboxGroup("gexpCheckFiltersRank");
    options.hiddenRanks = [...(hiddenRanks ?? options.hiddenRanks)];

    const response = await gexpCheckCommand.getResponse(options);
    await interaction.message.edit(response);
    await interaction.deleteReply();
  }
}

export default GexpCheckFiltersModal;
