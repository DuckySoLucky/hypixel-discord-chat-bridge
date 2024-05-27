const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: "adduser",
  description: "Adds a user to the current text channel.",
  options: [
    {
      name: "user",
      description: "The user to add to the channel",
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
        [PermissionsBitField.Flags.ViewChannel]: true,
        [PermissionsBitField.Flags.SendMessages]: true,
        [PermissionsBitField.Flags.ReadMessageHistory]: true,
      });

      const embed = new SuccessEmbed(`Successfully added \`${user.username}\` to \`${channel.name}\`.`);
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: "There was an error while executing this command.", ephemeral: true });
    }
  },
};
