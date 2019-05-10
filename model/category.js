const mongoose = require("mongoose");

const category = new mongoose.Schema({
    name: String,
}, {versionKey: false, timestamps: {createdAt: "createTime", updatedAt: "updateTime"}})

module.exports = mongoose.model("category", category);