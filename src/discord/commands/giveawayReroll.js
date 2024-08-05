const { readFileSync, writeFileSync } = require("fs");

module.exports = {
  name: "giveaway-reroll",
  description: "Create a giveaway",
  moderatorOnly: true,
  giveawayCommand: true,
  options: [
    {
      name: "id",
      description: "Giveaway id (Message id)",
      type: 3,
      required: true,
    },
    {
      name: "amount",
      description: "Amount of winners to reroll",
      type: 4,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const giveawayData = JSON.parse(readFileSync("data/giveaways.json", "utf-8"));
    const id = interaction.options.getString("id");
    const giveaway = giveawayData.find((x) => x.id === id);
    if (!giveaway) {
      return interaction.followUp({ content: "Giveaway not found!" });
    }
    if (!giveaway.ended) {
      return interaction.followUp({ content: "Giveaway has not ended!" });
    }

    const winners = interaction.options.getInteger("winners") || giveaway.winners;
    if (winners > giveaway.winners) {
      return interaction.followUp({
        content: "Amount of winners to reroll is higher than the original amount of winners!",
      });
    }
    const channel = await interaction.guild.channels.fetch(giveaway.channel);
    const message = await channel.messages.fetch(giveaway.id);
    const newWinners = [];
    const users = giveaway.users.filter((x) => x.winner === false);
    if (users.length === 0) {
      return interaction.followUp({ content: "No users to reroll!" });
    }
    for (let i = 0; i < winners; i++) {
      if (users.length === 0) break;
      const winner = users[Math.floor(Math.random() * users.length)];
      newWinners.push(`<@${winner.id}>`);
      giveaway.users.find((x) => x.id === winner.id).winner = true;
    }
    message.reply({ content: `Congratulations to ${newWinners.join(", ")} for winning the giveaway!` });
    writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
    await interaction.followUp({ content: "Giveaway rerolled!" });
  },
};
