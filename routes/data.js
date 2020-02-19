const fs = require("fs");
const readFile = fs.readFile;
const writeFile = fs.writeFile;
var path = require('path');
const axios = require('axios');
//first API server route
const dataRoutes = (app, fs) => {

    //helper for post requests
    const appendTask = (fileData, callback, encoding = 'utf8') => {

        readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
            if (err) {
                throw err;
            }
    
            var taskArray = JSON.parse(data);
            taskArray.push(fileData);

            writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), encoding, (err) => {
            if (err) {
                throw err;
            }
            console.log("added data");
        });
    });
    callback();
}

    const toggleTask = (id, res, encoding = 'utf8') => {
        readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
            if (err) {
                throw err;
            }
    
            var taskArray = JSON.parse(data);
            
            console.log("STATE OF THIS ID: ");
            console.log(taskArray[id]["completed"]); 

            console.log("SETTING STATE OF THIS ID TO: ");
            console.log(!(taskArray[id]["completed"])); 

            taskArray[id]["completed"] = !(taskArray[id]["completed"]);

            writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), encoding, (err) => {
            if (err) {
                throw err;
            }
            console.log("added data");
            res.send(JSON.parse(data));
        });
    });

}


const deleteTask = (id, res, encoding = 'utf8') => {
    readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        var taskArray = JSON.parse(data);
        taskArray.splice(id, 1);

        writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), encoding, (err) => {
        if (err) {
            throw err;
        }
        console.log("added data");
        res.send(JSON.parse(data));
    });
});

}
    

    app.get('/data', (req, res) => {
       readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(data));
    });
});

app.post('/toggle_complete', (req, res) => {
    var taskId = req.body.id;
    toggleTask(taskId, res);
});

app.post('/delete_task', (req, res) => {
    var taskId = req.body.id;
    deleteTask(taskId, res);
});


app.post('/add', (req, res) => {
        var newTask = req.body.new_task.toString();
        console.log(newTask);

        var toAdd = {}
        toAdd["name"] = newTask;
        toAdd["completed"] = false;

        appendTask(toAdd, () => {
            res.redirect('/test');
        });
    });



app.get("/auth", async (req, res) => {
    axios.get('https://hunter-todo-api.herokuapp.com/user')
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
});

app.post('/addUser', (req, res) => {
    var username = req.body.username;
    var info = {
        'username': username,
        headers: { 'Content-Type': 'application/json'}

    }
    axios
        .post('https://hunter-todo-api.herokuapp.com/user', info)
        .then(response => {
            console.log(`statusCode: ${response.statusCode}`)
            console.log(response);
            res.redirect("/login?msg=successfully+added+user"); 
        })
        .catch(error => {
             console.error(error); 
             res.redirect("/login?msg=please+try+again");  
        })  
    });


    const getUserData = (username) => {
        console.log("running getUserData...");
        var info = {
            'username': username,
            headers: { 'Content-Type': 'application/json'}
    
        }
             axios
            .get('https://hunter-todo-api.herokuapp.com/user?username='+username)
            .then(res => {
                //console.log("Response.data:");
                //return res.data;
                //console.log("RES");
                //console.log(res);
                
                //console.log(`statusCode: ${response.statusCode}`)
                //console.log(response);
                //console.log(response.data[0]);
                
            })
            .catch(error => {
                //console.log("ERROR");
                 //console.error(error); 
                //return "error"
            });
            console.log("DONE");
    } 
    


    app.get('/auth', (req, res) => {
        var username = req.body.username;
        console.log("about to run response");
        //var response = getUserData(username);
        console.log("RESPONSE IS: ");
       // console.log(response);
        });
    

};
module.exports = dataRoutes;