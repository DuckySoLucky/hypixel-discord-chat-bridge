const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const config = require("./../../../config.json");
const { EmbedBuilder } = require("discord.js");
const app = require("./../../Application.js");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-restart",
  description: "Restarts the bot.",

  execute: async (interaction) => {
    const user = interaction.member;
    const executor_id = user.id;
    const permission_required = 'restart';

    let permission = false;

    const AuthData = new AuthProvider();
    permission = (await AuthData.permissionInfo(user)).permissions?.[permission_required] ?? false;

    if (!permission) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command, or the Permission API is Down.");
    }

    const restartEmbed = new EmbedBuilder()
      .setColor(15548997)
      .setTitle("Restarting...")
      .setDescription("The bot is restarting. This might take few seconds.")
      .setFooter({
        text: "/help [command] for more information",
        iconURL: config.minecraft.API.SCF.logo,
      });

    interaction.followUp({ embeds: [restartEmbed] });

    await bot.end("restart");
    await client.destroy();

    app.register().then(() => {
      app.connect();
    });

    const successfulRestartEmbed = new EmbedBuilder()
      .setColor(2067276)
      .setTitle("Restart Successful!")
      .setDescription("The bot has been restarted successfully.")
      .setFooter({
        text: "/help [command] for more information",
        iconURL: config.minecraft.API.SCF.logo,
      });

    interaction.followUp({ embeds: [successfulRestartEmbed] });
  },
};
