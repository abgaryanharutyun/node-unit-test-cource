var mongoose = require('mongoose');
var usersSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    age: Number,
});
module.exports = mongoose.model('User', usersSchema)