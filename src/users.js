const mongoose = require('mongoose');
const User = require('./models/users');

exports.get = function(id, callBack) {
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

exports.delete = function(id) {
    if (!id) {
        return Promise.reject(new Error("invalid id"));
    }
    
    return User.remove({
        _id: id
    })
}