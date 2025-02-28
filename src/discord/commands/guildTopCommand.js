const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { Embed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "guildtop",
  description: "Top 10 members with the most guild experience.",
  requiresBot: true,
  options: [
    {
      name: "time",
      description: "Days Ago",
      type: 3,
      required: false
    }
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
        resolve(cachedMessages);
      }, 1000);
    });

    const message = await messages;
    if (message.length === 0) {
      throw new HypixelDiscordChatBridgeError("Could not retrieve the top 10 guild members.");
    }

    const trimmedMessages = message.map((message) => message.trim()).filter((message) => message.includes("."));
    const description = trimmedMessages
      .map((message) => {
        const [position, mightBeName, tempName, tempGuildExperience] = message.split(" ");
        const isExperience = !isNaN(parseInt(tempGuildExperience.replaceAll("`", "")));
        const name = isExperience ? tempName : mightBeName;
        const guildExperience = isExperience ? tempGuildExperience : tempName;

        return `\`${position}\` **${name}** - \`${guildExperience}\` Guild Experience\n`;
      })
      .join("");

    const embed = new Embed().setAuthor({ name: "Top 10 Guild Members" }).setDescription(description);

    return await interaction.followUp({ embeds: [embed] });
  }
};
