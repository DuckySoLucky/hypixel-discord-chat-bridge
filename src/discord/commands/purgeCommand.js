const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");

module.exports = {
  name: "purge",
  description: "Purge x messages from a channel.",
  options: [
    {
      name: "amount",
      description: "The amount of messages to purge. (5 by default)",
      type: 4,
      required: false,
    },
  ],

  execute: async (interaction) => {
    if (config.discord.commands.checkPerms === true && interaction.member.roles.cache.has(config.discord.commands.commandRole) === false) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const amount = interaction.options.getInteger("amount") ?? 5;
    if (amount < 1 || amount > 100) {
      throw new HypixelDiscordChatBridgeError("You can only purge between 1 and 100 messages.");
    }

    await interaction.channel.bulkDelete(amount);
  },
};
