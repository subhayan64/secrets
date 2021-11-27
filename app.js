//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt= require('mongoose-encryption');

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


//encrypting password in schema
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
//when save() is called mongoose encrypt will automatically encrypt the password field.
//when find() is called it will automatically decrypt the encrypted fields.


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
        if (foundUser.password === password) {
          res.render("secrets");
        }
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
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  })
  newUser.save(function(err){
    if (!err) {
      res.render("secrets")
    }else{
      console.log(err);
    }
  });
})



app.listen(3000, function(){
  console.log("Server started at port 3000");
});
