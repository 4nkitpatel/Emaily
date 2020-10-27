const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

// this will create a real chrage and int front end we got token back from stripe so here we will use
// it and charge it
module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const { token, amount } = req.body;
    try {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr",
        description: "500rs for 5 credits",
        payment_method: token,
        confirm: true,
      });

      if (payment.status === "succeeded") {
        req.user.credits += 5; // modifting req.user model now we will save it to db
        const user = await req.user.save();
        res.send(user);
      } else {
        console.log("something went wrong");
        res.status(500).send({
          statusCode: 500,
          message: "Some Action require OR something went wrong",
        });
      }
    } catch (err) {
      res.status(500).send({
        statusCode: 500,
        message: err.message,
      });
    }
    // const charge = await stripe.charges.create({
    //   amount: 500,
    //   currency: "inr", // usd gives error not inr see to it
    //   source: req.body.id,
    //   description: "$5 for 5 credits ",
    // });
    // // console.log(req.user instanceof mongoose.Model);
    // console.log(charge);
    // req.user.credits += 5; // modifting req.user model now we will save it to db
    // const user = await req.user.save();
    // res.send(user);
  });
};
