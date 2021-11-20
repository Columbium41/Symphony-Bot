/*
 * Charley Liu
 * 2021-11-13
 * A command that queues a song for the bot to play
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed, embedVideo, embedPlaylist } = require("../../util/embed");
const { log } = require("../../util/log-error");
const { play } = require("../play");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const yts = require("yt-search");

// Song Constructor
// @param title - The title of the video
// @param url - The url of the video
// @param thumbnail - The thumbnail of the video
// @param views - The amount of views the video has
// @param length - The length of the video
function song(title, url, thumbnail, views, length) {

    this.title = title
    this.url = url
    this.thumbnail = thumbnail
    this.views = views
    this.length = length

}

// Queue constructor
// @param songs - A list of songs to be played by the bot
// @param audioPlayer - The audio player attributed to the bot
// @param audioResource - The current audio resource being played by the bot
// @param channel - The channel the queue was instantiated in
// @param loopedCurrent - A boolean indicating if the current song is looped
// @param looped - A boolean indicating if the queue is looped
// @param index - An integer representing the current song being played in the queue (0 - start/first song in queue)
function queue(songs, audioPlayer, audioResource, channel, loopedCurrent, looped, index) {

    this.songs = songs;
    this.audioPlayer = audioPlayer;
    this.audioResource = audioResource;
    this.channel = channel;
    this.loopedCurrent = loopedCurrent;
    this.looped = looped;
    this.index = index;

}

// A function that converts seconds to duration (hours:minutes:seconds)
function secondsToDuration(seconds) {

    // Return the minutes:seconds if the duration is less than an hour, otherwise, return hours:minutes:seconds
    return ((seconds < 3600) ? (new Date(seconds * 1000).toISOString().substr(14, 5)) : (new Date(seconds * 1000).toISOString().substr(11, 8)));

}

// A function that adds a song to a server queue
async function addQueue(interaction, song) {

    // Check if there is a server queue
    if (!interaction.client.queues.get(interaction.guildId)) {

        const guildQueue = new queue([], null, null, interaction.channel, false, false, 0);

        // Add song to queue
        guildQueue.songs.push(song);

        // Add queue to map
        interaction.client.queues.set(interaction.guildId, guildQueue);

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
        .setDescription("queue a song for the bot to play!")
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

        // Attempt to get song information
        try {

            // Find if the song argument is a youtube playlist, video url, or set of keywords

            // Playlist
            if (ytpl.validateID(songArg)) {

                const playlist = (await ytpl(songArg));
                const songs = playlist.items;

                //playlistTitle = playlist.title;
                //playlistViews = playlist.views;

                // Loop through songs and add them to the queue
                for (const index of songs) {

                    //console.log(index);

                    title = index.title;
                    url = index.url;
                    thumbnail = index.bestThumbnail.url;
                    views = null;
                    length = secondsToDuration(index.durationSec);

                    // Song isn't available
                    if (title === null) {
                        reply = embed(interaction.member.user, "Queue", `:x: Couldn't queue the song/playlist. Make sure the link is public.`);
                        return await interaction.reply({ embeds: [reply] });
                    }

                    const currentSong = new song(title, url, thumbnail, views, length);
                    await addQueue(interaction, currentSong);

                }

                reply = embedPlaylist(interaction.member.user, "Queue", `:white_check_mark: Queued ${playlist.title} playlist.`, playlist);
                return await interaction.reply({ embeds: [reply] });

            }

            // Video url
            else if (ytdl.validateURL(songArg)) {

                const songInfo = await (await ytdl.getBasicInfo(songArg)).videoDetails;
                //console.log(songInfo);

                title = songInfo.title;
                url = songInfo.video_url;
                thumbnail = songInfo.thumbnails[0].url;
                views = parseInt(songInfo.viewCount);
                length = secondsToDuration(songInfo.lengthSeconds);

                // Song isn't available
                if (title === null) {
                    reply = embed(interaction.member.user, "Queue", `:x: Couldn't queue the song/playlist. Make sure the link is public.`);
                    return await interaction.reply({ embeds: [reply] });
                }

                const currentSong = new song(title, url, thumbnail, views, length);
                await addQueue(interaction, currentSong);

                reply = embedVideo(interaction.member.user, "Queue", `:white_check_mark: Successfully queued ${currentSong.title}`, currentSong);
                return await interaction.reply({ embeds: [reply] });

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

                    title = video.title;
                    url = video.url;
                    thumbnail = video.thumbnail;
                    views = video.views;
                    length = secondsToDuration(video.seconds);

                    // Song isn't available
                    if (title === null) {
                        reply = embed(interaction.member.user, "Queue", `:x: Couldn't queue the song/playlist. Make sure the link is public.`);
                        return await interaction.reply({ embeds: [reply] });
                    }

                    currentSong = new song(title, url, thumbnail, views, length);
                    await addQueue(interaction, currentSong);

                    reply = embedVideo(interaction.member.user, "Queue", `:white_check_mark: Successfully queued ${currentSong.title}`, currentSong);
                    return await interaction.reply({ embeds: [reply] });

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

    }

}
