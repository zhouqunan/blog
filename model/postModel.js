var mongoose = require('mongoose');
var setting = require('../setting');
mongoose.Promise = global.Promise;  
mongoose.connect(setting.mongodb,{useMongoClient: true});
//通过mongoose模块中的Schema数据结构来文章的标题，发布者，时间等等信息
var postSchema = new mongoose.Schema({
    title:String,//标题
    author:String,//作者
    article:String,//文章内容
    publishTime:String,//发表时间
    postImg:String,//封面
    comments:[{
        name:String,
        time:String,
        content:String
    }],//评论
    pv:Number//访问次数
});

//储存model postSchema
var Post = mongoose.model('Post',postSchema);
module.exports = Post;