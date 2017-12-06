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
      //返回首页
      return res.redirect('/');
  }
});

//登录
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});


module.exports = router;
