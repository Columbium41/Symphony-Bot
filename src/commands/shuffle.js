/*
 * Charley Liu
 * 2021-11-21
 * A command that shuffles the bot's queue
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../../util/embed");
const { log } = require("../../util/log-error");

module.exports = {

    // Command Data
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("shuffle the queue")
        .setDefaultPermission(true),

    // Execute Command
    async run(interaction) {

        // Check to see if there is a queue and the user is in the same channel as the bot
        const userVC = interaction.member.voice.channel;
        const botVC = interaction.guild.me.voice.channel;
        const queue = interaction.client.queues.get(interaction.guildId);
        if (botVC === null) {
            reply = embed(interaction.member.user, "Shuffle", ":x: I'm currently not in a voice channel.");
            return await interaction.reply({ embeds: [reply] });
        }
        else if (botVC !== userVC) {
            reply = embed(interaction.member.user, "Shuffle", ":x: You must be in the same voice channel as me to use this command.");
            return await interaction.reply({ embeds: [reply] });
        }
        else if (!queue || queue.songs.length === 0) {
            reply = embed(interaction.member.user, "Shuffle", ":x: There are no songs in the queue to shuffle.");
            return await interaction.reply({ embeds: [reply] });
        }

        // Get the queue and shuffle the songs by taking the songs and randomizing their indexes
        try {

            // Randomize song indexes
            // Skip if the queue's size is less than 3
            for (let i = 0; ( (queue.songs.length > 2) && (i < queue.songs.length * 3) ); i++) {

                randomIndexOne = Math.floor(Math.random() * queue.songs.length);
                randomIndexTwo = Math.floor(Math.random() * queue.songs.length);

                // Check if the random indexes aren't the current song playing
                if (randomIndexOne === queue.index || randomIndexTwo === queue.index) {
                    continue;
                } else {
                    
                    // Create a deep copy of the song object at random index one and swap the songs in the queue
                    const temp = JSON.parse(JSON.stringify(queue.songs[randomIndexOne]));

                    queue.songs[randomIndexOne] = queue.songs[randomIndexTwo];
                    queue.songs[randomIndexTwo] = temp;

                }

            }

            reply = embed(interaction.member.user, "Shuffle", ":twisted_rightwards_arrows: Successfully shuffled the queue.");
            return await interaction.reply({ embeds: [reply] });

        } catch (error) {

            log(error);
            console.log(error);

            const reply = embed(interaction.client.user, "Error", ":sweat_smile: An error occured while attempting to shuffle the queue.");
            return await interaction.reply({ embeds: [reply] });

        }
        
    }

}
