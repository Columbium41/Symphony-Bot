/*
 * Charley Liu
 * 2021-11-12
 * A command that pings the bot and returns how long it took for the ping to come back 
*/

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot!")
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {
        await interaction.reply("Pong!");
    }

}
