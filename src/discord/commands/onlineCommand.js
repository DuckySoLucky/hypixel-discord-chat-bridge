const { EmbedBuilder } = require("discord.js");

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
      const trimmedMessages = messages.map(message => message.trim());
      
      const onlineMembersMessage = trimmedMessages.find(message =>
        message.startsWith("Online Members: ")
      );
      const onlineMembers = `${onlineMembersMessage.split(": ")[0]}: \`${onlineMembersMessage.split(": ")[1]}\``;
      
      const totalMembersMessage = trimmedMessages.find(message =>
        message.startsWith("Total Members: ")
      );
      const totalMembers = `${totalMembersMessage.split(": ")[0]}: \`${totalMembersMessage.split(": ")[1]}\``;
      
      const onlineMembersList = trimmedMessages;
      
      let description = `${totalMembers}\n${onlineMembers}\n\n`;
      
      let online = onlineMembersList.flatMap((item, index) => {
        if (item.includes("-- ")) {
          const nextLine = onlineMembersList[parseInt(index) + 1];
          if (nextLine?.includes("●")) {
            return [item, nextLine.split("●").map(item => item.trim())];
          }
        }
        return [];
      });
      
      online = online.filter(item => item);
      
      description += online.map(item => {
        if (item.length === 0) return;
        
        if (item.includes("--")) {
          item = item.replaceAll("--", "").trim();
          return `**${item}**\n`;
        } else {
          return `\`${item.filter(item => item !== "").join(", ")}\`\n`;
        }
      }).join(" ");
      
    
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
