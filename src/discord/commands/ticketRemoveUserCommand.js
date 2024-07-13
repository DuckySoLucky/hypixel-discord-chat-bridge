const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { PermissionFlagsBits } = require("discord.js");

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
  name: "remove-user-from-ticket",
  description: "Remove a user from a ticket.",
  moderatorOnly: true,
  ticketCommand: true,
  options: [
    {
      name: "user",
      description: "The user to remove from the ticket",
      type: 6,
      required: true,
    },
  ],

  execute: async (interaction) => {
    if (!interaction.channel.name.toLowerCase().startsWith("ticket-")) {
      throw new HypixelDiscordChatBridgeError("This is not a ticket channel");
    }

    const user = interaction.options.getUser("user");
    const ticketOwnerId = (await interaction.channel.messages.fetchPinned()).first().mentions.users.first().id;

    if (user.id === ticketOwnerId) {
      throw new HypixelDiscordChatBridgeError(
        "What? What is your plan? This is the owner of the ticket. You can't remove the owner of this ticket.",
      );
    }

    const channelPermissions = [
      {
        id: `${user.id}`,
        deny: permissions,
      },
    ];
    interaction.channel.permissionOverwrites.cache.forEach((value, key) => {
      if (key === user.id) return;
      channelPermissions.push(value);
    });

    await interaction.channel.permissionOverwrites.set(channelPermissions);

    await interaction.followUp({
      content: `<@${user.id}> has been removed from this ticket by <@${interaction.user.id}>`,
    });
  },
};
