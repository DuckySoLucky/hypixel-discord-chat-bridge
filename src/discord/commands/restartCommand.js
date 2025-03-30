const app = require("./../../Application.js");
const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "restart",
  description: "Restarts the bot.",
  moderatorOnly: true,

  execute: async (interaction) => {
    const restartEmbed = new Embed().setTitle("Restarting...").setDescription("The bot is restarting. This might take few seconds.");

    interaction.followUp({ embeds: [restartEmbed] });

    await bot.end("restart");
    await client.destroy();

    app.register().then(() => {
      app.connect();
    });

    const successfulRestartEmbed = new Embed().setTitle("Success").setDescription("The bot has been restarted successfully.");

    interaction.followUp({ embeds: [successfulRestartEmbed] });
  }
};
