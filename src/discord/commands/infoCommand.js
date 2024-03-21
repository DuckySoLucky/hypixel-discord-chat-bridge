const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "info",
  description: "Shows information about the bot.",
  requiresBot: true,

  execute: async (interaction) => {
    if (bot === undefined || bot._client.chat === undefined) {
      throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    }

    const commands = interaction.client.commands;

    const { discordCommands, minecraftCommands } = getCommands(commands);

    const chunkSize = 10; // Adjust this value based on your needs
    const discordChunks = [];
    const minecraftChunks = [];

    for (let i = 0; i < discordCommands.length; i += chunkSize) {
      discordChunks.push(discordCommands.slice(i, i + chunkSize));
    }

    for (let i = 0; i < minecraftCommands.length; i += chunkSize) {
      minecraftChunks.push(minecraftCommands.slice(i, i + chunkSize));
    }

    const infoEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hypixel Bridge Bot Commands");

    discordChunks.forEach((chunk, index) => {
      infoEmbed.addFields({
        name: `Discord Commands ${index + 1}`,
        value: chunk.join('\n'),
        inline: true,
      });
    });

    minecraftChunks.forEach((chunk, index) => {
      infoEmbed.addFields({
        name: `Minecraft Commands ${index + 1}`,
        value: chunk.join('\n'),
        inline: true,
      });
    });

    infoEmbed.addFields(
      { name: "\u200B", value: "\u200B" },
      {
        name: "**Minecraft Information**:",
        value: `Bot Username: \`${bot.username}\`\nPrefix: \`${config.minecraft.bot.prefix}\`\nSkyBlock Events: \`${
          config.minecraft.skyblockEventsNotifications.enabled ? "enabled" : "disabled"
        }\`\nAuto Accept: \`${
          config.minecraft.guildRequirements.autoAccept ? "enabled" : "disabled"
        }\`\nGuild Experience Requirement: \`${config.minecraft.guild.guildExp.toLocaleString()}\`\nUptime: Online since <t:${Math.floor(
          (Date.now() - client.uptime) / 1000
        )}:R>\nVersion: \`${require("../../../package.json").version}\`\n`,
        inline: true,
      },
      {
        name: `**Discord Information**`,
        value: `Guild Channel: ${
          config.discord.channels.guildChatChannel ? `<#${config.discord.channels.guildChatChannel}>` : "None"
        }\nOfficer Channel: ${
          config.discord.channels.officerChannel ? `<#${config.discord.channels.officerChannel}>` : "None"
        }\nGuild Logs Channel: ${
          config.discord.channels.loggingChannel ? `<#${config.discord.channels.loggingChannel}>` : "None"
        }\nDebugging Channel: ${
          config.discord.channels.debugChannel ? `<#${config.discord.channels.debugChannel}>` : "None"
        }\nCommand Role: <@&${config.discord.commands.commandRole}>\nMessage Mode: \`${
          config.discord.other.messageMode
        }\`\nFilter: \`${config.discord.other.filterMessages ? "enabled" : "disabled"}\`\nJoin Messages: \`${
          config.discord.other.joinMessage ? "enabled" : "disabled"
        }\``,
        inline: true,
      }
    )
    .setFooter({
      text: "/help [command] for more information",
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

    await interaction.followUp({ embeds: [infoEmbed] });
  },
};

function getCommands(commands) {
  const discordCommands = commands
    .map(({ name, options }) => {
      const optionsString = options?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`)).join("");
      return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
    });

  const minecraftCommands = fs
    .readdirSync("./src/minecraft/commands")
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = new (require(`../../minecraft/commands/${file}`))();
      const optionsString = command.options
        ?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`))
        .join("");

      return `- \`${command.name}${optionsString}\`\n`;
    });

  return { discordCommands, minecraftCommands };
}