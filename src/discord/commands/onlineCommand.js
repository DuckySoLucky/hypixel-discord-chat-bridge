const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "online",
  description: "List of online members.",

  execute: async (interaction) => {
    const cachedMessages = [];
    const messages = new Promise((resolve, reject) => {
      const listener = (message) => {
        message = message.toString();

        cachedMessages.push(message);
        if (message.startsWith("Offline Members")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat("/g online");

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("Command timed out. Please try again.");
      }, 5000);
    });

    const message = await messages;

    const onlineMembers = message.find((m) => m.startsWith("Online Members: "));
    const totalMembers = message.find((message) => message.startsWith("Total Members: "));

    const onlineMembersList = message;
    const online = onlineMembersList
      .flatMap((item, index) => {
        if (item.includes("-- ") === false) return;

        const nextLine = onlineMembersList[parseInt(index) + 1];
        if (nextLine.includes("●")) {
          const rank = item.replaceAll("--", "").trim();
          const players = nextLine
            .split("●")
            .map((item) => item.trim())
            .filter((item) => item);

          if (rank === undefined || players === undefined) return;

          return `**${rank}**\n${players.map((item) => `\`${item}\``).join(", ")}`;
        }
      })
      .filter((item) => item);

    const description = `${totalMembers}\n${onlineMembers}\n\n${online.join("\n")}`;
    const embed = new EmbedBuilder()
      .setColor("#2ECC71")
      .setTitle("Online Members")
      .setDescription(description)
      .setFooter({
        text: "/help [command] for more information",
        iconURL: config.minecraft.API.SCF.logo,
      });

    return await interaction.followUp({ embeds: [embed] });
  },
};
