const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "guildtop",
  description: "Top 10 members with the most guild experience.",
  options: [
    {
      name: "time",
      description: "Days Ago",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const time = interaction.options.getString("time");

    const cachedMessages = [];
    const messages = new Promise((resolve, reject) => {
      const listener = (message) => {
        message = message.toString();
        cachedMessages.push(message);

        if (message.startsWith("10.") && message.endsWith("Guild Experience")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat(`/g top ${time || ""}`);

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("Command timed out. Please try again.");
      }, 5000);
    });

    const message = await messages;

    const trimmedMessages = message.map((message) => message.trim()).filter((message) => message.includes("."));
    const description = trimmedMessages
      .map((message) => {
        const message_parts = message.split(" ");

        let position = message_parts[0];
        let name = message_parts[1];
        let guildExperience = message_parts[2];

        if (message_parts.length == 6) {
          position = message_parts[0];
          name = message_parts[2];
          guildExperience = message_parts[3];
        }

        return `\`${position}\` **${name}** - \`${guildExperience}\` Guild Experience\n`;
      })
      .join("");

    const embed = new EmbedBuilder()
      .setColor("#2ECC71")
      .setTitle("Top 10 Guild Members")
      .setDescription(description)
      .setFooter({
        text: "/help [command] for more information",
        iconURL: config.minecraft.API.SCF.logo,
      });

    return await interaction.followUp({ embeds: [embed] });
  },
};
