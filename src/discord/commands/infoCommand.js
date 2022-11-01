const { toFixed } = require("../../contracts/helperFunctions.js");
const { version } = require("../../../package.json");
// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "info",
  description: "Shows information about the bot.",

  execute: async (interaction, client) => {
    let discordCommands = "",
      minecraftCommands = "";
    const discordCommandFiles = fs
      .readdirSync("src/discord/commands")
      .filter((file) => file.endsWith(".js"));
    for (const file of discordCommandFiles) {
      const command = require(`./${file}`);
      let discordOptions = "";
      if (!command.options) {
        discordCommands += `- \`${command.name}\`\n`;
        continue;
      }
      for (let i = 0; i < command.options.length; i++) {
        for (let j = 0; j < command.options.length; j++) {
          discordOptions += ` [${command.options[j].name}]`;
        }
        discordCommands += `- \`${command.name}${discordOptions}\`\n`;
        break;
      }
    }
    for (let i = 0; i < minecraftCommandList.length; i++) {
      if (minecraftCommandList[i].options.length < 1) {
        minecraftCommands += `- \`${minecraftCommandList[i].name}${
          minecraftCommandList[i].options != ""
            ? ` [${minecraftCommandList[i].options}]\`\n`
            : `\`\n`
        }`;
      } else {
        let options = "";
        for (let j = 0; j < minecraftCommandList[i].options.length; j++) {
          options += ` [${minecraftCommandList[i].options[j]}]`;
        }
        minecraftCommands += `- \`${minecraftCommandList[i].name}${options}\`\n`;
      }
    }

    const infoEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hypixel Bridge Bot Commands")
      .addFields(
        {
          name: "**Minecraft Commands**: ",
          value: `${minecraftCommands}`,
          inline: true,
        },
        {
          name: "**Discord Commands**: ",
          value: `${discordCommands}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "**Minecraft Information**:",
          value: `Bot: \`${bot.username}\`\nPrefix: \`${
            config.minecraft.prefix
          }\`\nUptime: Online since <t:${toFixed(
            uptime / 1000,
            0
          )}:R>\nVersion: \`${version}\``,
          inline: true,
        },
        {
          name: `**Discord Information**`,
          value: `Guild Channel: ${
            config.discord.guildChatChannel
              ? `<#${config.discord.guildChatChannel}>`
              : "None"
          }>\nOfficer Channel: ${
            config.discord.officerChannel
              ? `<#${config.discord.officerChannel}>`
              : "None"
          }>\nGuild Logs Channel: ${
            config.discord.loggingChannel
              ? `<#${config.discord.loggingChannel}>`
              : "None"
          }>\nDebugging Channel: ${
            config.console.debugChannel
              ? `<#${config.console.debugChannel}>`
              : "None"
          }\nCommand Role: <@&${config.discord.commandRole}>\nMessage Mode: \`${
            config.discord.messageMode
          }\`\nFilter: \`${config.discord.filterMessages}\`\nJoin Messages: \`${
            config.discord.joinMessage
          }\``,
          inline: true,
        }
      )
      .setFooter({
        text: "by DuckySoLucky#5181 | /help [command] for more information",
        iconURL: "https://imgur.com/tgwQJTX.png",
      });
    await interaction.followUp({ embeds: [infoEmbed] });
  },
};
