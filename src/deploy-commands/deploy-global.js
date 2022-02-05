/*
 * Charley Liu
 * 2021-11-12
 * Deploys all commands to all servers the bot is in
*/

const dotenv = require("dotenv");
dotenv.config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync("./src/commands/").filter(file => file.endsWith(".js"));

// Push all command data to commands list
for (const file of commandFiles) {

    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());

}

const rest = new REST( {version: "9"} ).setToken(process.env.CLIENT_TOKEN);
const { log } = require("../../util/log-error");

// Push commands to guild
(async() => {

    try {

        console.log("Started refreshing application global commands.");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands},
        );

        console.log("Successfully refreshed application global commands");

    } catch (error) {
        
        console.log(error);
        log(error);

    }

})();
