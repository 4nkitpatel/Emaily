const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const { Schema } = mongoose;
const RecipientSchema = require("./Recipient");

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema], // sub document collection
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: "User" }, // relation ship setup for user,
  dateSent: Date,
  lastResponded: Date,
});

// creating a collection name survey in mongoDb using mongoose
mongoose.model("surveys", surveySchema);
// we are not exporting it and use it using require() in another file NO
// why bcz some time in testing environment if we need this mongoose thhings u already have this model and throw us an error
// so to fetch the model we will use mongoose.model("survey") this fetch the model with 2 arg it creates it so see in passport.js we did this
