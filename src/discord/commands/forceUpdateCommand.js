const { SlashCommandBuilder } = require("discord.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const updateRolesCommand = require("./updateCommand.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("force-update")
    .setDescription("Update user's or everyone's roles")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username"))
    .addBooleanOption((option) => option.setName("everyone").setDescription("Update everyone's roles")),
  moderatorOnly: true,
  verificationCommand: true,
  requiresBot: true,

  execute: async (interaction, extra = { everyone: false, hidden: false }) => {
    const linkedData = fs.readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData.toString("utf8"));
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const user = interaction?.options?.getUser("user");
    const everyone = extra.everyone || interaction?.options?.getBoolean("everyone");
    if (!user && !everyone) {
      throw new HypixelDiscordChatBridgeError("You must specify a user or everyone.");
    }

    if (user && everyone) {
      throw new HypixelDiscordChatBridgeError("You cannot specify both user and everyone.");
    }

    if (user) {
      await updateRolesCommand.execute(interaction, { discordId: user.id, hidden: extra.hidden });
    }

    if (everyone) {
      const discordIds = Object.values(linked);
      for (const discordId of discordIds) {
        await updateRolesCommand.execute(interaction, { discordId, hidden: extra.hidden });
        console.log(`Updated roles for ${discordId}`);
      }
    }
  }
};
