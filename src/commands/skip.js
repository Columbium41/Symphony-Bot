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
        .setDescription("allows a user to skip a song")
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

            // Shift the song queue and play the next song
            const skipped = queue.songs.shift();

            if (queue.songs.length > 0) {  // There is still a song in the queue

                queue.audioPlayer.stop();
                await play(interaction.client, interaction.guildId);
    
                const reply = embed(interaction.client.user, "Skip", `:fast_forward: Successfully skipped ${skipped.title}.`);
                return await interaction.reply({ embeds: [reply] });
    
            } else {  // Queue is empty
                
                // Destroy voice connection and server queue
                getVoiceConnection(interaction.guildId).destroy();
                interaction.client.queues.delete(interaction.guildId);
    
                const reply = embed(interaction.client.user, "Queue Finished", ":wave: I'm not playing anything anymore.");
                return await interaction.reply({ embeds: [reply] });
    
            }

        }

        catch (error) {

            console.log(error);
            log("An error occured while trying to skip a song");

            const reply = embed(interaction.client.user, "Error", ":sweat_smile: An error occured while attempting to skip the song.");
            return await interaction.reply({ embeds: [reply] });
            
        }
        
    }

}
