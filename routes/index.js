var express = require('express');
var mongoose = require('mongoose');
var User = require('./../model/userModel');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'My Blog' });
})

//注册页
router.get('/register', function(req, res, next) {
  res.render('register', { title: '注册' });
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
    
  res.render('login', { title: '登录' });
});

router.post('/login',function(req, res, next){
  //储存密码
  var password = req.body.password;
  User.findOne({'username':req.body.username},function(err,data){
    //错误则跳转
    if(err) {
      console.log(err);
      return res.redirect('/login');
    }
    //不存在则跳转
    if(!data){
      console.log('用户不存在');
      return res.redirect('/login');
    }
    //验证密码是否一致
    if(data.password != password){
      console.log('密码不一致');
      return res.redirect('/login');
    }
    console.log('登陆成功：'+data.username);
    //req.flash('success','登录成功');
    return res.redirect('/');
  })
})
module.exports = router;
