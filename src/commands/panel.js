const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Creates the exchange ticket panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('💱 Create Exchange Ticket')
      .setDescription('Welcome to the Exchange Desk!\n\nPlease select the type of exchange you wish to make by clicking one of the buttons below. Our staff will assist you shortly.')
      .setColor(config.colors.primary)
      .setFooter({ text: 'GoldenBerry Exchange Desk', iconURL: interaction.guild.iconURL() })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('inrToCrypto')
          .setLabel('INR → Crypto')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🇮🇳'),
        new ButtonBuilder()
          .setCustomId('cryptoToInr')
          .setLabel('Crypto → INR')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🪙')
      );

    await interaction.reply({ content: 'Panel created successfully.', ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [row] });
  },
};
