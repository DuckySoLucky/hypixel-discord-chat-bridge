const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { getTimestamp } = require("../../contracts/helperFunctions.js");
const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const { ErrorEmbed } = require("../../contracts/embedHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "force-update-everyone",
  description: "Update a user's roles",
  moderatorOnly: true,
  verificationCommand: true,

  execute: async (interaction, auto = false) => {
    const updateRolesCommand = require("./updateCommand.js");
    if (!updateRolesCommand) {
      throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
    }

    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    if (auto === false) await interaction.followUp({ content: `Updating ${linked.length} users...` });
    const startTimestamp = Date.now();
    let string = "Format: [Discord ID] | [UUID] | [Message]\n";
    const remove = [];

    for (const linkedUser of linked) {
      const user = await guild.members.fetch(linkedUser.id).catch(() => {});
      if (user === undefined) {
        if (config.verification.autoUnverify) remove.push(linkedUser);
        string += `${linkedUser.id} | ${linkedUser.uuid} | not in the discord removing verification\n`;
        const failedEmbed = new ErrorEmbed(`<@${linkedUser.id}> not found in the discord. Removing verification.`);
        if (auto === false) await interaction.followUp({ embeds: [failedEmbed], ephemeral: true });
        continue;
      }
      await updateRolesCommand.execute(interaction, user.user, auto ? null : true);
      string += `${linkedUser.id} | ${linkedUser.uuid} | updated\n`;
      await delay(1000);
    }

    const endTimestamp = Date.now();
    string = `Start: ${getTimestamp(startTimestamp)} (${startTimestamp})\nEnd: ${getTimestamp(endTimestamp)} (${endTimestamp})\nTaken: ${Math.floor((endTimestamp - startTimestamp) / 1000)}s\n\nUsers: ${linked.length} | Updated: ${linked.length - remove.length} | Removed: ${remove.length}\n${string}`;
    const logEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Users Updated")
      .setDescription(
        `Users: ${linked.length}\nUsers updated: ${linked.length - remove.length}\nUsers removed: ${
          remove.length
        }\nStart: <t:${Math.floor(startTimestamp / 1000)}> (<t:${Math.floor(
          startTimestamp / 1000,
        )}:R>)\nEnd: <t:${Math.floor(endTimestamp / 1000)}> (<t:${Math.floor(endTimestamp / 1000)}:R>)`,
      )
      .setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });

    remove.forEach((user) => {
      const index = linked.indexOf(user);
      if (index > -1) {
        linked.splice(index, 1);
      }
    });

    writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));
    writeFileSync("data/updateUsersLog.txt", string);

    const updateLogs = await guild.channels.cache.get(config.verification.updateLogs);

    if (updateLogs) {
      await updateLogs.send({
        embeds: [logEmbed],
        files: ["data/updateUsersLog.txt"],
      });
    } else {
      if (auto === false) {
        await interaction.followUp({ content: "Ticket Logs Channel not found. Not sending log", ephemeral: true });
      }
    }
    unlinkSync("data/updateUsersLog.txt");
    if (auto === false) await interaction.followUp({ content: "Update complete." });
  },
};
