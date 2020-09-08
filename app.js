var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var router = require('./router');

app.use(express.static('public'));
app.use(router);

var conf = require('./config/app.json');
var server = http.createServer(app);
server.listen(conf.PORT);
