/*
 * Charley Liu
 * 2021-11-13
 * A file that handles playing music
*/

const dotenv = require("dotenv");
dotenv.config();
const ytdl = require("ytdl-core");
const { embed } = require("../util/embed");
const { log } = require("../util/log-error");
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require("@discordjs/voice");

// Send a message to a channel everytime a new song plays
// @param song - The song that is currently playing
// @param client - The client object
// @return - no return value
async function sendMessage(queue, client) {

    const message = embed(client.user, "Now Playing", `:musical_note: Now playing ${queue.songs[queue.index].title}`);
    message.thumbnail = { url: queue.songs[queue.index].thumbnail };
    await queue.channel.send({ embeds: [message] });

}

// Convert youtube URLs to audio resources with inline volume
// @param song - The song to be converted into an audio resource
// @returns - An audio resource with inline volume
async function createResourceInline(song) {

    // Create an audio stream, check if the song url exists, otherwise throw an error
    if (!song.url) {
        return null;
    }
    const stream = ytdl(song.url, { filter: format => { format.codecs === "opus"; format.container === "webm" }, filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream, { inlineVolume: true });
    resource.volume.setVolume(0.05);
    return resource;

}

// Convert youtube URLs to audio resources
// @param song - The song to be converted into an audio resource
// @returns - An audio resource
async function createResource(song) {

    // Create an audio stream
    const stream = ytdl(song.url, { filter: format => { format.codecs === "opus"; format.container === "webm" }, filter: 'audioonly', highWaterMark: 1 << 25 });
    return createAudioResource(stream);

}

// A function that plays music
// @param client - The client object
// @param guild - The guild that has instantiated this function
// @return - An embedded message to the channel that instantiated this play function
module.exports.play = async (client, guild) => {

    // Get the queue and connection
    const queue = client.queues.get(guild.id);
    const connection = getVoiceConnection(guild.id);

    // Check if the queue is over
    if (queue.index >= queue.songs.length) {

        // If the playlist is looped, go back to the first song in the queue
        if (queue.looped) {

            queue.index = 0;

        }

        // Leave the channel
        else {

            client.queues.delete(guild.id);
            connection.destroy();
            const reply = embed(client.user, "Queue Finished", ":wave: I'm not playing anything anymore.");
            await queue.channel.send({ embeds: [reply] });

        }

    }

    // Convert the song url and create an audio resource
    queue.audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    queue.resource = await createResourceInline(queue.songs[queue.index]);

    // Error occured while creating audio resource
    if (queue.resource === null) {

        const message = embed(client.user, "Error Playing", `:question: An error occured when trying to play ${queue.songs[queue.index].title}.\nAttempting to skip to the next song...`);
        await queue.channel.send({ embeds: [message] });

    } else {

        // Play the song
        queue.audioPlayer.play(queue.resource);
        sendMessage(queue, client);

        // subscribe to the connection
        connection.subscribe(queue.audioPlayer);

        // Catch any errors/disconnects
        queue.audioPlayer.on('error', async error => {

            console.log(`Error: ${error.message} with resource ${queue.resource.metadata}`);
            const message = embed(client.user, "Error Playing", `:question: An error occured when trying to play ${queue.songs[queue.index].title}.\nAttempting to skip to the next song...`);
            await queue.channel.send({ embeds: [message] });

        });

    }

    // Wait for the song to finish
    queue.audioPlayer.on(AudioPlayerStatus.Idle, () => {

        // Increase the queue index if the current song isn't looped
        if (!queue.loopedCurrent) {
            queue.index += 1;
        }

        queue.audioPlayer.stop();
        this.play(client, guild);

    });

}
