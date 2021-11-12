/* 
 * Charley Liu
 * 2021-11-12
 * A file that retrieves all commands
*/

const fs = require("fs");

module.exports = (client) => {

    // Get all command files
    const commandFiles = fs.readdirSync("./src/commands/").filter(file => file.endsWith(".js"));

    // Traverse all command files
    for (const file of commandFiles) {
    
        const command = require(`../commands/${file}`);

        if (command.name) {  // Command Name exists

            client.commands.set(command.name, command);
            console.log("\033[32mSuccessfully loaded the " + command.name + " command.\033[0m");

        } else {  // No command name

            console.log("\033[31mError while loading " + command + " command file.\033[0m");

        }

    }

}

