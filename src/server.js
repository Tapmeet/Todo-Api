/* eslint-disable max-len */
require('dotenv').config();
const middleware = require('./middlewares/jwt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
// const path = require("path");
const bodyParser = require('body-parser');
const route = require('./routes/index');
// Setting up port
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const PORT = process.env.PORT || 2000;

// === 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
// === 2 - SET UP DATABASE
// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
if (connUri) {
  mongoose.connect(connUri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
} else {
  console.log('connUri is not defined');
}
const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  database connection established successfully!'));
connection.on('error', (err) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  process.exit();
});

// === 3 - INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());
middleware(passport);


// === 4 - CONFIGURE ROUTES
// Configure Route
route(app);

app.use(express.static('src/Assets'));
// === 5 - START SERVER
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT + '/'));
