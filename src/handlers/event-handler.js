/* 
 * Charley Liu
 * 2021-11-12
 * A file that retrieves all events and binds them
*/

const fs = require("fs");

module.exports = (client) => {

    // Get all event files
    const eventsFiles = fs.readdirSync("./src/events/").filter(file => file.endsWith(".js"));

    // Traverse all event files
    for (const file of eventsFiles) {

        const event = require(`../events/${file}`);
        
        if (event.name) {  // Event name exists

            client.on(event.name, (client) => event.execute(client));
            console.log("\033[32mSuccessfully binded the " + event.name + " event.\033[0m");

        } else {  // Event name does not exist

            console.log("\033[31mError while loading " + event + " event file.\033[0m");

        }

    }

}
