const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { Embed } = require("../../contracts/embedHandler.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guildtop")
    .setDescription("Top 10 members with the most guild experience.")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Days ago")
        .addChoices(
          ...Array.from({ length: 14 }, (_, index) => ({
            name: `${index + 1} Day ago`,
            value: (index + 1).toString()
          }))
        )
    ),
  requiresBot: true,

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
