// Get environment variables
const dotenv = require("dotenv");
dotenv.config();

// Get the necessary discord.js classes
const { Client, Intents } = require("discord.js");

// Create a new client instance
// Client is shared across all servers
const client = new Client( { intents: [Intents.FLAGS.GUILDS] } );

// Login to discord
client.login(process.env.CLIENT_TOKEN);
