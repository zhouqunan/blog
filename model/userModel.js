var mongoose = require('mongoose');
var setting = require('../setting');
mongoose.connect(setting.mongodb,{useMongoClient: true});
//通过mongoose模块中的Schema数据结构来储存用户名，密码以及邮箱
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
});

//储存model userSchema
var User = mongoose.model('User',userSchema);
module.exports = User;