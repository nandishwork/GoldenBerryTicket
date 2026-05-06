const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const { getConfig } = require('../utils/configManager');

module.exports = {
  customId: 'claimTicket',
  async execute(interaction) {
    const guildConfig = getConfig(interaction.guild.id);

    // Check if the user has the staff role
    if (!interaction.member.roles.cache.has(guildConfig.exchangerRoleId) && !interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
    }

    await interaction.deferReply();



    const embed = new EmbedBuilder()
      .setTitle('✅ Ticket Claimed')
      .setDescription(`This ticket has been claimed by ${interaction.user}. They will be assisting you shortly.`)
      .setColor(config.colors.success)
      .setTimestamp();

    // Update the message to remove the claim button
    const message = interaction.message;
    const components = message.components;
    
    if (components.length > 0) {
      const newComponents = [];
      const row = components[0];
      const newRow = { type: 1, components: [] };
      
      for (const component of row.components) {
        if (component.customId !== 'claimTicket') {
          newRow.components.push(component);
        }
      }
      
      newComponents.push(newRow);
      await message.edit({ components: newComponents });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
