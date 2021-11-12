/*
 * Charley Liu
 * 2021-11-12
 * An event that runs when an interaction is created with the bot
*/ 

module.exports = {

    name: "interactionCreate",
    once: false,

    execute(interaction) {
        console.log(interaction.user.username + " created an interaction!");
    }

}
