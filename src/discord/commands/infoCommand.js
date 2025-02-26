const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { replaceVariables } = require("../../contracts/helperFunctions.js");
const { Embed } = require("../../contracts/embedHandler.js");
const config = require("../../../config.json");
const fs = require("fs");

function formatOptions(name, required) {
  return replaceVariables(required ? ` ({${name}})` : ` [{${name}}]`, { username: "u" })
    .replaceAll("{", "")
    .replaceAll("}", "");
}

function getCommands(commands) {
  const discordCommands = commands
    .map(({ name, options }) => {
      const optionsString = options?.map(({ name, required }) => formatOptions(name, required)).join("");
      return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
    })
    .join("");

  const minecraftCommands = fs
    .readdirSync("./src/minecraft/commands")
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = new (require(`../../minecraft/commands/${file}`))();
      const optionsString = command.options?.map(({ name, required }) => formatOptions(name, required)).join("");

      return `- \`${command.name}${optionsString}\`\n`;
    })
    .join("");

  return { discordCommands, minecraftCommands };
}

module.exports = {
  name: "info",
  description: "Shows information about the bot.",
  requiresBot: true,
  getCommands,
  execute: async (interaction) => {
    try {
      if (bot === undefined || bot._client.chat === undefined) {
        throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
      }

      const { discordCommands, minecraftCommands } = getCommands(interaction.client.commands);

      const infoEmbed = new Embed().setTitle("Hypixel Bridge Bot Commands").addFields(
        {
          name: "**Minecraft Commands**: ",
          value: `${minecraftCommands}`,
          inline: true
        },
        {
          name: "**Discord Commands**: ",
          value: `${discordCommands}`,
          inline: true
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "**Minecraft Information**:",
          value: `Bot Username: \`${bot.username}\`\nPrefix: \`${config.minecraft.bot.prefix}\`\nSkyBlock Events: \`${
            config.minecraft.skyblockEventsNotifications.enabled ? "enabled" : "disabled"
          }\`\nAuto Accept: \`${config.minecraft.guildRequirements.autoAccept ? "enabled" : "disabled"}\`\nUptime: Online since <t:${Math.floor(
            (Date.now() - client.uptime) / 1000
          )}:R>\nVersion: \`${require("../../../package.json").version}\`\n`,
          inline: true
        },
        {
          name: `**Discord Information**`,
          value: `Guild Channel: ${config.discord.channels.guildChatChannel ? `<#${config.discord.channels.guildChatChannel}>` : "None"}\nOfficer Channel: ${
            config.discord.channels.officerChannel ? `<#${config.discord.channels.officerChannel}>` : "None"
          }\nGuild Logs Channel: ${config.discord.channels.loggingChannel ? `<#${config.discord.channels.loggingChannel}>` : "None"}\nDebugging Channel: ${
            config.discord.channels.debugChannel ? `<#${config.discord.channels.debugChannel}>` : "None"
          }\nCommand Role: <@&${config.discord.commands.commandRole}>\nMessage Mode: \`${
            config.discord.other.messageMode
          }\`\nFilter: \`${config.discord.other.filterMessages ? "enabled" : "disabled"}\`\nJoin Messages: \`${
            config.discord.other.joinMessage ? "enabled" : "disabled"
          }\``,
          inline: true
        }
      );
      await interaction.followUp({ embeds: [infoEmbed] });
    } catch (e) {
      console.error(e);
    }
  }
};
