const {Router} = require("express");
const router = Router();
const category = require('../model/category');

//获取全部分类
router.get('/categories', (req, res) => {
    category.find().then(data => {
        res.json({
            code: 200,
            data
        })
    })
});

//获取某一条分类
router.get('/categories/:id',(req,res) => {
    let {id} = req.params;
    category.findById(id).then(data => {
        res.json({
            code : 200,
            data
        })
    })
});

//添加分类
router.post('/categories',async (req,res,next) => {
    try {
        const {name} = req.body;
        const data = await category.create({name});
        res.json({
            code : 200,
            msg : '分类添加成功',
            data
        })
    }catch (err) {
        next(err)
    }
});

module.exports = router;