/*
 * Charley Liu
 * 2021-11-28
 * A command that gives information to the user on how to use the bot
*/

const dotenv = require("dotenv");
dotenv.config();

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("displays information on how to use the bot")
        .setDefaultPermission(true),

    async run(interaction) {

        // Reply embed
        const reply = {
            
            color: process.env.EMBED_COLOR,
            title: "Help",
            author: {
                name: interaction.member.user.username,
                icon_url: interaction.member.user.avatarURL(),
            },
            fields: [

                // Joining/Leaving channels
                {
                    name: "Joining & Leaving Channels",
                    value: ("`/join - Connect me to a voice channel\n" + 
                            "/leave - Disconnect me from a voice channel`")
                },

                // Playing songs
                {
                    name: "Playing Music",
                    value: ("`/queue - Queue a youtube song/playlist for me to play\n" +
                            "/pause - Pause the current song\n" + 
                            "/resume - Resume the current song\n" +
                            "/skip - Skip or remove the current song`")
                },

                // Managing queue
                {
                    name: "Managing Queue",
                    value: ("`/loop - Loop the entire playlist or current song\n" +
                            "/shuffle - Shuffle the queue`")
                },

                // Information
                {
                    name: "Information",
                    value: ("`/ping - Ping the bot to check latency\n" + 
                            "/status - Check the status of the bot`")
                }

            ],
            timestamp: new Date(),

        };

        return await interaction.reply({ embeds: [reply] });

    }

}
