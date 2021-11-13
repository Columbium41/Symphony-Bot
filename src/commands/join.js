/*
 * Charley Liu
 * 2021-11-12
 * A command that makes the bot join a VC
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");
const { log } = require("../../util/log-error");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Make the bot join a voice channel")
        .setDefaultPermission(true),

    // Execute Command
    async run(client, interaction) {

        let reply = null;

        // Check if the bot isn't in a VC and the user is currently in one
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        if (botVC !== null) {
            reply = embed(interaction.member.user, "Join", ":x: I'm already in a voice channel.");
            return await interaction.reply( {embeds: [reply]} );
        }
        if (userVC === null) {
            reply = embed(interaction.member.user, "Join", ":x: You must join a voice channel to use this command.");
            return await interaction.reply( {embeds: [reply]} );
        }

        // Check if there is an existing connection for this server
        if (!client.connections.get(interaction.guildId)) {
            
            // create a connection
            const connection = joinVoiceChannel({
                channelId: userVC.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // add the connection to the client connection map
            client.connections.set(interaction.guildId, connection);

            reply = embed(interaction.member.user, "Join", `:speaker: Successfully joined ${userVC.name}.`);
            return await interaction.reply( {embeds: [reply]} );

        } else {

            reply = embed(interaction.member.user, "Join", ":sweat_smile: There seems to be an existing connection in this server.");
            log(`Attempted to join a voice channel in ${interaction.guild.name} while there was an existing connection.`);
            return await interaction.reply( {embeds: [reply]} );

        }
        
    }

}
