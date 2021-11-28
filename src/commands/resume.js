/*
 * Charley Liu
 * 2021-11-28
 * A command that resumes the current song in queue
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resume the current song")
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
            reply = embed(interaction.member.user, "Resume", ":x: I'm currently not in a voice channel.");
            return await interaction.reply({ embeds: [reply] });
        }
        else if (userVC !== botVC) {
            reply = embed(interaction.member.user, "Resume", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }
        else if (!queue || queue.songs.length === 0) {
            reply = embed(interaction.member.user, "Resume", ":x: I'm currently not playing anything.");
            return await interaction.reply({ embeds: [reply] });
        }

        // Resume the audio player if it currently isn't playing
        if (queue.audioPlayer.state.status !== "playing") {

            queue.audioPlayer.unpause();
            reply = embed(interaction.member.user, "Resume", ":arrow_forward: Resumed the current song.");

        }
        else {

            reply = embed(interaction.member.user, "Resume", ":arrow_forward: The current song is already playing.");

        }

        return await interaction.reply({ embeds: [reply] });

    }

}
