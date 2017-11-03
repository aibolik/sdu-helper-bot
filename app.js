// load all environment variables
require('dotenv').config();

var fs = require('fs');
var builder = require('botbuilder');
var restify = require('restify');
var mongoose = require('mongoose');

var log = require('./utils/messageParser.js').log;
var hasHashtags = require('./utils/messageParser.js').hasHashtags;

// Telegram specific channel objects
var channelData = require('./telegram/channelData');

// kind a RestAPI to interact with MongoDB server
var api = require('./api');

// for HTTPS
var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/sdubot.jsindev.party/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/sdubot.jsindev.party/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/sdubot.jsindev.party/chain.pem')
}

var server = restify.createServer(options);

const dbUrl = `mongodb://${process.env.MLAB_DB_USERNAME}:${process.env.MLAB_DB_PASSWORD}@ds245715.mlab.com:45715/sdu`;
mongoose.connect(dbUrl, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));


server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} is listening to ${server.url}`);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

const vacancyHashtags = ['#vacancy', '#вакансия'];

var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    log('-------------------');
    log('Bot received message at \/ (root) dialog. Message below: ');

    var message = session.message;
    log(message);

    if (hasHashtags(message.text, vacancyHashtags)) {
        log('Message contains vacancy');
        var msg = new builder.Message(session);
        var reply = new channelData.ReplyMessage(message, 'This message contains vacancy');
        var userRequest = api.findOrCreateUser(message.sourceEvent.message.from.id, message.sourceEvent.message.from);
        userRequest.then(user => {
            console.log('We got a user');
            log(user);
        }).catch(err => {
            console.log(err);
        });
        msg.sourceEvent(reply);
        session.send(msg);
    } else {
        session.send('I will ignore it in production');
    }
});


