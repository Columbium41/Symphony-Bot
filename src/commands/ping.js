/*
 * Charley Liu
 * 2021-11-12
 * A command that pings the bot and returns how long it took for the ping to come back 
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot!")
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {

        let reply = embed(interaction.user, "Ping", ":ping_pong: Pong!");
        reply.fields = [ 
            { name: "Response Latency", value: `${Date.now() - interaction.createdTimestamp}ms` }, 
            { name: "API Latency", value: `${Math.round(interaction.client.ws.ping)}ms` } 
        ];

        await interaction.reply( { embeds: [reply] } );
    }

}
