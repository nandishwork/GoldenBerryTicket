const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'inrToCrypto',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('inrToCryptoModal')
      .setTitle('INR to Crypto Exchange');

    // Create the text input components
    const amountInput = new TextInputBuilder()
      .setCustomId('amount')
      .setLabel('Amount in INR')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., 5000')
      .setRequired(true);

    const cryptoInput = new TextInputBuilder()
      .setCustomId('crypto')
      .setLabel('Crypto Currency')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., USDT, BTC, ETH')
      .setRequired(true);

    const networkInput = new TextInputBuilder()
      .setCustomId('network')
      .setLabel('Network')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., TRC20, BEP20, ERC20')
      .setRequired(true);

    const walletInput = new TextInputBuilder()
      .setCustomId('wallet')
      .setLabel('Wallet Address')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Your crypto wallet address')
      .setRequired(true);

    // Add inputs to action rows
    const firstActionRow = new ActionRowBuilder().addComponents(amountInput);
    const secondActionRow = new ActionRowBuilder().addComponents(cryptoInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(networkInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(walletInput);

    // Add action rows to modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

    // Show the modal
    await interaction.showModal(modal);
  },
};
