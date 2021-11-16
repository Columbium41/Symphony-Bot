/*
 * Charley Liu
 * 2021-11-13
 * A command that queues a song for the bot to play
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");
const { log } = require("../../util/log-error");
const { play } = require("../play");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const yts = require("yt-search");

// A function that adds a song to a server queue
async function addQueue(interaction, song) {
    
    // Check if there is a server queue
    if (!interaction.client.queues.get(interaction.guildId)) {

        // Queue constructor
        // @param songs - A list of songs to be played by the bot
        // @param audioPlayer - The audio player attributed to the bot
        // @param audioResource - The current audio resource being played by the bot
        // @param channel - The channel the queue was instantiated in
        const queue = {

            songs: [],
            audioPlayer: null,
            audioResource: null,
            channel: interaction.channel

        }

        // Add song to queue
        queue.songs.push(song);

        // Add queue to map
        interaction.client.queues.set(interaction.guildId, queue);

        // Play the song (client, guildId, channel)
        await play(interaction.client, interaction.guildId);

    } else {

        interaction.client.queues.get(interaction.guildId).songs.push(song);

    }

}

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Queue a song for the bot to play!")
        .addStringOption(option =>
            option.setName("song")
                .setDescription("the song to play")
                .setRequired(true))
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {

        let reply = null;

        // Check if the bot is in a VC and that the user is in the same vc
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        if (botVC === null) {
            reply = embed(interaction.member.user, "Queue", ":x: I'm currently not in a voice channel.");
            return await interaction.reply({ embeds: [reply] });
        }
        if (userVC !== botVC) {
            reply = embed(interaction.member.user, "Queue", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }

        let song = {};
        const songArg = interaction.options.getString("song", true);

        // Attempt to get song information
        try {

            // Find if the song argument is a playlist, video url, or set of keywords

            if (ytpl.validateID(songArg)) {  // playlist
                
                const songs = (await ytpl(songArg)).items;
                
                // Loop through songs and add them to the queue
                for (const index of songs) {

                    song = { title: index.title, url: index.url};
                    addQueue(interaction, song);

                }

                reply = embed(interaction.member.user, "Queue", `:white_check_mark: Queued ${songs.length} songs`);
                return await interaction.reply( { embeds: [reply] } );

            }
            else if (ytdl.validateURL(songArg)) {  // video url

                const songInfo = await ytdl.getBasicInfo(songArg);
                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
                await addQueue(interaction, song);

            }
            else {  // set of keywords

                // get the first video result
                const videoFinder = async (query) => {

                    const videoResult = await yts(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

                }

                // add the song to the queue
                const video = await videoFinder(songArg);
                if (video !== null) {

                    song = { title: video.title, url: video.url };
                    await addQueue(interaction, song);

                }
                else {

                    reply = embed(interaction.member.user, "Queue", ":mag: Sorry, I couldn't find the video you were looking for.");
                    return await interaction.reply({ embeds: [reply] });

                }

            }

        } 
        
        // Error occured while trying to gather song information
        catch (error) {

            console.log(error);
            log(error);

        }

        reply = embed(interaction.member.user, "Queue", `:white_check_mark: Successfully queued ${song.title}`);
        return await interaction.reply({ embeds: [reply] });

    }

}
