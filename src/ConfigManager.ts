import BasicConfigManager from "./core/BasicConfigManager.ts";
import MinecraftManager from "./minecraft/MinecraftManager.js";
import { Config, ConfigChangeType, type MigrationMap } from "./types/config.js";

class ConfigManager extends BasicConfigManager<Config> {
  protected readonly configPath = "config.json";
  protected readonly defaultConfigPath = "config.example.json";
  protected readonly schema = Config;
  protected readonly versions: Record<number, MigrationMap> = {
    2: {
      "discord.bot.serverID": { key: "discord.serverId", change: ConfigChangeType.Move },
      "discord.bot.token": { key: "discord.token", change: ConfigChangeType.Move },
      "discord.channels.allowedBots": { key: "bridge.discord.allowedBots", change: ConfigChangeType.Move },
      "discord.channels.debugChannel": { key: "bridge.channels.debug.channel", change: ConfigChangeType.Move },
      "discord.channels.debugChannelMessageMode": { key: "bridge.channels.debug.mode", change: ConfigChangeType.Move },
      "discord.channels.debugMode": { key: "bridge.channels.debug.enabled", change: ConfigChangeType.Move },
      "discord.channels.guildChatChannel": { key: "bridge.channels.guild.channel", change: ConfigChangeType.Move },
      "discord.channels.officerChannel": { key: "bridge.channels.officer.channel", change: ConfigChangeType.Move },
      "discord.channels.loggingChannel": { key: "bridge.channels.logging.channel", change: ConfigChangeType.Move },
      "discord.commands.checkPerms": { key: "discord.commands.checkPermissions", change: ConfigChangeType.Move },
      "discord.commands.commandRole": { key: "discord.commands.staffRole", change: ConfigChangeType.Move },
      "discord.commands.users": { key: "discord.commands.adminUsers", change: ConfigChangeType.Move },
      "discord.commands.blacklistRoles": { change: ConfigChangeType.Delete },
      "discord.other.autoLimbo": { key: "minecraft.autoLimbo", change: ConfigChangeType.Move },
      "discord.other.filterMessages": { key: "bridge.filter.enabled", change: ConfigChangeType.Move },
      "discord.other.filterWords": { key: "bridge.filter.customWords", change: ConfigChangeType.Move },
      "discord.other.messageMode": { key: "bridge.discord.mode", change: ConfigChangeType.Move },
      "discord.other.messageFormat": { key: "bridge.discord.format", change: ConfigChangeType.Move },
      "discord.other.stripEmojisFromUsernames": { key: "bridge.stripEmojisFromUsernames", change: ConfigChangeType.Move },
      "discord.other.joinMessage": { change: ConfigChangeType.Delete },
      "minecraft.fragBot": { change: ConfigChangeType.Delete },
      "minecraft.API.hypixelAPIkey": { key: "API.hypixel.key", change: ConfigChangeType.Move },
      "minecraft.API.imgurAPIkey": { change: ConfigChangeType.Delete },
      "minecraft.bot.messageFormat": { key: "bridge.minecraft.format", change: ConfigChangeType.Move },
      "minecraft.bot.messageRepeatBypassLength": { key: "minecraft.commands.messageRepeatBypassLength", change: ConfigChangeType.Move },
      "minecraft.commands.normal": { key: "minecraft.commands.normal.enabled", change: ConfigChangeType.Move },
      "minecraft.commands.soopy": { key: "minecraft.commands.soopy.enabled", change: ConfigChangeType.Move },
      "minecraft.bot.prefix": { key: "minecraft.commands.normal.prefix", change: ConfigChangeType.Move },
      "minecraft.hypixelUpdates.enabled": { change: ConfigChangeType.Delete },
      "minecraft.hypixelUpdates.hypixelNews": { key: "minecraft.hypixelAlerts.hypixelNews.enabled", change: ConfigChangeType.Move },
      "minecraft.hypixelUpdates.statusUpdates": { key: "minecraft.hypixelAlerts.hypixelNews.enabled", change: ConfigChangeType.Move },
      "minecraft.hypixelUpdates.skyblockVersion": { key: "minecraft.hypixelAlerts.skyblockVersion.enabled", change: ConfigChangeType.Move },
      "minecraft.hypixelUpdates.alphaPlayerCountTracker": { key: "minecraft.hypixelAlerts.alphaPlayerCountTracker.enabled", change: ConfigChangeType.Move },
      "minecraft.skyblockEventsNotifications": { change: ConfigChangeType.Delete },
      "minecraft.guildRequirements": { key: "minecraft.guild.requirements", change: ConfigChangeType.Move },
      "web": { change: ConfigChangeType.Delete },
      "other.timezone": { change: ConfigChangeType.Delete },
      "statsChannels.autoUpdaterInterval": { key: "statsChannels.autoUpdater.interval", change: ConfigChangeType.Transform, transform: (value) => `${String(value)}m` },
      "verification.inactivity.channel": { change: ConfigChangeType.Delete },
      "verification.inactivity.maxInactivityTime": {
        key: "verification.inactivity.maxInactivityTime",
        change: ConfigChangeType.Transform,
        transform: (value) => `${String(value)}d`
      },
      "verification.autoRoleUpdater.enabled": { key: "verification.roles.autoUpdater.enabled", change: ConfigChangeType.Move },
      "verification.autoRoleUpdater.interval": {
        key: "verification.roles.autoUpdater.interval",
        change: ConfigChangeType.Transform,
        transform: (value) => `${String(value)}h`
      }
    },
    3: { "minecraft.guild.requirements.requiredToHave": { key: "minecraft.guild.requirements.requirementsNeededToPass", change: ConfigChangeType.Move } },
    4: { "minecraft.autoLimbo": { change: ConfigChangeType.Delete }, "other.codeUpdater": { change: ConfigChangeType.Delete } },
    5: {
      "minecraft.bot.accountsLocation": {
        key: "minecraft.bot.accountsLocation",
        change: ConfigChangeType.Transform,
        transform: (value) => {
          if (value === "./auth-cache") return "./data/auth-cache";
          return value;
        }
      },
      "other.logToFiles": { key: "other.logging.saveToFiles", change: ConfigChangeType.Move }
    },
    6: { "discord.commands.checkPermissions": { change: ConfigChangeType.Delete } },
    7: {
      "other.autoUpdater": { change: ConfigChangeType.Delete },
      "other.autoUpdaterInterval": { change: ConfigChangeType.Delete },
      "bridge.channels.debug.mode": { change: ConfigChangeType.Delete }
    },
    8: {
      "other.showDevFooters": { key: "discord.embeds.showDevFooters", change: ConfigChangeType.Move },
      "other.colors": { key: "discord.embeds.colors", change: ConfigChangeType.Move },
      "other.logging": { key: "other.logger", change: ConfigChangeType.Move },
      "bridge.stripEmojisFromUsernames": { key: "bridge.strippers.usernames.emojis", change: ConfigChangeType.Move },
      "bridge.stripSpacesFromUsernames": { key: "bridge.strippers.usernames.spaces", change: ConfigChangeType.Move }
    }
  };

  protected override onConfigValidated(config: Config): Config {
    MinecraftManager.validateMinecraftVersion(config.minecraft.bot.version);
    return config;
  }
}

export default ConfigManager;
