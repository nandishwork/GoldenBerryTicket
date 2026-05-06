const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) {
        // Fallback for customIds that might have appended data
        const buttonKey = client.buttons.findKey((val, key) => interaction.customId.startsWith(key));
        if (buttonKey) {
            const buttonCmd = client.buttons.get(buttonKey);
            try {
                await buttonCmd.execute(interaction);
            } catch (error) {
                console.error(error);
            }
            return;
        }
        return;
      }
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(`Error executing button ${interaction.customId}`);
        console.error(error);
      }
    } else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (!modal) return;
      try {
        await modal.execute(interaction);
      } catch (error) {
        console.error(`Error executing modal ${interaction.customId}`);
        console.error(error);
      }
    }
  },
};
