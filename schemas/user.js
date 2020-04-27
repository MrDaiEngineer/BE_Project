var mongoose = require('mongoose')

/*定义用户user的数据存储结构*/
module.exports = new mongoose.Schema({
    username: String,
    password: String
},{collection: "user"})