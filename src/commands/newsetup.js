const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setConfig } = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newsetup')
    .setDescription('Setup the bot configuration for this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
      option.setName('category')
        .setDescription('The category where ticket channels will be created')
        .addChannelTypes(4) // 4 is GuildCategory
        .setRequired(true))
    .addChannelOption(option => 
      option.setName('logs_channel')
        .setDescription('The channel where transcript logs will be sent')
        .addChannelTypes(0) // 0 is GuildText
        .setRequired(true))
    .addRoleOption(option => 
      option.setName('exchanger_role')
        .setDescription('The role allowed to claim and manage tickets')
        .setRequired(true)),
  
  async execute(interaction) {
    const category = interaction.options.getChannel('category');
    const logsChannel = interaction.options.getChannel('logs_channel');
    const exchangerRole = interaction.options.getRole('exchanger_role');

    setConfig(interaction.guild.id, category.id, logsChannel.id, exchangerRole.id);

    await interaction.reply({ 
      content: `Setup complete for this server!\n**Category**: ${category}\n**Logs Channel**: ${logsChannel}\n**Exchanger Role**: ${exchangerRole}`, 
      ephemeral: true 
    });
  },
};
