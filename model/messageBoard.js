const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageBoard = new mongoose.Schema({
    content: String,
    author: {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
}, {versionKey: false, timestamps: {createdAt: "createTime", updatedAt: "updateTime"}})

module.exports = mongoose.model("messageBoard", messageBoard);