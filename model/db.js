var setting = require('../setting.js'),
    mongodb = require('mongodb'),
    Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;
    console.log(Db+Connection+Server);
module.exports = new Db(setting.db, new Server(setting.host, setting.port),
{safe: true});   
