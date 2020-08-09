const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongosoe = require("mongoose");

const keys = require("../config/keys");

const User = mongosoe.model("users"); // this fetch the user model so we dont have to export it in User model file

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser); // this go to as args in serializeUser()
        } else {
          new User({ googleId: profile.id }).save().then((user) => {
            done(null, user); // this go to as args in serializeUser()
          });
        }
      });
    }
  )
);
