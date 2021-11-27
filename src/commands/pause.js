/*
 * Charley Liu
 * 2021-11-13
 * A command that pauses/unpauses the current song in queue
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pauses/unpauses the current song")
        .setDefaultPermission(true),

    async run(interaction) {

        let reply = null;

        // Check if:
        // The bot is in a vc
        // The user is in the same vc as the bot
        // The bot is currently playing something
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        const queue = interaction.client.queues.get(interaction.guildId);
        if (botVC === null) {
            reply = embed(interaction.member.user, "Pause", ":x: I'm currently not in a voice channel.");
            return await interaction.reply({ embeds: [reply] });
        }
        else if (userVC !== botVC) {
            reply = embed(interaction.member.user, "Pause", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }
        else if (!queue || queue.songs.length === 0) {
            reply = embed(interaction.member.user, "Pause", ":x: I'm currently not playing anything.");
            return await interaction.reply({ embeds: [reply] });
        }

        // Pause/Unpause the audio player
        if (queue.audioPlayer.state.status === "paused") {
            queue.audioPlayer.unpause();
            reply = embed(interaction.member.user, "Pause", ":arrow_forward: Unpaused the current song.");
        }
        else {
            queue.audioPlayer.pause();
            reply = embed(interaction.member.user, "Pause", ":pause_button: Paused the current song.");
        }

        return await interaction.reply({ embeds: [reply] });

    }

}
