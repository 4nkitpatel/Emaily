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
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser); // this go to as args in serializeUser()
      }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user); // this go to as args in serializeUser()
    }
  )
);
