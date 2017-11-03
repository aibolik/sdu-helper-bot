require('dotenv').config();
var fs = require('fs');

var builder = require('botbuilder');
var restify = require('restify');
var log = require('./utils/messageParser.js').log;
var hasHashtag = require('./utils/messageParser.js').hasHashtag;

// Telegram specific channel objects
var channelData = require('./telegram/channelData');

// for HTTPS
var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/sdubot.jsindev.party/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/sdubot.jsindev.party/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/sdubot.jsindev.party/chain.pem')
}

var server = restify.createServer(options);

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} is listening to ${server.url}`);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

const vacancyHashtag = '#vacancy';

var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    log('-------------------');
    log('Bot received message at \/ (root) dialog. Message below: ');

    var message = session.message;
    log(message);

    if (hasHashtag(message.text, vacancyHashtag)) {
        log('Message contains vacancy');
        var msg = new builder.Message(session);
        // var sourceEvent = {
        //     telegram: {
        //         sendMessage: {
        //             chat_id: message.sourceEvent.message.chat.id,
        //             text: 'This message contains vacancy',
        //             reply_to_message_id: message.sourceEvent.message.message_id
        //         }
        //     }
        // };
        // var sourceEvent = {
        //     telegram: {
        //         method: 'sendMessage',
        //         parameters: {
        //             chat_id: message.sourceEvent.message.chat.id,
        //             text: 'This message contains vacancy',
        //             reply_to_message_id: message.sourceEvent.message.message_id
        //         }
        //     }
        // };
        log('Event to be sent');
        var reply = new channelData.ReplyMessage(message, 'This message contains vacancy');
        log(reply);
        msg.sourceEvent(reply);
        session.send(msg);
    } else {
        session.send('I will ignore it in production');
    }
});


