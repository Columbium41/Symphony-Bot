/*
 * Charley Liu
 * 2021-11-12
 * An event that runs when the bot is online
*/ 

const { generateDependencyReport } = require('@discordjs/voice');

module.exports = async (client) => {

    //await console.log(generateDependencyReport());
    await console.log(`${client.user.username} has successfully logged in!`);

}
