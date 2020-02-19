var express = require('express');
var app = express();
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
const axios = require('axios');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const routes = require('./routes/routes.js')(app,fs);

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'default', layoutsDir: __dirname + '/views/layouts/'}));

app.set('view engine', 'hbs');


const dataRoutes = require('./routes/data');

var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));




app.listen(8080);

