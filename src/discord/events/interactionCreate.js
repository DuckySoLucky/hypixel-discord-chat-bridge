const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { ErrorEmbed } = require("../../contracts/embedHandler.js");
const { readFileSync, writeFileSync } = require("fs");
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
        const memberRoles = interaction.member.roles.cache.map((role) => role.id);
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        if (memberRoles.some((role) => config.discord.commands.blacklistRoles.includes(role))) {
          throw new HypixelDiscordChatBridgeError("You are blacklisted from the bot.");
        }

        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }
        
        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);

        if (command.verificationCommand === true && config.verification.enabled === false) {
          throw new HypixelDiscordChatBridgeError("Verification is disabled.");
        }
        
        if (command.giveawayCommand === true && config.giveaway.enabled === false) {
          throw new HypixelDiscordChatBridgeError("Giveaways are disabled.");
        }

        if (command.moderatorOnly === true && isModerator(interaction) === false) {
          throw new HypixelDiscordChatBridgeError("You don't have permission to use this command.");
        }

        if (command.requiresBot === true && isBotOnline() === false) {
          throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
        }

        await command.execute(interaction);
      } else if (interaction.isButton()) {
        await interaction.deferReply({ ephemeral: true });
        if (interaction.customId.startsWith("g.e.")) {
          const giveawayData = JSON.parse(readFileSync("data/giveaways.json", "utf-8"));
          const giveaway = giveawayData.find((x) => x.id === interaction.customId.split("g.e.")[1]);
          if (!giveaway) {
            return await interaction.followUp({ content: "This giveaway does not exist." });
          }
          if (giveaway.host === interaction.user.id) {
            return await interaction.followUp({ content: "You cannot enter your own giveaway." });
          }
          const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
          if (userIndex !== -1) {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Leave Giveaway")
                .setCustomId(`g.l.${giveaway.id}`)
                .setStyle(ButtonStyle.Danger),
            );

            return await interaction.followUp({
              content: "You have already entered the giveaway.",
              components: [row],
              ephemeral: true,
            });
          }

          giveaway.users.push({ id: interaction.user.id, winner: false, claimed: false });

          const giveawayEmbed = new EmbedBuilder()
            .setColor(3447003)
            .setTitle("Giveaway")
            .addFields(
              {
                name: "Prize",
                value: `${giveaway.prize}`,
                inline: true,
              },
              {
                name: "Host",
                value: `<@${giveaway.host}>`,
                inline: true,
              },
              {
                name: "Entries",
                value: `${giveaway.users.length}`,
                inline: true,
              },
              {
                name: "Winners",
                value: `${giveaway.winners}`,
              },
              {
                name: "Ends At",
                value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
              },
            )
            .setFooter({
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            });

          if (giveaway.requiredRoles.length > 0) {
            const memberRoles = interaction.member.roles.cache.map((role) => role.id);
            giveawayEmbed.addFields({
              name: "Required Roles (any)",
              value: giveaway.requiredRoles.map((role) => `<@&${role}>`).join(", "),
            });

            if (!giveaway.requiredRoles.some((role) => memberRoles.includes(role))) {
              return await interaction.followUp({
                content: "You don't have the required roles to enter this giveaway.",
              });
            }
          }

          const message = await interaction.guild.channels.cache.get(giveaway.channel).messages.fetch(giveaway.id);
          await message.edit({ embeds: [giveawayEmbed] });
          writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
          return await interaction.editReply({ content: "You have successfully entered the giveaway." });
        } else if (interaction.customId.startsWith("g.l.")) {
          const giveawayData = JSON.parse(readFileSync("data/giveaways.json", "utf-8"));
          const giveawayId = interaction.customId.split("g.l.")[1];
          const giveaway = giveawayData.find((x) => x.id === giveawayId);
          if (!giveaway) {
            return await interaction.editReply({ content: "This giveaway does not exist." });
          }

          const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
          if (userIndex === -1) {
            return await interaction.editReply({ content: "You are not in the giveaway." });
          }

          giveaway.users.splice(userIndex, 1);
          const giveawayEmbed = new EmbedBuilder()
            .setColor(3447003)
            .setTitle("Giveaway")
            .addFields(
              {
                name: "Prize",
                value: `${giveaway.prize}`,
                inline: true,
              },
              {
                name: "Host",
                value: `<@${giveaway.host}>`,
                inline: true,
              },
              {
                name: "Entries",
                value: `${giveaway.users.length}`,
                inline: true,
              },
              {
                name: "Winners",
                value: `${giveaway.winners}`,
              },
              {
                name: "Ends At",
                value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
              },
            )
            .setFooter({
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            });

          if (giveaway.requiredRoles.length > 0) {
            giveawayEmbed.addFields({
              name: "Required Roles (any)",
              value: giveaway.requiredRoles.map((role) => `<@&${role}>`).join(", "),
            });
          }
          const message = await interaction.guild.channels.cache.get(giveaway.channel).messages.fetch(giveaway.id);
          await message.edit({ embeds: [giveawayEmbed] });
          writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
          return await interaction.editReply({ content: "You have successfully left the giveaway." });
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
