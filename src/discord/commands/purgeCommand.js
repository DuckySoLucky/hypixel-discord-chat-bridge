const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
  name: "purge",
  description: "Purge x messages from a channel.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "amount",
      description: "The amount of messages to purge. (5 by default)",
      type: 4,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const amount = interaction.options.getInteger("amount") ?? 5;
    if (amount < 1 || amount > 100) {
      throw new HypixelDiscordChatBridgeError("You can only purge between 1 and 100 messages.");
    }

    await interaction.channel.bulkDelete(amount);
  },
};
