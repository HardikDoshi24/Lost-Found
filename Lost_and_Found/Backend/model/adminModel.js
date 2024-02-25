const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const AdminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.methods.generateAuthToken = async function () {
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

module.exports = mongoose.model("Admin", AdminSchema);
