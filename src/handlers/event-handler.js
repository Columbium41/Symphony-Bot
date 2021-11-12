/* 
 * Charley Liu
 * 2021-11-12
 * A file that retrieves all events and binds them
*/

const fs = require("fs");
const { log } = require("../../util/log-error");

module.exports = (client) => {

    // Get all event files
    const eventsFiles = fs.readdirSync("./src/events/").filter(file => file.endsWith(".js"));

    // Traverse all event files
    for (const file of eventsFiles) {

        const event = require(`../events/${file}`);
        const eventName = file.split(".")[0];
        
        if (eventName) {  // Event name exists

            client.on(eventName, event.bind(null, client));
            console.log("\033[32mSuccessfully binded the " + eventName + " event.\033[0m");

        } else {  // Event name does not exist

            console.log("\033[31mError while loading " + file + " event file.\033[0m");
            log("Error while loading " + file + " event file.");

        }

    }

}
