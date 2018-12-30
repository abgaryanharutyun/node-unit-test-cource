const mongoose = require('mongoose');
const User = require('./models/users');
const mailer = require('./mailer');

exports.get = function (id, callBack) {
    if (!id) {
        return callBack(new Error("Invalid user id"));
    }
    User.findById(id, (err, result) => {
        if (err) {
            return callBack(err)
        }
        return callBack(null, result);
    })
}

exports.delete = function (id) {
    if (!id) {
        return Promise.reject(new Error("invalid id"));
    }

    return User.remove({
        _id: id
    })
}

exports.create = function (data) {
    if (!data || !data.email || !data.name) {
        return Promise.reject(new Error('Invalid arguments'));
    }

    var user = new User(data);

    return user.save().then((result) => {
        return mailer.sendWelcomeEmail(data.email, data.name).then(() => {
            return {
                message: 'User created',
                userId: result.id,
            }
        }).catch((err) => {
            return Promise.reject(err);
        });
    })
}

exports.update = async function(id, data) {
    try{
        const user = await User.findById(id);

        for (var props in data){
            user[props] = data[props];
        }

        var result = await user.save();
        return result;
    }catch(err){
        return Promise.reject(err);
    }
}

exports.resetPassword = function(email) {
    if (!email) {
        return Promise.reject(new Error('Invalid email'));
    }


    return mailer.sendPasswordResetEmail(email);
}