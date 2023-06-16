const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./Models/User');
const jwtStrategy = require('passport-jwt').Strategy;
const Extractjwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('./config');


exports.local = passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(function (user, cb) {
//     process.nextTick(function () {
//         cb(null, { id: user.id, username: user.username });
//     });
// });

// passport.deserializeUser(function (user, cb) {
//     process.nextTick(function () {
//         return cb(null, user);
//     });
// });
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new LocalStrategy(
    function (username, password, done, next) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err, false, { message: "Invalid Email or password" })
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: "User Does not exist." });
            }
        });
    }
));

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};
exports.checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else
    next(new Error("Already Logout."))
}
exports.isLocalAuthenticated =
 function (req, res, next) {
    passport.authenticate('local',function (err, user, info, done) {            
        if (err) { return next(err); }
        if (!user) {
            next(new Error("User Doesn't Exist"))
        }
        next()
    })(req, res, next);
}
exports.isAdmin = (req, res, next) => {
    try {
        User.findOne({ _id: req.user })
            .populate("role")
            .populate({
                path: "role",
                populate: {
                    path: "permissions",
                    model: "Permissions"
                }
            })
            .then((user) => {
                if (user?.role?.title == "Admin") {
                    next();
                } else {
                    const err = new Error('You are not authorized to perform this operation!');
                    err.status = 403;
                    return next(err);
                }
            }, (err) => {
                next(err)
            })
            .catch((err) => {
                console.log("err", err)
                next(err)
            });
    }
    catch (err) {
        const error = new Error('You are not authorized to perform this operation!');
        error.status = 403;
        return next(err);
    }
};