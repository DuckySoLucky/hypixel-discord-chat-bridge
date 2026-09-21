import BasicConfigManager from "./core/BasicConfigManager.js";
import MinecraftManager from "./minecraft/MinecraftManager.js";
import { Config, ConfigChangeType, ConfigVerificationRolesCustom, type JsonValue, type MigrationMap } from "./types/config.js";

class ConfigManager extends BasicConfigManager<Config> {
  protected readonly configPath = "config.json";
  protected readonly defaultConfigPath = "config.example.json";
  protected readonly schema = Config;
  protected readonly playerVariableStatsKeyRenamingMap: Record<number, Record<string, string>> = {
    1: {
      bedwarsKDRatio: "bedwarsKillDeathRatio",
      bedwarsFinalDeathss: "bedwarsFinalDeaths",
      bedwarsFinalKDRatio: "bedwarsFinalKillDeathRatio",
      bedwarsSoloKDRatio: "bedwarsSoloKillDeathRatio",
      bedwarsSoloFinalKDRatio: "bedwarsSoloFinalKillDeathRatio",
      bedwarsDoublesKDRatio: "bedwarsDoublesKillDeathRatio",
      bedwarsDoublesFinalKDRatio: "bedwarsDoublesFinalKillDeathRatio",
      bedwarsThreesKDRatio: "bedwarsThreesKillDeathRatio",
      bedwarsThreesFinalKDRatio: "bedwarsThreesFinalKillDeathRatio",
      bedwarsFoursKDRatio: "bedwarsFoursKillDeathRatio",
      bedwarsFoursFinalKDRatio: "bedwarsFoursFinalKillDeathRatio",
      bedwars4v4KDRatio: "bedwars4v4KillDeathRatio",
      bedwars4v4FinalKDRatio: "bedwars4v4FinalKillDeathRatio",
      skywarsKDRatio: "skywarsKillDeathRatio",
      duelsKDRatio: "duelsKillDeathRatio"
    },
    2: {
      level: "hypixelLevel",
      karma: "hypixelKarma",
      achievementPoints: "hypixelAchievementPoints",
      bedwars4v4Kills: "bedwarsTwoFourKills",
      bedwars4v4Deaths: "bedwarsTwoFourDeaths",
      bedwars4v4KillDeathRatio: "bedwarsTwoFourKillDeathRatio",
      bedwars4v4FinalKills: "bedwarsTwoFourFinalKills",
      bedwars4v4FinalDeathss: "bedwarsTwoFourFinalDeathss",
      bedwars4v4FinalKillDeathRatio: "bedwarsTwoFourFinalKillDeathRatio",
      bedwars4v4Wins: "bedwarsTwoFourWins",
      bedwars4v4Losses: "bedwarsTwoFourLosses",
      bedwars4v4WLRatio: "bedwarsTwoFourWLRatio",
      bedwars4v4BedsBroken: "bedwarsTwoFourBedsBroken",
      bedwars4v4BedsLost: "bedwarsTwoFourBedsLost",
      bedwars4v4BedsBLRatio: "bedwarsTwoFourBedsBLRatio",
      bedwars4v4PlayedGames: "bedwarsTwoFourPlayedGames",
      bedwarsWLRatio: "bedwarsWinLossRatio",
      bedwarsBedsBLRatio: "bedwarsBedsBrokenLostRatio",
      bedwarsSoloFinalDeathss: "bedwarsSoloFinalDeaths",
      bedwarsSoloWLRatio: "bedwarsSoloWinLossRatio",
      bedwarsSoloBedsBLRatio: "bedwarsSoloBedsBrokenLostRatio",
      bedwarsDoublesFinalDeathss: "bedwarsDoublesFinalDeaths",
      bedwarsDoublesWLRatio: "bedwarsDoublesWinLossRatio",
      bedwarsDoublesBedsBLRatio: "bedwarsDoublesBedsBrokenLostRatio",
      bedwarsThreesFinalDeathss: "bedwarsThreesFinalDeaths",
      bedwarsThreesWLRatio: "bedwarsThreesWinLossRatio",
      bedwarsThreesBedsBLRatio: "bedwarsThreesBedsBrokenLostRatio",
      bedwarsFoursFinalDeathss: "bedwarsFoursFinalDeaths",
      bedwarsFoursWLRatio: "bedwarsFoursWinLossRatio",
      bedwarsFoursBedsBLRatio: "bedwarsFoursBedsBrokenLostRatio",
      bedwarsTwoFourFinalDeathss: "bedwarsTwoFourFinalDeaths",
      bedwarsTwoFourWLRatio: "bedwarsTwoFourWinLossRatio",
      bedwarsTwoFourBedsBLRatio: "bedwarsTwoFourBedsBrokenLostRatio",
      skywarsWLRatio: "skywarsWinLossRatio",
      duelsWLRatio: "duelsWinLossRatio"
    }
  };
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
    },
    9: {
      "verification.roles.custom": {
        key: "verification.roles.custom",
        change: ConfigChangeType.Transform,
        transform: (value) => {
          const replacementMap = this.playerVariableStatsKeyRenamingMap[1];
          if (!replacementMap) throw new Error("Could not find the player variable stats key renamming map");
          return this.remapVerificationRolesCustomKeys(value, replacementMap);
        }
      },
      "minecraft.guild.requirements.requirements": {
        key: "minecraft.guild.requirements.requirements",
        change: ConfigChangeType.Transform,
        transform: (rawValue) => {
          const replacementMap = this.playerVariableStatsKeyRenamingMap[1];
          if (!replacementMap) throw new Error("Could not find the player variable stats key renamming map");
          return this.remapMinecraftGuildRequirementsRequirements(rawValue, replacementMap);
        }
      }
    },
    10: {
      "verification.roles.custom": {
        key: "verification.roles.custom",
        change: ConfigChangeType.Transform,
        transform: (value) => {
          const replacementMap = this.playerVariableStatsKeyRenamingMap[2];
          if (!replacementMap) throw new Error("Could not find the player variable stats key renamming map");
          return this.remapVerificationRolesCustomKeys(value, replacementMap);
        }
      },
      "minecraft.guild.requirements.requirements": {
        key: "minecraft.guild.requirements.requirements",
        change: ConfigChangeType.Transform,
        transform: (rawValue) => {
          const replacementMap = this.playerVariableStatsKeyRenamingMap[2];
          if (!replacementMap) throw new Error("Could not find the player variable stats key renamming map");
          return this.remapMinecraftGuildRequirementsRequirements(rawValue, replacementMap);
        }
      }
    }
  };

  protected override onConfigValidated(config: Config): Config {
    MinecraftManager.validateMinecraftVersion(config.minecraft.bot.version);
    return config;
  }

  private remapVerificationRolesCustomKeys(rawValue: JsonValue, replacementMap: Record<string, string>): JsonValue {
    if (typeof rawValue !== "object" || rawValue === null || !Array.isArray(rawValue)) throw new Error("Verifcation roles custom must be an array.");
    const fixedValues: ConfigVerificationRolesCustom[] = [];
    rawValue.forEach((value, index) => {
      if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`Verifcation roles custom [${index}] must be an object.`);
      if (typeof value.enabled !== "boolean" || value.enabled === null) throw new Error(`Verifcation roles custom [${index}] enabled must be an boolean.`);
      if (typeof value.roleId !== "string" || value.roleId === null) throw new Error(`Verifcation roles custom [${index}] roleId must be an string.`);
      if (typeof value.requirements !== "object" || value.requirements === null || !Array.isArray(value.requirements)) {
        throw new Error(`Verifcation roles custom [${index}] Requirements must be an array.`);
      }
      const fixed: ConfigVerificationRolesCustom = { enabled: value.enabled, roleId: value.roleId, requirements: [] };
      value.requirements.forEach((requirement, requirementIndex) => {
        if (typeof requirement !== "object" || requirement === null || Array.isArray(requirement)) {
          throw new Error(`Verifcation roles custom [${index}] requirement [${requirementIndex}] must be an object.`);
        }
        if (typeof requirement.type !== "string" || requirement.type === null) {
          throw new Error(`Verifcation roles custom [${index}] requirement [${requirementIndex}] type must be an string.`);
        }
        if (typeof requirement.value !== "string" && typeof requirement.value !== "number") {
          throw new Error(`Verifcation roles custom [${index}] requirement [${requirementIndex}] type must be an string.`);
        }
        const normalizedType = replacementMap[requirement.type] ?? requirement.type;
        const migrationRequirement = { type: normalizedType as string, value: requirement.value } as ConfigVerificationRolesCustom["requirements"][number];
        fixed.requirements.push(migrationRequirement);
      });
      fixedValues.push(fixed);
    });
    return fixedValues;
  }

  private remapMinecraftGuildRequirementsRequirements(rawValue: JsonValue, replacementMap: Record<string, string>): JsonValue {
    if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) throw new Error("Guild requirements must be an object.");
    const newRequirements: Record<string, number> = {};
    Object.entries(rawValue).forEach(([key, value]) => {
      if (typeof value !== "number") throw new Error(`Guild requirement "${key}" must be a number.`);
      if (replacementMap[key]) newRequirements[replacementMap[key]] = value;
      else newRequirements[key] = value;
    });
    return newRequirements;
  }
}

export default ConfigManager;
