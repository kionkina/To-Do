const fs = require('fs');
const readFile = fs.readFile;
var path = require('path');

//first API server route
const dataRoutes = (app) => {

    //helper for post requests
    const writeFile = (fileData, callback, encoding = 'utf8') => {
        console.log("about to call fs.writeFile");
        fs.writeFile(path.join(__dirname,'../data.json'), fileData, encoding, (err) => {
            if (err) {
                throw err;
            }
    
            callback();
        });
    };


    app.get('/data', (req, res) => {
       readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(data));
    });
});

app.post('/add', (req, res) => {
        var newTask = req.body.new_task.toString();
        console.log(newTask);

        var toAdd = {}
        toAdd["name"] = newTask;
        toAdd["completed"] = false;

        writeFile(JSON.stringify(toAdd, 2), () => {
            res.status(200).send('new item added');
        });
    });
};



module.exports = dataRoutes;