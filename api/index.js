var User = require('../models/user');

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
                console.log('exists');
                return resolve(user);
            } else {
                console.log('Creating new one');
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
                    console.log('created!')
                    resolve(product);
                })
            }
        }).catch(err => {
            return reject(err);
        })
    });
};

exports.getUserById = getUserById;
exports.findOrCreateUser = findOrCreateUser;