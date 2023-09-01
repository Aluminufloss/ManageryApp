const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {type: String, unique: false, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    avatar: {type: String, required: false},
    isActiveted: {type: Boolean, required: false},
    activationCode: {type: String, required: true}
});

module.exports = model('User', UserSchema);