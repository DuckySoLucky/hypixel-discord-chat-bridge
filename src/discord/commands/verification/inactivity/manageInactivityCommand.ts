import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import InactiveUser from "../../../../data/inactivity/InactiveUser.js";
import ms, { type StringValue } from "ms";
import { type ChatInputCommandInteraction } from "discord.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../../types/discord.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { translate } from "../../../../translations/TranslationsManager.js";

class ManageInactivityCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("manage-inactivity")
      .addSubcommand((option) =>
        option
          .setName("add")
          .addUserOption((option) => option.setName("user").setRequired(true))
          .addStringOption((option) => option.setName("time").setRequired(true))
          .addStringOption((option) => option.setName("reason"))
      )
      .addSubcommand((option) => option.setName("delete").addStringOption((option) => option.setName("inactivity").setRequired(true).setAutocomplete(true)))
      .addSubcommand((option) => option.setName("get").addStringOption((option) => option.setName("inactivity").setRequired(true).setAutocomplete(true)));
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(true);

    switch (subcommand) {
      case "add": {
        const user = interaction.options.getUser("user", true);
        const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(user.id);
        if (!linkedUser) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.missing"));
        const guildMember = await linkedUser.isUserInHypixelGuild();
        if (!guildMember) throw new HypixelDiscordChatBridgeError(translate("discord.commands.manage-inactivity.execute.errors.not.in.guild"));
        const inactivityData = await this.discord.application.data.inactivity.getUserByDiscordId(user.id);
        if (inactivityData) {
          throw new HypixelDiscordChatBridgeError(translate("discord.commands.manage-inactivity.execute.errors.already.inactive", { timestamp: inactivityData.expires }));
        }
        const time = Math.floor(ms(interaction.options.getString("time", true) as StringValue) / 1000);
        if (isNaN(time)) throw new HypixelDiscordChatBridgeError(translate("discord.commands.inactivity.execute.errors.invalid.time"));
        const reason = interaction.options.getString("reason") ?? translate("generic.no.reason");
        await new InactiveUser({ discordId: user.id, reason, duration: time }, this.discord.application.data.inactivity).save();
        await interaction.followUp({
          embeds: [new SuccessEmbed().setDescription(translate("discord.commands.manage-inactivity.execute.success.add")).setDevFooter("Kathund")]
        });
        break;
      }
      case "delete": {
        const inactivityId = interaction.options.getString("inactivity", true);
        const inactivityData = await this.discord.application.data.inactivity.getUserById(inactivityId);
        if (!inactivityData) throw new HypixelDiscordChatBridgeError(translate("inactivity.errors.failed.find"));
        await inactivityData.delete();
        await interaction.followUp({
          embeds: [new SuccessEmbed().setDescription(translate("discord.commands.manage-inactivity.execute.success.delete")).setDevFooter("Kathund")]
        });
        break;
      }
      case "get": {
        const inactivityId = interaction.options.getString("inactivity", true);
        const inactivityData = await this.discord.application.data.inactivity.getUserById(inactivityId);
        if (!inactivityData) throw new HypixelDiscordChatBridgeError(translate("inactivity.errors.failed.find"));
        const inactivityResponse = await this.discord.application.data.inactivity.getInactivityDataResponse(inactivityData);
        await interaction.followUp(inactivityResponse);
        break;
      }
      default: {
        throw new HypixelDiscordChatBridgeError(translate("discord.errors.interaction.command.unknown.subcommand"));
      }
    }
  }
}

export default ManageInactivityCommand;
