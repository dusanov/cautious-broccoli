const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  content: String,
});
module.exports.ResponseSchema = ResponseSchema;
