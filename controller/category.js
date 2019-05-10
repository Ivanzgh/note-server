const {Router} = require("express");
const router = Router();
const category = require('../model/category');

//获取全部分类
router.get('/categories', async (req, res, next) => {
    try {
        const {page} = req.query;
        const pages = parseInt(page);  //解析字符串，返回整数
        const data = await category.find()
            .skip((pages - 1) * 10)   //skip()方法可以跳过指定数量的数据,此处的10表示page_size
            .limit(10)      //表示每页返回10条数据
            .sort({_id: -1}) //让发布的文章倒序排列
        const count = await category.find().count()
        res.json({
            code: 200,
            count,
            data,
            msg: '获取成功'
        })
    } catch (err) {
        next(err)
    }
})

//添加分类
router.post('/addCategory', async (req, res, next) => {
    try {
        let {name} = req.body
        let data = await category.create({name})
        res.json({
            code: 200,
            data,
            msg: '分类添加成功'
        })
    } catch (err) {
        next(err)
    }
})

//删除单个分类
router.post('/delCategory', async (req, res, next) => {
    try {
        let {_id} = req.body
        const data = await category.deleteOne({_id})
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