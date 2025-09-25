const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { writeFileSync, readFileSync } = require("fs");

module.exports = {
  name: "unverify",
  description: "Remove your linked Minecraft account",
  requiresBot: true,
  verificationCommand: true,

  execute: async (interaction) => {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
      }

      const linked = JSON.parse(linkedData.toString("utf8"));
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const uuid = Object.entries(linked).find(([, value]) => value === interaction.user.id)?.[0];
      if (!uuid) {
        throw new HypixelDiscordChatBridgeError(`You are not verified. Please run /verify to continue.`);
      }

      delete linked[uuid];
      writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));

      const updateRole = new SuccessEmbed(`You have successfully unlinked \`${await getUsername(uuid)}\`. Run \`/verify\` to link a new account.`, {
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });
      await interaction.followUp({ embeds: [updateRole] });
      const updateRolesCommand = require("./updateCommand.js");
      if (updateRolesCommand === undefined) {
        throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
      }

      await updateRolesCommand.execute(interaction, undefined, true);
    } catch (error) {
      const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
