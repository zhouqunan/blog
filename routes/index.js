var express = require('express');
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
  console.log(req.body);
});

//登录
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});


module.exports = router;
