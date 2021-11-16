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

    const message = embed(client.user, "Now Playing", `:musical_note: Now playing ${queue.songs[0].title}`);
    await queue.channel.send( { embeds: [message] } );

}

// Convert youtube URLs to audio resources
// @param song - The song to be converted into an audio resource
// @return - no return value
function convertURL(song) {

    const resource = ytdl(song.url, { filter: "audioonly" });
    return createAudioResource(resource , { inputType: StreamType.Arbitrary });

}

// A function that plays music
// @param client - The client object
// @param guildId - The ID of the guild that has instantiated this function
// @return - An embedded message to the channel that instantiated this play function
module.exports.play = async (client, guildId) => {
    
    // Get the queue and connection
    const queue = client.queues.get(guildId);
    const connection = getVoiceConnection(guildId);

    // Check if the queue is empty
    if (queue.songs.length === 0) {

        const reply = embed(interaction.client.user, "Queue Finished", ":wave: I'm not playing anything anymore.");
        connection.destroy();
        return await queue.channel.send({ embeds: [reply] });

    }

    // Convert the song url and create an audio resource
    queue.audioPlayer = createAudioPlayer();
    queue.resource = convertURL(queue.songs[0]);

    // Play the song
    queue.audioPlayer.play(queue.resource);
    sendMessage(queue, client);

    // subscribe to the connection
    connection.subscribe(queue.audioPlayer);

    // Catch any errors
    queue.audioPlayer.on('error', error => {
        console.log(`Error: ${error.message} with resource ${queue.resource.metadata}`);
    });

    // Wait for the song to finish and play the next song
    queue.audioPlayer.on(AudioPlayerStatus.Idle, () => {

        // Shift queue and play next song
        queue.songs.shift();
        queue.audioPlayer.stop();
        this.play(client, guildId);

    });

}
