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
async function sendMessage(song, channel, client) {

    const message = embed(client.user, "Now Playing", `:musical_note: Now playing ${song.title}`);
    await channel.send( { embeds: [message] } );

}

// Convert youtube URLs to audio resources
function convertURL(song) {

    const stream = ytdl(song.url, { filter: "audioonly" });
    return (createAudioResource(stream, { inputType: StreamType.Arbitrary }));

}

module.exports.play = async (client, guildId) => {

    const queue = client.queues.get(guildId);
    const connection = getVoiceConnection(guildId);

    // Check if the queue is empty
    if (queue.songs.length === 0) {

        const reply = embed(interaction.client.user, "Queue Finished", ":wave: I'm not playing anything anymore.");
        return await queue.channel.send({ embeds: [reply] });

    }

    // Convert the song url and create an audio resource
    queue.audioPlayer = createAudioPlayer();
    queue.resource = convertURL(queue.songs[0]);

    // Play the song
    queue.audioPlayer.play(queue.resource);
    sendMessage(queue.songs[0], queue.channel, client);

    // subscribe to the connection
    connection.subscribe(queue.audioPlayer);

    // Wait for the song to finish and play the next song
    queue.audioPlayer.on(AudioPlayerStatus.Idle, () => {

        // Shift queue and destroy audio player and audio resource
        queue.songs.shift();
        queue.resource.destroy();
        queue.audioPlayer.destroy();
        this.play(client, guildId, queue.channel);

    });

}
