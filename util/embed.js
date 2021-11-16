/* 
 * Charley Liu
 * 2021-11-12
 * A file that embeds short messages
*/

const dotenv = require("dotenv");
dotenv.config();

// A function that embeds messages with a title and description
// @param user - The user that the embed should contain
// @param title - The title of the embed
// @param description - The description of the embed
// @return - returns the embed
module.exports.embed = function(user, title, description) {

    const embed = {

        color: process.env.EMBED_COLOR,
        title: title,
        author: {
            name: user.username,
            icon_url: user.avatarURL(),
        },
        description: description,
        timestamp: new Date(),

    };

    return embed;

}
