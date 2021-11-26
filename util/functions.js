// A function that converts seconds to duration (hours:minutes:seconds)
module.exports.secondsToDuration = (seconds) => {

    // Return the minutes:seconds if the duration is less than an hour, 
    // otherwise, return hours:minutes:seconds
    return ((seconds < 3600) ? (new Date(seconds * 1000).toISOString().substr(14, 5)) : (new Date(seconds * 1000).toISOString().substr(11, 8)));

}