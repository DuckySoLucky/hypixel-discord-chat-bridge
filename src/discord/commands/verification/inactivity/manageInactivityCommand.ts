import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import InactiveUser from "../../../../data/inactivity/InactiveUser.js";
import ms, { type StringValue } from "ms";
import { type ChatInputCommandInteraction } from "discord.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";

class ManageInactivityCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("manage-inactivity")
      .setDescription("Manage inactivity")
      .addSubcommand((option) =>
        option
          .setName("add")
          .setDescription("Add a user to the inactivity list")
          .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
          .addStringOption((option) => option.setName("time").setDescription("The time you are inactive for (e.g. 1d, 72h, 2w)").setRequired(true))
          .addStringOption((option) => option.setName("reason").setDescription("The reason you are going away"))
      )
      .addSubcommand((option) =>
        option
          .setName("delete")
          .setDescription("Delete an inactivity list entry")
          .addStringOption((option) => option.setName("inactivity").setDescription("The inactivity you are wanting to delete").setRequired(true).setAutocomplete(true))
      )
      .addSubcommand((option) =>
        option
          .setName("get")
          .setDescription("Get an inactivity list entry")
          .addStringOption((option) => option.setName("inactivity").setDescription("The inactivity you are wanting to get").setRequired(true).setAutocomplete(true))
      );
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(true);

    switch (subcommand) {
      case "add": {
        const user = interaction.options.getUser("user", true);
        const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(user.id);
        if (!linkedUser) throw new HypixelDiscordChatBridgeError("User is not verified.");
        const guildMember = await linkedUser.isUserInHypixelGuild();
        if (!guildMember) throw new HypixelDiscordChatBridgeError("User is not in the guild.");
        const inactivityData = await this.discord.application.data.inactivity.getUserByDiscordId(user.id);
        if (inactivityData) throw new HypixelDiscordChatBridgeError(`User already inactive until <t:${inactivityData.expires}:F> (<t:${inactivityData.expires}:R>)`);
        const time = Math.floor(ms(interaction.options.getString("time", true) as StringValue) / 1000);
        if (isNaN(time)) throw new HypixelDiscordChatBridgeError("Please input a valid time");
        const reason = interaction.options.getString("reason") ?? "No reason provided";
        await new InactiveUser({ discordId: user.id, reason, duration: time }, this.discord.application.data.inactivity).save();
        await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("User has been marked as inactive").setDevFooter("Kathund")] });
        break;
      }
      case "delete": {
        const inactivityId = interaction.options.getString("inactivity", true);
        const inactivityData = await this.discord.application.data.inactivity.getUserById(inactivityId);
        if (!inactivityData) throw new HypixelDiscordChatBridgeError("Unable to find that inactivity?");
        await inactivityData.delete();
        await interaction.followUp({ embeds: [new SuccessEmbed().setDescription("Inactivity has been removed").setDevFooter("Kathund")] });
        break;
      }
      case "get": {
        const inactivityId = interaction.options.getString("inactivity", true);
        const inactivityData = await this.discord.application.data.inactivity.getUserById(inactivityId);
        if (!inactivityData) throw new HypixelDiscordChatBridgeError("Unable to find that inactivity?");
        const inactivityResponse = await this.discord.application.data.inactivity.getInactivityDataResponse(inactivityData);
        await interaction.followUp(inactivityResponse);
        break;
      }
      default: {
        throw new HypixelDiscordChatBridgeError("Unknown subcommand");
      }
    }
  }
}

export default ManageInactivityCommand;
