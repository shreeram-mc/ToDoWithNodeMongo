var http = require('http');
var port = process.env.port || 1337;

var express = require("express");
var app = express();

app.set("view engine", "vash"); //contains both master and view like razor

//var ejsEngine = require("ejs-locals"); //master page
//app.engine("ejs", ejsEngine); //view engine
//app.set("view engine", "ejs");

//app.set("view engine", "jade"); //contains both master and view

//opto into services
var bodyParser = require('body-parser');
// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser());
app.use(bodyParser.json());
//using css
app.use(express.static(__dirname + "/public"));

var session = require('express-session');
app.use(session({ secret: "TheBoardSession" }));

var cookieparser = require("cookie-parser");
app.use(cookieparser());

var flash = require("connect-flash");
app.use(flash()); //for flash messages


//use auth
var auth = require("./auth");
auth.init(app);


var controllers = require("./controllers");
controllers.init(app);


app.get({ host: '/api/users' }, function (req, res) {
    res.set("Content-Type", "application/json");
    res.send({name:"Shree", isActive:true, age:29});
});

http.createServer(app).listen(port); 