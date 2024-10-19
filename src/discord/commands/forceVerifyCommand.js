const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
  name: "force-verify",
  description: "Connect Discord account to a Minecraft",
  moderatorOnly: true,
  verificationCommand: true,
  requiresBot: true,
  options: [
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: true,
    },
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.options.getUser("user");
    const verifyCommand = require("./verifyCommand.js");
    if (verifyCommand === undefined) {
      throw new HypixelDiscordChatBridgeError("The verify command does not exist. Please contact an administrator.");
    }

    await verifyCommand.execute(interaction, user, true);
  },
};
