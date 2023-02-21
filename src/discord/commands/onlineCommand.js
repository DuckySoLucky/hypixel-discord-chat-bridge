const { EmbedBuilder } = require("discord.js");
const { replaceAllRanks } = require("../../contracts/helperFunctions");

module.exports = {
  name: "online",
  description: "List of online members.",

  execute: async (interaction, client) => {
    const cachedMessages = [];
    const promise = new Promise((resolve, reject) => {
      const listener = (message) => {
        cachedMessages.push(message.toString());

        if (message.toString().startsWith("Offline Members")) {
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

    try {
      const messages = await promise;
      messages.map((message) => message.trim());
      let onlineMembers = messages.find((message) =>
        message.startsWith("Online Members: ")
      );
      onlineMembers =
        onlineMembers.split(": ")[0] +
        ": " +
        `\`${onlineMembers.split(": ")[1]}\``;

      let offlineMembers = messages.find((message) =>
        message.startsWith("Offline Members: ")
      );
      offlineMembers =
        offlineMembers.split(": ")[0] +
        ": " +
        `\`${offlineMembers.split(": ")[1]}\``;

      let totalMembers = messages.find((message) =>
        message.startsWith("Total Members: ")
      );
      totalMembers =
        totalMembers.split(": ")[0] +
        ": " +
        `\`${totalMembers.split(": ")[1]}\``;

      const onlineMembersList = messages

      let description = `**ONLINE**\n${onlineMembers}\n${offlineMembers}\n${totalMembers}\n\n`;
      let online = [];
      for (const [index, item] of Object.entries(onlineMembersList)) {
        if (item.includes("-- ")) {
          const nextLine = onlineMembersList[parseInt(index) + 1];
          if (nextLine) {
            if (nextLine.includes("●")) {
              online = online.concat(
                nextLine.split("●").map((item) => item.trim())
              );
            }
          }
        }
      }

      online = online.filter((item) => item);

      description += online
        .map((item) => {
          return `\`${item}\``;
        })
        .join(", ");

      const embed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle("Online Members")
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
