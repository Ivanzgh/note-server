const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const article = require('../controller/article');
const category = require('../controller/category');
const comment = require('../controller/comment');
const messageBoard = require('../controller/messageBoard');


/* GET home page. */
router.use(user);
router.use(article);
router.use(category);
router.use(comment);
router.use(messageBoard);

module.exports = router;
