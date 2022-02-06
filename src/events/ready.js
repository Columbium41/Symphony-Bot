/*
 * Charley Liu
 * 2021-11-12
 * An event that runs when the bot is online
*/ 

const { generateDependencyReport } = require('@discordjs/voice');

function updateStatus(client) {

    const numServers = client.guilds.cache.size;

    // Update the bot's status
    if (numServers > 1) {
        client.user.setActivity(`/ping | ${numServers} servers`, { type: "LISTENING" });
    } else {
        client.user.setActivity(`/ping | ${numServers} server`, { type: "LISTENING" });
    }

}

module.exports = async (client) => {

    await console.log(generateDependencyReport());

    // Update the bot's status every 5 minutes
    updateStatus(client);
    setInterval(function() {

        updateStatus(client);

    }, (1000 * 60 * 5));

    // Show every server the client is running on
    console.log(`List of guilds: (${client.guilds.cache.size})`);
    client.guilds.cache.forEach(guild => {

        console.log(`${guild.name}`);

    })

    await console.log(`\n${client.user.username} has successfully logged in!`);

}
