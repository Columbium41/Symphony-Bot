/* 
 * Charley Liu
 * 2021-11-12
 * A file that retrieves all commands
*/

const fs = require("fs");
const { log } = require("../../util/log-error");

module.exports = (client) => {

    // Get all command files
    const commandFiles = fs.readdirSync("./src/commands/").filter(file => file.endsWith(".js"));

    // Traverse all command files
    for (const file of commandFiles) {
    
        const command = require(`../commands/${file}`);

        if (command.data.name) {  // Command Name exists

            client.commands.set(command.data.name, command);
            console.log("\033[32mSuccessfully loaded the " + command.data.name + " command.\033[0m");

        } else {  // No command name

            console.log("\033[31mError while loading " + file + " command file.\033[0m");
            log("Error while loading " + file + " command file."); 

        }

    }

}

