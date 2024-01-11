const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
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

  execute: async (interaction) => {
    const commandName = interaction.options.getString("command") || undefined;

    if (commandName === undefined) {
      const discordCommands = interaction.client.commands
        .map(({ name, options }) => {
          const optionsString = options?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`)).join("");
          return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
        })
        .join("");

      const minecraftCommands = fs
        .readdirSync("./src/minecraft/commands")
        .filter((file) => file.endsWith(".js"))
        .map((file) => {
          const command = new (require(`../../minecraft/commands/${file}`))();
          const optionsString = command.options
            ?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`))
            .join("");

          return `- \`${command.name}${optionsString}\`\n`;
        })
        .join("");

      const helpMenu = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Hypixel Discord Chat Bridge Commands")
        .setDescription("() = required argument, [] = optional argument")
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
          }
        )
        .setFooter({
          text: "/help [command] for more information",
          iconURL: config.minecraft.API.SCF.logo,
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

      const description = `${command.description}\n\n${
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
          text: "() = required, [] = optional",
          iconURL: config.minecraft.API.SCF.logo,
        });

      await interaction.followUp({ embeds: [embed] });
    }
  },
};
