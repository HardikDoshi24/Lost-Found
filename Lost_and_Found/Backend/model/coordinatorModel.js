const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const moment = require("moment");

var createdAt = function () {
  var d = new Date();
  var formattedDate = moment(d).format("MM-DD-YYYY, h:mm:ss a");
  return formattedDate;
};

const CoordinatorSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    profilePicture: {
      type: String,
      default: "default-profile-picture.png",
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Please add a email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    status: {
      type: String,
    },
    token: {
      type: String,
    },
    createdAt: {
      type: String,
      default: createdAt,
    },
  },
  {
    timestamps: true,
  }
);

CoordinatorSchema.methods.generateAuthToken = async function () {
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

module.exports = mongoose.model("Coordinator", CoordinatorSchema);
