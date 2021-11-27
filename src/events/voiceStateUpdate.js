/*
 * Charley Liu
 * 2021-11-27
 * An event that runs when a voice state change occurs
*/
const { getVoiceConnection } = require("@discordjs/voice");
const { embed } = require("../../util/embed");

module.exports = async (client, oldState, newState) => {

    const guild = newState.guild;
    const botVC = guild.me.voice;
    const queue = client.queues.get(guild.id);

    if (botVC.channel === null) return;

    // Make the bot leave the VC if it's the only member in the vc and it's currently playing something
    if (botVC.channel.members.size === 1 && queue) {

        client.queues.delete(guild.id);
        getVoiceConnection(guild.id).destroy();
        const reply = embed(client.user, "Leave", ":wave: No one's in the VC anymore.");
        return await queue.channel.send({ embeds: [reply] });

    }

}
