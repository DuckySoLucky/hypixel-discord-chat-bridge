import {
  type ApplicationCommandOptionChoiceData,
  type BaseInteraction,
  ChannelType,
  type Client,
  type GuildMember,
  PermissionFlagsBits,
  type Role,
  type SendableChannels,
  Team
} from "discord.js";
import { type AutocompleteInteractionWithGuild, type AutocompleteOption, type BaseInteractionWithGuild, CommandPermission } from "../types/discord.js";

export async function getApplicationOwners(client: Client): Promise<string[]> {
  if (!client.application) return [];
  const app = await client.application.fetch();
  if (app.owner instanceof Team) return app.owner.members.map((member) => member.id);
  const applicationOwners = app.owner?.id ? [app.owner.id] : [];
  return [...new Set([...client.config.discord.commands.adminUsers, ...applicationOwners, client.discordManager.guild?.ownerId ?? ""])];
}

export async function getRoles(member: GuildMember): Promise<Role[]> {
  member = await member.fetch();
  return member.roles.cache.map((role) => role);
}

export async function isAdminMember(member: GuildMember): Promise<boolean> {
  const adminUsers = await getApplicationOwners(member.client);

  if (member.client.config.discord.commands.checkPermissions === true && !adminUsers.includes(member.user.id)) {
    return false;
  }

  return true;
}

export async function isStaffMember(member: GuildMember): Promise<boolean> {
  const userRoles = await getRoles(member).then((roles) => roles.map((role) => role.id));
  const adminUsers = await getApplicationOwners(member.client);

  if (
    member.client.config.discord.commands.checkPermissions === true &&
    !(userRoles.includes(member.client.config.discord.commands.staffRole) || adminUsers.includes(member.user.id))
  ) {
    return false;
  }

  return true;
}

export async function isGuildMember(member: GuildMember): Promise<boolean> {
  const userRoles = await getRoles(member).then((roles) => roles.map((role) => role.id));
  const adminUsers = await getApplicationOwners(member.client);

  if (
    member.client.config.discord.commands.checkPermissions === true &&
    !(userRoles.includes(member.client.config.verification.roles.guildMember.roleId ?? "") || adminUsers.includes(member.user.id))
  ) {
    return false;
  }

  return true;
}

export async function isVerifiedMember(member: GuildMember): Promise<boolean> {
  const userRoles = await getRoles(member).then((roles) => roles.map((role) => role.id));
  const adminUsers = await getApplicationOwners(member.client);

  if (
    member.client.config.discord.commands.checkPermissions === true &&
    !(userRoles.includes(member.client.config.verification.roles.verified.roleId ?? "") || adminUsers.includes(member.user.id))
  ) {
    return false;
  }

  return true;
}

export function ParseAutoComplete(interaction: AutocompleteInteractionWithGuild, options: AutocompleteOption[]): ApplicationCommandOptionChoiceData[] {
  if (options.length === 0) options.push({ name: "No choices found", value: "UNKNOWN" });
  const focusedOption = interaction.options.getFocused(true);
  return options
    .filter((choice) => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()))
    .slice(0, 25)
    .map((choice) => ({ name: choice.name, value: choice.value ?? choice.name }));
}

export async function canSendMessages(channel: SendableChannels): Promise<boolean> {
  if (!channel.isTextBased()) return false;
  if (channel.type !== ChannelType.GuildText) return false;
  const me = await channel.guild.members.fetchMe();
  const perms = channel.permissionsFor(me);
  return perms.has(PermissionFlagsBits.ViewChannel) && perms.has(PermissionFlagsBits.SendMessages);
}

export function getDiscordCommandPermission(permission: CommandPermission) {
  switch (permission) {
    case CommandPermission.AdminOnly:
      return "Admin";
    case CommandPermission.StaffOnly:
      return "Staff";
    case CommandPermission.GuildMemberOnly:
      return "GuildMember";
    case CommandPermission.VerifiedOnly:
      return "Verified";
    case CommandPermission.Anyone:
    default:
      return "Anyone";
  }
}

export function isInteractionInsideOfGuild(interaction: BaseInteraction): interaction is BaseInteractionWithGuild {
  return interaction.guild !== null && interaction.member !== null;
}
