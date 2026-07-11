import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import InactiveUser from "../../../../data/inactivity/InactiveUser.js";
import ms, { type StringValue } from "ms";
import { type ChatInputCommandInteraction } from "discord.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { translate } from "../../../../translations/TranslationsManager.js";

class InactivityCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("inactivity")
      .addStringOption((option) => option.setName("time").setRequired(true))
      .addStringOption((option) => option.setName("reason"));
    this.flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand, CommandFlags.VerifiedOnly, CommandFlags.GuildMemberOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(interaction.user.id);
    if (!linkedUser) throw new HypixelDiscordChatBridgeError(translate("discord.errors.interaction.command.no.verify"));
    const inactivityData = await this.discord.application.data.inactivity.getUserByDiscordId(interaction.user.id);
    if (inactivityData) {
      throw new HypixelDiscordChatBridgeError(translate("discord.commands.inactivity.execute.errors.already.inactive", { timestamp: inactivityData.expires }));
    }

    const time = Math.floor(ms(interaction.options.getString("time", true) as StringValue) / 1000);
    if (isNaN(time)) throw new HypixelDiscordChatBridgeError(translate("discord.commands.inactivity.execute.errors.invalid.time"));
    const reason = interaction.options.getString("reason") ?? translate("generic.no.reason");
    await new InactiveUser({ discordId: interaction.user.id, reason, duration: time }, this.discord.application.data.inactivity).save();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("discord.commands.inactivity.execute.success")).setDevFooter("Kathund")] });
  }
}

export default InactivityCommand;
