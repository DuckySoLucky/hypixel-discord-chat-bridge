import zod from "zod";
import { PlayerVariableStatsKeysNumbers, PlayerVariableStatsKeysStrings } from "../private/constants.js";

export enum ConfigChangeType {
  Move,
  Delete,
  Transform
}

export type TransformFunction = (value: any, config: any) => any;

export interface MigrationRule {
  key?: string;
  change: ConfigChangeType;
  transform?: TransformFunction;
}

export type MigrationMap = Record<string, MigrationRule>;

export const ConfigAPIHypixel = zod.object({
  key: zod.string(),
  baseURL: zod.url().nullable().meta({ description: "The base URL for the Hypixel API. If null, the default Hypixel API URL will be used" })
});
export const ConfigAPIMowojang = zod.object({
  baseURL: zod.url().nullable().meta({ description: "The base URL for the Mowojang API. If null, the default Mowojang API URL will be used" })
});
export const ConfigAPI = zod.object({ hypixel: ConfigAPIHypixel, mowojang: ConfigAPIMowojang });

export const ConfigBridgeMinecraft = zod.object({
  format: zod
    .string()
    .meta({ description: "The format for messages sent from Discord to Minecraft\nUse {username} for the player's username and {message} for the message content" })
});
export const ConfigBridgeDiscord = zod.object({
  allowedBots: zod.array(zod.string()).meta({ description: "Array of discord User Ids" }),
  mode: zod.enum(["bot", "webhook", "minecraft"]),
  format: zod
    .string()
    .meta({
      description:
        "The format for messages sent from Minecraft to Discord\nOnly used with `minecraft` mode\nSupported arguments: {chatType}, {username}, {rank}, {guildRank}, {username}"
    })
});
export const ConfigBridgeChannelLoggingChannels = zod.object({
  guild: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" }),
  event: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" }),
  error: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" }),
  blacklist: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" }),
  scripts: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" }),
  inactivity: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" })
});
export const ConfigBridgeChannelLogging = zod.object({
  enabled: zod.boolean(),
  channel: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated channel will be used" }),
  channels: ConfigBridgeChannelLoggingChannels
});
export const ConfigBridgeChannel = zod.object({
  enabled: zod.boolean(),
  channel: zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated channel will be used" })
});
export type ConfigBridgeChannel = zod.infer<typeof ConfigBridgeChannel>;
export const ConfigBridgeChannels = zod.object({
  debug: ConfigBridgeChannel,
  guild: ConfigBridgeChannel,
  officer: ConfigBridgeChannel,
  logging: ConfigBridgeChannelLogging
});
export const ConfigBridgeFilter = zod.object({
  enabled: zod.boolean(),
  customWords: zod.array(zod.string()).meta({ description: "Custom words used for filtering bridge messages" })
});
export const ConfigBridge = zod.object({
  minecraft: ConfigBridgeMinecraft,
  discord: ConfigBridgeDiscord,
  channels: ConfigBridgeChannels,
  filter: ConfigBridgeFilter,
  stripEmojisFromUsernames: zod.boolean()
});

export const ConfigMinecraftCommand = zod.object({ enabled: zod.boolean(), prefix: zod.string() });
export const ConfigMinecraftCommands = zod.object({
  messageRepeatBypassLength: zod.number(),
  maxMessageLength: zod.number(),
  normal: ConfigMinecraftCommand,
  soopy: ConfigMinecraftCommand
});
export const ConfigMinecraftGuildRequirements = zod.object({
  enabled: zod.boolean(),
  autoAccept: zod.boolean().meta({ description: "Whether new guild members are automatically accepted if they have pass the requirements" }),
  requirementsNeededToPass: zod.number().meta({ description: "The number of requirements a player must meet to pass" }),
  requirements: zod
    .record(zod.string(), zod.number().int().positive())
    .refine((obj) => Object.keys(obj).every((key) => PlayerVariableStatsKeysNumbers.includes(key as any)), { message: "Invalid requirement key" })
});
export const ConfigMinecraftGuild = zod.object({ requirements: ConfigMinecraftGuildRequirements });
export const ConfigMinecraftHypixelAlertsAlert = zod.object({
  enabled: zod.boolean(),
  interval: zod.string().meta({ description: "How often should the alert be ran (/checked)" })
});
export const ConfigMinecraftHypixelAlertsAlphaPlayerCountTracker = zod.object({
  enabled: zod.boolean(),
  interval: zod.string().meta({ description: "How often should the alert be ran (/checked)" }),
  messageCooldown: zod.string().meta({ description: "The cooldown between alpha player count messages" }),
  playerThreshold: zod.number().meta({ description: "The player count threshold to trigger an alert" })
});
export const ConfigMinecraftHypixelAlerts = zod.object({
  hypixelNews: ConfigMinecraftHypixelAlertsAlert,
  statusUpdates: ConfigMinecraftHypixelAlertsAlert,
  skyblockVersion: ConfigMinecraftHypixelAlertsAlert,
  alphaPlayerCountTracker: ConfigMinecraftHypixelAlertsAlphaPlayerCountTracker
});
export const ConfigMinecraftBot = zod.object({
  server: zod.string(),
  port: zod.number().positive().max(65535).min(1),
  version: zod.string().meta({ description: "The Minecraft version" }),
  accountsLocation: zod.string().meta({ description: "The file path to Minecraft account credentials" })
});
export const ConfigMinecraft = zod.object({
  commands: ConfigMinecraftCommands,
  guild: ConfigMinecraftGuild,
  hypixelAlerts: ConfigMinecraftHypixelAlerts,
  bot: ConfigMinecraftBot
});

export const ConfigDiscordCommands = zod.object({
  checkPermissions: zod.boolean(),
  staffRole: zod.string().meta({ description: "The discord role Id of your staff members" }),
  adminUsers: zod.array(zod.string()).meta({ description: "The discord user Ids of any admins\nThe people who own the bot are automatically included" })
});
export const ConfigDiscord = zod.object({
  serverId: zod.string().meta({ description: "The Discord server (guild) ID" }),
  token: zod.string().meta({ description: "The Discord bot token used to authenticate" }),
  commands: ConfigDiscordCommands
});

export const ConfigVerificationRolesAutoUpdater = zod.object({
  enabled: zod.boolean(),
  interval: zod.string().meta({ description: "How often should all linked users have there roles updated" })
});

export const ConfigVerificationRole = zod.discriminatedUnion("enabled", [
  zod.object({ enabled: zod.literal(true), roleId: zod.string().meta({ description: "Discord role id" }) }),
  zod.object({ enabled: zod.literal(false), roleId: zod.string().nullable().meta({ description: "Discord role id" }) })
]);
export const ConfigVerificationRolesCustomRequirementString = zod.object({
  type: zod.enum(PlayerVariableStatsKeysStrings).meta({ description: "The player variable string type required for verification\nSee docs/PlayerStatVariables.md " }),
  value: zod.string().meta({ description: "The string value required for this custom verification requirement" })
});
export const ConfigVerificationRolesCustomRequirementNumber = zod.object({
  type: zod.enum(PlayerVariableStatsKeysNumbers).meta({ description: "The player variable string type required for verification\nSee docs/PlayerStatVariables.md " }),
  value: zod.number().int().positive().meta({ description: "The numeric value required for this custom verification requirement" })
});
export const ConfigVerificationRolesCustomRequirement = zod.union([ConfigVerificationRolesCustomRequirementString, ConfigVerificationRolesCustomRequirementNumber]);
export type ConfigVerificationRolesCustomRequirement = zod.infer<typeof ConfigVerificationRolesCustomRequirement>;
export const ConfigVerificationRolesCustomEnabled = zod.object({
  enabled: zod.literal(true),
  roleId: zod.string().meta({ description: "Discord role id" }),
  requirements: zod.array(ConfigVerificationRolesCustomRequirement)
});
export type ConfigVerificationRolesCustomEnabled = zod.infer<typeof ConfigVerificationRolesCustomEnabled>;
export const ConfigVerificationRolesCustomDisabled = zod.object({
  enabled: zod.literal(false),
  roleId: zod.string().nullable().meta({ description: "Discord role id" }),
  requirements: zod.array(ConfigVerificationRolesCustomRequirement)
});
export const ConfigVerificationRolesCustom = zod.discriminatedUnion("enabled", [ConfigVerificationRolesCustomEnabled, ConfigVerificationRolesCustomDisabled]);
export const ConfigVerificationRoles = zod.object({
  verified: ConfigVerificationRole,
  guildMember: ConfigVerificationRole,
  custom: zod.array(ConfigVerificationRolesCustom),
  autoUpdater: ConfigVerificationRolesAutoUpdater
});
export const ConfigVerificationNickname = zod.object({
  enabled: zod.boolean(),
  nickname: zod.string().meta({ description: "The nickname format used for verified users.\nSee docs/PlayerStatVaribles.md for list of supported variables" }),
  removeCommas: zod.boolean().meta({ description: "Whether commas should be removed from generated nicknames" })
});
export const ConfigVerificationInactivity = zod.object({
  enabled: zod.boolean(),
  maxInactivityTime: zod.string().meta({ description: "The maximum allowed inactivity time before action is taken" })
});
export const ConfigVerification = zod.object({
  enabled: zod.boolean(),
  nickname: ConfigVerificationNickname,
  roles: ConfigVerificationRoles,
  inactivity: ConfigVerificationInactivity
});

export const ConfigBlacklistNotificationsOnBlacklistChange = zod.object({
  enabled: zod.boolean().meta({ description: "Whether the user being blacklisted with be notified of blacklist changes" }),
  shareBlacklister: zod.boolean().meta({ description: "Whether the user who blacklisted someone should be shared in notifications" })
});
export const ConfigBlacklistNotifications = zod.object({
  onBlacklistChange: ConfigBlacklistNotificationsOnBlacklistChange,
  onJoinRequest: zod.boolean().meta({ description: "Whether join request notifications are enabled" }),
  onUserJoinDiscord: zod.boolean().meta({ description: "Whether Discord join notifications are enabled" })
});
export const ConfigBlacklistActionsKickFromGuild = zod.object({
  enabled: zod.boolean(),
  reason: zod.string().meta({ description: "The reason used when kicking a player from the guild" })
});
export const ConfigBlacklistActions = zod.object({
  blockBotAccess: zod.boolean().meta({ description: "Whether blacklisted users are blocked from bot access" }),
  kickFromGuild: ConfigBlacklistActionsKickFromGuild
});
export const ConfigBlacklist = zod.object({ enabled: zod.boolean(), notifications: ConfigBlacklistNotifications, actions: ConfigBlacklistActions });

export const ConfigStatsChannelsAutoUpdater = zod.object({
  enabled: zod.boolean(),
  interval: zod.string().meta({ description: "How often stats channels are updated" })
});
export const ConfigStatsChannelsChannel = zod.object({
  id: zod.string().meta({ description: "Discord channel id" }),
  name: zod.string().meta({ description: "What the channel should be named to\nSee docs/ChannelStatVariables.md" })
});
export const ConfigStatsChannels = zod.object({ enabled: zod.boolean(), autoUpdater: ConfigStatsChannelsAutoUpdater, channels: zod.array(ConfigStatsChannelsChannel) });

export const ConfigOtherColors = zod.enum(["Blue", "Red", "Green", "Yellow"]);
export type ConfigOtherColors = zod.infer<typeof ConfigOtherColors>;
export const ConfigOther = zod.object({
  colors: zod.record(ConfigOtherColors, zod.string()).meta({ skip: true }),
  backupConfigs: zod.boolean().meta({ description: "Whether backup copies of config files should be created" }),
  logToFiles: zod.boolean().meta({ description: "Whether log output should be written to files" })
});

export const Config = zod.object({
  $schema: zod.string().meta({ skip: true }),
  configVersion: zod.number().int().positive().meta({ description: "!IMPORTANT DO NOT TOUCH\nConfig format version number", skip: true }),
  API: ConfigAPI,
  bridge: ConfigBridge,
  minecraft: ConfigMinecraft,
  discord: ConfigDiscord,
  verification: ConfigVerification,
  blacklist: ConfigBlacklist,
  statsChannels: ConfigStatsChannels,
  other: ConfigOther
});
export type Config = zod.infer<typeof Config>;
