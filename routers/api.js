var express = require('express')
var User = require('../modules/User')
var jwt = require('jsonwebtoken')


var router = express.Router()

// 使用中间件统一返回格式
var responseData
router.use(function(req,res,next){
    // 返回格式初始化
    responseData = {
        status: 0,
        message: ''
    }
    next()
})

// 用户登录
router.post('/login', function(req,res,next){
    var username = req.body.username
    var password = req.body.password

    // 生成token
    let payload = {
        username: username,
        password: password
    }
    let secretkey = 'Mr_Dai'
    let token = jwt.sign(payload, secretkey, {expiresIn: 60*60*1})

    User.findOne({
        username: username,
        password: password
    }).then((user) => {
        if(!user){
            responseData.status = 404
            responseData.message = '用户不存在!'
            res.json(responseData)
        }
        responseData.status = 200
        responseData.message = '登录成功'
        // 设置浏览器头的cookie，用于保持用户登录状态
        res.cookie('token', token, {maxAge: 4000000, httpOnly:false})
        res.json(responseData)
    })
})

// 用户注册
router.post('/regist', function(req,res,next){
    var username = req.body.username
    var password = req.body.password
    var checkPass = req.body.checkPass

    // 用户名是否为空
    if(username == ''){
        responseData.status = 410,
        responseData.message = '用户名不能为空！'
        res.json(responseData)
        return
    }
    if(password == ''){
        responseData.status = 411,
        responseData.message = '密码不能为空！'
        res.json(responseData)
        return
    }
    if(checkPass !== password){
        responseData.status = 412,
        responseData.message = '密码不一致！'
        res.json(responseData)
        return
    }
    
    User.findOne({username:username}).then(function(user){
        if(user){
            responseData.status = 413
            responseData.message = '该用户已存在!'
            res.json(responseData)
            return 
        }
        var newUser = new User({
            username: username,
            password: password
        })
        return newUser.save()
    }).then(function(newUser){
        responseData.status = 200
        responseData.message = '注册成功'
        res.json(responseData)
    })
})

router.get('/home',(req,res,next)=>{
    responseData.status = 200,
    responseData.message = '登录成功！'
    res.json(responseData)
})

module.exports = router