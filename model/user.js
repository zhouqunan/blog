var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//储存用户信息
User.prototype.save = function(callback){
    //要存入的文档数据
    
}