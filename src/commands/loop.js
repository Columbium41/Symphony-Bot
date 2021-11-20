/*
 * Charley Liu
 * 2021-11-18
 * A command that allows the user to loop the current song or the entire playlist
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");
const { log } = require("../../util/log-error");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("loop through a song or the entire playlist")
        .addStringOption(option => 
            option.setName("options")
                .setDescription("loop through the entire queue or just the current song?")
                .setRequired(true)
                .addChoice("Playlist", "playlist")
                .addChoice("Song", "song"))
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {

        let reply = null;

        // Check if there is a queue and if the user is in the same channel as the bot
        const queue = interaction.client.queues.get(interaction.guildId);
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        if (!queue) {
            reply = embed(interaction.member.user, "Loop", ":x: I'm currently not playing anything.");
            return await interaction.reply({ embeds: [reply] });
        }
        if (userVC !== botVC) {
            reply = embed(interaction.member.user, "Loop", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }

        const loopOptions = interaction.options.getString("options", true);
        
        // Loop or unloop the queue
        if (loopOptions === "playlist") {

            queue.looped = !queue.looped;

            // Queue was previously unlooped
            if (queue.looped) {
                reply = embed(interaction.member.user, "Loop", ":arrows_counterclockwise: Looped the queue.");
                return await interaction.reply({ embeds: [reply] });
            } 
            // Queue was previously looped
            else {
                reply = embed(interaction.member.user, "Loop", ":arrow_right: Unlooped the queue.");
                return await interaction.reply({ embeds: [reply] });
            }

        }

        // Loop or unloop the current song
        else if (loopOptions === "song") {

            queue.loopedCurrent = !queue.loopedCurrent;

            // Song was previously unlooped
            if (queue.loopedCurrent) {
                reply = embed(interaction.member.user, "Loop", ":arrows_counterclockwise: Looped the current song.");
                return await interaction.reply({ embeds: [reply] });
            }
            // Song was previously looped
            else {
                reply = embed(interaction.member.user, "Loop", ":arrow_right: Unlooped the current song.");
                return await interaction.reply({ embeds: [reply] });
            }

        }

    }

}
