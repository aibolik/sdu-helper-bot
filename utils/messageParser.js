const NOT_PROVIDED = 'не указано';
const KEY_POSITION = 'Позиция: ';
const KEY_SALARY = 'Зарплата: ';
const KEY_CITY = 'Город: ';
const KEY_OCCUPATION = 'Занятость: ';
const KEY_CONTACTS = 'Контакты: ';
const KEY_DESCRIPTION = 'Описание: ';

function hasHashtags(text, hashtags) {
    if (Array.isArray(hashtags)) {
        for (let tag of hashtags) {
            if (text.indexOf(tag) >= 0) return true;
        }
        return false;
    } else {
        return text.indexOf(hashtags) >= 0;
    }
}

function log(message) {
    console.log(JSON.stringify(message));
}

function tryToParseVacancy(message, author) {
    var text = message.text

    var position = text.indexOf(KEY_POSITION) >= 0
        ? text.substring(text.indexOf(KEY_POSITION) + KEY_POSITION.length,
            text.indexOf('\n', text.indexOf(KEY_POSITION)))
        : NOT_PROVIDED;

    var salary = text.indexOf(KEY_SALARY) >= 0
        ? text.substring(text.indexOf(KEY_SALARY) + KEY_SALARY.length,
            text.indexOf('\n', text.indexOf(KEY_SALARY)))
        : NOT_PROVIDED;

    var city = text.indexOf(KEY_CITY) >= 0
        ? text.substring(text.indexOf(KEY_CITY) + KEY_CITY.length,
            text.indexOf('\n', text.indexOf(KEY_CITY)))
        : NOT_PROVIDED;

    var occupation = text.indexOf(KEY_OCCUPATION) >= 0
        ? text.substring(text.indexOf(KEY_OCCUPATION) + KEY_OCCUPATION.length,
            text.indexOf('\n', text.indexOf(KEY_OCCUPATION)))
        : NOT_PROVIDED;

    var contacts = text.indexOf(KEY_CONTACTS) >= 0
        ? text.substring(text.indexOf(KEY_CONTACTS) + KEY_CONTACTS.length,
            text.indexOf('\n', text.indexOf(KEY_CONTACTS)))
        : NOT_PROVIDED;

    var description = text.indexOf(KEY_DESCRIPTION) >= 0
        ? text.substring(text.indexOf(KEY_DESCRIPTION) + KEY_DESCRIPTION.length)
        : NOT_PROVIDED;

    if (position === NOT_PROVIDED) {
        throw new Error('No position provided');
    }

    return {
        position,
        salary,
        city,
        occupation,
        contacts,
        description,
        author: author._id,
        sourceChatId: message.sourceEvent.message.chat.id
    };
}

function getCommandsList(message) {
    var result = [];
    var entities = message.sourceEvent.message.entities;
    if (!entities || entities.length === 0) return [];
    for(let entity of entities) {
        if (entity.type === 'bot_command') {
            result.push(message.text.substring(entity.offset, entity.offset + entity.length));
        }
    }
    return result;
}

function formatVacancy(vacancy) {
    var result = '';
    result = result.concat(`*${KEY_POSITION}*${vacancy.position}`) + '\n';
    result = result.concat(`*${KEY_CITY}*${vacancy.city}`) + '\n';
    result = result.concat(`*${KEY_OCCUPATION}*${vacancy.occupation}`) + '\n';
    result = result.concat(`*${KEY_SALARY}*${vacancy.salary}`) + '\n';
    result = result.concat(`*${KEY_CONTACTS}*${vacancy.contacts}`) + '\n';
    result = result.concat(`*${KEY_DESCRIPTION}*\n${vacancy.description}`) + '\n';
    result = result.concat(`*Автор вакансии: *@${vacancy.author.telegramUsername}`);
    return result;
}

exports.log = log;
exports.hasHashtags = hasHashtags;
exports.tryToParseVacancy = tryToParseVacancy;
exports.getCommandsList = getCommandsList;
exports.formatVacancy = formatVacancy;