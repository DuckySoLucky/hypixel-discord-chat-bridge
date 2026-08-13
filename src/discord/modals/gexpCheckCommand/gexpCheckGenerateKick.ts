import DiscordModal from "../../private/modals/DiscordModal.js";
import DiscordModalData from "../../private/modals/DiscordModalData.js";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { BasicInteractionResponse, CommandFlags, CommandPermission, type ModalSubmitInteractionWithGuild } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { replaceVariables } from "../../../utils/stringUtils.js";

class GexpCheckGenerateKickModal extends DiscordModal {
  override readonly data = new DiscordModalData("gexpCheckGenerateKick");
  override readonly response = BasicInteractionResponse.Ephemeral;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ModalSubmitInteractionWithGuild) {
    if (!interaction.message) return;
    const gexpCheckCommand = new GexpCheckCommand(this.discord);
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    const { filtered } = await gexpCheckCommand.getUsers(options);
    const reason = interaction.fields.getTextInputValue("gexpCheckGenerateKickReason");
    const kickCommands = filtered.map(
      ({ username, member }) =>
        `/g kick ${username} ${replaceVariables(reason, { gexp: member.weeklyExperience.toLocaleString(), requirement: options.requirement.toLocaleString(), username })}`
    );
    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription("Attached a full list of kick commands for the selected users").setDevFooter("Kathund")],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setLabel("Execute commands as bot").setCustomId("gexpCheckGenerateKickExecute").setStyle(ButtonStyle.Danger)
        )
      ],
      files: [new AttachmentBuilder(Buffer.from(kickCommands.join("\n"), "utf-8"), { name: "commands.txt" })]
    });
  }
}

export default GexpCheckGenerateKickModal;
