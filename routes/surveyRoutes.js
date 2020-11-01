const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTamplate = require("../services/emailTamplates/surveyTamplate");
const Survey = mongoose.model("surveys");
// sengrideAPi = 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

module.exports = (app) => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    }); // .select() do not select recpients list may be its huge and we dont want it so sont pull that
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!"); // TODO: handle this appropriatly
  });

  // TODO ---------------------------------------------------------------------
  // * MOST IMP - NGROCK URL CHAGE SO UPDATE IT IN SENDRID EVERY 8 HR MAY BE
  // TODO ---------------------------------------------------------------------
  /*
    we dont want to store dublicate respose when user click twice in yes button 
    and that user may be in two suveys so per survey only one res should allowed
    1. map through all cicked events we recieved from sendgride
    2. extract /api/surveys/id/yes - from url
    3. extract the data which is surveyId = abdsacas123123 and Choice = yes/no
    4. remove element which dont have suveyId and choice, that will undefine in array so remove undefine from array
    5. now we have survey id and email and choice but what if user click it twice (yes btn) then we have 
       same record twice with same surveyId and Choice so remove this dublicate attemps
    6. we _.uniqBy emails and suvey id so now there will not be dublictate
  */
  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact() // remove all undefine elemts in array
      .uniqBy("email", "surveyId") // TODO: i think for the uniquenes there is option in (sendgrid to sending email and get res unique see docs of webhhok)
      .each(({ email, choice, surveyId }) => {
        // the whole why we use is written in book
        // and we didnt await bcz no need bcz we dont want to resp to sendgride
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  // TODO: handle all the errors below that we didnt count

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients
        .split(",")
        .map((email) => ({ email: email.trim() })), // create a array of obj {email:0 "you@fas.com"}
      _user: req.user.id, // just pass user id to make relationship
      dateSent: Date.now(),
    });

    // great place to send email
    // passing mailer whole survey details like subject, recipients and all and passed htmls version of survey body
    const mailer = new Mailer(survey, surveyTamplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
