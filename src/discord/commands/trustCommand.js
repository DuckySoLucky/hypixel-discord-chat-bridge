const config = require("../../../config.json");

module.exports = {
    name: 'trust',
    description: 'Assigns or removes the "Trusted" role to/from a user.',
    options: [
      {
        name: 'user',
        description: 'User to trust/untrust',
        type: 6, 
        required: true,
      },
    ],
    permissions: ['MANAGE_ROLES'],
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('user');
      const trustedRole = interaction.guild.roles.cache.get('1234353679440679004');
      const commandRole = interaction.guild.roles.cache.get(config.discord.commands.commandRole);
      const additionalRole = interaction.guild.roles.cache.get('1230305459840487464');

      // Check if the user has the command role, the additional role, or is a specific user
      if (!interaction.member.roles.cache.has(commandRole.id) && !interaction.member.roles.cache.has(additionalRole.id) && !config.discord.commands.users.includes(interaction.user.id)) {
        await interaction.followUp({ content: 'You do not have the required role to use this command.', ephemeral: true });
        return;
      }

      const member = interaction.guild.members.cache.get(targetUser.id);

      if (member.roles.cache.has(trustedRole.id)) {
        member.roles.remove(trustedRole);
        await interaction.followUp({ content: `Removed the "Trusted" role from ${targetUser.tag}.`, ephemeral: true });
      } else {
        member.roles.add(trustedRole);
        await interaction.followUp({ content: `Assigned the "Trusted" role to ${targetUser.tag}.`, ephemeral: true });
      }
    },
};