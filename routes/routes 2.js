var path = require('path');
var fs = require('fs');

const dataRoutes = require('./data');
const appRouter = (app, fs) => {

//view at localhost:8080
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/../index.html'));
});



app.get('/test', function(req, res){
    res.render("home", {title: "title", data:"boop"});
});

    dataRoutes(app, fs);

};

module.exports = appRouter;