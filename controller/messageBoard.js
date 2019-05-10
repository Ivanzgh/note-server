const {Router} = require("express");
const router = Router();
const messageBoard = require('../model/messageBoard');

//获取所有留言
router.get('/messageBoard',async (req,res,next) => {
    try {
        const {page = 1} = req.query;
        const pages = parseInt(page);
        let data = await messageBoard.find()
            .skip((pages - 1) * 10)
            .limit(10)
            .sort({_id: -1}) //让发布的留言倒序排列
            .populate({
                path: 'author',
                select: '-password -email'
            })
        const count = await messageBoard.find().count()
        res.json({
            code: 200,
            count,
            data,
            msg: '获取成功'
        })
    }catch (e) {
        next(e)
    }
});

//发布留言
router.post('/addMessageBoard', async (req, res, next) => {
    try {
        if (req.session.user) {
            let {content} = req.body;
            let author = req.session.user._id;
            let data = await messageBoard.create({content,author})
            res.json({
                code: 200,
                msg: '留言成功',
                data
            })
        } else {
            res.json({
                code: 403,
                msg: '请先登录'
            })
        }
    } catch (err) {
        next(err)
    }
});

//删除留言
router.post('/delMessageBoard',async (req,res,next) => {
    try {
        let {_id} = req.body
        const data = await messageBoard.deleteOne({_id})
        res.json({
            code: 200,
            data,
            msg: '删除成功'
        })
    }catch (e) {
        next(e)
    }
})

module.exports = router;

