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
// @return - returns an embed
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

// A function that embeds the basic information of a video
// @param song - The song object to embed
// @param title - The title of the embed
// @param user - The person who sent the embed
// @return - returns an embed
module.exports.embedVideo = function(user, title, description, song) {

    const embed = {

        color: process.env.EMBED_COLOR,
        title: title,
        author: {
            name: user.username,
            icon_url: user.avatarURL(),
        },
        description: description,
        thumbnail: { url: song.thumbnail },
        fields: [

            // Link
            {
                name: "Link",
                value: song.url
            },
            // Views
            {
                name: "views",
                value: song.views.toString(),
                inline: true
            },
            // Length
            {
                name: "length",
                value: song.length,
                inline: true
            }

        ],
        timestamp: new Date(),

    }

    return embed;

}

// A funciton that embeds the basic information of a playlist
module.exports.embedPlaylist = function(user, title, description, playlist) {

    const embed = {

        color: process.env.EMBED_COLOR,
        title: title,
        author: {
            name: user.username,
            icon_url: user.avatarURL(),
        },
        description: description,
        thumbnail: { url: playlist.bestThumbnail.url },
        fields: [

            // Link
            {
                name: "Link",
                value: playlist.url
            },
            // Views
            {
                name: "views",
                value: playlist.views.toString(),
                inline: true
            },
            // Song count
            {
                name: "Playlist Size",
                value: playlist.items.length.toString(),
                inline: true
            }

        ],
        timestamp: new Date(),

    }

    return embed;

}
