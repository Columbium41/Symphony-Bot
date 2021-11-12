/*
 * Charley Liu
 * 2021-11-12
 * Deploys all commands to the testing server
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

        console.log("Started refreshing application guild commands.");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID),
            {body: commands},
        );

        console.log("Successfully refreshed application guild commands");

    } catch (error) {
        
        console.log(error);
        log(error);

    }

})();
