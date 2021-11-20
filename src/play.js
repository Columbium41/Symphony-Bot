/*
 * Charley Liu
 * 2021-11-13
 * A file that handles playing music
*/

const ytdl = require("ytdl-core");
const { embed } = require("../util/embed");
const { log } = require("../util/log-error");
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType, AudioPlayerStatus, getVoiceConnection } = require("@discordjs/voice");

// Send a message to a channel everytime a new song plays
// @param queue - The queue attributed to the server
// @param client - The client object
// @return - no return value
async function sendMessage(queue, client) {

    const message = embed(client.user, "Now Playing", `:musical_note: Now playing ${queue.songs[queue.index].title}`);
    await queue.channel.send( { embeds: [message] } );

}

// Convert youtube URLs to audio resources
// @param song - The song to be converted into an audio resource
// @return - no return value
async function convertURL(song) {

    const stream = ytdl( song.url, { filter: format => {format.codecs === 'opus'; format.container === "webm"}, filter: 'audioonly', highWaterMark:  1 << 25} );
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
            
        } else {

            const reply = embed(client.user, "Queue Finished", ":wave: I'm not playing anything anymore.");
            connection.destroy();
            return await queue.channel.send({ embeds: [reply] });

        }

    }

    // Convert the song url and create an audio resource
    queue.audioPlayer = createAudioPlayer();
    queue.resource = await convertURL(queue.songs[queue.index]);

    // Play the song
    queue.audioPlayer.play(queue.resource);
    sendMessage(queue, client);

    // subscribe to the connection
    connection.subscribe(queue.audioPlayer);

    // Look for state changes
    queue.audioPlayer.on('stateChange', (oldState, newState) => {

        console.log(`Audio player in ${guild.name} transitioned from ${oldState.status} to ${newState.status}`);

        // Song was skipped or bot left channel
        // wait for next song to buffer if the bot is still in the channel
        if (newState.status === "autopaused") {
            console.log("Song was skipped!");
        }

    });

    // Catch any errors/disconnects
    queue.audioPlayer.on('error', error => {
        console.log(`Error: ${error.message} with resource ${queue.resource}`);
    });

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
