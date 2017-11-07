require('dotenv').config();

var fetch = require('isomorphic-fetch');

const BASE_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`;
const METHOD_SEND_MESSAGE = 'sendMessage';


function sendToChannel(channelUsername, text, parse_mode = null) {
    return fetch(BASE_URL + METHOD_SEND_MESSAGE, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            chat_id: channelUsername,
            text
        })
    });
}

exports.sendToChannel = sendToChannel;