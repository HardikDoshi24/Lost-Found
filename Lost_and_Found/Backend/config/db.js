const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  
  try {
    const url =
      "mongodb+srv://db:db@cluster0.4seeh3x.mongodb.net/lostfound?retryWrites=true&w=majority";
    const conn = await mongoose.connect(url);
    console.log(
      `mongo database is connected!!! ${conn.connection.host}`.cyan.underline
    );
  } catch (error) {
    console.error(`Error: ${error} `);
    process.exit(1); //passing 1 - will exit the proccess with error
  }
};

module.exports = connectDB;
