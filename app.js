//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

//to access statis files
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//connect to mongoDB
mongoose.connect("mongodb://localhost:27017/userDB");

//defining schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});




//creating model
const User = new mongoose.model("User", userSchema);



// GET route to serve the home/root page
app.get("/", function(req, res){
  res.render("home");
});

// GET route to serve the login page
app.get("/login", function(req, res){
  res.render("login");
});

// POST route to handle login form data and authentication
app.post("/login", function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(error, result) {
          if(result){
            res.render("secrets");
          }
          else{
            console.log(error);
          }
});
      }
    }
  });
});

// GET route to serve the register page
app.get("/register", function(req, res){
  res.render("register");
});

// POST route to handle register form data and authentication
app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.email,
      password: hash
    })
    newUser.save(function(err){
      if (!err) {
        res.render("secrets")
      }else{
        console.log(err);
      }
    });
});



})



app.listen(3000, function(){
  console.log("Server started at port 3000");
});
