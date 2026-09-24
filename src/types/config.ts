import zod from "zod";
import { PlayerVariableStatsKeysNumbers, PlayerVariableStatsKeysStrings } from "../private/constants.js";

export enum ConfigChangeType {
  Move,
  Delete,
  Transform
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type TransformFunction = (value: JsonValue, config: JsonObject) => JsonValue;

export interface MigrationRuleMove {
  key: string;
  change: ConfigChangeType.Move;
}

export interface MigrationRuleDelete {
  change: ConfigChangeType.Delete;
}

export interface MigrationRuleTransform {
  key: string;
  change: ConfigChangeType.Transform;
  transform: TransformFunction;
}

export type MigrationRule = MigrationRuleMove | MigrationRuleDelete | MigrationRuleTransform;
export type MigrationMap = Record<string, MigrationRule>;

export const ConfigDiscordChannelId = zod.string().meta({ description: "Discord channel id" });
export const ConfigDiscordChannelIdGenerate = zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated channel will be used" });
export const ConfigDiscordChannelIdGenerateThread = zod.string().nullable().meta({ description: "Discord channel id. If null, an auto-generated thread will be used" });

export const ConfigAPIHypixel = zod
  .object({
    key: zod.string().meta({ description: "The Hypixel API key itself" }),
    baseURL: zod.url().nullable().meta({ description: "The base URL for the Hypixel API. If null, the default Hypixel API URL will be used" })
  })
  .meta({ description: "Configuration for the Hypixel API" });
export const ConfigAPIMowojang = zod
  .object({ baseURL: zod.url().nullable().meta({ description: "The base URL for the Mowojang API. If null, the default Mowojang API URL will be used" }) })
  .meta({ description: "Configuration for the Mowojang API" });
export const ConfigAPISoopy = zod
  .object({ baseURL: zod.url().meta({ description: "The base URL for the Soopy API" }) })
  .meta({ description: "Configuration for the Soopy API" });
export const ConfigAPIMCHeads = zod
  .object({ baseURL: zod.url().meta({ description: "The base URL for the mc-heads API" }) })
  .meta({ description: "Configuration for the mc-heads API" });
export const ConfigAPI = zod
  .object({ hypixel: ConfigAPIHypixel, mowojang: ConfigAPIMowojang, soopy: ConfigAPISoopy, mcHeads: ConfigAPIMCHeads })
  .meta({ description: "Configuration options for API's used inside of the bot" });

export const ConfigBridgeMinecraft = zod
  .object({
    format: zod
      .string()
      .meta({ description: "The format for messages sent from Discord to Minecraft\nUse {username} for the player's username and {message} for the message content" })
  })
  .meta({ description: "Configuration options for how the minecraft side of the bridge behaves" });
export const ConfigBridgeDiscord = zod
  .object({
    allowedBots: zod.array(zod.string()).meta({ description: "Array of discord User Ids" }),
    mode: zod.enum(["bot", "webhook", "minecraft"]).meta({ description: "Which Discord bridge mode should be used" }),
    format: zod
      .string()
      .meta({
        description: [
          "The format for messages sent from Minecraft to Discord",
          "Only used with `minecraft` mode",
          "Supported arguments: {chatType}, {username}, {rank}, {guildRank}, {username}"
        ].join("\n")
      })
  })
  .meta({ description: "Configuration options for how the discord side of the bridge behaves" });
export const ConfigBridgeChannelLoggingChannels = zod
  .object({
    guild: ConfigDiscordChannelIdGenerateThread,
    event: ConfigDiscordChannelIdGenerateThread,
    error: ConfigDiscordChannelIdGenerateThread,
    blacklist: ConfigDiscordChannelIdGenerateThread,
    scripts: ConfigDiscordChannelIdGenerateThread,
    inactivity: ConfigDiscordChannelIdGenerateThread
  })
  .meta({ description: "Specific logging channels for different bridge events" });
export const ConfigBridgeChannelLogging = zod
  .object({
    enabled: zod.boolean().meta({ description: "Should this bridge channel be enabled" }),
    channel: ConfigDiscordChannelIdGenerate,
    channels: ConfigBridgeChannelLoggingChannels
  })
  .meta({ description: "Configuration for a bridge logging channel" });
export const ConfigBridgeChannel = zod
  .object({ enabled: zod.boolean().meta({ description: "Should this bridge channel be enabled" }), channel: ConfigDiscordChannelIdGenerate })
  .meta({ description: "Configuration for a single bridge channel" });
export type ConfigBridgeChannel = zod.infer<typeof ConfigBridgeChannel>;
export const ConfigBridgeChannels = zod
  .object({ debug: ConfigBridgeChannel, guild: ConfigBridgeChannel, officer: ConfigBridgeChannel, logging: ConfigBridgeChannelLogging })
  .meta({ description: "Configuration options for the bridge channels" });
export const ConfigBridgeFilter = zod
  .object({
    enabled: zod.boolean().meta({ description: "Should the chat filter be enabled" }),
    customWords: zod.array(zod.string()).meta({ description: "Custom words used for filtering bridge messages" })
  })
  .meta({ description: "Bridge chat filtering configuration" });
export const ConfigBridgeStrippersItems = zod
  .object({
    emojis: zod.boolean().meta({ description: "Whether emoji characters should be stripped from usernames or messages" }),
    spaces: zod.boolean().meta({ description: "Whether extra spaces should be stripped from usernames or messages" }),
    nonAlphanumeric: zod.boolean().meta({ description: "Whether non-alphanumeric characters should be stripped from usernames or messages" })
  })
  .meta({ description: "Configuration options for the strippers" });
export const ConfigBridgeStrippers = zod
  .object({
    usernames: ConfigBridgeStrippersItems.meta({ description: "Stripper settings for usernames" }),
    messages: ConfigBridgeStrippersItems.meta({ description: "Stripper settings for messages" })
  })
  .meta({ description: "Configuration options for the bridge message/username strippers" });
export const ConfigBridge = zod
  .object({
    minecraft: ConfigBridgeMinecraft,
    discord: ConfigBridgeDiscord,
    channels: ConfigBridgeChannels,
    filter: ConfigBridgeFilter,
    strippers: ConfigBridgeStrippers,
    timeout: zod.string().meta({ description: "How long should bridged messages wait before assuming something went wrong" }),
    messageErrorReactions: zod.boolean().meta({ description: "Should the bot react X when a message fails" })
  })
  .meta({ description: "Configuration options for the chat bridge" });

export const ConfigMinecraftCommand = zod.object({
  enabled: zod.boolean().meta({ description: "Whether this minecraft command is enabled" }),
  prefix: zod.string().meta({ description: "The command prefix used for this minecraft command" })
});
export const ConfigMinecraftCommands = zod
  .object({
    timeout: zod.string().meta({ description: "How long the command should wait before assuming something went wrong" }),
    messageRepeatBypassLength: zod.number().meta({ description: "The number of repeated messages allowed before a command is ignored" }),
    maxMessageLength: zod.number().meta({ description: "The maximum length of a minecraft command message" }),
    normal: ConfigMinecraftCommand.meta({ description: "Configuration for the normal minecraft command system" }),
    soopy: ConfigMinecraftCommand.meta({ description: "Configuration for the Soopy minecraft command system" })
  })
  .meta({ description: "Configuration for minecraft command handling" });
export const ConfigMinecraftGuildRequirements = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether guild requirement checking is enabled" }),
    autoAccept: zod.boolean().meta({ description: "Whether new guild members are automatically accepted if they have pass the requirements" }),
    requirementsNeededToPass: zod.number().meta({ description: "The number of requirements a player must meet to pass" }),
    requirements: zod
      .record(zod.string(), zod.number().int().positive())
      .refine((obj) => Object.keys(obj).every((key) => (PlayerVariableStatsKeysNumbers as readonly string[]).includes(key)), { message: "Invalid requirement key" })
      .meta({ description: "The guild requirement thresholds keyed by player stat" })
  })
  .meta({ description: "Configuration for guild join requirements" });
export const ConfigMinecraftGuildWelcomer = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether the guild welcome message is enabled" }),
    message: zod.string().meta({ description: "The welcome message sent to new guild members" }),
    showCredits: zod.boolean().meta({ skip: true, description: "Whether welcome message credits should be shown" })
  })
  .meta({ description: "Configuration for the guild welcome message" });
export const ConfigMinecraftGuild = zod
  .object({ requirements: ConfigMinecraftGuildRequirements, welcomer: ConfigMinecraftGuildWelcomer })
  .meta({ description: "Configuration for minecraft guild behavior" });
export const ConfigMinecraftHypixelAlertsAlert = zod.object({
  enabled: zod.boolean().meta({ description: "Whether this Hypixel alert is enabled" }),
  interval: zod.string().meta({ description: "How often should the alert be ran (/checked)" })
});
export const ConfigMinecraftHypixelAlertsAlphaPlayerCountTracker = ConfigMinecraftHypixelAlertsAlert.extend({
  messageCooldown: zod.string().meta({ description: "The cooldown between alpha player count messages" }),
  playerThreshold: zod.number().meta({ description: "The player count threshold to trigger an alert" })
}).meta({ description: "Configuration for the alpha player count tracking alert" });
export const ConfigMinecraftHypixelAlerts = zod
  .object({
    hypixelNews: ConfigMinecraftHypixelAlertsAlert.meta({ description: "Hypixel news alert settings" }),
    statusUpdates: ConfigMinecraftHypixelAlertsAlert.meta({ description: "Hypixel status update alert settings" }),
    skyblockVersion: ConfigMinecraftHypixelAlertsAlert.meta({ description: "SkyBlock version alert settings" }),
    alphaPlayerCountTracker: ConfigMinecraftHypixelAlertsAlphaPlayerCountTracker
  })
  .meta({ description: "Configuration for Hypixel alerts" });
export const ConfigMinecraftBot = zod
  .object({
    server: zod.string().meta({ description: "The Minecraft server address to connect to" }),
    port: zod.number().positive().max(65535).min(1).meta({ description: "The Minecraft server port to connect to" }),
    version: zod.string().meta({ description: "The Minecraft version" }),
    accountsLocation: zod.string().meta({ description: "The file path to Minecraft account credentials" })
  })
  .meta({ description: "Configuration for the minecraft bot connection" });
export const ConfigMinecraft = zod
  .object({ commands: ConfigMinecraftCommands, guild: ConfigMinecraftGuild, hypixelAlerts: ConfigMinecraftHypixelAlerts, bot: ConfigMinecraftBot })
  .meta({ description: "Configuration options for minecraft related stuff" });

export const ConfigDiscordCommands = zod
  .object({
    staffRole: zod.string().meta({ description: "The discord role Id of your staff members" }),
    adminUsers: zod.array(zod.string()).meta({ description: "The discord user Ids of any admins\nThe people who own the bot are automatically included" }),
    debugCommands: zod.boolean().meta({ description: "Should the debug commands be enabled" })
  })
  .meta({ description: "Configuration for discord bot commands" });
export const ConfigDiscordEmbedsColors = zod.enum(["Blue", "Red", "Green", "Yellow"]);
export type ConfigDiscordEmbedsColors = zod.infer<typeof ConfigDiscordEmbedsColors>;
export const ConfigDiscordEmbeds = zod
  .object({
    showTime: zod.boolean().meta({ description: "Should the default generic embed show the current timestamp" }),
    showDevFooters: zod.boolean().meta({ description: "Whether dev footers should be disabled or not", skip: true }),
    colors: zod.record(ConfigDiscordEmbedsColors, zod.string()).meta({ description: "The default colors for embeds", skip: true })
  })
  .meta({ description: "Configuration options for embeds and how they are displayed" });
export const ConfigDiscord = zod
  .object({
    serverId: zod.string().meta({ description: "The Discord server (guild) ID" }),
    token: zod.string().meta({ description: "The Discord bot token used to authenticate" }),
    commands: ConfigDiscordCommands,
    embeds: ConfigDiscordEmbeds
  })
  .meta({ description: "Configuration options for discord related stuff" });

export const ConfigVerificationRolesAutoUpdater = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether role auto-updating is enabled for verified users" }),
    interval: zod.string().meta({ description: "How often should all linked users have there roles updated" })
  })
  .meta({ description: "Configuration for automatic verification role updates" });

export const ConfigVerificationRole = zod.discriminatedUnion("enabled", [
  zod.object({ enabled: zod.literal(true), roleId: zod.string().meta({ description: "Discord role id" }) }),
  zod.object({ enabled: zod.literal(false), roleId: zod.string().nullable().meta({ description: "Discord role id" }) })
]);
export const ConfigVerificationRolesCustomRequirementString = zod.object({
  type: zod.enum(PlayerVariableStatsKeysStrings).meta({ description: "The player variable string type required for verification\nSee docs/Variables/Player.md" }),
  value: zod.string().meta({ description: "The string value required for this custom verification requirement" })
});
export const ConfigVerificationRolesCustomRequirementNumber = zod.object({
  type: zod.enum(PlayerVariableStatsKeysNumbers).meta({ description: "The player variable string type required for verification\nSee docs/Variables/Player.md " }),
  value: zod.number().int().positive().meta({ description: "The numeric value required for this custom verification requirement" })
});
export const ConfigVerificationRolesCustomRequirement = zod.union([ConfigVerificationRolesCustomRequirementString, ConfigVerificationRolesCustomRequirementNumber]);
export type ConfigVerificationRolesCustomRequirement = zod.infer<typeof ConfigVerificationRolesCustomRequirement>;
export const ConfigVerificationRolesCustomEnabled = zod.object({
  enabled: zod.literal(true).meta({ description: "Whether this custom verification role is enabled" }),
  roleId: zod.string().meta({ description: "Discord role id" }),
  requirements: zod.array(ConfigVerificationRolesCustomRequirement).meta({ description: "The requirements needed to receive this custom verification role" })
});
export type ConfigVerificationRolesCustomEnabled = zod.infer<typeof ConfigVerificationRolesCustomEnabled>;
export const ConfigVerificationRolesCustomDisabled = zod.object({
  enabled: zod.literal(false).meta({ description: "Whether this custom verification role is disabled" }),
  roleId: zod.string().nullable().meta({ description: "Discord role id" }),
  requirements: zod.array(ConfigVerificationRolesCustomRequirement).meta({ description: "The requirements needed to receive this custom verification role" })
});
export const ConfigVerificationRolesCustom = zod.discriminatedUnion("enabled", [ConfigVerificationRolesCustomEnabled, ConfigVerificationRolesCustomDisabled]);
export type ConfigVerificationRolesCustom = zod.infer<typeof ConfigVerificationRolesCustom>;
export const ConfigVerificationRoles = zod
  .object({
    verified: ConfigVerificationRole.meta({ description: "Role assigned to verified users" }),
    guildMember: ConfigVerificationRole.meta({ description: "Role assigned to guild members" }),
    custom: zod.array(ConfigVerificationRolesCustom).meta({ description: "Custom verification roles based on player requirements" }),
    autoUpdater: ConfigVerificationRolesAutoUpdater
  })
  .meta({ description: "Configuration for verification roles" });
export const ConfigVerificationNickname = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether verified user nicknames should be managed automatically" }),
    nickname: zod.string().meta({ description: "The nickname format used for verified users.\nSee docs/PlayerStatVaribles.md for list of supported variables" }),
    removeCommas: zod.boolean().meta({ description: "Whether commas should be removed from generated nicknames" })
  })
  .meta({ description: "Configuration for automatic nickname updates" });
export const ConfigVerificationInactivity = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether inactivity checks are enabled for verified users" }),
    maxInactivityTime: zod.string().meta({ description: "The maximum allowed inactivity time before action is taken" })
  })
  .meta({ description: "Configuration for verification inactivity tracking" });
export const ConfigVerification = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether verification is enabled" }),
    nickname: ConfigVerificationNickname,
    roles: ConfigVerificationRoles,
    inactivity: ConfigVerificationInactivity
  })
  .meta({ description: "Configuration for user verification" });

export const ConfigBlacklistNotificationsOnBlacklistChange = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether the user being blacklisted with be notified of blacklist changes" }),
    shareBlacklister: zod.boolean().meta({ description: "Whether the user who blacklisted someone should be shared in notifications" })
  })
  .meta({ description: "Configuration for notifications sent when a blacklist change occurs" });
export const ConfigBlacklistNotifications = zod
  .object({
    onBlacklistChange: ConfigBlacklistNotificationsOnBlacklistChange,
    onJoinRequest: zod.boolean().meta({ description: "Whether join request notifications are enabled" }),
    onUserJoinDiscord: zod.boolean().meta({ description: "Whether Discord join notifications are enabled" })
  })
  .meta({ description: "Configuration for blacklist notifications" });
export const ConfigBlacklistActionsKickFromGuild = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether blacklisted users should be kicked from the guild" }),
    reason: zod.string().meta({ description: "The reason used when kicking a player from the guild" })
  })
  .meta({ description: "Configuration for kicking blacklisted users from the guild" });
export const ConfigBlacklistActions = zod
  .object({
    blockBotAccess: zod.boolean().meta({ description: "Whether blacklisted users are blocked from bot access" }),
    kickFromGuild: ConfigBlacklistActionsKickFromGuild
  })
  .meta({ description: "Configuration for actions taken against blacklisted users" });
export const ConfigBlacklist = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether the blacklist feature is enabled" }),
    notifications: ConfigBlacklistNotifications,
    actions: ConfigBlacklistActions
  })
  .meta({ description: "Configuration for blacklist handling" });

export const ConfigStatsChannelsAutoUpdater = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether stats channel auto-updating is enabled" }),
    interval: zod.string().meta({ description: "How often stats channels are updated" })
  })
  .meta({ description: "Configuration for automatic stats channel updates" });
export const ConfigStatsChannelsChannel = zod
  .object({ id: ConfigDiscordChannelId, name: zod.string().meta({ description: "What the channel should be named to\nSee docs/Variables/Channel.md" }) })
  .meta({ description: "Configuration for a single stats channel" });
export const ConfigStatsChannels = zod
  .object({
    enabled: zod.boolean().meta({ description: "Whether stats channels are enabled" }),
    autoUpdater: ConfigStatsChannelsAutoUpdater,
    channels: zod.array(ConfigStatsChannelsChannel).meta({ description: "The stats channels to maintain" })
  })
  .meta({ description: "Configuration for stats channels" });

export const ConfigOtherLogger = zod
  .object({
    saveToFiles: zod.boolean().meta({ description: "Whether log output should be written to files" }),
    location: zod.string().meta({ description: "The location of where these files should be saved" }),
    warningForDisabledChannel: zod.boolean().meta({ description: "Whether the channel disabled warning should be sent", skip: true })
  })
  .meta({ description: "Configuration options for the logger" });
export const ConfigOther = zod
  .object({ backupConfigs: zod.boolean().meta({ description: "Whether backup copies of config files should be created" }), logger: ConfigOtherLogger })
  .meta({ description: "Configuration options for misc/other stuff or things that don't have a good location" });

export const Config = zod.object({
  $schema: zod.string().meta({ description: "!IMPORTANT DO NOT TOUCH\nConfig schema format path" }),
  configVersion: zod.number().int().positive().meta({ description: "!IMPORTANT DO NOT TOUCH\nConfig format version number" }),
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
