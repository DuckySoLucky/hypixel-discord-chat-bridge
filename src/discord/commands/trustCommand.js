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
    execute : async (client, interaction) => {
      const targetUser = interaction.options.getUser('user');
      const trustedRole = interaction.guild.roles.cache.get('1234353679440679004');
      const userRole = interaction.member.roles.cache.get('1230305459840487464');
  
      if (!userRole) {
        return interaction.reply({ content: 'You do not have the required role to use this command.', ephemeral: true });
      }
  
      const member = interaction.guild.members.cache.get(targetUser.id);
  
      if (member.roles.cache.has(trustedRole.id)) {
        member.roles.remove(trustedRole);
        interaction.reply({ content: `Removed the "Trusted" role from ${targetUser.tag}.`, ephemeral: true });
        interaction.channel.send(`Role removed from ${targetUser.tag}.`);
      } else {
        member.roles.add(trustedRole);
        interaction.reply({ content: `Assigned the "Trusted" role to ${targetUser.tag}.`, ephemeral: true });
        interaction.channel.send(`Role added to ${targetUser.tag}.`);
      }
    },
  };