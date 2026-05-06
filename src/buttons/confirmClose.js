const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const config = require('../config/config');
const { getConfig } = require('../utils/configManager');

module.exports = {
  customId: 'confirmClose',
  async execute(interaction) {
    await interaction.reply({ content: 'Ticket is closing, generating transcript and saving data...' });

    const channel = interaction.channel;

    try {
      // Generate transcript
      const transcript = await discordTranscripts.createTranscript(channel, {
        limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
        returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the new config object below
        filename: `${channel.name}-transcript.html`, // Only valid with returnType is 'attachment'. Name of attachment.
        saveImages: true, // Download all images and include the image data in the HTML (allows viewing the image even after it's deleted)
        poweredBy: false, // Whether to include the "Powered by discord-html-transcripts" footer
        description: `Transcript for ticket ${channel.name}`
      });

      // Send to logs channel
      const guildConfig = getConfig(interaction.guild.id);
      const logsChannel = interaction.guild.channels.cache.get(guildConfig.logsChannelId);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('📄 Ticket Closed')
          .addFields(
            { name: 'Ticket Name', value: channel.name, inline: true },
            { name: 'Closed By', value: `<@${interaction.user.id}>`, inline: true }
          )
          .setColor(config.colors.primary)
          .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed], files: [transcript] });
      }



      // Delete channel after 5 seconds
      await interaction.editReply({ content: 'Transcript saved! Channel will be deleted in 5 seconds.' });
      setTimeout(async () => {
        try {
          await channel.delete();
        } catch (err) {
          console.error('Error deleting channel:', err);
        }
      }, 5000);

    } catch (error) {
      console.error('Error closing ticket:', error);
      await interaction.editReply({ content: 'There was an error while trying to close the ticket.' });
    }
  },
};
