var express = require('express');
var createError = require('http-errors');
var path = require('path');
const mongoose = require('mongoose');
var config = require('./config');
var bodyParser = require('body-parser');
var path = require('path')
require('dotenv/config');
var app = express();
const cors = require('cors');
const expresssession = require('express-session')
const MongoStore = require('connect-mongo');

var passport = require('passport');
const ServiceRouter = require('./Routes/ServiceRouter');
app.use(cors({ origin: "*" }));

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('connected Correctly');
}, (err) => { console.log(err) });


app.use(expresssession({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongoUrl: url }),
  // cookie: { secure: true }
}));
// app.use(expresssession({
//     secret: config.secretKey,
//   resave: false,
//   saveUninitialized: true,
//   store: new MongoStore({ mongoUrl: url }),
//   cookie: { secure: true }
// }));
app.use(express.static('./assets'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



app.use('/service', ServiceRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || req.session.message,
      success: false
    }
  })
});
app.listen(config.PORT || 8082, function () {
  console.log(`I'm listening at localhost:${config.PORT}`);
});

module.exports = app;