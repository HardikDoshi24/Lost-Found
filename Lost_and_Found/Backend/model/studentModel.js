const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");

const moment = require("moment");

var LogedinAt = function () {
  var d = new Date();
  var formattedDate = moment(d).format("MM-DD-YYYY, h:mm:ss a");
  return formattedDate;
};

const StudentSchema = mongoose.Schema(
  {
    id: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    status: {
      type: String,
    },
    token: {
      type: String,
    },
    LogedinAt: {
      type: String,
      default: LogedinAt,
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

StudentSchema.methods.generateAuthToken = async function () {
  try {
    const token_final = jwt.sign(
      { _id: this._id.toString() },
      process.env.JWT_SECRET
    );
    this.tokens = token_final;
    await this.save();
    return token_final;
  } catch (error) {
    console.log(error);
  }
};

StudentSchema.plugin(passportLocalMongoose);
StudentSchema.plugin(findOrCreate);

module.exports = mongoose.model("Student", StudentSchema);
