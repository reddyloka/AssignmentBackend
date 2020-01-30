const mongoose = require('mongoose');
// const Logs=mongoose.model('Logs');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role:{ type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    activity :[{type:mongoose.Types.ObjectId,ref:"Logs"}]  
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);