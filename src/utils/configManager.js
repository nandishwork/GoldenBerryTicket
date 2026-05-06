const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config/guilds.json');

// Ensure the config file exists
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
}

function loadConfigs() {
  const data = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(data);
}

function saveConfigs(configs) {
  fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));
}

function setConfig(guildId, categoryId, logsChannelId, exchangerRoleId) {
  const configs = loadConfigs();
  configs[guildId] = {
    categoryId,
    logsChannelId,
    exchangerRoleId,
    ticketCount: configs[guildId]?.ticketCount || 0
  };
  saveConfigs(configs);
}

function getConfig(guildId) {
  const configs = loadConfigs();
  // Fallback to environment variables if not setup for the server
  return configs[guildId] || {
    categoryId: process.env.TICKET_CATEGORY_ID,
    logsChannelId: process.env.LOG_CHANNEL_ID,
    exchangerRoleId: process.env.EXCHANGER_ROLE_ID,
    ticketCount: 0
  };
}

function getNextTicketId(guildId) {
  const configs = loadConfigs();
  if (!configs[guildId]) {
    configs[guildId] = {
      categoryId: process.env.TICKET_CATEGORY_ID,
      logsChannelId: process.env.LOG_CHANNEL_ID,
      exchangerRoleId: process.env.EXCHANGER_ROLE_ID,
      ticketCount: 0
    };
  }
  configs[guildId].ticketCount++;
  saveConfigs(configs);
  return configs[guildId].ticketCount.toString().padStart(5, '0');
}

module.exports = { setConfig, getConfig, getNextTicketId };
