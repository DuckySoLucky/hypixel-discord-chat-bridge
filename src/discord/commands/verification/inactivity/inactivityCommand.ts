import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import InactiveUser from "../../../../data/inactivity/InactiveUser.js";
import ms, { type StringValue } from "ms";
import { type ChatInputCommandInteraction } from "discord.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";

class InactivityCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("inactivity")
      .setDescription("Send an inactivity notice to the guild staff")
      .addStringOption((option) => option.setName("time").setDescription("The time you are inactive for (e.g. 1d, 72h, 2w)").setRequired(true))
      .addStringOption((option) => option.setName("reason").setDescription("The reason you are going away"));
    this.flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand, CommandFlags.VerifiedOnly, CommandFlags.GuildMemberOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(interaction.user.id);
    if (!linkedUser) throw new HypixelDiscordChatBridgeError("This command requires you to be verified. Please use /verify to verify.");
    const inactivityData = await this.discord.application.data.inactivity.getUserByDiscordId(interaction.user.id);
    if (inactivityData) throw new HypixelDiscordChatBridgeError(`You are already inactive until <t:${inactivityData.expires}:F> (<t:${inactivityData.expires}:R>)`);

    const time = Math.floor(ms(interaction.options.getString("time", true) as StringValue) / 1000);
    if (isNaN(time)) throw new HypixelDiscordChatBridgeError("Please input a valid time");
    const reason = interaction.options.getString("reason") ?? "No reason provided";
    await new InactiveUser({ discordId: interaction.user.id, reason, duration: time }, this.discord.application.data.inactivity).save();
    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription("Inactivity request has been successfully sent to the guild staff.").setDevFooter("Kathund")]
    });
  }
}

export default InactivityCommand;
