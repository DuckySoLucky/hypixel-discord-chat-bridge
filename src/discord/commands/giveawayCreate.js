const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const ms = require("ms");

module.exports = {
  name: "giveaway-create",
  description: "Create a giveaway",
  moderatorOnly: true,
  giveawayCommand: true,
  options: [
    {
      name: "prize",
      description: "Giveaway Prize",
      type: 3,
      required: true,
    },
    {
      name: "winners",
      description: "Number of winners",
      type: 4,
      required: true,
    },
    {
      name: "duration",
      description: "Duration of the giveaway",
      type: 3,
      required: true,
    },
    {
      name: "host",
      description: "Host of the giveaway",
      type: 6,
      required: false,
    },
    {
      name: "channel",
      description: "Channel to create the giveaway in",
      type: 7,
      required: false,
      channel_types: [0],
    },
    {
      name: "required-role",
      description: "Whether the user should have a specific role to enter",
      type: 8,
      required: false,
    },
    {
      name: "bypass-role",
      description: "Role that will bypass all requirements",
      type: 8,
      required: false,
    },
    {
      name: "banned-role",
      description: "Role that is blocked from entering",
      type: 8,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const prize = interaction.options.getString("prize");
    const winners = interaction.options.getInteger("winners");
    const duration = interaction.options.getString("duration");
    const host = interaction.options.getUser("host") || interaction.user;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const requiredRole = interaction.options.getRole("required-role") || null;
    const bypassRole = interaction.options.getRole("bypass-role") || null;
    const bannedRole = interaction.options.getRole("banned-role") || null;

    const endTimestamp = Math.floor((Date.now() + ms(duration)) / 1000);
    const giveawayEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Giveaway")
      .addFields(
        {
          name: "Prize",
          value: `${prize}`,
          inline: true,
        },
        {
          name: "Host",
          value: `<@${host.id}>`,
          inline: true,
        },
        {
          name: "Entries",
          value: "0",
          inline: true,
        },
        {
          name: "Winners",
          value: `${winners}`,
        },
        {
          name: "Ends At",
          value: `<t:${endTimestamp}:f> (<t:${endTimestamp}:R>)`,
        },
      )
      .setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });

    if (requiredRole !== null) giveawayEmbed.addFields({ name: "Required Role", value: `<@&${requiredRole.id}>` });
    if (bypassRole !== null) giveawayEmbed.addFields({ name: "Bypass Role", value: `<@&${bypassRole.id}>` });
    if (bannedRole !== null) giveawayEmbed.addFields({ name: "Banned Role", value: `<@&${bannedRole.id}>` });

    const giveawayData = JSON.parse(readFileSync("data/giveaways.json", "utf-8"));
    const giveaway = await channel.send({ embeds: [giveawayEmbed] });
    giveawayData.push({
      host: host.id,
      winners,
      prize,
      endTimestamp,
      channel: giveaway.channel.id,
      id: giveaway.id,
      users: [],
      ended: false,
      requiredRole: requiredRole !== null ? requiredRole.id : null,
      bypassRole: bypassRole !== null ? bypassRole.id : null,
      bannedRole: bannedRole !== null ? bannedRole.id : null,
    });

    writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Enter Giveaway").setCustomId(`g.e.${giveaway.id}`).setStyle(ButtonStyle.Success),
    );
    await giveaway.edit({ embeds: [giveawayEmbed], components: [row] });

    await interaction.followUp({ content: `Giveaway created! [View here](${giveaway.url})` });
  },
};
