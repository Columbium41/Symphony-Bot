/*
 * Charley Liu
 * 2021-11-12
 * An event that runs when the bot is online
*/ 

module.exports = {

    name: "ready",
    once: true,

    execute(client) {
        console.log(`${client.user.username} has successfully logged in!`);
    }

}