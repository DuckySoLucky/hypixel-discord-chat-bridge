const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
  name: "force-unverify",
  description: "Unverify a user",
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

    const unverifyCommand = require("./unverifyCommand.js");
    if (!unverifyCommand) {
      throw new HypixelDiscordChatBridgeError("The unverify command does not exist. Please contact an administrator.");
    }
    await unverifyCommand.execute(interaction, user);
  },
};
