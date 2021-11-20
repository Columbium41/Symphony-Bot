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

        if (queue && queue.songs !== null) {
            
            let count = 1;

            // Get all song titles
            for (const song of queue.songs) {
                songNames += `${count}: ${song.title}\n`;
                count += 1;

            }

        }

        const reply = {
            
            color: process.env.EMBED_COLOR,
            title: "Status",
            author: {
                name: interaction.member.user.username,
                icon_url: interaction.member.user.avatarURL(),
            },
            fields: [

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
                    value: ( (queue) ? (queue.channel.name) : ("N/A") ),
                    inline: true
                },

                // Audio player status
                {
                    name: "Audio Player Status",
                    value: ( (queue && queue.audioPlayer) ? (queue.audioPlayer.state.status.toString()) : ("N/A") ),
                    inline: true
                }

            ],
            description: ( (queue && queue.songs !== null) ? (songNames) : ("N/A") ),
            timestamp: new Date(),

        };

        return await interaction.reply({ embeds: [reply] });

    }

}
