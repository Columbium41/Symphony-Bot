/* 
 * Charley Liu
 * 2021-11-12
 * The index file of the bot
*/

// Get environment variables
const dotenv = require("dotenv");
dotenv.config();

// Get the necessary discord.js classes
const { Client, Intents, Collection } = require("discord.js");

// Create a new client instance
// The client instance is shared across all guilds the bot is in
const client = new Client( { intents: [Intents.FLAGS.GUILDS] } );
client.commands = new Collection();

// Require handler files
const fs = require("fs");
fs.readdir("./src/handlers/", (error, files) => {

    if (error) {

        console.log(error);
        process.exit(1);

    } else {

        // Require all handler files (pass in client)
        files.forEach(file => {
            
            if (file.endsWith(".js")) {
                require(`./handlers/${file}`)(client);
            }

        })

    }

});

// Login to discord
client.login(process.env.CLIENT_TOKEN);
