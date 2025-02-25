const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "blacklist",
  description: "Ignore add or remove the given user.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "arg",
      description: "Add or Remove",
      type: 3,
      required: true,
      choices: [
        {
          name: "Add",
          value: "add"
        },
        {
          name: "Remove",
          value: "remove"
        }
      ]
    },
    {
      name: "username",
      description: "Minecraft Username",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction) => {
    const name = interaction.options.getString("username");
    const arg = interaction.options.getString("arg").toLowerCase();

    bot.chat("/lobby megawalls");
    await delay(250);
    if (arg == "add") {
      bot.chat(`/ignore add ${name}`);
    } else if (arg == "remove") {
      bot.chat(`/ignore remove ${name}`);
    } else {
      throw new HypixelDiscordChatBridgeError("Invalid Usage: `/ignore [add/remove] [name]`.");
    }
    await delay(250);
    bot.chat("/limbo");

    const embed = new SuccessEmbed(`Successfully ${arg == "add" ? "added" : "removed"} \`${name}\` ${arg == "add" ? "to" : "from"} the blacklist.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
