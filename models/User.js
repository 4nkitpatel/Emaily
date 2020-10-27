const mongoose = require("mongoose");
const { use } = require("passport");
// const Schema = mongoose.Schema
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0,
  },
});

// creating a collection name users in mongoDb using mongoose
mongoose.model("users", userSchema);
// we are not exporting it and use it using require() in another file NO
// why bcz some time in testing environment if we need this mongoose thhings u already have this model and throw us an error
// so to fetch the model we will use mongoose.model("users") this fetch the model with 2 arg it creates it so see in passport.js we did this
