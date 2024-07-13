const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { ErrorEmbed } = require("../../contracts/embedHandler.js");
// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const config = require("../../../config.json");
const Logger = require("../.././Logger.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        const memberRoles = interaction.member.roles.cache.map((role) => role.id);
        await interaction.deferReply({ ephemeral: command.ephemeral || false }).catch(() => {});
        if (memberRoles.some((role) => config.discord.commands.blacklistRoles.includes(role))) {
          throw new HypixelDiscordChatBridgeError("You are blacklisted from the bot.");
        }

        if (command.moderatorOnly === true && isModerator(interaction) === false) {
          throw new HypixelDiscordChatBridgeError("You don't have permission to use this command.");
        }

        if (command.requiresBot === true && isBotOnline() === false) {
          throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
        }

        if (command.ticketCommand === true && config.tickets.enabled === false) {
          throw new HypixelDiscordChatBridgeError("Tickets are disabled.");
        }

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction);
      } else if (interaction.isButton()) {
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        if (interaction.customId === "ticket.open") {
          const openTicketCommand = interaction.client.commands.get("open-ticket");

          if (openTicketCommand === undefined) {
            throw new HypixelDiscordChatBridgeError(
              "Could not find open ticket command! Please contact an administrator.",
            );
          }

          await openTicketCommand.execute(interaction);
        } else if (interaction.customId === "ticket.close") {
          const closeTicketCommand = interaction.client.commands.get("close-ticket");

          if (closeTicketCommand === undefined) {
            throw new HypixelDiscordChatBridgeError(
              "Could not find close ticket command! Please contact an administrator.",
            );
          }

          await closeTicketCommand.execute(interaction);
        }
      }
    } catch (error) {
      console.log(error);

      const errrorMessage =
        error instanceof HypixelDiscordChatBridgeError
          ? ""
          : "Please try again later. The error has been sent to the Developers.\n\n";

      const errorEmbed = new ErrorEmbed(`${errrorMessage}\`\`\`${error}\`\`\``);

      await interaction.editReply({ embeds: [errorEmbed] });

      if (error instanceof HypixelDiscordChatBridgeError === false) {
        const username = interaction.user.username ?? interaction.user.tag ?? "Unknown";
        const commandOptions = JSON.stringify(interaction.options.data) ?? "Unknown";
        const commandName = interaction.commandName ?? "Unknown";
        const errorStack = error.stack ?? error ?? "Unknown";
        const userID = interaction.user.id ?? "Unknown";

        const errorLog = new ErrorEmbed(
          `Command: \`${commandName}\`\nOptions: \`${commandOptions}\`\nUser ID: \`${userID}\`\nUser: \`${username}\`\n\`\`\`${errorStack}\`\`\``,
        );
        interaction.client.channels.cache.get(config.discord.channels.loggingChannel).send({
          content: `<@&${config.discord.commands.commandRole}>`,
          embeds: [errorLog],
        });
      }
    }
  },
};

function isBotOnline() {
  if (bot === undefined || bot._client.chat === undefined) {
    return false;
  }

  return true;
}

function isModerator(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (
    config.discord.commands.checkPerms === true &&
    !(userRoles.includes(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
  ) {
    return false;
  }

  return true;
}
