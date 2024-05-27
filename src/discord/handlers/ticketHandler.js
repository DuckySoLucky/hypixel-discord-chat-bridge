const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType
} = require('discord.js');
const config = require('../../../config.json');

class TicketHandler {
  constructor(client) {
    this.client = client;
    this.client.on('interactionCreate', async (interaction) => {
      this.onInteraction(interaction);
    });
  }

  async onStartup() {
    const supportChannel = this.client.channels.cache.get(config.tickets.support.supportChannel);
    const dungeonChannel = this.client.channels.cache.get(config.tickets.dungeon.dungeonChannel);
    const slayerChannel = this.client.channels.cache.get(config.tickets.slayer.slayerChannel);
  
    const channels = [supportChannel, dungeonChannel, slayerChannel];

    for (const channel of channels) {
      if (channel) {
        const messages = await channel.messages.fetch();
        await Promise.all(messages.map((message) => message.delete()));
      }
    }

    await this.createEmbed(supportChannel, 'Support');
    await this.createEmbed(dungeonChannel, 'Dungeon');
    await this.createEmbed(slayerChannel, 'Slayer');
  }

  async setupTicketSystem() {
    const guild = this.client.guilds.cache.get(config.discord.bot.serverID);

    if (!guild) {
      console.error(`Guild with ID ${config.discord.bot.serverID} not found.`);
      return;
    }

    if (config.tickets.support.enabled) {
      const supportChannel = guild.channels.cache.get(config.tickets.support.supportChannel);
      if (supportChannel) {
        await this.createEmbed(supportChannel, 'Support');
      }
    }

    if (config.tickets.dungeon.dungeonEnabled) {
      const dungeonChannel = guild.channels.cache.get(config.tickets.dungeon.dungeonChannel);
      if (dungeonChannel) {
        await this.createEmbed(dungeonChannel, 'Dungeon');
      }
    }

    if (config.tickets.slayer.slayerEnabled) {
      const slayerChannel = guild.channels.cache.get(config.tickets.slayer.slayerChannel);
      if (slayerChannel) {
        await this.createEmbed(slayerChannel, 'Slayer');
      }
    }
  }

  async createEmbed(channel, ticketType) {
    if (!channel) return;

    const messages = await channel.messages.fetch();
    await Promise.all(messages.map((message) => message.delete()));

    let options = [];
  
    switch (ticketType) {
      case 'Support':
        options = [
          { label: 'Support', value: 'support' },
          { label: 'Application', value: 'application' },
        ];
        break;
      case 'Dungeon':
        options = [
          { label: `F1 (${config.tickets.dungeon.noobFloors})`, value: 'f1' },
          { label: `F2 (${config.tickets.dungeon.noobFloors})`, value: 'f2' },
          { label: `F3 (${config.tickets.dungeon.noobFloors})`, value: 'f3' },
          { label: `F4 (${config.tickets.dungeon.noobFloors})`, value: 'f4' },
          { label: `F5 (${config.tickets.dungeon.f5})`, value: 'f5' },
          { label: `F6 (${config.tickets.dungeon.f6})`, value: 'f6' },
          { label: `F7 (${config.tickets.dungeon.f7})`, value: 'f7' },
          { label: `M1 (${config.tickets.dungeon.m1})`, value: 'm1' },
          { label: `M2 (${config.tickets.dungeon.m2})`, value: 'm2' },
          { label: `M3 (${config.tickets.dungeon.m3})`, value: 'm3' },
          { label: `M4 (${config.tickets.dungeon.m4})`, value: 'm4' },
          { label: `M5 (${config.tickets.dungeon.m5})`, value: 'm5' },
          { label: `M6 (${config.tickets.dungeon.m6})`, value: 'm6' },
          { label: `M7 (${config.tickets.dungeon.m7})`, value: 'm7' },
        ];
        break;
      case 'Slayer':
        options = [
          { label: `Rev 1-4 (${config.tickets.slayer.rev})`, value: 'rev' },
          { label: `Rev5 (${config.tickets.slayer.rev5})`, value: 'rev5' },
          { label: `Sven (${config.tickets.slayer.sven})`, value: 'sven' },
          { label: `Tara (${config.tickets.slayer.tara})`, value: 'tara' },
          { label: `Voidgloom 1-3 (${config.tickets.slayer.voidgloom})`, value: 'voidgloom' },
          { label: `Voidgloom T4 (${config.tickets.slayer.voidgloom_t4})`, value: 'voidgloom_t4' },
        ];
        break;
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ticket')
          .setPlaceholder(`Select a ${ticketType} ticket type`)
          .addOptions(options),
      );

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${ticketType} Ticket System`)
      .setDescription(`Please select the type of ${ticketType} ticket you want to create from the dropdown menu.`);

    await channel.send({ embeds: [embed], components: [row] });
  }

  async onInteraction(interaction) {
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket') {
      await this.handleSelectMenu(interaction);
    } else if (interaction.isModalSubmit() && interaction.customId.startsWith('ticketForm')) {
      await this.handleModalSubmit(interaction);
    } else if (interaction.isButton()) {
      if (interaction.customId === 'claimTicket') {
        await this.handleClaimTicket(interaction);
      } else if (interaction.customId === 'unclaimTicket') {
        await this.handleUnclaimTicket(interaction);
      } else if (interaction.customId === 'closeTicket') {
        await this.handleCloseTicket(interaction);
      } else if (interaction.customId === 'confirmCloseTicket') {
        await this.confirmCloseTicket(interaction);
      } else if (interaction.customId === 'reopenTicket') {
        await this.handleReopenTicket(interaction);
      } else if (interaction.customId === 'deleteTicket') {
        await this.handleDeleteTicket(interaction);
      }
    }
  }

  async handleClaimTicket(interaction) {
    const { user, channel, message } = interaction;

    // Extract the user ID from the channel's topic
    const userId = channel.topic.match(/(\d+)/)[0];

    const buttons = message.components[0].components.map((button) => {
      if (button.customId === 'claimTicket') {
        return new ButtonBuilder(button)
          .setCustomId('unclaimTicket')
          .setLabel('Unclaim Ticket')
          .setStyle(ButtonStyle.Secondary);
      }
      return button;
    });

    const row = new ActionRowBuilder().addComponents(buttons);

    await message.edit({ components: [row] });

    // Mention the user who opened the ticket in the message
    await channel.send(`<@${userId}>, you ticket has been claimed by ${user}.`);
    await interaction.reply({ content: 'You have claimed this ticket.', ephemeral: true });
}

  async handleUnclaimTicket(interaction) {
    const { user, channel, message } = interaction;

    const buttons = message.components[0].components.map((button) => {
      if (button.customId === 'unclaimTicket') {
        return new ButtonBuilder(button)
          .setCustomId('claimTicket')
          .setLabel('Claim Ticket')
          .setStyle(ButtonStyle.Success);
      }
      return button;
    });

    const row = new ActionRowBuilder().addComponents(buttons);

    await message.edit({ components: [row] });

    await channel.send(`${user} has unclaimed this ticket.`);
    await interaction.reply({ content: 'You have unclaimed this ticket.', ephemeral: true });
  }

  async handleCloseTicket(interaction) {
    const { channel } = interaction;
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirmCloseTicket')
          .setLabel('Confirm Close')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancelCloseTicket')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ content: 'Are you sure you want to close this ticket?', components: [row], ephemeral: true });
  }

  async confirmCloseTicket(interaction) {
    const { channel, guild, user } = interaction;
    const closedCategory = guild.channels.cache.get(config.tickets.closedCategory);

    if (!closedCategory) {
      console.error('Closed category not found.');
      return;
    }

    await channel.setParent(closedCategory.id);

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Ticket Closed')
      .setDescription('This ticket has been closed.');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reopenTicket')
          .setLabel('Reopen Ticket')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('deleteTicket')
          .setLabel('Delete Ticket')
          .setStyle(ButtonStyle.Danger)
      );

    // Store the original opener's ID in the channel's topic or name
    const originalOpenerId = channel.topic ? channel.topic.split(' ')[3] : null; // Changed to correctly parse the ID
    if (!originalOpenerId) {
      await channel.setTopic(`Ticket closed by ${user.id}`);
    }

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.update({ content: 'The ticket has been closed and moved to the closed category.', components: [] });
  }

  async handleReopenTicket(interaction) {
    const { channel, guild } = interaction;
    const originalCategory = guild.channels.cache.get(config.tickets.category);

    if (!originalCategory) {
      console.error('Original category not found.');
      return;
    }

    await channel.setParent(originalCategory.id);

    // Retrieve the original opener's ID from the channel's topic and grant them view permissions
    const originalOpenerId = channel.topic ? channel.topic.split(' ')[3] : null; // Changed to correctly parse the ID
    if (originalOpenerId) {
      await channel.permissionOverwrites.create(originalOpenerId, {
        [PermissionsBitField.Flags.ViewChannel]: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Ticket Reopened')
      .setDescription('This ticket has been reopened.');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('claimTicket')
          .setLabel('Claim Ticket')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('closeTicket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
      );

    await channel.send({ embeds: [embed], components: [row] });
    if (!interaction.replied) {
      await interaction.update({ content: 'The ticket has been reopened.', components: [] });
    }
  }

  async handleDeleteTicket(interaction) {
    const { channel } = interaction;
    await channel.delete();
  }

  async handleSelectMenu(interaction) {
    try {
      const { user, values } = interaction;
      const ticketType = values[0];
    
      let modal;
    
      if (ticketType === 'support') {
        modal = new ModalBuilder()
          .setCustomId(`ticketForm-${ticketType}`)
          .setTitle(`Ticket Form - ${ticketType}`)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Brief explanation of the problem')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );

      } else if (ticketType === 'application') {
        modal = new ModalBuilder()
          .setCustomId(`ticketForm-${ticketType}`)
          .setTitle(`Ticket Form - ${ticketType}`)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('ign')
                .setLabel('In-game Name (IGN)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('playtime')
                .setLabel('Playtime')
                .setStyle(TextInputStyle.Short)
                .setRequired(ticketType === 'application')
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('applyFor')
                .setLabel('What to apply for')
                .setStyle(TextInputStyle.Short)
                .setRequired(ticketType === 'application')
            )
          );   
      } else {
        modal = new ModalBuilder()
          .setCustomId(`ticketForm-${ticketType}`)
          .setTitle(`Ticket Form - ${ticketType}`)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('amount')
                .setLabel('Amount of carries needed')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('ign')
                .setLabel('In-game Name (IGN)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
      }
    
      await interaction.showModal(modal);
    } catch (error) {
      console.error('Error handling select menu interaction:', error);
    }
  }

  async handleModalSubmit(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        const { guild, user, customId } = interaction;
        const ticketType = customId.split('-')[1];

        let amount, ign, description, playtime, applyFor;

        if (ticketType === 'support') {
            description = interaction.fields.getTextInputValue('description');
        } else if (ticketType === 'application') {
            ign = interaction.fields.getTextInputValue('ign');
            playtime = interaction.fields.getTextInputValue('playtime');
            applyFor = interaction.fields.getTextInputValue('applyFor');
        } else {
            amount = interaction.fields.getTextInputValue('amount');
            ign = interaction.fields.getTextInputValue('ign');
        }

        const channelName = `${ticketType}-${user.username}`.toLowerCase();

        const supportRole = guild.roles.cache.get(config.tickets.support.role);

        const channel = await guild.channels.create({
            name: channelName,
            type: 0, // Ensure the correct type
            parent: config.tickets.category,
            topic: `Ticket opened by ${user.id}`
        });

        await channel.permissionOverwrites.create(user, {
            [PermissionsBitField.Flags.ViewChannel]: true
        });
        await channel.permissionOverwrites.create(guild.roles.everyone, {
            [PermissionsBitField.Flags.ViewChannel]: false
        });
        await channel.permissionOverwrites.create(supportRole, {
            [PermissionsBitField.Flags.ViewChannel]: true,
            [PermissionsBitField.Flags.SendMessages]: true,
            [PermissionsBitField.Flags.ReadMessageHistory]: true
        });

        let embedDescription = `**Welcome ${user}, a team member will be with you shortly.**\n\n`;

        if (ticketType === 'support') {
            embedDescription += `**Issue:**\n\`\`\`${description}\`\`\``;
        } else if (ticketType === 'application') {
            embedDescription += `**IGN:**\n\`\`\`${ign}\`\`\`\n**Playtime:**\n\`\`\`${playtime}\`\`\`\n**Applying For:**\n\`\`\`${applyFor}\`\`\``;
        } else {
            embedDescription += `**Amount:**\n\`\`\`${amount}\`\`\`\n**IGN:**\n\`\`\`${ign}\`\`\``;
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Ticket`)
            .setDescription(embedDescription);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('claimTicket')
                    .setLabel('Claim Ticket')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger)
            );

        await channel.send({ embeds: [embed], components: [row] });

        const validDungeonTypes = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
        const validSlayerTypes = ['rev', 'rev5', 'sven', 'tara', 'voidgloom', 'voidgloom_t4'];


// Send Shiiyu Moe link for certain ticket types
if (ticketType === 'application' || validDungeonTypes.includes(ticketType) || validSlayerTypes.includes(ticketType)) {
  await channel.send(`https://sky.shiiyu.moe/stats/${ign}`);

  // If it's a dungeon or slayer ticket, calculate and send the total price
  if (validDungeonTypes.includes(ticketType) || validSlayerTypes.includes(ticketType)) {
      let pricePerCarry;
      if (['f1', 'f2', 'f3', 'f4'].includes(ticketType)) {
          pricePerCarry = config.tickets.dungeon.noobFloors;
      } else {
          pricePerCarry = validDungeonTypes.includes(ticketType) ? config.tickets.dungeon[ticketType] : config.tickets.slayer[ticketType]; // Get the price per carry from the config
      }
      const amountOfCarries = interaction.fields.getTextInputValue('amount'); // Get the amount of carries requested

      // Calculate the total price
      let totalPrice;
      if (pricePerCarry.toLowerCase().endsWith('m')) {
          totalPrice = parseFloat(pricePerCarry) * 1000000 * amountOfCarries; // Convert price to millions
      } else if (pricePerCarry.toLowerCase().endsWith('k')) {
          totalPrice = parseFloat(pricePerCarry) * 1000 * amountOfCarries; // Convert price to thousands
      } else if (pricePerCarry.toLowerCase() === 'free') {
          totalPrice = 'free';
      }

      // Convert the total price back to 'm' or 'k' format
      let formattedTotalPrice;
      if (totalPrice >= 1000000) {
          formattedTotalPrice = (totalPrice / 1000000) + 'M';
      } else if (totalPrice < 1000000 && totalPrice >= 1000) {
          formattedTotalPrice = (totalPrice / 1000) + 'K';
      } else {
          formattedTotalPrice = totalPrice;
      }

      // Send a message with the total price
      await channel.send(`The total price for ${amountOfCarries} carries is ${formattedTotalPrice}.`);
  }
}

        await interaction.editReply({ content: `Your ${ticketType} ticket has been created.`, ephemeral: true });
    } catch (error) {
        console.error('Error handling modal submit interaction:', error);
        await interaction.editReply({ content: `There was an error creating your ticket. Please try again later.`, ephemeral: true });
    }
}
}

module.exports = TicketHandler;
