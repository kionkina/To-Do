const fs = require("fs");
const readFile = fs.readFile;
const writeFile = fs.writeFile;
var path = require('path');
const axios = require('axios');
const session = require('express-session');
const fetch = require("node-fetch");
var jwt = require("jsonwebtoken");
var request = require('request');

//axios.defaults.withCredentials = true;
//const tough = require('tough-cookie');
//const axiosCookieJarSupport = require('axios-cookiejar-support').default;
//const https = require('https');
//axiosCookieJarSupport(axios);

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


app.post('/addUser', (req, res) => {
    var username = req.body.username;
    var token = jwt.sign({ username: username }, 'secret key');
    var cookie = {'Authorization': token};
    var info = {
        'username': username,
        headers: { 'Content-Type': 'application/json', 'Cookie': cookie}};


    
    console.log(info);
    axios
        .post('https://hunter-todo-api.herokuapp.com/user', info)
        .then(response => {
            console.log(`statusCode: ${response.statusCode}`)
            console.log(response);
            console.log("COOKIES:")
            console.log(response.cookies);
            res.redirect("/login?msg=successfully+added+user"); 
        })
        .catch(error => {
             console.error(error); 
             res.redirect("/login?msg=please+try+again");  
        })
        
  
    });


    const getTasks = () => {
 
        console.log("making call");
        

        axios
        .get("https://hunter-todo-api.herokuapp.com/todo-item",{ withCredentials: true } )
            .then(response => {
                if (response.ok) {
                console.log("here");
                return response.json()
                }
                else {
                    console.log(response);
                }
            })
            .catch(error => {
                console.log("ERROR");
                console.error(error);


            })

        fetch("https://hunter-todo-api.herokuapp.com/todo-item",{ credentials: "include" } )
            .then(response => {
                if (response.ok) {
                console.log("here");
                return response.json()
                }
                else {
                    console.log(response);
                }
            })
            //.catch(error => {
              //  console.log("ERROR");
                //console.error(error);
  //          })
    }




    app.post('/auth', (req, res) => {
        var username = req.body.username;
        console.log("running getUserData...");
        
        var url = 'https://hunter-todo-api.herokuapp.com/user?username='+username;
             axios
            .get(url)
            .then(result => {
                console.log(result.headers);
                console.log(result.data);
                var id = result.data[0].id; 
                console.log("id is" + id);  
                console.log("RES.COOKIES:")
                console.log(result.cookie);            
            
           
                var token = Buffer.from(`${username}`, 'utf8').toString('base64')
                //res.redirect("/home");
                  console.log(" MOVING ON TO AXIOS CALL ");
                    axios.get("https://hunter-todo-api.herokuapp.com/todo-item", {headers: {
                
                'Authorization': `${token}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
            }
                })
                .then(response => {
                   console.log(response);
                })
                  .catch(error => {
                   console.log("ERROR");
                console.error(error);
                   })
            })
            .catch(error => {
                console.log("here");
                res.redirect("/login?msg=username+does+not+exist"); 
            });
    
    }); 
    

    app.get('/home', function(req, res){
        console.log("res.signedCookies.cookie1 is:");
        console.log(req.signedCookies.cookie1);
        axios.get("https://hunter-todo-api.herokuapp.com/todo-item",{  headers: {
            'Authorization': Buffer.from('username:c').toString('base64'), 
        }})
        .then(response => {
           console.log(response);
        })
          .catch(error => {
           console.log("ERROR");
        console.error(error);
           })
        //msg = "Welcome, " + req.session.user.username + ". Your ID is " + req.session.user.id;
        //username = req.session.user.username;
     
        var msg = "Welcome, "  + ".";
        res.render("home", {layout: "default",  message:msg});
    });
    
};
module.exports = dataRoutes;