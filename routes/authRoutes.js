const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  // the route look similiar but when ggoogle redirect us to this url is also append "code" property so that distinguish this
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"), // this is middleware after is complete it work redirect to frontend
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(); // so passport additionally pass do many things in req obj so when we do logout() it take the coookie and kill it
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
