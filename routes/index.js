var express = require('express');
var mongoose = require('mongoose');
var User = require('./../model/userModel');
var Post = require('./../model/postModel');
var router = express.Router();
var moment = require('moment'); //时间控件
var formidable = require('formidable');//表单控件
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({},function(err,data){
    if(err){
      console.log('出错',err)
      req.flash('error','文章查找错误');
      return res.redirect('/');
    }
    res.render('index', { 
      title: '首页' ,
      user:req.session.user,
      error:req.flash('error'),
      success:req.flash('success'),
      post:data,
      time:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });
  })
  
})

//注册页
router.get('/register', function(req, res, next) {
  res.render('register', { 
    title: '注册',
    user:req.session.user,
    error:req.flash('error'),
    success:req.flash('success'),
  });
});

router.post('/register', function(req, res, next) {
  //生成model新数据
  var user = new User({
    username:req.body.username,
    password:req.body.password,
    email:req.body.email,
  })
  //判断确认密码的输入是否与第一次输入的密码一致
  if(req.body.password !== req.body['password-repeat']){
      console.log('两次密码不一致');
      //重新注册
      return res.redirect('/register');
  }
  //查找数据库
  User.findOne({"username":user.username},function(err,data){
    //报错则重新注册
    if(err){
      console.log(err);
      return err;
    }
    if(data != null){
      console.log('用户已存在');
      return res.redirect('/register');
    }else{
      user.save(function(err){
        if(err) return err;
        console.log('注册成功');
        return res.redirect('/login');
      })
    }
    
  })
});

//登录
router.get('/login', function(req, res, next) {
  res.render('login', { 
    title: '登录',
    user:req.session.user,
    error:req.flash('error'),
    success:req.flash('success'),
  });
});

router.post('/login',function(req, res, next){
  //储存密码
  var password = req.body.password;
  User.findOne({'username':req.body.username},function(err,data){
    //错误则跳转
    if(err) {
      console.log(err);
      req.flash('error','登录出错');
      return res.redirect('/login');
    }
    //不存在则跳转
    if(!data){
      console.log('用户不存在');
      req.flash('error','用户不存在');
      return res.redirect('/login');
    }
    //验证密码是否一致
    if(data.password != password){
      console.log('密码不一致');
      req.flash('error','密码不一致');
      return res.redirect('/login');
    }
    console.log('登陆成功：'+data.username);
    //将登陆信息存储到session中
    req.session.user = data;
    req.flash('success','登录成功');
    res.redirect('/');
  })
})
//登出
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');
});
//发表文章页
router.get('/post', function(req, res, next) {
  res.render('post', { 
    title: '发表文章' ,
    user:req.session.user,
    error:req.flash('error'),
    success:req.flash('success'),
  });
});
router.post('/post', function(req, res, next) {
  var imgPath = path.dirname(__dirname)+'/public/images/'; //获取图片路径
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编码格式
  form.uploadDir = imgPath; //设置上传路径
  form.keepExtensions = true; //是否保留后缀
  form.maxFieldsSize = 2*1024*1024; //设置文件大小 2M
  form.type = true; //只读
  form.parse(req,function(err,fields,files){
    if(err){
      console.log(err);
      req.flash('error','图片上传失败');
      return;
    }
    var file = files.postImg; //获取上传的文件信息
    if(file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/gif'){
      console.log('图片上传格式错误，是适合png,jpeg,gif');
      req.flash('error','图片上传格式错误，是适合png,jpeg,gif');
      return res.redirect('back'); //重定向到上传界面
    }
    var title = fields.title; //标题
    var author = req.session.user.username; //用户名
    var article = fields.article; //文章正文
    var postImg = file.path.split(path.sep).pop(); //图片路径分成数组后取出图片
    var pv = fields.pv; //预览次数
    try{
      if(!title.length) {
        throw new Error('标题不能为空');
      }
      if(!article.length){
        throw new Error('文章不能为空');
      }
    }catch(e){
      req.flash('error', e.message);
      return res.redirect('back');
    }
    //储存post
    var post= new Post({
      title:title,
      author:author,
      article:article,
      postImg:postImg,
      publishTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toString(), //生成时间
    });
    post.save(function(err){
      if(err){
        console.log('文章发表出现错误');
         req.flash('error','文章发表出现错误'); 
         return res.redirect('/post');
      }
      console.log('文章已录入成功');
      req.flash('success','文章已发布');
      res.redirect('/');
    })
  })
});
//文章详情页
router.get('/detail', function(req, res, next) {
  //获取页面id
  var id = req.query.id;
  //id存在则进行操作
  if( id && id!= ''){
    //更新预览数
    Post.update({'_id':id},{$inc:{'pv':1}},function(err) {
      if(err){
        console.log(err);
        return res.redirect("back");
      }
      console.log("浏览数量+1");
    })
    Post.findById(id,function(err,data){
      if(err){
        console.log('文章打开失败');
        req.flash('error','文章打开失败');
        return res.redirect('back');
      }
      console.log(data);
      res.render('detail', { 
        title: '发表文章' ,
        user:req.session.user,
        error:req.flash('error'),
        success:req.flash('success'),
        post:data,
        time:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      });
    })
  }else{
    req.flash('error','打开失败');
    return res.redirect("/");
  }
});
//编辑页面
router.get('/edit/:author/:title', function(req, res, next) {
  var id = req.query.id;
  Post.findById(id,function(err,data){
    if(err){
      console.log('编辑打开失败');
      req.flash('error','编辑打开失败');
      return res.redirect('back');
    }
    console.log(data.id);
    res.render('edit', { 
      title: '编辑' ,
      user:req.session.user,
      error:req.flash('error'),
      success:req.flash('success'),
      post:data,
    });
  })
  
});
router.post('/edit/:author/:title', function(req, res, next) {
  var post = new Post({
    _id:req.body.id,
    author:req.session.username,
    title:req.body.title,
    article:req.body.article,
  })

  Post.findByIdAndUpdate(post.id,{$set:{title:post.title,article:post.article}},{new:true},function(err,data){
    if(err){
      console.log('编辑失败');
      req.flash('error','编辑失败');
      return res.redirect('back');
    }
    console.log('编辑成功');
    
    req.flash('success','编辑成功');
    res.redirect("/detail?id="+data._id);
  })
});
//删除
router.get('/delete', function(req, res, next) {
  var id = req.query.id;
  Post.findByIdAndRemove(id,function(err){
    if(err){
      console.log('删除失败');
      req.flash('error','删除失败');
      return res.redirect('back');
    }
    console.log('删除成功');
    req.flash('success','删除成功');
    res.redirect("/");
  })
  
});
module.exports = router;
