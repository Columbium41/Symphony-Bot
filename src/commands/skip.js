/* 
 * Charley Liu
 * 2021-11-13
 * A command that allows users to skip the current song
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { play } = require("../play");
const { embed } = require("../../util/embed");
const { log } = require("../../util/log-error");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skip the current song or multiple songs")
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {

        // Make sure the bot is in a VC and has a queue and that the user is in the same VC as the bot
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        const queue = interaction.client.queues.get(interaction.guildId);
        if (botVC === null) {
            reply = embed(interaction.member.user, "Skip", ":x: I'm currently not in a voice channel.");
            return await interaction.reply({ embeds: [reply] });
        }
        if (userVC !== botVC) {
            reply = embed(interaction.member.user, "Skip", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }
        if (!queue || queue.songs.length === 0) {
            reply = embed(interaction.member.user, "Skip", ":x: There are no songs in the queue to skip.");
            return await interaction.reply({ embeds: [reply] });
        }

        try {

            // Get the current song for later reference and increase the queue index
            // Set the current song loop condition to false as a user might've skipped the song because the song was looped
            const skipped = queue.songs[queue.index];
            queue.index += 1;
            queue.loopedCurrent = false;

            queue.audioPlayer.stop();
            await play(interaction.client, interaction.guild);
    
            const reply = embed(interaction.client.user, "Skip", `:fast_forward: Successfully skipped ${skipped.title}.`);
            reply.thumbnail = { url: skipped.thumbnail };
            return await interaction.reply({ embeds: [reply] });

        }

        catch (error) {

            console.log(error);
            log("An error occured while trying to skip a song");

            const reply = embed(interaction.client.user, "Error", ":sweat_smile: An error occured while attempting to skip the song.");
            return await interaction.reply({ embeds: [reply] });
            
        }
        
    }

}
