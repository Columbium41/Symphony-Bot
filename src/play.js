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
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    return resource;

}

module.exports.play = async (client, guildId, channel) => {

    const currentQueue = client.queues.get(guildId);
    const connection = getVoiceConnection(guildId);

    // Create an audio player and subscribe to the connection (pauses if there are no subscribers)
    const audioPlayer = createAudioPlayer();
    connection.subscribe(audioPlayer);

    // Convert the song url to an audio resource
    let resource = convertURL(currentQueue.songs[0]);

    // Play the song
    audioPlayer.play(resource);
    sendMessage(currentQueue.songs[0], channel, client);

    // Wait for the song to finish and play the next song
    audioPlayer.on(AudioPlayerStatus.Idle, () => {

        currentQueue.songs.shift();

        // Leave the channel if the queue is over
        if (currentQueue.songs.length === 0) {

            try {

                connection.destroy();
                client.queues.delete(guildId);

                const reply = embed(client.user, "Queue Finished", ":wave: I'm not playing anything anymore.");
                channel.send({ embeds: [reply] });

            } catch (error) {

                console.log(error);
                log(error);

            }

        } else {

            // Get the next song and play it
            resource = convertURL(currentQueue.songs[0]);
            audioPlayer.play(resource);
            sendMessage(currentQueue.songs[0], channel, client);

        }

    });

}
