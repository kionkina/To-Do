var path = require('path');

var fs = require('fs');

const dataRoutes = require('./data');
const appRouter = (app, fs) => {
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//view at localhost:8080
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/../index.html'));
});



app.get('/test', function(req, res){
    res.render("home", {layout: 'tasks', title: "title", data:"boop"});
});

app.get('/login', function(req, res){
 console.log(req.query);
 console.log(req.query !== {});
    if (Object.keys(req.query).length === 0){
        msg = "";
    }
    else {
        msg = req.query.msg;
    }
    res.render("home", {layout: "login", title: "title", message:msg});
});

    dataRoutes(app, fs);

};



module.exports = appRouter;