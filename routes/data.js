const fs = require("fs");
const readFile = fs.readFile;
const writeFile = fs.writeFile;
var path = require('path');
const axios = require('axios');
const session = require('express-session');

//const cookieJar = new tough.CookieJar();
const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true // if you use the secret with cookieParser
  };
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


app.post('/addTask', (req, res) => {

    console.log(req.body.new_task);
    var token = req.cookies.userCookie.token;
    var task = req.body.new_task;
   
    console.log("content:");
    console.log(task);
    var info = {headers: {"Authorization":`${token}`}
};
    var data = {content:task};
    console.log("BOUTTA ADD TASK");
    axios
    .post('https://hunter-todo-api.herokuapp.com/todo-item', data, info)
    .then(response => {
        console.log(response);
        res.redirect("/home"); 
    })
    .catch(error => {
         console.error(error); 
         res.redirect("/home");  
    })
    

});



app.post('/addUser', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    
    var info = {
        'username': username,
        headers: { 
            'Content-Type': 'application/json',
        }
    }


    
    console.log(info);
    axios
        .post('https://hunter-todo-api.herokuapp.com/user', info)
        .then(response => {
            console.log(`statusCode: ${response.statusCode}`)
            console.log(response);
            console.log(response.headers);
            
            console.log(req.cookies);
            console.log(res.cookies);
           
            res.redirect("/login?msg=successfully+added+user"); 
        })
        .catch(error => {
             console.error(error); 
             res.redirect("/login?msg=please+try+again");  
        })
        
  
    });



    app.get('/logout', (req,res) => {
        console.log(req.cookies.userCookie);
        if (req.cookies.userCookie){
            console.log("CLEARING");
            res.clearCookie("userCookie");
        }

        res.redirect('/login');


    });
    



    app.post('/auth', (req, res) => {
        var username = req.body.username;
        console.log("running getUserData...");
        
        var url = 'https://hunter-todo-api.herokuapp.com/auth';
             axios
            .post(url, {username:username})
            .then(result => {
                console.log(result.data.token);
                var token = result.data.token;
               
                // no: set a new cookie
            var randomNumber=Math.random().toString();
            randomNumber=randomNumber.substring(2,randomNumber.length);
            res.cookie('userCookie', {token:token, name:username});
            console.log('cookie created successfully');

                res.redirect("/home");
            })
            .catch(error => {
                console.log("here");
                res.redirect("/login?msg=username+does+not+exist"); 
            });
    
    }); 
    

    app.get('/home', function(req, res){
        if (!req.cookies.userCookie){
            res.redirect("/login?msg=Please+log+in+or+sign+up"); 
        }
        else {
        console.log("WE ARE NOW AT HOME!");
        console.log(req.cookies);
        var username = req.cookies.userCookie.name;
        console.log("USERNAME1:");
        var token = req.cookies.userCookie.token;
        console.log(username);
        var info = {headers: {'Authorization':`${token}`}};
        console.log("about to make request");
        axios.get("https://hunter-todo-api.herokuapp.com/todo-item", info)
        .then(response => {
           console.log(response);
           var list = response.data;
           res.render("home", {layout: "userTasks",  list:list, username:username});
        })
          .catch(error => {
           console.log("ERROR");
        console.error(error);
        var list = error.data;
        console.log("USERNAME");
        console.log(username);
        res.render("home", {layout: "userTasks",  list:list, username:username});
    
        }) //end else
    };
    
}); 

}
module.exports = dataRoutes;