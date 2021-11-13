/* 
 * Charley Liu
 * 2021-11-12
 * A file that writes to a text file containing error logs
*/

const fs = require("fs");

module.exports.log = async function (message) {

    // Get current log contents and concatenate message to log contents
    const logContents = fs.readFileSync("./logs.txt", "utf-8", (err) => {
        if (err) {
            console.log(err);
        }
    });

    // Get current date
    const date = new Date().toLocaleString();

    // Write to log file
    fs.writeFile("./logs.txt", (logContents + date + " - " + message + "\n"), (err) => {

        // Error while logging to file
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully logged error to file");
        }

    })

}

