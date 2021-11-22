/*
 * Charley Liu
 * 2021-11-12
 * An event that runs when the bot is online
*/ 

const { generateDependencyReport } = require('@discordjs/voice');

module.exports = async (client) => {

    //await console.log(generateDependencyReport());

    // Show every server the client is running on
    console.log("List of guilds:");
    client.guilds.cache.forEach(guild => {

        console.log(`${guild.name}`);

    })

    await console.log(`\n${client.user.username} has successfully logged in!`);

}
