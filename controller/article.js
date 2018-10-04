const {Router} = require("express");
const router = Router();
const article = require('../model/article');
const category = require('../model/category');


//发布笔记
router.post('/article', async (req, res, next) => {
    try {
        if (req.session.user) {
            let {title, content, contentText, category} = req.body;
            let author = req.session.user._id;
            const data = await article.create({
                title,
                content,
                contentText,
                category,
                author
            });
            res.json({
                code: 200,
                msg: '笔记发布成功',
                data
            })
        } else {
            res.json({
                code: 403,
                msg: '未登录不能发布笔记'
            })
        }
    } catch (err) {
        next(err)
    }
});

//获取全部笔记
router.get('/article', (req, res) => {
    let {pn = 1, size = 10} = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    article.find()
        .skip((pn - 1) * size)
        .limit(size)
        .sort({_id: -1}) //让发布的笔记倒序排列
        .populate({
            path: 'author',
            select: '-password -email'
        })
        .populate({
            path: 'category'
        })
        .then(data => {
            res.json({
                code: 200,
                data
            })
        });
});
//获取某一篇笔记
router.get('/article/:id', (req, res) => {
    let {id} = req.params;
    article.findById(id)
        .populate({
            path: 'author',
            select: '-password -email'
        })
        .populate({
            path: 'category'
        })
        .then(data => {
            res.json({
                code: 200,
                data
            })
        })
});


module.exports = router;