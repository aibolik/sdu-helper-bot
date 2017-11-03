var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = Schema({
    telegramChatId: { type: Number },
    telegramUsername: { type: String },
    telegramFirstName: { type: String },
    telegramLastName: { type: String }
});

module.exports = mongoose.model('User', UserSchema);