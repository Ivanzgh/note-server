const mongoose = require('mongoose');

const user = new mongoose.Schema({
    avatar: String,
    username: String,
    email: {
        type: String,
        //唯一且必须
        unique: true,
        required: true
    },
    password: String,
}, {versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}});

module.exports = mongoose.model('user', user);