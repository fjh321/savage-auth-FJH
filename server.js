// server.js

// set up ======================================================================
// get all the tools we need
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient //setup to help me talk to db
const mongoose = require('mongoose');//setup mongoose to help us talk to mongodbs better/easier
const passport = require('passport');//for authentication
const flash = require('connect-flash');//for our error messages.

const morgan = require('morgan');//how we are doing our logging in terminal
const cookieParser = require('cookie-parser');//enables us to look at the logged in session. user can leave computer and still come back can see if theyre still logged in by looking at their cookies.
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');//grabbing our database same as plugging in server url object

let db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {//configDB.url is taking the object configDBurl in our config folder's database.js file and getting the url property's value  from that object, which is our server's url.
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db); //running function from routes.js "module.exports = function(app, passport, db) {"
}); // connect to our mongoDB database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))//setting public folder so we dont have to write individual routes


app.set('view engine', 'ejs'); // set up ejs for templating so we can use the ejs files.

// required for passport
app.use(session({ //all i need to know about this "required for passport" code is that this creates a new session in my app
  secret: 'rcbootcamp2021b', // session secret (I can name this whatever I want.)
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);//console.log to show us that our server is running