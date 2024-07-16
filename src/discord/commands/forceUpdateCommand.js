const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
  name: "force-update",
  description: "Update a user's roles",
  moderatorOnly: true,
  verificationCommand: true,
  options: [
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.options.getUser("user");

    const updateRolesCommand = require("./updateCommand.js");
    if (!updateRolesCommand) {
      throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
    }
    await updateRolesCommand.execute(interaction, user);
  },
};
