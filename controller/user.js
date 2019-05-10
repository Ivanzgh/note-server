const {Router} = require('express');
const router = Router();
const user = require('../model/user');

//注册接口
router.post('/register',async (req,res,next) => {
    try {
        let {username,password,email} = req.body;
        const avatarNumber = Math.ceil(Math.random()*9);
        const avatar = `http://pbl.yaojunrong.com/avatar${avatarNumber}.jpg`;
        const emailData = await user.findOne({email})
        const userName = await user.findOne({username})
        if (emailData) {
            res.json({
                code : 401,
                msg : '邮箱已注册'
            })
        }
        if (userName) {
            res.json({
                code : 401,
                msg : '用户名已注册'
            })
        }
        if (password&&password.length>=5) {
            const data = await user.create({username,password,email,avatar});
            console.log(data);
            res.json({
                code : 200,
                msg : '注册成功'
            })
        } else {
            res.json({
                code : 401,
                msg : '密码长度至少5位'
            })
        }
    }catch (err) {
        res.json({
            code : 400,
            msg : '缺少必要参数',
            err
        });
        next(err)
    }
});

//登录接口
router.post('/login',async (req,res,next) => {
    try{
        let {email,password} = req.body;
        const data = await user.findOne({email});

        if (!data) {
            res.json({
                code: 401,
                msg: '邮箱未注册'
            })
        } else if (data.password !== password) {
            res.json({
                code: 403,
                msg: '密码不正确'
            })
        } else if (data.password === password) {
            req.session.user = data;
            let userMsg = {
                username: data.username,
                email: data.email,
                avatar: data.avatar,
                desc : data.desc
            };
            res.json({
                code: 200,
                data : userMsg,
                msg: '登录成功'
            })
        }
    }catch (err) {
        next(err)
    }
});

//退出登录接口
router.get('/logout',(req,res) => {
    if (req.session.user) {
        req.session.user = null;
        res.json({
            code : 200,
            msg : '退出登录成功'
        })
    } else {
        res.json({
            code : 400,
            msg : '用户未登录'
        })
    }
});

//获取所有用户
router.get('/allUser',async (req,res,next) => {
    try {
        const {page} = req.query;
        const pages = parseInt(page);  //解析字符串，返回整数
        const data = await user.find()
            .skip((pages - 1) * 10)
            .limit(10)
            .sort({_id: -1})
        const count = await user.find().count()
        res.json({
            code: 200,
            count,
            data,
            msg: '成功'
        })
    }catch (e) {
        next(e)
    }
});

//删除某个用户
router.post('/delUser',async (req,res,next) => {
    try {
        let {_id} = req.body
        const data = await user.deleteOne({_id})
        res.json({
            code: 200,
            data,
            msg: '删除成功'
        })
    }catch (e) {
        next(e)
    }
})

//获取某个用户信息
router.get('/user/:id', async (req, res,next) => {
    try {
        let {id} = req.params;
        const data = await user.findById(id)
        res.json({
            code: 200,
            data,
            msg: '获取成功'
        })
    }catch (e) {
        next(e)
    }
});

// 修改某个用户信息
router.patch('/updateUser/:id',async (req,res,next) => {
    try {
        const {id} = req.params
        const {
            username,
            password,
            email ,
            avatar,
        } = req.body
        const data = await user.findById(id)
        const updateData =  await data.update({$set : {
                username,
                password,
                email ,
                avatar,
            }})
        res.json({
            code : 200,
            data : updateData,
            msg : '修改成功'
        })
    }catch (err) {
        next(err)
    }
})

//用户搜索
router.post('/userSearch', async (req, res, next) => {
    try {
        const keyword = req.body.keyword
        const page = req.body.page
        const pages = parseInt(page);
        const reg = new RegExp(keyword, "i")   //不区分大小写
        const data = await user.find({
            $or: [ //多条件，数组
                {username: {$regex: reg}},
                {email: {$regex: reg}}
            ]
        })
            .skip((pages - 1) * 10)
            .limit(10)
        const count = await user.find({
            $or: [
                {username: {$regex: reg}},
                {email: {$regex: reg}}
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

module.exports = router;