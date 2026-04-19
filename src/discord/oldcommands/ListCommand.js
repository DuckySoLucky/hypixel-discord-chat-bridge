const { ApplicationFlagsBitField } = require('discord.js');
const DiscordCommand = require('../../contracts/DiscordCommand')
const { Embed } = require("../../contracts/embedHandler.js");

const executeCommand = async (bot) => {
  if (!bot || !bot._client.chat) {
    throw new HypixelDiscordChatBridgeError(
      "Bot doesn't seem to be connected to Hypixel. Please try again."
    );
  }

  const cachedMessages = [];
  const messages = new Promise((resolve, reject) => {
    const listener = (message) => {
      message = message.toString();
      cachedMessages.push(message);

      if (message.startsWith("Online Members")) {
        bot.removeListener("message", listener);
        resolve(cachedMessages);
      }
    };

    bot.on("message", listener);
    bot.chat("/g list");

    setTimeout(() => {
      bot.removeListener("message", listener);
      reject("Command timed out. Please try again.");
    }, 5000);
  });

  try {
    const message = await messages;
    const onlineMembers = message.find((m) => m.startsWith("Online Members: ")).replace("Online Members: ", "");
    const totalMembers = message.find((m) => m.startsWith("Total Members: ")).replace("Total Members: ", "");

    const onlineMembersList = message;
    const online = onlineMembersList
      .flatMap((item, index) => {
        if (!item.includes("-- ")) return;

        const nextLine = onlineMembersList[parseInt(index) + 1];
        if (nextLine.includes("●")) {
          const rank = item.replaceAll("--", "").trim();
          const players = nextLine
            .split("●")
            .map((item) => item.trim())
            .filter((item) => item);

          if (!rank || !players) return;

          return { rank, players };
        }
      })
      .filter((item) => item);

    // Return mapped data instead of sending it as a follow-up.
    return {
      totalMembers,
      onlineMembers,
      online,
    };
  } catch (error) {
    console.error("Error processing the command:", error);
    throw new Error(error);
  }
};
const sortOnline = (online) => {
  // Define the rank order for sorting
  const rankOrder = ["Guild Master", "Baka", "Master", "Expert", "Challenger", "Beginner"];

  // Sort the `online` array based on the rank order
  const sortedOnline = online
    .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)) // Sort by rank order
    .flatMap(({ rank, players }) => {
      if (!rank || !players || players.length === 0) return; // Skip invalid or empty entries

      // Format the rank and player list
      const formattedRank = `\n**${rank}**`;

      const formattedPlayers = players.map((player) => `✦ ${player.replace("[VIP]", "").replace("[VIP+]", "").replace("[MVP]", "").replace("[MVP+]", "").replace("[MVP++]", "").replace("[YOUTUBE]", "")}`).join(" ");

      return `${formattedRank}\n${formattedPlayers.replaceAll("_", "\\_")}`;
    })
    .filter(Boolean); // Remove undefined entries

  return sortedOnline;
};

class GuildList extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'list'
    this.description = 'Checks G list'
  }

  async onCommand(cat) {
    let skyData = await executeCommand(bot)
    const description = `**Total Members** ${skyData.totalMembers}\n**Online Members:** ${skyData.onlineMembers}\n${sortOnline(skyData.online).join("\n")}`;
    const embed = new Embed("#2ECC71", "Guild List", description);

    cat.channel.send({
      embeds: [embed],
    })
  }
}

module.exports = GuildList