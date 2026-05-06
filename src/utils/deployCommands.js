const { REST, Routes } = require('discord.js');

async function deployCommands(client) {
  const commands = [];
  client.commands.forEach(command => {
    commands.push(command.data.toJSON());
  });

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}

module.exports = { deployCommands };
