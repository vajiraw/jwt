const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const {connectDB}  = require('./db')
const bodyParser = require('body-parser')
const User = require('./user')
const bcrypt = require('bcryptjs')
const auth = require('./auth')

require('dotenv').config()

/**
  * It parses incoming JSON requests and puts the parsed data in req.body.
 */
//app.use(express.json());  // 

app.use(bodyParser.json());
// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }))


app.get('/',(req,res)=>{
    res.send('Home page for ')
})

//
app.get('/signup', async (req,res)=>{
    console.log('get sigup');    
    res.send('get signup')
})

app.post("/signup", async (req, res) => {
    try {
      console.log(req.body);
      const { first_name, last_name, email, password } = req.body;

      console.log('' + first_name, last_name, email, password);
  
      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      //check whether user already registered
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  

app.get('/signin', async (req,res)=>{
    console.log('get signin');
})

app.post('/signin',async (req,res)=>{
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.listen(3000,()=>{
    console.log('server up');
})