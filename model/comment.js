const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = new mongoose.Schema({
    commentBody: String,
    user_id: {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    article_id: {
        type : Schema.Types.ObjectId,
        ref : 'article'
    },
}, {versionKey: false, timestamps: {createdAt: "createTime", updatedAt: "updateTime"}})

module.exports = mongoose.model("comment", comment);