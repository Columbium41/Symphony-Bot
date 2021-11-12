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

            client.on(event.name, event.bind(null, client));
            console.log( ("Successfully binded the " + event.name + " event.").fontcolor("#00ff00") );

        } else {  // Event name does not exist

            console.log( ("Error while loading " + event + " event file.").fontcolor("#ff0000") );

        }

    }

}
