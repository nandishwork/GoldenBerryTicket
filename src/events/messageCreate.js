const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const config = require('../config/config');
const { getConfig } = require('../utils/configManager');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const prefix = '.';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'done') {
      console.log(`.done command detected in ${message.channel.name} by ${message.author.tag}`);
      const guildConfig = getConfig(message.guild.id);

      // Check if user is staff or administrator
      const isStaff = message.member.roles.cache.has(guildConfig.exchangerRoleId);
      const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);

      if (!isStaff && !isAdmin) return;

      // Check if in a ticket channel
      if (!message.channel.name.startsWith('ticket-')) return;

      const embed = new EmbedBuilder()
        .setTitle('✅ Ticket Marked as Done')
        .setDescription('This ticket has been marked as complete via prefix command. The channel will be automatically deleted in **2 minutes**.\n\nA transcript will be saved to the logs.')
        .setColor(config.colors.success)
        .setTimestamp();

      await message.reply({ embeds: [embed] });

      try {
        const channel = message.channel;
        
        // Generate transcript instantly
        const transcript = await discordTranscripts.createTranscript(channel, {
          limit: -1,
          returnType: 'attachment',
          filename: `${channel.name}-transcript.html`,
          saveImages: true,
          poweredBy: false
        });

        // Send to logs channel instantly
        const logsChannel = message.guild.channels.cache.get(guildConfig.logsChannelId);
        if (logsChannel) {
          const logEmbed = new EmbedBuilder()
            .setTitle('📄 Ticket Closed (Done - Prefix)')
            .addFields(
              { name: 'Ticket Name', value: channel.name, inline: true },
              { name: 'Closed By', value: `<@${message.author.id}>`, inline: true }
            )
            .setColor(config.colors.success)
            .setTimestamp();

          await logsChannel.send({ embeds: [logEmbed], files: [transcript] });
        }
      } catch (error) {
        console.error('Error generating instant transcript for .done:', error);
      }

      // Wait 2 minutes
      setTimeout(async () => {
        try {
          const channel = message.channel;
          if (!channel) return;

          // Final notice and delete
          await channel.send({ content: 'Ticket closure process complete. Deleting now...' });
          setTimeout(() => channel.delete().catch(() => {}), 2000);

        } catch (error) {
          console.error('Error during .done final deletion:', error);
        }
      }, 120000);
    }
  },
};
