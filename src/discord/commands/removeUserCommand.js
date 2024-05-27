const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: "removeuser",
  description: "Removes a user from the current text channel.",
  options: [
    {
      name: "user",
      description: "The user to remove from the channel",
      type: 6,  // USER type
      required: true,
    },
  ],
  permissions: ['MANAGE_CHANNELS'],
  execute: async (interaction) => {
    const user = interaction.options.getUser("user");
    const channel = interaction.channel;

    try {
      await channel.permissionOverwrites.edit(user.id, {
        [PermissionsBitField.Flags.ViewChannel]: false,
        [PermissionsBitField.Flags.SendMessages]: false,
        [PermissionsBitField.Flags.ReadMessageHistory]: false,
      });

      const embed = new SuccessEmbed(`Successfully removed \`${user.username}\` from \`${channel.name}\`.`);
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: "There was an error while executing this command.", ephemeral: true });
    }
  },
};
