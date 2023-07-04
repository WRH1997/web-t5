const express = require('express');
const fs = require('fs');
const users = require('./users.json');
const app = express();
const port = 6000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", (req, res) => {
    try{
        let returnData = {};
        returnData.message = "Users retrieved";
        returnData.success = true;
        returnData.users = users;
        res.json(returnData);
    }
    catch(error){
        res.status(500).json({"success":false, "error":"Internal Server Error"});
    }
})


app.put("/update/:id", (req, res) => {
    let userId = req.params['id'];
    if(!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('firstName')){
        res.status(400).json({"success":false, "error":"Email or firstName missing from request body!"});
    }
    let email = req.body['email'];
    let fname = req.body['firstName'];
    let userIndex = 0;
    for(var i=0; i<users.length; i++){
        if(users[i]['id']==userId){
            users[i]['email'] = email;
            users[i]['firstName'] = fname;
        }
        fs.writeFileSync('./users.json', JSON.stringify(users));
    }
    res.json({"message":"User updated", "success":true});
})


app.post("/add", (req, res) => {
    try{
        if(!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("firstName")){
            res.status(400).send({"status":false, "error": "Email or firstName missing from request body!"});
        }
        let email = req.body['email'];
        let fname = req.body['firstName'];
        let randId = Math.floor(Math.random()*10);
        users.push({"email":email, "firstName":fname, "id": randId});
        fs.writeFileSync('./users.json', JSON.stringify(users));
        res.send({"success":true, "message":"User added"});
    }
    catch(error){
        res.status(500).send({"status":false, "error": error.message});
    }
})


app.get("/user/:id", (req, res) => {
    try{
        let userId = req.params.id;
        for(var i=0; i<users.length; i++){
            if(users[i]['id']==userId){
                res.send({"success":true, "user": {"email": users[i]['email'], "firstName": users[i]['firstName'], "id": userId}});
            }
        }
        res.send({"success":false, "error": "User ID Supplied Does Not Exist!"});
    }
    catch(error){
        res.status(500).send({"success":false, "error": error.message});
    }
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})