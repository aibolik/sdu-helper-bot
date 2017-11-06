// load all environment variables
require('dotenv').config();

var fs = require('fs');
var builder = require('botbuilder');
var restify = require('restify');
var mongoose = require('mongoose');

var utils = require('./utils/messageParser');
// var log = require('./utils/messageParser.js').log;
var log = utils.log;
// var hasHashtags = require('./utils/messageParser.js').hasHashtags;
// var tryToParseVacancy = require('./utils/messageParser.js').tryToParseVacancy;

// Only texts
var texts = require('./utils/texts');

// Telegram specific channel objects
var channelData = require('./telegram/channelData');

// kind a RestAPI to interact with MongoDB server
var api = require('./api');

const COMMAND_VACANCY_LIST = '/vacancylist';

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

    if (utils.hasHashtags(message.text, vacancyHashtags)) {
        log('Message contains vacancy');
        let msg = new builder.Message(session);
        let reply = new channelData.ReplyMessage(message, texts.TEXT_MESSAGE_HAS_VACANCY);
        let userRequest = api.findOrCreateUser(message.sourceEvent.message.from.id, message.sourceEvent.message.from);
        userRequest.then(user => {
            console.log('We got a user');
            log(user);
            let vacancy = utils.tryToParseVacancy(message, user);
            log(vacancy);
            let vacancyRequest = api.createVacancy(vacancy);
            vacancyRequest.then(result => {
                if (result === true) {
                    log('Success, we created vacancy');
                    msg.sourceEvent(reply);
                    session.send(msg);
                } else {
                    log('We got some error creating vacancy');
                    log(result);
                    session.send(texts.TEXT_ERROR_CREATE_VACANCY);
                }
            });
        }).catch(err => {
            console.log(err);
        });
    } else {
        var commandsList = utils.getCommandsList(message);
        for (let command of commandsList) {
            if (command.indexOf(COMMAND_VACANCY_LIST) !== -1) {
                var listVacanciesRequest = api.listVacancies();
                listVacanciesRequest.then(vacancyList => {
                    let text = '';
                    if (vacancyList.length === 0) {
                        text = 'Список вакансии пуст :(';
                    } else {
                        text = '*Список вакансии:* \n\n';
                    }
                    for (let i in vacancyList) {
                        text = text + `*${parseInt(i + 1)}.* `;
                        text = text.concat(utils.formatVacancy(vacancyList[i])) + '\n\n';
                    }
                    log(text);
                    let msg = new builder.Message(session);
                    let reply = new channelData.ReplyMessage(message, text, 'markdown');
                    msg.sourceEvent(reply);
                    session.send(msg);
                })
            }
        }
    }
});


