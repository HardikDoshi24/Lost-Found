const mongoose = require("mongoose");
const moment = require("moment");

var ListedAt = function () {
  var d = new Date();
  var formattedDate = moment(d).format("YYYY-MM-DD");
  return formattedDate;
};

const ItemSchema = mongoose.Schema(
  {
    ItemType: {
      type: String,
      require: [true, "Please add a lost type"],
    },
    itemName: {
      type: String,
      require: [true, "Please add a item name"],
    },
    description: {
      type: String,
      require: [true, "Please add a description"],
    },
    location: {
      type: String,
      require: [true, "Please add a Lacation"],
    },
    lostDate: {
      type: String,
      require: [true, "Please add a Lost Date"],
    },
    foundDate: {
      type: String,
      require: [true, "Please add a Lost Date"],
    },
    listedBy: {
      type: String,
      require: [true, "please add name who Listed item"],
    },
    department: {
      type: String,
    },
    status: {
      type: String,
      require: [true, "Please add a satus"],
    },
    ListedAt: {
      type: String,
      default: ListedAt,
    },
    handedBy: {
      type: String,
    },
    claimedAt: {
      type: String,
    },
    emailOfWhoListed: {
      type: String,
      require: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Item", ItemSchema);
