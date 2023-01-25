const express = require("express");
const app = express();
const jsonParser = express.json();

app.get("/api/users", function(req, res){
    console.log('get users');
    res.send('get users');
});

app.get("/api/users/:id", function(req, res){
    console.log('get user ', req.params.id);
    res.send('get user ' + req.params.id);
});

app.post("/api/users", jsonParser, function (req, res) {
    console.log('set user');
    res.send('set user');
});

app.delete("/api/users/:id", function(req, res){
    console.log('delete user');
    res.send('delete user');
});

app.put("/api/users", jsonParser, function(req, res){
    console.log('change user');
    res.send('change user');
});

app.listen(3003, function(){
    console.log("listening 3003");
});