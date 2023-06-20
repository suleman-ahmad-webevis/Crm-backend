//ModuleImports
var express = require("express");
var app = express();
const cors = require("cors");
var createError = require("http-errors");
var path = require("path");
// var bodyParser = require("body-parser");
require("dotenv").config();
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
var passport = require("passport");
//FilesImports
var config = require("./config");
// require("dotenv/config");
//DBConnection
const connectDB = require("./config/database");
connectDB();
//Routes
// const UsersRouter = require("./routes/UsersRouter");
const PermissionRouter = require("./routes/PermissionRouter");
const RoleRouter = require("./routes/RoleRouter");
const SubscribeRouter = require("./routes/SubscribeNewsletterRoute");
const QueriesRouter = require("./routes/QueriesRouter");
const HireDeveloper = require("./routes/HireDeveloper");
const MeetingsRouter = require("./routes/MeetingsRouter");
const DealsRouter = require("./routes/DealsRouter");
const OnBoardsRouter = require("./routes/OnBoardsRouter");
const DeveloperRouter = require("./routes/Developer");
const ServiceRouter = require("./routes/ServiceRouter");
app.use(cors({ origin: "*", credentials: true }));
// const url = process.env.MONGO_URL;
// const connect = mongoose.connect(url);
// const dotenv = require("dotenv");
// dotenv.config({ path: ".env" });
// connect.then(
//   (db) => {
//     console.log("connected Correctly");
//     console.log(
//       "The mongoose.connection.readyState",
//       mongoose.connection.readyState
//     );
//   },
//   (err) => {
//     console.log(err);
//   }
// );
app.use(
  expressSession({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    // cookie: { maxAge: 1000 * 60 * 60 * 40 },
    // cookie: { maxAge: 1000 * 60 * 60 * 40, secure: true },
    // cookie: { secure: true },
  })
);
app.use(express.static("./assets"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
//Routes
// app.use("/user", UsersRouter);
app.use("/permissions", PermissionRouter);
app.use("/role", RoleRouter);
app.use("/subscribe-newsletter", SubscribeRouter);
app.use("/query", QueriesRouter);
app.use("/hire-developer", HireDeveloper);
app.use("/meeting", MeetingsRouter);
app.use("/deal", DealsRouter);
app.use("/onBoard", OnBoardsRouter);
app.use("/developer", DeveloperRouter);
app.use("/service", ServiceRouter);
app.use(function (req, res, next) {
  next(createError(404));
});
// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || req.session.message,
      success: false,
    },
  });
});
app.listen(config.PORT || 8082, function () {
  console.log(`I'm listening at localhost:${config.PORT}`);
});
module.exports = app;
