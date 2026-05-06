const { Events, ActivityType } = require('discord.js');
const { deployCommands } = require('../utils/deployCommands');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    // Set bot presence
    client.user.setPresence({
      activities: [{ name: 'Exchange Tickets', type: ActivityType.Watching }],
      status: 'online',
    });

    // Deploy slash commands on startup
    await deployCommands(client);
  },
};
