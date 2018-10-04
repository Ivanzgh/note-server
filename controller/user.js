const {Router} = require('express');
const router = Router();
const user = require('../model/user');

//注册接口
router.post('/register',async (req,res,next) => {
    try {
        let {username,password,email} = req.body;
        console.log(username,password,email);
        const avatarNumber = Math.ceil(Math.random()*9);
        const avatar = `http://pbl.yaojunrong.com/avatar${avatarNumber}.jpg`;

        if (password&&password.length>=5) {
            const data = await user.create({username,password,email,avatar});
            console.log(data);
            res.json({
                code : 200,
                msg : '注册成功'
            })
        } else {
            throw '密码长度至少5位'
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
        } else if (!data.password === password) {
            res.json({
                code: 401,
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

module.exports = router;