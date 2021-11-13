/* 
 * Charley Liu
 * 2021-11-12
 * A file that embeds short messages
*/

const dotenv = require("dotenv");
dotenv.config();

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
