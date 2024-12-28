const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");
const { getCommands } = require("./infoCommand.js");

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

  execute: async (interaction) => {
    try {
      const commandName = interaction.options.getString("command") || undefined;
      const { discordCommands, minecraftCommands } = getCommands(interaction.client.commands);

      if (commandName === undefined) {
        const helpMenu = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("Hypixel Discord Chat Bridge Commands")
          .setDescription("`()` = **required** argument, `[]` = **optional** argument\n`u` = Minecraft Username")
          .addFields(
            {
              name: "**Minecraft**: ",
              value: `${minecraftCommands}`,
              inline: true,
            },
            {
              name: "**Discord**: ",
              value: `${discordCommands}`,
              inline: true,
            },
          )
          .setFooter({
            text: "by @duckysolucky | /help [command] for more information",
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await interaction.followUp({ embeds: [helpMenu] });
      } else {
        const minecraftCommand = fs
          .readdirSync("./src/minecraft/commands")
          .filter((file) => file.endsWith(".js"))
          .map((file) => new (require(`../../minecraft/commands/${file}`))())
          .find((command) => command.name === commandName || command.aliases.includes(commandName));

        const type = minecraftCommand ? "minecraft" : "discord";

        const command = interaction.client.commands.find((command) => command.name === commandName) ?? minecraftCommand;
        if (command === undefined) {
          throw new HypixelDiscordChatBridgeError(`Command ${commandName} not found.`);
        }

        const description = `${
          command.aliases
            ? `\nAliases: ${command.aliases
                .map((aliase) => {
                  return `\`${config.minecraft.bot.prefix}${aliase}\``;
                })
                .join(", ")}\n\n`
            : ""
        }${command.description}\n\n${
          command.options
            ?.map(({ name, required, description }) => {
              const optionString = required ? `(${name})` : `[${name}]`;
              return `\`${optionString}\`: ${description}\n`;
            })
            .join("") || ""
        }`;

        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(`**${type === "discord" ? "/" : config.minecraft.bot.prefix}${command.name}**`)
          .setDescription(description + "\n")
          .setFooter({
            text: "by @duckysolucky | () = required, [] = optional",
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
