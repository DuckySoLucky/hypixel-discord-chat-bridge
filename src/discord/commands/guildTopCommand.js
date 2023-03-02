const { EmbedBuilder } = require("discord.js");

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

  execute: async (interaction, client) => {
    const time = interaction.options.getString("time");

    const cachedMessages = [];
    const promise = new Promise((resolve, reject) => {
      const listener = (message) => {
        cachedMessages.push(message.toString());
        console.log(message.toString());

        if (
          message.toString().startsWith("10.") &&
          message.toString().endsWith("Guild Experience")
        ) {
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

    try {
      const messages = await promise;
      const trimmedMessages = messages
        .map((message) => message.trim())
        .filter((message) => message.includes("Guild Experience"));

      const description = trimmedMessages.map(
        (message) => {
          if (trimmedMessages.indexOf(message) === 0) return;

          const [position, , name, guildExperience] = message.split(" ");
          return `\`${position}\` **${name}** - \`${guildExperience}\` Guild Experience\n`
        }
      ).join("");

      const embed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle("Top 10 Guild Members")
        .setDescription(description)
        .setFooter({
          text: "by DuckySoLucky#5181 | /help [command] for more information",
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      return await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      const errorEmbed = new EmbedBuilder()
        .setColor("#E74C3C")
        .setTitle("Error")
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: "by DuckySoLucky#5181 | /help [command] for more information",
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      return await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
