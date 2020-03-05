var path = require('path');

var fs = require('fs');

const dataRoutes = require('./data');
const appRouter = (app, fs) => {
var cookieParser = require('cookie-parser');
app.use(cookieParser());


app.get('/', (req, res) => {
	res.render("home", {layout: 'landingPage'});
	});

app.get('/part1b', function(req, res){
	res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/part1c-d', function(req, res){
    res.render("home", {layout: 'tasks'});
});

app.get('/login', function(req, res){
    if (req.cookies.userCookie){
        return res.redirect("/home");
    }

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