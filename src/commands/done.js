const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const config = require('../config/config');
const { getConfig } = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('done')
    .setDescription('Marks the ticket as done and deletes it after 2 minutes.'),
  
  async execute(interaction) {
    const guildConfig = getConfig(interaction.guild.id);

    // Only staff or administrator can use this
    if (!interaction.member.roles.cache.has(guildConfig.exchangerRoleId) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: 'Only staff can mark a ticket as done.', ephemeral: true });
    }

    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'This command can only be used in ticket channels.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('✅ Ticket Marked as Done')
      .setDescription('This ticket has been marked as complete by staff. The channel will be automatically deleted in **2 minutes**.\n\nA transcript will be saved to the logs.')
      .setColor(config.colors.success)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    try {
      const channel = interaction.channel;
      
      // Generate transcript instantly
      const transcript = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        returnType: 'attachment',
        filename: `${channel.name}-transcript.html`,
        saveImages: true,
        poweredBy: false
      });

      // Send to logs channel instantly
      const logsChannel = interaction.guild.channels.cache.get(guildConfig.logsChannelId);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('📄 Ticket Closed (Done)')
          .addFields(
            { name: 'Ticket Name', value: channel.name, inline: true },
            { name: 'Closed By', value: `<@${interaction.user.id}>`, inline: true }
          )
          .setColor(config.colors.success)
          .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed], files: [transcript] });
      }
    } catch (error) {
      console.error('Error generating instant transcript for /done:', error);
    }

    // Wait 2 minutes (120000 ms) before final deletion
    setTimeout(async () => {
      try {
        const channel = interaction.channel;
        if (!channel) return;

        // Final notice
        await channel.send({ content: 'Ticket closure process complete. Deleting now...' });
        
        // Final delete
        setTimeout(() => channel.delete().catch(() => {}), 2000);

      } catch (error) {
        console.error('Error during /done final deletion:', error);
      }
    }, 120000);
  },
};
