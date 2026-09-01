import {
  type ApplicationCommandOptionChoiceData,
  type BaseInteraction,
  type Client,
  type GuildMember,
  InteractionType,
  type Role,
  type SendableChannels,
  Team,
  User
} from "discord.js";
import { type AutocompleteInteractionWithGuild, type AutocompleteOption, type BaseInteractionWithGuild, CommandPermission } from "../types/discord.js";

export async function getRoles(member: GuildMember): Promise<Role[]> {
  member = await member.fetch();
  return member.roles.cache.map((role) => role);
}

export async function getApplicationOwners(client: Client<true>): Promise<string[]> {
  const app = await client.application.fetch();
  if (app.owner instanceof Team) return app.owner.members.map((member) => member.id);
  return app.owner?.id ? [app.owner.id] : [];
}

export async function isApplicationOwner(user: User): Promise<boolean> {
  const adminUsers = await getApplicationOwners(user.client);
  return adminUsers.includes(user.id);
}

export function isDiscordServerOwner(user: User): boolean {
  if (!user.client.discordManager.isGuildReady()) return false;
  return user.id === user.client.discordManager.guild.ownerId;
}

export async function isAdminMember(user: User): Promise<boolean> {
  if (await isApplicationOwner(user)) return true;
  if (isDiscordServerOwner(user)) return true;
  return false;
}

export async function isStaffMember(member: GuildMember): Promise<boolean> {
  if (await isAdminMember(member.user)) return true;
  const userRoles = await getRoles(member).then((roles) => roles.map((role) => role.id));
  if (userRoles.includes(member.client.config.discord.commands.staffRole)) return true;
  return false;
}

export async function isGuildMember(member: GuildMember): Promise<boolean> {
  if (await isAdminMember(member.user)) return true;
  const userRoles = await getRoles(member).then((roles) => roles.map((role) => role.id));
  if (userRoles.includes(member.client.config.verification.roles.guildMember.roleId ?? "")) return true;
  return false;
}

export async function isVerifiedMember(member: GuildMember): Promise<boolean> {
  if (await isAdminMember(member.user)) return true;
  const userRoles = await getRoles(member).then((roles) => roles.map((role) => role.id));
  if (userRoles.includes(member.client.config.verification.roles.verified.roleId ?? "")) return true;
  return false;
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
  return await channel
    .sendTyping()
    .then(() => true)
    .catch((error: Error) => {
      if (error.message === "Missing Access") return false;
      throw error;
    });
}

export function getDiscordCommandPermission(permission: CommandPermission) {
  switch (permission) {
    case CommandPermission.Admin:
      return "Admin";
    case CommandPermission.Staff:
      return "Staff";
    case CommandPermission.GuildMember:
      return "Guild Member";
    case CommandPermission.Linked:
      return "Verified";
    case CommandPermission.Anyone:
    default:
      return "Anyone";
  }
}

export function isInteractionInsideOfGuild(interaction: BaseInteraction): interaction is BaseInteractionWithGuild {
  return interaction.guild !== null && interaction.member !== null;
}

export function parseInteractionType(type: InteractionType): string {
  switch (type) {
    case InteractionType.ApplicationCommand:
      return "ApplicationCommand";
    case InteractionType.MessageComponent:
      return "MessageComponent";
    case InteractionType.ApplicationCommandAutocomplete:
      return "ApplicationCommandAutocomplete";
    case InteractionType.ModalSubmit:
      return "ModalSubmit";
    case InteractionType.Ping:
    default:
      return "Ping";
  }
}
