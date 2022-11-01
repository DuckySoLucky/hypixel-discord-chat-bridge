// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "help",
  description: "Shows help menu.",
  options: [
    {
      name: "command",
      description: "Get information about a specific command",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, client) => {
    const commandName = interaction.options.getString("command");
    if (!commandName) {
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
      const helpMenu = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Hypixel Bridge Bot Commands")
        .setDescription("() = required argument, [] = optional argument")
        .addFields(
          {
            name: "**Minecraft**: ",
            value: `${minecraftCommands}`,
            inline: true,
          },
          { name: "**Discord**: ", value: `${discordCommands}`, inline: true }
        )
        .setFooter({
          text: "by DuckySoLucky#5181 | /help [command] for more information",
          iconURL: "https://imgur.com/tgwQJTX.png",
        });
      await interaction.followUp({ embeds: [helpMenu] });
    } else {
      let options = "",
        found = false;
      // Discord Commands
      const discordCommandFiles = fs
        .readdirSync("src/discord/commands")
        .filter((file) => file.endsWith(".js"));
      for (const file of discordCommandFiles) {
        const command = require(`./${file}`);
        if (command.name === commandName) {
          const description = command.description;
          found = true;
          if (!command.options) {
            const commandData = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle(`**${config.minecraft.prefix}${command.name}**`)
              .setDescription(description + "\n")
              .setFooter({
                text: "by DuckySoLucky#5181 | () = required, [] = optional",
                iconURL: "https://imgur.com/tgwQJTX.png",
              });
            await interaction.followUp({ embeds: [commandData] });
            break;
          }
          for (let i = 0; i < command.options.length; i++) {
            for (let j = 0; j < command.options.length; j++) {
              options += `${
                command.options[j].name != ""
                  ? `\`[${command.options[j].name}]\`:`
                  : ``
              }${
                command.options[j].description != ""
                  ? ` ${command.options[j].description}\n`
                  : ``
              }`;
            }

            const commandData = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle(`**${config.minecraft.prefix}${command.name}**`)
              .setDescription(description + "\n")
              .addFields({
                name: "**Options** ",
                value: `${options}`,
                inline: true,
              })
              .setFooter({
                text: "by DuckySoLucky#5181 | () = required, [] = optional",
                iconURL: "https://imgur.com/tgwQJTX.png",
              });
            await interaction.followUp({ embeds: [commandData] });
            break;
          }
        }
      }
      if (found) return;
      // Minecraft Commands
      for (let i = 0; i < minecraftCommandList.length; i++) {
        if (minecraftCommandList[i].name === commandName) {
          const description = minecraftCommandList[i].description;
          found = true;
          if (
            minecraftCommandList[i].options.length == 0 ||
            minecraftCommandList[i].options == []
          ) {
            const commandData = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle(
                `**${config.minecraft.prefix}${minecraftCommandList[i].name}**`
              )
              .setDescription(description + "\n")
              .setFooter({
                text: "by DuckySoLucky#5181 | () = required, [] = optional",
                iconURL: "https://imgur.com/tgwQJTX.png",
              });
            await interaction.followUp({ embeds: [commandData] });
            break;
          } else {
            for (let j = 0; j < minecraftCommandList[i].options.length; j++) {
              options += `${
                minecraftCommandList[i].options[j] != ""
                  ? `\`[${minecraftCommandList[i].options[j]}]\`:`
                  : ``
              }${
                minecraftCommandList[i].optionsDescription[j] != ""
                  ? ` ${minecraftCommandList[i].optionsDescription[j]}\n`
                  : ``
              }`;
            }
          }
          const commandData = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(
              `**${config.minecraft.prefix}${minecraftCommandList[i].name}**`
            )
            .setDescription(minecraftCommandList[i].description + "\n")
            .addFields({
              name: "**Options** ",
              value: `${options}`,
              inline: true,
            })
            .setFooter({
              text: "by DuckySoLucky#5181 | () = required, [] = optional",
              iconURL: "https://imgur.com/tgwQJTX.png",
            });
          await interaction.followUp({ embeds: [commandData] });
          break;
        }
      }
      if (found) return;
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(`Command \`${commandName}\` was not found`)
        .setFooter({
          text: "by DuckySoLucky#5181",
          iconURL: "https://imgur.com/tgwQJTX.png",
        });
      await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
