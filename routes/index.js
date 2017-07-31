var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var conn = require('../conn')
var db = conn.db;

  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Pass to next layer of middleware
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
 
  app.get('/api/comments', (req, res) => {
    db.any('SELECT * from comment')
     .then(function (data) {
      const Data = data;
     // var commentArr = _.map(Data, getCommentArray);
	res.send(Data);
    })
    .catch(function (error) {
      console.log('ERROR:', error);
    });
  });

 app.post('/api/addcomment', (req, res) => {
    var name = req.body.name;
    var comment = req.body.comment;
   db.one('INSERT INTO comment (name, comment) VALUES($1, $2) RETURNING id', [name, comment])
     .then(data => {
     // success
      res.send({ 'data': data.id });
    })
     .catch(error => {
     // Error
      console.log('ERROR:', error);
    });
  });
 

module.exports = app;

function getCommentArray(item,index) {
 var comment = [item.id, item.name, item.comment];
 return comment;
}
