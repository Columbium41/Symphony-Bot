/*
 * Charley Liu
 * 2021-11-20
 * A command that shows the bot's current status
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const dotenv = require("dotenv");
dotenv.config();
const { log } = require("../../util/log-error");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("get the status of the bot")
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {

        const queue = interaction.client.queues.get(interaction.guildId);
        let songNames = "";

        // Get the current song playing as well as the previous and next 5 songs
        if (queue && queue.songs !== null) {

            // Add "..." to indicate that there are more songs previous to the song playing in the list shown
            if (queue.index > 5) {
                songNames += "...\n";
            }

            // Get the previous 5 songs
            count = 0;
            for (let i = queue.index - 5; (i < queue.index && count < 5); i++) {

                if (i >= 0) {
                    songNames += `${i + 1}: ${queue.songs[i].title}\n`;
                }

                count++;
            }

            // Add the current song to the list
            songNames += `**>> ${queue.index + 1}: ${queue.songs[queue.index].title}**\n`;

            // Get the next 5 songs
            count = 0;
            for (let i = queue.index + 1; (i < queue.songs.length && count < 5); i++) {
                songNames += `${i + 1}: ${queue.songs[i].title}\n`;
                count++;
            }

            // Add "..." to indicate that there are more songs after the list shown
            if (queue.index + 6 < queue.songs.length) {
                songNames += "...";
            }

        }

        // Reply embed
        const reply = {
            
            color: process.env.EMBED_COLOR,
            title: "Status",
            author: {
                name: interaction.member.user.username,
                icon_url: interaction.member.user.avatarURL(),
            },
            fields: [

                // Queue list (only shows up to 11 items)
                {
                    name: "Songs Playing",
                    value: ( (queue && queue.songs !== null) ? (songNames) : ("N/A") )
                },

                // Queue size
                {
                    name: "Queue Size",
                    value: ( (queue) ? (queue.songs.length.toString()) : ("N/A") ),
                    inline: true
                },

                // Current song index
                {
                    name: "Position in Queue",
                    value: ( (queue) ? (queue.index + 1).toString() : ("N/A") ),
                    inline: true
                },

                // Queue looped
                {
                    name: "Song Looped",
                    value: ( (queue && queue.loopedCurrent) ? ("yes") : ("no") ),
                    inline: true
                },
                {
                    name: "Playlist Looped",
                    value: ( (queue && queue.looped) ? ("yes") : ("no") ),
                    inline: true
                },

                // The channel the bot is in
                {
                    name: "Channel",
                    value: ( (interaction.guild.me.voice.channel) ? (interaction.guild.me.voice.channel.name) : ("N/A") ),
                    inline: true
                },

                // Audio player status
                {
                    name: "Audio Player Status",
                    value: ( (queue && queue.audioPlayer) ? (queue.audioPlayer.state.status.toString()) : ("N/A") ),
                    inline: true
                }

            ],
            timestamp: new Date(),

        };

        return await interaction.reply({ embeds: [reply] });

    }

}
