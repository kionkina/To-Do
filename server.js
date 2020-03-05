var express = require('express');
var app = express();
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser())

// parse application/json
app.use(bodyParser.json());

const routes = require('./routes/routes.js')(app,fs);

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'default', layoutsDir: __dirname + '/views/layouts/'}));

app.set('view engine', 'hbs');


const dataRoutes = require('./routes/data');

var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));


app.listen(8080);

