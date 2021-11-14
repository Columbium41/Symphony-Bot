/*
 * Charley Liu
 * 2021-11-12
 * A command that makes the leave the VC
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { VoiceConnectionStatus, getVoiceConnection } = require("@discordjs/voice");
const { embed } = require("../../util/embed");
const { log } = require("../../util/log-error");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave the voice channel")
        .setDefaultPermission(true),

    // Executre Command
    async run(interaction) {

        let reply = null;

        // Check if the bot is in a voice channel and if the user is in the same voice channel
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        if (botVC === null) {
            reply = embed(interaction.member.user, "Leave", ":x: I'm currently not in a voice channel.");
            return await interaction.reply({ embeds: [reply] });
        }
        if (userVC !== botVC) {
            reply = embed(interaction.member.user, "Leave", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }

        // Check if there is an existing connection for this server
        const connection = getVoiceConnection(interaction.guildId);
        if (connection) {

            // Send a message once the bot's connection has been destroyed
            connection.on(VoiceConnectionStatus.Destroyed, async () => {
                reply = embed(interaction.member.user, "Leave", `:wave: Successfully left ${userVC.name}.`);
                await interaction.reply({ embeds: [reply] });
            });

            // Destroy the connection and queue
            connection.destroy();
            interaction.client.queues.delete(interaction.guildId);

        } else {

            reply = embed(interaction.member.user, "Leave", ":sweat_smile: There seems to be no connection in this server.");
            log(`Attempted to leave a voice channel in ${interaction.guild.name} while there was no existing connection.`);
            return await interaction.reply({ embeds: [reply] });

        }

    }

}
