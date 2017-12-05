<<<<<<< HEAD
var settings = require('../settings');
=======
var setting = require('../setting.js'),
    mongodb = require('mongodb'),
    Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;
    console.log(Db+Connection+Server);
module.exports = new Db(setting.db, new Server(setting.host, setting.port),
{safe: true});   
>>>>>>> 175868c8885cb279a13df0cce4cfa794f85fa945
