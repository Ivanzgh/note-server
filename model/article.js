const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const article = new mongoose.Schema({
    author: {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    title: {
        type: String,
        index: 1
    },
    content: String,   //富文本
    contentText: String,  //非富文本
    category : {
        type : Schema.Types.ObjectId,
        ref : 'category'
    },
    looknums: {
        type: Number,
        default: 0,
    },
    commontnums: {
        type: Number,
        default: 0
    },
}, {versionKey: false, timestamps: {createdAt: "createTime", updatedAt: "updateTime"}});

module.exports = mongoose.model("article", article);