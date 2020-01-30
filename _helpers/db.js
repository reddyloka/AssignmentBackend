const config = require('config.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://anvesh:chat123@ds117846.mlab.com:17846/chat_reddy' || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

mongoose.set('debug',true)
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Logs:require('../users/log.model')
};