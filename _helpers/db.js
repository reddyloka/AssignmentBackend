const config = require('config.js');
const mongoose = require('mongoose');
mongoose.connect( process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

mongoose.set('debug',true)
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Logs:require('../users/log.model')
};