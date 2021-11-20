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

// A function that converts seconds to duration (hours:minutes:seconds)
function secondsToDuration(seconds) {

    // Return the minutes:seconds if the duration is less than an hour, otherwise, return hours:minutes:seconds
    return ( (seconds < 3600) ? ( new Date(seconds * 1000).toISOString().substr(14, 5) ) : ( new Date(seconds * 1000).toISOString().substr(11, 8) ) );

}

// A function that adds a song to a server queue
async function addQueue(interaction, song) {
    
    // Check if there is a server queue
    if (!interaction.client.queues.get(interaction.guildId)) {

        // Queue object
        // @param songs - A list of songs to be played by the bot
        // @param audioPlayer - The audio player attributed to the bot
        // @param audioResource - The current audio resource being played by the bot
        // @param channel - The channel the queue was instantiated in
        // @param loopedCurrent - A boolean indicating if the current song is looped
        // @param looped - A boolean indicating if the queue is looped
        // @param index - An integer representing the current song being played in the queue (0 - start/first song in queue)
        const queue = {

            songs: [],
            audioPlayer: null,
            audioResource: null,
            channel: interaction.channel,
            loopedCurrent: false,
            looped: false,
            index: 0

        }

        // Add song to queue
        queue.songs.push(song);

        // Add queue to map
        interaction.client.queues.set(interaction.guildId, queue);

        // Play the song (client, guildId, channel)
        await play(interaction.client, interaction.guild);

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

        const songArg = interaction.options.getString("song", true);

        // Song object
        // @param title - the title of the song
        // @param url - the url of the song to be played
        // @param thumbnail - the thumbnail of the youtube video
        // @param views - the amount of views the video has
        // @param length - the length of the song
        const song = {

            title: null,
            url: null,
            thumbnail: null,
            views: null,
            length: null

        }

        // Attempt to get song information
        try {

            // Find if the song argument is a youtube playlist, video url, or set of keywords

            // Playlist
            if (ytpl.validateID(songArg)) { 
                
                const songs = (await ytpl(songArg)).items;
                
                // Loop through songs and add them to the queue
                for (const index of songs) {

                    //console.log(index);

                    song.title = index.title;
                    song.url = index.url;

                    await addQueue(interaction, song);

                }

                reply = embed(interaction.member.user, "Queue", `:white_check_mark: Queued ${songs.length} songs`);
                return await interaction.reply( { embeds: [reply] } );

            }

            // Video url
            else if (ytdl.validateURL(songArg)) {  

                const songInfo = await (await ytdl.getBasicInfo(songArg)).videoDetails;
                //console.log(songInfo);

                song.title = songInfo.title;
                song.url = songInfo.video_url;
                song.thumbnail = songInfo.thumbnails[0].url;
                song.views = parseInt(songInfo.viewCount);
                song.length = secondsToDuration(songInfo.lengthSeconds);

                await addQueue(interaction, song);

            }

            // Set of keywords
            else {  

                // get the first video result
                const videoFinder = async (query) => {

                    const videoResult = await yts(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

                }

                // add the song to the queue
                const video = await videoFinder(songArg);
                if (video !== null) {

                    //console.log(video); 

                    song.title = video.title;
                    song.url = video.url;
                    song.thumbnail = video.thumbnail;
                    song.views = video.views;
                    song.length = secondsToDuration(video.seconds);

                    await addQueue(interaction, song);

                }

                // Couldn't find video through keywords
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

        // Song isn't available
        if (song.title === null) {
            reply = embed(interaction.member.user, "Queue", `:x: Couldn't queue the song/playlist. Make sure the video/playlist is available and public.`);
            return await interaction.reply({ embeds: [reply] });
        }

        reply = embed(interaction.member.user, "Queue", `:white_check_mark: Successfully queued ${song.title}`);
        reply.thumbnail = {url: song.thumbnail};
        reply.fields = [

            // Link
            {
                name: "Link",
                value: song.url
            },
            // Views
            {
                name: "views",
                value: song.views.toString(),
                inline: true
            },
            // Length
            {
                name: "length",
                value: song.length,
                inline: true
            }

        ];

        return await interaction.reply({ embeds: [reply] });

    }

}
