/* 
 * Charley Liu
 * 2021-11-12
 * A file that writes to a text file containing error logs
*/

const fs = require("fs");

module.exports.log = async function(message) {

    // Write to log file
    fs.writeFile("./logs.txt", message, (err) => {
        
        // Error while logging to file
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully logged error to file");
        }

    })

}

