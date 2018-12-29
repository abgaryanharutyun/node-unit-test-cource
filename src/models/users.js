var mongoose = require('mongoose');
var usersSchema = new mongoose.Schema({
    name: String,
    email: String,
});
module.exports = mongoose.model('User', usersSchema)