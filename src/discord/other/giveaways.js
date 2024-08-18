const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const cron = require("node-cron");

async function checkGiveaways() {
  try {
    const giveaways = JSON.parse(readFileSync("data/giveaways.json", "utf8"));
    if (giveaways === undefined) return;
    if (giveaways.length === 0) return;
    giveaways.forEach(async (giveaway) => {
      if (giveaway.ended) return;
      if (giveaway.endTimestamp >= Math.floor(Date.now() / 1000)) return;
      const winners = [];
      for (let i = 0; i < giveaway.winners; i++) {
        const users = giveaway.users.filter((x) => x.winner === false);
        if (users.length === 0) break;
        const winner = users[Math.floor(Math.random() * users.length)];
        winners.push(`<@${winner.id}>`);
        giveaway.users.find((x) => x.id === winner.id).winner = true;
      }
      const channel = await guild.channels.fetch(giveaway.channel);
      const message = await channel.messages.fetch(giveaway.id);
      message.reply({ content: `Congratulations to ${winners.join(", ")} for winning the giveaway!` });
      const giveawayEmbed = new EmbedBuilder()
        .setColor(3447003)
        .setTitle("Giveaway")
        .addFields(
          {
            name: "Prize",
            value: `${giveaway.prize}`,
            inline: true,
          },
          {
            name: "Host",
            value: `<@${giveaway.host}>`,
            inline: true,
          },
          {
            name: "Entries",
            value: `${giveaway.users.length}`,
            inline: true,
          },
          {
            name: "Winners",
            value: `${giveaway.winners}`,
          },
          {
            name: "Ends At",
            value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
          },
        )
        .setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });
      if (giveaway.requiredRole !== null) {
        giveawayEmbed.addFields({ name: "Required Role", value: `<@&${giveaway.requiredRole}>` });
      }

      if (giveaway.bypassRole !== null) {
        giveawayEmbed.addFields({ name: "Bypass Role", value: `<@&${giveaway.bypassRole}>` });
      }

      if (giveaway.bannedRole !== null) {
        giveawayEmbed.addFields({ name: "Banned Role", value: `<@&${giveaway.bannedRole}>` });
      }

      giveaway.ended = true;

      writeFileSync("data/giveaways.json", JSON.stringify(giveaways, null, 2));

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Enter Giveaway")
          .setCustomId(`g.e.${giveaway.id}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
      );
      message.edit({ embeds: [giveawayEmbed], components: [row] });
    });
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("* * * * *", checkGiveaways);
