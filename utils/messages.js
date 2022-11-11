var today = new Date();
var timeCurrent = today.getHours() + ":" + today.getMinutes() ;

function formatMessage(username, text) {
    return {
        username,
        text,
        time: timeCurrent,
    }
}

module.exports = formatMessage;