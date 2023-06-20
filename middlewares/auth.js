const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../Models/User");

passport.serializeUser(function (user, done) {
  console.log("The serializeUser");
  // The serializeUser function is called when a user is authenticated and successfully logged in. It takes the user object as an argument and calls the done function with null as the first parameter (indicating no error) and the user's id as the second parameter. This user ID is then serialized and stored in the session.
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("The serializeUser");
  // The deserializeUser function is called when subsequent requests are made by the authenticated user. It receives the serialized id as an argument and calls the done function with err (if any) and the user object. Inside the function, you can use the id to query your database or user storage to find the corresponding user. Once you have retrieved the user object, you pass it as the second parameter to the done function.
  User.findById(id, function (err, user) {
    console.log("The user", user);
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        User.findOne({ email: username }, function (err, user) {
          if (err) {
            return done(err, false, { message: "Invalid Email or password" });
          } else if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: "User Does not exist." });
          }
        });
      } catch (err) {
        return done(err, false, { message: "Error while authenticating." });
      }
    }
  )
);

exports.checkLogin = (req, res, next) => {
  console.log("The", req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({ success: true, message: "Already Logout" });
  }
};

// exports.isLocalAuthenticated = function (req, res, next) {
//   passport.authenticate("local", function (err, user, info, done) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       next(new Error("User Doesn't Exist"));
//     }
//     next();
//   })(req, res, next);
// };

exports.isAdmin = (req, res, next) => {
  try {
    User.findOne({ _id: req.user })
      .populate("role")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          model: "Permissions",
        },
      })
      .then(
        (user) => {
          if (user?.role?.title == "Admin") {
            next();
          } else {
            const err = new Error(
              "You are not authorized to perform this operation!"
            );
            err.status = 403;
            return next(err);
          }
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        console.log("err", err);
        next(err);
      });
  } catch (err) {
    const error = new Error(
      "You are not authorized to perform this operation!"
    );
    error.status = 403;
    return next(err);
  }
};
