var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VacancySchema = Schema({
    position: { type: String, required: true, max: 200 },
    salary: { type: String, max: 100 },
    city: { type: String, max: 100},
    occupation: { type: String, max: 100},
    contacts: { type: String, max: 200 }
    description: { type: String },
    author: { type: Schema.ObjectId, ref='User', required: true },
    sourceChatId: { type: Number }
});

module.exports = mongoose.model('Vacancy', VacancySchema);