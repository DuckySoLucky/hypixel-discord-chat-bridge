const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { readFileSync, writeFileSync } = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "force-update-everyone",
  description: "Update a user's roles",
  moderatorOnly: true,
  verificationCommand: true,
  requiresBot: true,

  execute: async (interaction, doNotRespond = false) => {
    try {
      const updateRolesCommand = require("./updateCommand.js");
      if (updateRolesCommand === undefined) {
        throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
      }

      const linkedData = readFileSync("data/linked.json");
      if (linkedData === undefined) {
        throw new HypixelDiscordChatBridgeError(
          "The linked data file does not exist. Please contact an administrator.",
        );
      }

      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      if (doNotRespond === false) {
        const embed = new EmbedBuilder()
          .setColor(3447003)
          .setTitle("Updating Users")
          .setDescription(`Progress: 0 / ${Object.keys(linked).length} (\`0%\`)`)
          .setFooter({
            text: `by @.kathund | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          });

        await interaction.editReply({ embeds: [embed], ephemeral: true });
      }

      const description = [];
      for (const id in linked) {
        const user = await guild.members.fetch(id).catch(() => {});
        if (user === undefined) {
          delete linked[id];
          continue;
        }

        await updateRolesCommand.execute(interaction, user.user, true).catch(() => {
          description.push(`- <@${id}>`);
        });

        const embed = new EmbedBuilder()
          .setColor(3447003)
          .setTitle("Updating Users")
          .setDescription(
            `Progress: ${Object.keys(linked).indexOf(id)} / ${Object.keys(linked).length} (\`${((Object.keys(linked).indexOf(id) / Object.keys(linked).length) * 100).toFixed(2)}%\`)`,
          )
          .setFooter({
            text: `by @.kathund | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          });

        if (doNotRespond === false) {
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      }

      writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));
      if (doNotRespond === false) {
        if (description.length > 0) {
          description.unshift(`\n__**Failed to update:**__`);
        }

        description.unshift(`Updated **${Object.keys(linked).length}** users.`);

        const embed = new EmbedBuilder()
          .setColor(3447003)
          .setTitle("Users Updated")
          .setDescription(description.join("\n"))
          .setFooter({
            text: `by @.kathund | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          });

        await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
