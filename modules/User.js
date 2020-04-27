var mongoose = require('mongoose')
var userSchema = require('../schemas/user')

// 定义并导出user数据模型类
module.exports = mongoose.model('User',userSchema)