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
            console.log( ("Successfully loaded the " + command.name + " command.").fontcolor("#00ff00") );

        } else {  // No command name

            console.log( ("Error while loading " + command + " command file.").fontcolor("#ff0000") );

        }

    }

}

