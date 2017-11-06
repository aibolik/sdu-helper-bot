var User = require('../models/user');
var Vacancy = require('../models/vacancy');

// User API
function getUserById(userId) {
    return new Promise(function (resolve, reject) {
        User.find({telegramChatId: userId}, 'telegramUsername')
            .exec(function (err, users_list) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(users_list[0]);
            });
    });
}


function findOrCreateUser(userId, from = { first_name: '', last_name: '', username: ''}) {
    return new Promise((resolve, reject) => {
        getUserById(userId).then(user => {
            if (user) {
                return resolve(user);
            } else {
                var newUser = new User({
                    telegramChatId: userId,
                    telegramUsername: from.username,
                    telegramFirstName: from.first_name,
                    telegramLastName: from.last_name
                });
                newUser.save((err, product) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(product);
                })
            }
        }).catch(err => {
            return reject(err);
        })
    });
};

// Vacancy API
function createVacancy(vacancyObject) {
    return new Promise((resolve, reject) => {
        var vacancy = new Vacancy(vacancyObject);
        vacancy.save((err, product) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
            return;
        })
    });
}

function listVacancies() {
    return new Promise((resolve, reject) => {
        Vacancy.find({}).populate('author')
            .exec((err, vacancyList) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(vacancyList);
            });
    });
}

// User API
exports.getUserById = getUserById;
exports.findOrCreateUser = findOrCreateUser;

// Vacancy API
exports.createVacancy = createVacancy;
exports.listVacancies = listVacancies;