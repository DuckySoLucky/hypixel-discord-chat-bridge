const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("./../../../config.json");
const { EmbedBuilder } = require("discord.js");
const app = require("./../../Application.js");

module.exports = {
  name: "restart",
  description: "Restarts the bot.",

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(config.discord.other.colors.fail)
          .setTitle("Restarting...")
          .setDescription("The bot is restarting. This might take few seconds.")
          .setFooter({
            text: `by @george_filos | /help [command] for more information`,
            iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
          }),
      ],
    });

    await bot.end("restart");
    await client.destroy();

    app.register().then(() => {
      app.connect();
    });

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(config.discord.other.colors.success)
          .setTitle("Restart Successful!")
          .setDescription("The bot has been restarted successfully.")
          .setFooter({
            text: `by @george_filos | /help [command] for more information`,
            iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
          }),
      ],
    });
  },
};
