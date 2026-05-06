module.exports = {
  customId: 'cancelClose',
  async execute(interaction) {
    await interaction.message.delete();
  },
};
