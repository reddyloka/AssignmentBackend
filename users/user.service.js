const config = require('config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const Logs=db.Logs;

module.exports = {
    authenticate,
    updateLogoutTime,
    getAll,
    getAllAudits,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    console.log("user",username)
    const user = await User.findOne({ username });
    console.log("user",user)
    if (user && bcrypt.compareSync(password, user.hash)) {
        const log = new Logs({ loginTime: new Date() })
        console.log(log);
        await log.save();
        user.activity.push(log._id);
        await user.save();
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token,
            currentSession : log._id
        };
    }
} 

async function updateLogoutTime({ _id,logoutTime }) {
    console.log("user",_id,logoutTime)
    const log = await Logs.updateOne({ _id} ,{$set:{logoutTime}});
    console.log("userlog",log)
    if (log) {
        return {
            success:true
        };
    }
}

async function getAll() {
    return await User.find().select('-hash')
}

async function getAllAudits(_id) {
   let exists= await User.countDocuments({_id,role:"auditor"})
   console.log(exists)
    if(exists)
    return await User.find().select('-hash').populate({path:'activity'});
    else 
    return "";
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username ,role:userParam.role})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);
console.log("user",user)
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}