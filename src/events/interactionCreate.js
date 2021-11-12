/*
 * Charley Liu
 * 2021-11-12
 * An event that runs when an interaction is created with the bot
*/

const { log } = require("../../util/log-error");

module.exports = async (client, interaction) => {
    
    if (!interaction.isCommand()) return;

    // Get the command the user instantiated
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Execute the command
    try {
        await command.run(interaction);
    } catch (error) {

        console.log(error);
        log(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });

    }

}
