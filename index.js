const express = require("express"); //commonJS module system node uses not that ES module (import this from that)
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const keys = require("./config/keys");
require("./models/User"); // this will confiure and make the model or collection
require("./services/passport"); // we have to require("./models/User") do this first bca passport file uses User model so before that user should be initiated

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days to autoamatically expire
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// authRoutes returning a function so we can call it by appending brackets and passing arg app, eg.(app)
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // express serve  production assets LIKE our build version of client (main.js or main.css)
  app.use(express.static("client/build"));
  // express serve up index.html file if doesnt recognize the route [may be that route belongs to client side thats why]
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// if there is not env var define by herouk use 5000 so we will use 5000 in dev but in production herouk internalyy det this env port to its convinience
const PORT = process.env.PORT || 5000;
app.listen(PORT);
