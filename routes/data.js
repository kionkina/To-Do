const fs = require("fs");
const readFile = fs.readFile;
const writeFile = fs.writeFile;
var path = require('path');

//first API server route
const dataRoutes = (app, fs) => {

    //helper for post requests
    const appendTask = (fileData, callback, encoding = 'utf8') => {
 
       

    return;
}
    


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

        readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
            if (err) {
                throw err;
            }
    
            var taskArray = JSON.parse(data);
            taskArray.push(toAdd);

            writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), 'utf8', (err) => {
            if (err) {
                throw err;
            }
            console.log("added data");
            return res.redirect("back");
        });
    });
});
}



module.exports = dataRoutes;