import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../../private/commands/DiscordCommandDataBuilder.ts";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import InactiveUser from "../../../../data/inactivity/InactiveUser.js";
import ms, { type StringValue } from "ms";
import { CommandFlags, CommandPermission } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { truncateString } from "../../../../utils/stringUtils.ts";
import type { AutocompleteInteractionWithGuild, AutocompleteOption, ChatInputCommandInteractionWithGuild } from "../../../../types/discord.js";

class ManageInactivityCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
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
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async autocomplete(interaction: AutocompleteInteractionWithGuild): Promise<void> {
    const users = await this.discord.application.data.inactivity.getFullData().then((users) => users.filter((user) => !user.isExpired));
    const parsed = (
      await Promise.all(
        users.map(async (user) => {
          const discUser = await user.getDiscordUser();
          if (!discUser) return null;
          return { username: this.discord.messageHandler.getDisplayName(discUser), reason: user.reason, id: user.inactivityId };
        })
      )
    ).filter((x): x is { username: string; reason: string; id: string } => x !== null);
    const options: AutocompleteOption[] = parsed
      .sort((a, b) => a.username.localeCompare(b.username))
      .map(({ username, reason, id }) => ({ value: id, name: `${username} - ${truncateString(reason, 20)}` }));
    await this.respondToAutocomplete(interaction, options);
  }

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
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
