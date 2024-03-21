const app = require("./../../Application.js");
const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "restart",
  description: "Restarts the bot.",
  moderatorOnly: true,

  execute: async (interaction) => {
    const restartEmbed = new Embed(15548997, "Restarting...", "The bot is restarting. This might take few seconds.", {
      text: `/help [command] for more information`,
      iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
    });

    interaction.followUp({ embeds: [restartEmbed] });

    await bot.end("restart");
    await client.destroy();

    app.register().then(() => {
      app.connect();
    });

    const successfulRestartEmbed = new Embed(2067276, "Success!", "The bot has been restarted successfully.", {
      text: `/help [command] for more information`,
      iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
    });

    interaction.followUp({ embeds: [successfulRestartEmbed] });
  },
};
