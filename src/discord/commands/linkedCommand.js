const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const { getUUID, getUsername } = require("../../contracts/API/mowojangAPI.js");
const { MessageFlags } = require("discord.js");
const { readFileSync } = require("fs");

module.exports = {
  name: "linked",
  description: "View who a user is linked to",
  moderatorOnly: true,
  verificationCommand: true,
  options: [
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: false
    },
    {
      name: "username",
      description: "Minecraft Username",
      type: 3,
      required: false
    }
  ],

  execute: async (interaction) => {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (linkedData === undefined) {
        throw new HypixelDiscordChatBridgeError(
          "The linked data file does not exist. Please contact an administrator."
        );
      }

      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const user = interaction.options.getUser("user");
      const name = interaction.options.getString("username");
      if (!user && !name) {
        throw new HypixelDiscordChatBridgeError("Please provide a user or a name.");
      }

      if (user && !name) {
        const uuid = linked[user.id];
        if (uuid === undefined) {
          throw new HypixelDiscordChatBridgeError("This user is not linked.");
        }

        const username = await getUsername(uuid);
        const embed = new SuccessEmbed(`<@${user.id}> is linked to \`${username}\` (\`${uuid}\`).`, {
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });
        await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } else if (!user && name) {
        const uuid = await getUUID(name);
        if (uuid === undefined) {
          throw new HypixelDiscordChatBridgeError("This user does not exist.");
        }

        const discordID = Object.keys(linked).find((key) => linked[key] === uuid);
        if (discordID === undefined) {
          throw new HypixelDiscordChatBridgeError("This user is not linked.");
        }

        const embed = new SuccessEmbed(`\`${name}\` (\`${uuid}\`) is linked to <@${discordID}>.`, {
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

        await interaction.followUp({ embeds: [embed], flags:MessageFlags.Ephemeral});
      } else {
        throw new HypixelDiscordChatBridgeError("Please provide a user or a name, not both.");
      }
    } catch (error) {
      const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
