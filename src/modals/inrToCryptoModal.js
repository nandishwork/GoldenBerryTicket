const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config/config');
const { getConfig, getNextTicketId } = require('../utils/configManager');

module.exports = {
  customId: 'inrToCryptoModal',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });



    const amount = interaction.fields.getTextInputValue('amount');
    const crypto = interaction.fields.getTextInputValue('crypto');
    const network = interaction.fields.getTextInputValue('network');
    const wallet = interaction.fields.getTextInputValue('wallet');

    // Create the ticket channel
    const ticketId = getNextTicketId(interaction.guild.id);
    const channelName = `ticket-${ticketId}`;

    const guildConfig = getConfig(interaction.guild.id);

    try {
      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: guildConfig.categoryId,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel], // Deny everyone
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Allow creator
          },
          {
            id: guildConfig.exchangerRoleId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Allow staff
          },
          {
            id: interaction.client.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels], // Allow bot
          }
        ]
      });



      // Create embed
      const embed = new EmbedBuilder()
        .setTitle('🎫 New Exchange Ticket | INR → Crypto')
        .setDescription(`Hello ${interaction.user}, a staff member will be with you shortly.`)
        .setColor(config.colors.primary)
        .addFields(
          { name: '💰 Amount (INR)', value: amount, inline: true },
          { name: '🪙 Crypto', value: crypto, inline: true },
          { name: '🌐 Network', value: network, inline: true },
          { name: '🏦 Wallet Address', value: `\`${wallet}\``, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'GoldenBerry Exchange' });

      // Create buttons
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('claimTicket')
            .setLabel('Claim Ticket')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✋'),
          new ButtonBuilder()
            .setCustomId('closeTicket')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
        );

      await channel.send({ content: `<@&${guildConfig.exchangerRoleId}> | ${interaction.user}`, embeds: [embed], components: [row] });
      await interaction.editReply({ content: `Your ticket has been created: ${channel}` });

    } catch (error) {
      console.error('Error creating ticket:', error);
      await interaction.editReply({ content: 'There was an error creating your ticket. Please try again later.' });
    }
  },
};
