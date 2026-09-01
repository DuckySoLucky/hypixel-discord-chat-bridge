import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";
import { isAdminMember, isApplicationOwner, isDiscordServerOwner, isGuildMember, isStaffMember, isVerifiedMember } from "../../../utils/discordUtils.js";

class PermissionCheckCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("permission-check")
    .setDescription("Check what level of permission a user has")
    .addUserOption((option) => option.setName("user").setDescription("The user to check (Defaults to self)"));
  override readonly flags = [CommandFlags.DebugCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const member = await interaction.guild.members.fetch(user);

    const permSources = [
      ["isApplicationOwner", isApplicationOwner(user)],
      ["isDiscordServerOwner", isDiscordServerOwner(user)],
      ["isAdminMember", isAdminMember(user)],
      ["isStaffMember", isStaffMember(member)],
      ["isGuildMember", isGuildMember(member)],
      ["isVerifiedMember", isVerifiedMember(member)]
    ] as const;

    const perms = await Promise.all(permSources.map(async ([name, promise]) => ({ name, value: await promise })));
    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(`Permissions for <@${user.id}>`)
          .setFields(...perms.map(({ name, value }) => ({ name, value: value ? ":white_check_mark:" : ":x:", inline: true })))
          .setDevFooter("Kathund")
      ]
    });
  }
}

export default PermissionCheckCommand;
