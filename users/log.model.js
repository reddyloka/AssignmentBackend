const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    loginTime:{type:Date,default:''},
    logoutTime:{type:Date,default:''}
});


module.exports = mongoose.model('Logs', schema);