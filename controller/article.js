const {Router} = require("express");
const router = Router();
const article = require('../model/article');
const category = require('../model/category');

//发布博客
router.post('/saveArticle', async (req, res, next) => {
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

//获取全部文章
router.get('/article',async (req, res,next) => {
    try {
        const {page} = req.query;
        const pages = parseInt(page);  //解析字符串，返回整数
        const data = await article.find()
            .skip((pages - 1) * 10)   //skip()方法可以跳过指定数量的数据,此处的10表示page_size
            .limit(10)      //表示每页返回10条数据
            .sort({_id: -1}) //让发布的文章倒序排列
            .populate({
                path: 'author',
                select: '-password -email'
            })
            .populate({
                path: 'category'
            })
            .populate({
                path: 'comment'
            })
        const count = await article.find().count()
        res.json({
            code : 200,
            count,
            data,
            msg : '获取成功'
        })
    }catch (e) {
        next(e)
    }
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

// 删除某一篇博客
router.post('/delArticle', async (req, res, next) => {
    try {
        let {_id} = req.body
        const data = await article.deleteOne({_id})
        res.json({
            code: 200,
            data,
            msg: '删除成功'
        })
    } catch (err) {
        next(err)
    }
})

// 修改某一篇博客
router.patch('/updateArticle/:id', async (req, res, next) => {
    try {
        const {id} = req.params
        const {
            title,
            content,
            contentText,
            category,
        } = req.body
        const data = await article.findById(id)
        const updateData = await data.update({
            $set: {
                title,
                content,
                contentText,
                category,
            }
        })
        res.json({
            code: 200,
            data: updateData,
            msg: '修改成功'
        })
    } catch (err) {
        next(err)
    }
})

//更新阅读量
router.patch('/looknums/:id', async (req, res, next) => {
    try {
        const {id} = req.params
        const data = await article.findOneAndUpdate({_id: id},
            {
                $inc: {looknums: 1}
            })
        res.json({
            code: 200,
            data: data,
            msg: '阅读量修改成功'
        })
    } catch (e) {
        next(e)
    }
})

//文章搜索
router.post('/search', async (req, res, next) => {
    try {
        const keyword = req.body.keyword
        const page = req.body.page
        const pages = parseInt(page);
        const reg = new RegExp(keyword, "i")   //不区分大小写
        const data = await article.find({
            $or: [ //多条件，数组
                {title: {$regex: reg}},
                {contentText: {$regex: reg}}
            ]
        })
            .skip((pages - 1) * 10)
            .limit(10)
            .populate({
                path: 'author',
                select: '-password -email'
            })
            .populate({
                path: 'category'
            })
        const count = await article.find({
            $or: [
                {title: {$regex: reg}},
                {contentText: {$regex: reg}}
            ]
        }).count()
        res.json({
            code: 200,
            count,
            data,
            msg: '搜索成功'
        })
    } catch (e) {
        next(e)
    }
})

//获取某一分类下的所有文章
router.post('/tagArticle', async (req, res, next) => {
    try {
        const tag = req.body.tag
        const page = req.body.page
        const pages = parseInt(page);
        const data = await article.find({category: tag})
            .skip((pages - 1) * 10)
            .limit(10)
            .sort({_id: -1})
            .populate({
                path: 'author',
                select: '-password -email'
            })
            .populate({
                path: 'category'
            })
        const count = await article.find({category: tag}).count()
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

module.exports = router;