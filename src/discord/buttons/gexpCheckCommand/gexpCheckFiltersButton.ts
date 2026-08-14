import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import {
  CheckboxGroupBuilder,
  CheckboxGroupOptionBuilder,
  LabelBuilder,
  ModalBuilder,
  RadioGroupBuilder,
  RadioGroupOptionBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { gexpCheckData } from "../../../types/inactivity.js";

class GexpCheckFiltersButton extends DiscordButton {
  override readonly data = new DiscordButtonData("gexpCheckFilters");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    const guild = this.discord.application.botGuild ? this.discord.application.botGuild : await this.discord.application.getBotGuild();

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("gexpCheckFilters")
        .setTitle("Gexp Check Filters")
        .addLabelComponents(
          new LabelBuilder()
            .setLabel("Amount")
            .setDescription("Change the required amount of gexp")
            .setTextInputComponent(
              new TextInputBuilder()
                .setCustomId("gexpCheckFiltersAmount")
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(6)
                .setPlaceholder(String(options.requirement))
                .setRequired(false)
            ),
          new LabelBuilder()
            .setLabel("Hidden Ranks")
            .setDescription("People with these ranks are hidden")
            .setCheckboxGroupComponent(
              new CheckboxGroupBuilder()
                .setCustomId("gexpCheckFiltersRank")
                .setOptions(
                  new CheckboxGroupOptionBuilder().setLabel("Guild Master").setValue("Guild Master").setDefault(options.hiddenRanks.includes("Guild Master")),
                  ...guild.ranks
                    .reverse()
                    .map(({ name }) => new CheckboxGroupOptionBuilder().setLabel(name).setValue(name).setDefault(options.hiddenRanks.includes(name)))
                )
                .setRequired(false)
            ),
          new LabelBuilder().setLabel("Page").setRadioGroupComponent(
            new RadioGroupBuilder()
              .setCustomId("gexpCheckFiltersPage")
              .setRequired(false)
              .setOptions(
                Object.entries(gexpCheckData).map(([id, { buttonLabel }]) =>
                  new RadioGroupOptionBuilder()
                    .setValue(id)
                    .setLabel(buttonLabel)
                    .setDefault(id === options.type)
                )
              )
          )
        )
    );
  }
}

export default GexpCheckFiltersButton;
