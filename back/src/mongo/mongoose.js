const mongoose = require("mongoose");
const schemas = require("./MongoSchemas");

//TODO
mongoose.set("strictQuery", false);
const mongoDB = "mongodb://user1:user1@mongo:27017/claudia";
//

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const Response = mongoose.model('response', schemas.ResponseSchema)

console.log('Connected to: ', mongoDB)
module.exports.mongoose = mongoose
// module.exports.ResponseSchema = ResponseSchema
module.exports.Response = Response
