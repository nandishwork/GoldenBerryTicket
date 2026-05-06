const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'cryptoToInr',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('cryptoToInrModal')
      .setTitle('Crypto to INR Exchange');

    // Create the text input components
    const cryptoInput = new TextInputBuilder()
      .setCustomId('crypto')
      .setLabel('Crypto Currency')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., USDT, BTC, ETH')
      .setRequired(true);

    const amountInput = new TextInputBuilder()
      .setCustomId('amount')
      .setLabel('Amount in Crypto')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., 100')
      .setRequired(true);

    const networkInput = new TextInputBuilder()
      .setCustomId('network')
      .setLabel('Network')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., TRC20, BEP20, ERC20')
      .setRequired(true);

    const upiInput = new TextInputBuilder()
      .setCustomId('upi')
      .setLabel('UPI ID or Bank Details')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Enter your UPI ID or Bank Account Details')
      .setRequired(true);

    // Add inputs to action rows
    const firstActionRow = new ActionRowBuilder().addComponents(cryptoInput);
    const secondActionRow = new ActionRowBuilder().addComponents(amountInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(networkInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(upiInput);

    // Add action rows to modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

    // Show the modal
    await interaction.showModal(modal);
  },
};
