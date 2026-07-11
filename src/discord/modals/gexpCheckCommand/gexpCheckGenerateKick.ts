import Button from "../../private/buttons/Button.js";
import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { ActionRowBuilder, AttachmentBuilder, ButtonStyle, type ModalSubmitInteraction } from "discord.js";
import { BasicInteractionResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { replaceVariables } from "../../../utils/stringUtils.js";
import { translate } from "../../../translations/TranslationsManager.js";

class GexpCheckGenerateKickModal extends DiscordModal {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordModalData("gexpCheckGenerateKick");
    this.response = BasicInteractionResponse.Ephemeral;
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ModalSubmitInteraction) {
    if (!interaction.message) return;
    const gexpCheckCommand = new GexpCheckCommand(this.discord);
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError(translate("discord.commands.gexp-check.execute.errors.failed.find.data"));
    const { filtered } = await gexpCheckCommand.getUsers(options);
    const reason = interaction.fields.getTextInputValue("gexpCheckGenerateKickReason");
    const kickCommands = filtered.map(
      ({ username, member }) =>
        `/g kick ${username} ${replaceVariables(reason, { gexp: member.weeklyExperience.toLocaleString(), requirement: options.requirement.toLocaleString(), username })}`
    );
    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(translate("discord.modals.gexpCheckGenerateKick.execute")).setDevFooter("Kathund")],
      components: [new ActionRowBuilder<Button>().addComponents(new Button().setCustomId("gexpCheckGenerateKickExecute").setStyle(ButtonStyle.Danger))],
      files: [new AttachmentBuilder(Buffer.from(kickCommands.join("\n"), "utf-8"), { name: "commands.txt" })]
    });
  }
}

export default GexpCheckGenerateKickModal;
