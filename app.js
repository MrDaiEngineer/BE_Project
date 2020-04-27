var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken')
var User = require('./modules/User')

var app = express()

// 使用中间件统一返回格式
var responseData
var secretkey
app.use((req,res,next)=>{
    // 返回格式初始化
    responseData = {
        status: 0,
        message: ''
    }
    secretkey = 'Mr_Dai'
    next()
})

// bodyparser设置，用来获取post提交数据
// extended:true代表可以接收任何数据类型的数据
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json()) //必须有这句

app.use(cookieParser())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080")
    res.header("Access-Control-Allow-Credentials",'true')
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,HEAD,OPTIONS")
    if(req.method === 'OPTIONS'){
        res.send('OK!')
        return
    }
    next()
})

app.use((req, res, next) => {
    var token = req.cookies.token
    if(!token) {
        if(req.url == "/api/login" || req.url == "/api/regist"){
            next()
        }else{
            // 如果没有token，并且访问非登录页面，返回未登录状态
            responseData.status = 401,
            responseData.message = '未登录！'
            res.json(responseData)
        }
    }else{
        if(req.url == "/api/login" || req.url == "/api/regist"){
            next()
        }else{
            // 判断token是否有效
            jwt.verify(token, secretkey, (err, decode)=>{
                // token过期等错误
                if(err){
                    responseData.status = 402
                    responseData.message = err.message
                    res.json(responseData)
                    return
                }
                // console.log(decode)
                User.findOne({
                    username: decode.username,
                    password: decode.password
                }).then((user) => {
                    if(!user){
                        responseData.status = 403
                        responseData.message = 'token假的!'
                        res.json(responseData)
                    }
                    next()
                })
            })
        }
    }
})

// api：API接口模块
app.use('/api',require('./routers/api'))


// 监听http请求，连接数据库
mongoose.connect('mongodb://localhost:27017/beproject',function(err){
    if(err){
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功')
        app.listen(3000)
        console.log('server listening on 3000!');
    }
})