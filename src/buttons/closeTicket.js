const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
  customId: 'closeTicket',
  async execute(interaction) {
    // Only staff or ticket creator should be able to close? Let's allow both or just anyone in the channel.
    // Usually it's better to allow anyone who can see the channel.

    const embed = new EmbedBuilder()
      .setTitle('🔒 Close Ticket')
      .setDescription('Are you sure you want to close this ticket? This action cannot be undone.')
      .setColor(config.colors.warning);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirmClose')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancelClose')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
