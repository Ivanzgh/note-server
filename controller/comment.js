const {Router} = require("express");
const router = Router();
const comment = require('../model/comment');

//获取所有的评论
router.get('/comment', async (req, res, next) => {
    try {
        const {page} = req.query;
        const pages = parseInt(page);
        const data = await comment.find()
            .skip((pages - 1) * 10)
            .limit(10)
            .sort({_id: -1})
            .populate({
                path: 'user_id',
                select: '-password -email'
            })
            .populate({
                path: 'article_id',
            })
        const count = await comment.find().count()
        res.json({
            code: 200,
            count,
            data,
            msg: '获取成功'
        })
    } catch (e) {
        next(e)
    }
})

//获取某一篇文章的所有评论
router.get('/comment/:id', async (req, res, next) => {
    try {
        let {id} = req.params
        let data = await comment.find({article_id: id})
            .sort({_id: -1})
            .populate({
                path: 'user_id',
                select: '-password -email'
            })
            .populate({
                path: 'article_id',
                select: '_id'
            })
        res.json({
            code: 200,
            data
        })
    } catch (e) {
        next(e)
    }
});

//添加评论
router.post('/addComment', async (req, res, next) => {
    try {
        if (req.session.user) {
            let user_id = req.session.user._id;
            let {commentBody, article_id, comment_date} = req.body
            let data = await comment.create({
                commentBody,
                user_id,
                article_id,
                comment_date
            })
            res.json({
                code: 200,
                data,
                msg: '评论发布成功'
            })
        } else {
            res.json({
                code: 403,
                msg: '请先登录'
            })
        }
    } catch (e) {
        next(e)
    }
})
//删除评论
router.post('/delComment', async (req, res, next) => {
    try {
        let {_id} = req.body
        const data = await comment.deleteOne({_id})
        res.json({
            code: 200,
            data,
            msg: '删除成功'
        })
    } catch (e) {
        next(e)
    }
})

module.exports = router;

