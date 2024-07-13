const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ChannelType, ButtonStyle } = require("discord.js");
const { Embed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const { writeFileSync, readFileSync } = require("fs");
const config = require("../../../config.json");

const permissions = [
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.UseExternalEmojis,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.EmbedLinks,
];

module.exports = {
  name: "open-ticket",
  description: "Open a support ticket.",
  ticketCommand: true,
  ephemeral: true,
  options: [
    {
      name: "reason",
      description: "The reason for opening a ticket",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const reason = interaction.options?.getString("reason") ?? "No Reason Provided";

    if (config.tickets.ticketsPerUserLimit !== -1) {
      const ticketsData = JSON.parse(readFileSync("data/tickets.json"));
      const openTickets = ticketsData.filter((ticket) => ticket.owner === interaction.user.id);
      if (openTickets.length >= config.tickets.ticketsPerUserLimit) {
        return await interaction.followUp({
          content: `You have reached the maximum number of open tickets (${config.tickets.ticketsPerUserLimit}).\nPlease close one of your open tickets before opening a new one.`,
          ephemeral: true,
        });
      }
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.member.displayName ?? interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: config.tickets.category,
      permissionOverwrites: [
        { id: interaction.user.id, allow: permissions },
        { id: interaction.client.user.id, allow: permissions },
        { id: interaction.guild.roles.everyone.id, deny: permissions },
        { id: config.discord.commands.commandRole, deny: permissions },
      ],
    });

    const ticketEmbed = new Embed(
      2067276,
      "Ticket Opened",
      `Ticket opened by <@${interaction.user.id}>\n\nReason: ${reason}`,
      {
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      },
    );

    await channel
      .send({
        content: `<@${interaction.user.id}> | ${reason}`,
        embeds: [ticketEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Close Ticket").setCustomId("ticket.close").setStyle(ButtonStyle.Danger),
          ),
        ],
      })
      .then((m) => {
        setTimeout(() => {
          m.pin();
        }, 500);
      });

    channel.send({ content: `<@&${config.discord.commands.commandRole}>` }).then((m) => {
      setTimeout(() => {
        m.delete();
      }, 500);
    });

    const ticketOpenEmbed = new SuccessEmbed(`Ticket opened in <#${channel.id}>`, {
      text: `by @kathund. | /help [command] for more information`,
      iconURL: "https://i.imgur.com/uUuZx2E.png",
    });

    ticketsData.push({ owner: interaction.user.id, channel: channel.id });
    writeFileSync("data/tickets.json", JSON.stringify(ticketsData));
    await interaction.followUp({ embeds: [ticketOpenEmbed], ephemeral: true });
  },
};
