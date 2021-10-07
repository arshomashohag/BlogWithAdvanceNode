const mongoogse = require('mongoose');

const User = mongoogse.model('User');

module.exports = ()=>{
    return new User({}).save();
}